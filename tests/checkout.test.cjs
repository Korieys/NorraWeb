const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
function loadRoute(enabled='true'){
 const calls=[];
 const js=ts.transpileModule(fs.readFileSync('app/api/checkout/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const exports={};
 vm.runInNewContext(js,{exports,process:{env:{DAYPACK_CHECKOUT_ENABLED:enabled}},console,require(name){
  if(name==='next/server')return {NextResponse:{json:(data,options)=>({data,status:options?.status||200})}};
  if(name==='@/lib/stripe')return {getStripe:()=>({checkout:{sessions:{create:async params=>{calls.push(params);return {url:'https://checkout.stripe.test/example'}}}}})};
  if(name==='@/lib/daypack-offers')return require('./load-ts.cjs').load('lib/daypack-offers.ts');
  throw new Error(name);
 }});
 return {post:exports.POST,calls};
}
for(const [offer,amount,total] of [['single',5499,6498],['core3',14999,15998],['core3-subscription',13999,14998]]){
 test(`${offer} preserves pricing and discloses preorder timing`,async()=>{
  const route=loadRoute();
  const result=await route.post(new Request('https://eatdaypack.com/api/checkout',{method:'POST',body:JSON.stringify({sku:'170',offer})}));
  assert.equal(result.status,200);
  const params=route.calls[0];
  assert.equal(params.line_items[0].price_data.unit_amount,amount);
  const shipping=params.shipping_options?.[0].shipping_rate_data;
  assert.equal(amount+(shipping?.fixed_amount.amount||params.line_items[1].price_data.unit_amount),total);
  assert.equal(shipping?.delivery_estimate,undefined);
  assert.equal(params.payment_method_types,undefined);
  assert.match(params.integration_identifier,/^daypack-preorder-[a-z]{8}$/);
  assert.match(params.custom_text.shipping_address.message,/Q4 2026/);
  assert.match(params.custom_text.shipping_address.message,/not immediate dispatch/);
  if(offer==='core3-subscription'){
   assert.equal(params.line_items[1].price_data.recurring.interval,'month');
   assert.equal(params.subscription_data.billing_mode.type,'classic');
   assert.deepEqual(params.subscription_data.metadata,params.metadata);
  } else assert.deepEqual(params.payment_intent_data.metadata,params.metadata);
 });
}
test('invalid offer never creates a checkout session',async()=>{
 const route=loadRoute();
 assert.equal((await route.post(new Request('https://eatdaypack.com/api/checkout',{method:'POST',body:JSON.stringify({sku:'170',offer:'invalid'})}))).status,400);
 assert.equal(route.calls.length,0);
});
for(const enabled of ['', 'false'])test(`checkout stays closed when readiness switch is ${enabled||'unset'}`,async()=>{
 const route=loadRoute(enabled);
 assert.equal((await route.post(new Request('https://eatdaypack.com/api/checkout',{method:'POST',body:JSON.stringify({sku:'170',offer:'single'})}))).status,503);
 assert.equal(route.calls.length,0);
});
for(const offer of ['__proto__','constructor','toString'])test(`${offer} cannot access an inherited checkout offer`,async()=>{
 const route=loadRoute();
 assert.equal((await route.post(new Request('https://eatdaypack.com/api/checkout',{method:'POST',body:JSON.stringify({sku:'170',offer})}))).status,400);
 assert.equal(route.calls.length,0);
});
