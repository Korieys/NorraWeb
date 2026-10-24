const {test}=require('node:test');
const assert=require('node:assert/strict');
const Stripe=require('stripe');
const {load}=require('./load-ts.cjs');
const signer=new Stripe('sk_test_local_fixture_only');
const secret='whsec_local_fixture_only';
const created=1792800000;
const metadata=(offer='single')=>({sku:'170',reserved_pack:'170',offer,pack_quantity:offer==='single'?'1':'3',kind:offer==='core3-subscription'?'daypack_170_subscription':'daypack_170_preorder',fulfillment_window:'Q4 2026'});
const session=(extra={})=>({id:'cs_test_fixture',mode:'payment',payment_intent:'pi_test_fixture',payment_status:'paid',currency:'usd',customer_details:{email:'fixture@example.test'},customer:null,metadata:metadata(),amount_total:6498,...extra});
const invoice=(extra={})=>({id:'in_test_initial',created,currency:'usd',status:'paid',amount_paid:14998,amount_remaining:0,billing_reason:'subscription_create',customer_email:'fixture@example.test',customer:'cus_test_fixture',parent:{type:'subscription_details',subscription_details:{subscription:'sub_test_fixture',metadata:metadata('core3-subscription')}},status_transitions:{paid_at:created+10},...extra});
const subscription=(extra={})=>({id:'sub_test_fixture',status:'active',metadata:metadata('core3-subscription'),customer:'cus_test_fixture',cancel_at_period_end:false,cancel_at:null,canceled_at:null,...extra});
const event=(type,object,extra={})=>({id:'evt_test_fixture',created,type,livemode:true,data:{object},...extra});
function route(options={}){
 const requests=[],purchases=[],reads=[],logs=[];
 let currentInvoice=options.invoice??invoice(),currentSubscription=options.subscription??subscription();
 let fail=options.fail??false;
 const stripe={webhooks:signer.webhooks,
  invoices:{retrieve:async id=>{reads.push(['invoice',id]);return currentInvoice}},
  subscriptions:{retrieve:async id=>{reads.push(['subscription',id]);return currentSubscription}},
  customers:{retrieve:async id=>{reads.push(['customer',id]);return options.customer??{email:'fixture@example.test'}}}};
 const loaded=load('app/api/stripe-webhook/route.ts',{
  'next/server':{NextResponse:{json:(data,options)=>({data,status:options?.status??200})}},
  '@/lib/stripe':{getStripe:()=>options.noStripe?null:stripe,stripePaymentMode:()=>options.mode??'live'},
  '@/lib/meta':{sendPurchaseToMeta:async value=>{purchases.push(value);return {ok:true}}}
 },{
  process:{env:{STRIPE_WEBHOOK_SECRET:secret,...(options.noKlaviyo?{}:{KLAVIYO_PRIVATE_API_KEY:'not-a-real-key'})}},
  console:{log:(...args)=>logs.push(args),warn:(...args)=>logs.push(args),error:(...args)=>logs.push(args)},
  ...(options.globals??{}),
  fetch:options.fetch??(async(url,init)=>{assert.ok(init.signal);requests.push(JSON.parse(init.body));return {ok:!fail,status:fail?503:202,body:{cancel:async()=>{}}}})
 });
 return {requests,purchases,reads,logs,setInvoice:value=>{currentInvoice=value},setSubscription:value=>{currentSubscription=value},setFail:value=>{fail=value},
  async send(e,signature=true){const payload=JSON.stringify(e);return loaded.POST(new Request('https://example.test/api/stripe-webhook',{method:'POST',body:payload,headers:signature?{'stripe-signature':signature===true?signer.webhooks.generateTestHeaderString({payload,secret}):'invalid'}:{}}))}};
}
const attrs=r=>r.requests.at(-1).data.attributes;

