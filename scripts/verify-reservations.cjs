// Safety checks run against the real handlers, with Stripe/Klaviyo mocked and no network.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const response = { NextResponse: { json: (body, options={}) => ({body,status:200,...options}) } };
function load(file, deps={}, env={}, globals={}) {
 const module={exports:{}};
 const code=ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 vm.runInNewContext(code,{module,exports:module.exports,require:n=>{if(n in deps)return deps[n];throw Error('Unexpected dependency '+n)},process:{env},URL,Date,console:{error(){},warn(){},log(){}},...globals},{filename:file});
 return module.exports;
}
async function main() {
 const offer=load('lib/reservations.ts');
 const goodPrice={id:offer.RESERVATION_PRICE_ID,active:true,type:'one_time',currency:'usd',unit_amount:100,recurring:null,custom_unit_amount:null,transform_quantity:null,product:{id:offer.RESERVATION_PRODUCT_ID,active:true}};
 let price=goodPrice, preordersOpen=false, createCalls=[], sessionTotal=100, expired=0;
 const stripe={prices:{retrieve:async id=>{assert.equal(id,offer.RESERVATION_PRICE_ID);return price}},checkout:{sessions:{create:async payload=>{createCalls.push(payload);return {id:'cs_test',url:'https://checkout.stripe.com/c/pay/test',amount_total:sessionTotal,currency:'usd',mode:'payment'}},expire:async()=>{expired++}}}};
 const deps={'next/server':response,'@/lib/stripe':{getStripe:()=>stripe},'@/lib/reservations':offer,'@/lib/preorder-availability':{canCreatePreorder:()=>preordersOpen}};
 const route=load('app/api/reservation-checkout/route.ts',deps);
 const request=body=>({json:async()=>body,headers:{get:()=> 'attacker.example'}});
 for(const body of [{},{offer:'single'},{offer:'reservation',amount:1},{offer:'reservation',price:'foreign'},{offer:'reservation',quantity:10},{offer:'reservation',sku:'170'}]) assert.equal((await route.POST(request(body))).status,400);
 assert.equal(createCalls.length,0);
 assert.equal((await route.POST(request({offer:'reservation',fbp:'fb.1.123.456'}))).status,200);
 const payload=createCalls[0];
 assert.equal(payload.mode,'payment');assert.equal(payload.currency,'usd');
 assert.equal(payload.line_items.length,1);assert.equal(payload.line_items[0].price,offer.RESERVATION_PRICE_ID);assert.equal(payload.line_items[0].quantity,1);
 assert.equal(payload.allow_promotion_codes,false);assert.equal(payload.automatic_tax.enabled,false);assert.equal(payload.adaptive_pricing.enabled,false);
 for(const key of ['shipping_options','shipping_address_collection','subscription_data','payment_method_types']) assert.equal(key in payload,false);
 assert.equal(payload.metadata.kind,'founder_reservation');assert.equal(payload.metadata.sku,'reservation');assert.equal(payload.metadata.reserved_pack,'daypack');
 assert.equal(payload.payment_intent_data.metadata.reservation_offer,offer.RESERVATION_OFFER);
 assert.equal(payload.success_url,'https://eatdaypack.com/reserved?session_id={CHECKOUT_SESSION_ID}');
 assert.ok(!JSON.stringify(payload).includes('Q4'));assert.ok(!JSON.stringify(payload).includes('14999'));
 for(const change of [{unit_amount:5499},{currency:'eur'},{active:false},{type:'recurring'},{recurring:{interval:'month'}},{product:{id:'foreign',active:true}},{product:{id:offer.RESERVATION_PRODUCT_ID,active:false}},{custom_unit_amount:{enabled:true}},{transform_quantity:{divide_by:2}}]) {
  price={...goodPrice,...change};assert.equal((await route.POST(request({offer:'reservation'}))).status,503);
 }
 assert.equal(createCalls.length,1);
 price=goodPrice;sessionTotal=101;assert.equal((await route.POST(request({offer:'reservation'}))).status,503);assert.equal(expired,1);sessionTotal=100;
 preordersOpen=true;assert.equal((await route.POST(request({offer:'reservation'}))).status,503);preordersOpen=false;
 const stopped=load('app/api/reservation-checkout/route.ts',deps,{DAYPACK_RESERVATIONS_ENABLED:'false'});assert.equal((await stopped.POST(request({offer:'reservation'}))).status,503);
 console.log('PASS reservation route: only allowlisted USD100 one-time price; input tampering, changed price, closed offer, and host injection blocked.');

 let event, rejectSignature=false, events=[],meta=[];
 const webhookStripe={webhooks:{constructEvent:()=>{if(rejectSignature)throw Error('bad signature');return event}},customers:{retrieve:async()=>({email:'test@example.com'})},charges:{retrieve:async()=>({billing_details:{email:'test@example.com'}})}};
 const webhook=load('app/api/stripe-webhook/route.ts',{'next/server':response,'@/lib/stripe':{getStripe:()=>webhookStripe},'@/lib/reservations':offer,'@/lib/meta':{sendPurchaseToMeta:async x=>{meta.push(x);return {ok:true,status:200}}}},{STRIPE_WEBHOOK_SECRET:'test',KLAVIYO_PRIVATE_API_KEY:'test'},{fetch:async(url,init)=>{events.push(JSON.parse(init.body));return {ok:true,status:202}}});
 const webhookRequest=(signature='test')=>({headers:{get:()=>signature},text:async()=> 'signed fixture'});
 assert.equal((await webhook.POST(webhookRequest(null))).status,400);rejectSignature=true;assert.equal((await webhook.POST(webhookRequest())).status,400);rejectSignature=false;
 const paid={id:'cs_test',mode:'payment',status:'complete',payment_status:'paid',amount_total:100,currency:'usd',metadata:{...offer.RESERVATION_METADATA},payment_intent:'pi_test_ABC123',customer_details:{email:'test@example.com'}};
 for(const change of [{payment_status:'unpaid'},{amount_total:5499},{currency:'eur'},{mode:'subscription'},{metadata:{kind:'daypack_170_preorder',sku:'170',reserved_pack:'170'}},{metadata:{}},{metadata:{...offer.RESERVATION_METADATA,reservation_price_id:'foreign'}}]) {
  event={type:'checkout.session.completed',data:{object:{...paid,...change}}};assert.equal((await webhook.POST(webhookRequest())).status,200);
 }
 event={type:'checkout.session.async_payment_failed',data:{object:paid}};assert.equal((await webhook.POST(webhookRequest())).status,200);
 assert.equal(events.length,0);assert.equal(meta.length,0);
 for(const type of ['checkout.session.completed','checkout.session.async_payment_succeeded']) {event={type,data:{object:paid}};assert.equal((await webhook.POST(webhookRequest())).status,200);}
 event={type:'payment_intent.succeeded',data:{object:{id:'pi_test_ABC123',status:'succeeded',amount_received:100,currency:'usd',metadata:paid.metadata,receipt_email:'test@example.com'}}};assert.equal((await webhook.POST(webhookRequest())).status,200);
 assert.equal(events.length,3);
 for(const entry of events){const a=entry.data.attributes;assert.equal(a.metric.data.attributes.name,'Placed Deposit');assert.equal(a.unique_id,'pi_test_ABC123');assert.equal(a.value,1);assert.equal(a.profile.data.attributes.properties.reservation_status,'reserved');assert.equal(a.properties.order_type,'reservation');assert.equal(a.properties.ReservationId,'ABC123');assert.equal('subscriptions' in a.profile.data.attributes,false);}
 assert.equal(new Set(events.map(e=>e.data.attributes.unique_id)).size,1);
 assert.equal(new Set(meta.map(e=>e.eventId)).size,1);
 event={type:'checkout.session.completed',data:{object:{...paid,payment_intent:'pi_history_XYZ789',metadata:{kind:'founder_reservation',reserved_pack:'170',sku:'170'}}}};assert.equal((await webhook.POST(webhookRequest())).status,200);assert.equal(events[3].data.attributes.properties.ReservedPack,'170');
 assert.equal(offer.reservationSessionState({...paid,payment_status:'unpaid'}),'pending');assert.equal(offer.reservationSessionState({...paid,status:'open'}),null);
 console.log('PASS signed webhook: no event for unpaid/failed/full-order/wrong-amount payments; paid and async success preserve Placed Deposit, reserved status, PI deduplication and historical reservations.');
}
main().catch(e=>{console.error(e);process.exitCode=1});