test('correctly signed wrong-mode and missing-mode events cannot reach any provider',async()=>{
 for(const [mode,livemode] of [['live',false],['test',true],['test',undefined]]){
  const r=route({mode});
  assert.equal((await r.send(event('invoice.paid',{id:'in_test_initial'},{livemode}))).status,400);
  assert.equal(r.reads.length,0);assert.equal(r.requests.length,0);assert.equal(r.purchases.length,0);
 }
});

test('sandbox orders are classified without emails, ad tracking or personal-data logs',async()=>{
 const r=route({mode:'test',noKlaviyo:true});
 const result=await r.send(event('checkout.session.completed',session(),{livemode:false}));
 assert.equal(result.status,200);assert.equal(result.data.test,true);
 assert.equal(result.data.notification.metric,'Placed Preorder');
 assert.equal(result.data.notification.reference,'pi_test_fixture');assert.equal(result.data.notification.amount,64.98);
 assert.equal(r.requests.length,0);assert.equal(r.purchases.length,0);
 assert.doesNotMatch(JSON.stringify([result,r.logs]),/fixture@example|customer_details|not-a-real-key|fbp|fbc/);
});

test('sandbox renewals still read current Stripe state and expose the stable invoice reference',async()=>{
 const r=route({mode:'test',noKlaviyo:true,invoice:invoice({id:'in_test_renewal',billing_reason:'subscription_cycle'})});
 const result=await r.send(event('invoice.paid',{id:'in_test_renewal'},{livemode:false}));
 assert.equal(result.status,200);assert.equal(result.data.notification.reference,'in_test_renewal');
 assert.equal(result.data.notification.orderType,'renewal');assert.equal(result.data.notification.quantity,3);
 assert.deepEqual(r.reads,[['invoice','in_test_renewal']]);assert.equal(r.requests.length,0);assert.equal(r.purchases.length,0);
});

test('sandbox failures still retry instead of claiming successful verification',async()=>{
 const r=route({mode:'test',customer:{deleted:true}});
 assert.equal((await r.send(event('checkout.session.completed',session({customer_details:null,customer:'cus_deleted'}),{livemode:false}))).status,502);
 assert.equal(r.requests.length,0);assert.equal(r.purchases.length,0);
});
test('missing and invalid signatures cannot reach providers',async()=>{
 const r=route();for(const sig of [false,'bad'])assert.equal((await r.send(event('checkout.session.completed',session()),sig)).status,400);
 assert.equal(r.requests.length,0);assert.equal(r.reads.length,0);
});
test('missing Stripe configuration fails closed',async()=>{
 assert.equal((await route({noStripe:true}).send(event('checkout.session.completed',session()))).status,503);
});
for(const status of ['unpaid','no_payment_required'])test(status+' completion cannot create a paid order',async()=>{
 const r=route();assert.equal((await r.send(event('checkout.session.completed',session({payment_status:status})))).status,200);assert.equal(r.requests.length,0);
});
test('immediate, delayed, repeated and concurrent checkout events share the payment key',async()=>{
 const r=route();
 await Promise.all(['checkout.session.completed','checkout.session.async_payment_succeeded','checkout.session.completed'].map((type,i)=>r.send(event(type,session(),{id:'evt_'+i}))));
 assert.equal(r.requests.length,3);
 assert.deepEqual(r.requests.map(x=>x.data.attributes.unique_id),Array(3).fill('pi_test_fixture'));
 assert.equal(attrs(r).value,64.98);assert.equal(attrs(r).properties.pack_quantity,1);
 assert.equal(attrs(r).metric.data.attributes.name,'Placed Preorder');
 assert.equal(attrs(r).profile.data.attributes.properties,undefined);
 assert.equal(r.purchases[0].eventId,'pi_test_fixture');
});
test('legacy one-dollar deposit stays separate from full preorders',async()=>{
 const r=route();await r.send(event('checkout.session.completed',session({metadata:{reserved_pack:'170'},amount_total:100})));
 assert.equal(attrs(r).metric.data.attributes.name,'Placed Deposit');assert.equal(attrs(r).properties.order_type,'deposit');
});
test('unrelated checkouts and unrecognized full-price metadata are ignored',async()=>{
 const r=route();
 for(const s of [session({metadata:{}}),session({mode:'setup'}),session({currency:'eur'}),session({metadata:{sku:'170'},amount_total:5499})])await r.send(event('checkout.session.completed',s));
 assert.equal(r.requests.length,0);
});
test('initial subscription checkout and invoice events share the invoice key and timestamp',async()=>{
 const r=route();const s=session({mode:'subscription',payment_intent:null,invoice:'in_test_initial',metadata:metadata('core3-subscription')});
 await r.send(event('checkout.session.completed',s));
 await r.send(event('invoice.paid',{id:'in_test_initial'},{id:'evt_invoice'}));
 assert.equal(r.requests.length,2);
 assert.deepEqual(r.requests.map(x=>x.data.attributes.unique_id),['in_test_initial','in_test_initial']);
 assert.equal(r.requests[0].data.attributes.time,r.requests[1].data.attributes.time);
 assert.equal(attrs(r).value,149.98);assert.equal(attrs(r).properties.pack_quantity,3);
 assert.equal(r.purchases[0].eventId,r.purchases[1].eventId);
});
test('each paid renewal is a distinct order without additional ad tracking',async()=>{
 const r=route({invoice:invoice({id:'in_test_renewal',billing_reason:'subscription_cycle'})});
 await r.send(event('invoice.paid',{id:'in_test_renewal'}));
 assert.equal(attrs(r).unique_id,'in_test_renewal');assert.equal(attrs(r).properties.order_type,'renewal');
 assert.equal(attrs(r).value,149.98);assert.equal(r.purchases.length,0);
});
test('old webhook invoice shapes are re-read through the pinned API',async()=>{
 const r=route();await r.send(event('invoice.paid',{id:'in_test_initial',subscription:'sub_test_fixture',subscription_details:{metadata:metadata('core3-subscription')}}));
 assert.deepEqual(r.reads[0],['invoice','in_test_initial']);assert.equal(attrs(r).unique_id,'in_test_initial');
});
test('unpaid, zero, unrelated and proration invoices are not fulfillment orders',async()=>{
 for(const data of [invoice({status:'open'}),invoice({amount_paid:0}),invoice({parent:null}),invoice({billing_reason:'subscription_update'})]){
  const r=route({invoice:data});await r.send(event('invoice.paid',{id:data.id}));assert.equal(r.requests.length,0);
 }
});
test('late payment failure does not override an invoice now paid',async()=>{
 const r=route();await r.send(event('invoice.payment_failed',{id:'in_test_initial',status:'open'}));
 assert.equal(r.requests.length,0);
});
test('failed invoice retries produce one failure key and no purchase value',async()=>{
 const r=route({invoice:invoice({status:'open',amount_paid:0,amount_remaining:14998})});
 await r.send(event('invoice.payment_failed',{id:'in_test_initial'},{created:created+3600}));
 assert.equal(attrs(r).time,new Date((created+3600)*1000).toISOString());
 await r.send(event('invoice.payment_failed',{id:'in_test_initial'},{id:'evt_second_attempt'}));
 assert.equal(attrs(r).metric.data.attributes.name,'Daypack Payment Failed');
 assert.equal(attrs(r).properties.amount_due,149.98);assert.equal(attrs(r).value,undefined);
 assert.equal(r.requests[0].data.attributes.unique_id,attrs(r).unique_id);assert.equal(r.purchases.length,0);
});
test('unexpected invoice currency is retried for review',async()=>{
 const r=route({invoice:invoice({currency:'eur'})});assert.equal((await r.send(event('invoice.paid',{id:'in_test_initial'}))).status,502);assert.equal(r.requests.length,0);
});
test('customer fallback is used only when checkout email is absent',async()=>{
 const r=route();await r.send(event('checkout.session.completed',session({customer_details:null,customer:'cus_test_fixture'})));
 assert.equal(attrs(r).profile.data.attributes.email,'fixture@example.test');assert.deepEqual(r.reads,[['customer','cus_test_fixture']]);
});
test('missing customer email is retried instead of acknowledged',async()=>{
 const r=route({customer:{deleted:true}});assert.equal((await r.send(event('checkout.session.completed',session({customer_details:null,customer:'cus_deleted'})))).status,502);assert.equal(r.requests.length,0);
});
test('email provider failures retry with a stable key and do not log customer data',async()=>{
 const r=route({fail:true});const e=event('checkout.session.completed',session());
 assert.equal((await r.send(e)).status,502);assert.equal(r.purchases.length,0);
 r.setFail(false);assert.equal((await r.send(e)).status,200);
 assert.equal(r.requests[0].data.attributes.unique_id,attrs(r).unique_id);
 assert.doesNotMatch(JSON.stringify(r.logs),/fixture@example|not-a-real-key/);
});
test('missing email configuration is retried',async()=>{
 const r=route({noKlaviyo:true});assert.equal((await r.send(event('checkout.session.completed',session()))).status,502);assert.equal(r.requests.length,0);
});
test('missing subscription invoice is retried',async()=>{
 const r=route();assert.equal((await r.send(event('checkout.session.completed',session({mode:'subscription',invoice:null,metadata:metadata('core3-subscription')})))).status,502);
});
test('PaymentIntent events cannot create duplicate orders',async()=>{
 const r=route();await r.send(event('payment_intent.succeeded',{id:'pi_test_fixture',metadata:metadata()}));assert.equal(r.requests.length,0);
});
for(const [label,current,previous,metric] of [
 ['scheduled',subscription({cancel_at_period_end:true,cancel_at:created+1000}),{cancel_at_period_end:false},'Daypack Cancellation Scheduled'],
 ['reversed',subscription(),{cancel_at_period_end:true,cancel_at:created+1000},'Daypack Cancellation Reversed'],
 ['ended',subscription({status:'canceled',canceled_at:created}),undefined,'Daypack Subscription Canceled']
])test('subscription '+label+' emits only its current confirmed state',async()=>{
 const r=route({subscription:current});const e=event(label==='ended'?'customer.subscription.deleted':'customer.subscription.updated',current);
 if(previous)e.data.previous_attributes=previous;
 assert.equal((await r.send(e)).status,200);
 assert.equal(attrs(r).metric.data.attributes.name,metric);assert.equal(attrs(r).properties.refund_status,'not_checked');
 assert.equal(attrs(r).value,undefined);assert.equal(r.purchases.length,0);
});
test('ordinary subscription updates do not send cancellation messages',async()=>{
 const r=route();await r.send(event('customer.subscription.updated',subscription(),{data:{object:subscription(),previous_attributes:{status:'past_due'}}}));
 assert.equal(r.requests.length,0);assert.equal(r.reads.length,0);
});
test('stale cancellation delivery cannot reverse the current state',async()=>{
 const r=route();const e=event('customer.subscription.updated',subscription({cancel_at_period_end:true,cancel_at:created+1000}));e.data.previous_attributes={cancel_at_period_end:false};
 await r.send(e);assert.equal(r.requests.length,0);
});
test('unrelated subscriptions cannot send Daypack cancellation notices',async()=>{
 const sub=subscription({status:'canceled',metadata:{}});const r=route({subscription:sub});
 await r.send(event('customer.subscription.deleted',sub));assert.equal(r.requests.length,0);
});
test('stalled email provider is aborted and remains retryable',async()=>{
 let signal;
 const r=route({globals:{AbortSignal:{timeout:ms=>{assert.equal(ms,8000);return AbortSignal.timeout(10)}}},fetch:async(url,init)=>{signal=init.signal;return new Promise((resolve,reject)=>{const keepAlive=setTimeout(()=>reject(new Error('test timeout')),1000);signal.addEventListener('abort',()=>{clearTimeout(keepAlive);reject(signal.reason)},{once:true})})}});
 assert.equal((await r.send(event('checkout.session.completed',session()))).status,502);assert.equal(signal.aborted,true);
});
