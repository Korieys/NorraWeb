const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
function route(event){
 const events=[];
 const js=ts.transpileModule(fs.readFileSync('app/api/stripe-webhook/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const exports={};
 vm.runInNewContext(js,{exports,console:{log(){},warn(){},error(){}},process:{env:{STRIPE_WEBHOOK_SECRET:'test-secret',KLAVIYO_PRIVATE_API_KEY:'test-key'}},fetch:async(url,options)=>{events.push(JSON.parse(options.body));return {ok:true,status:202,text:async()=>''}},require(name){
  if(name==='next/server')return {NextResponse:{json:(data,options)=>({data,status:options?.status||200})}};
  if(name==='@/lib/stripe')return {getStripe:()=>({webhooks:{constructEvent:()=>event}})};
  if(name==='@/lib/meta')return {sendPurchaseToMeta:async()=>({ok:true})};
  throw new Error(name);
 }});
 return {post:exports.POST,events};
}
function fixture(type,status){return {type,data:{object:{id:'cs_test_example',payment_intent:'pi_test_example',payment_status:status,customer_details:{email:'fixture@example.test'},metadata:{sku:'170'},amount_total:6498}}};}
async function send(r){return r.post(new Request('https://example.test/api/stripe-webhook',{method:'POST',headers:{'stripe-signature':'fixture'},body:'fixture'}));}
test('unpaid checkout completion never emits an order event',async()=>{
 const r=route(fixture('checkout.session.completed','unpaid'));
 assert.equal((await send(r)).status,200);assert.equal(r.events.length,0);
});
test('paid immediate and delayed events use the same order deduplication key',async()=>{
 const ids=[];
 for(const type of ['checkout.session.completed','checkout.session.async_payment_succeeded']){
  const r=route(fixture(type,'paid'));assert.equal((await send(r)).status,200);
  assert.equal(r.events.length,1);ids.push(r.events[0].data.attributes.unique_id);
 }
 assert.deepEqual(ids,['pi_test_example','pi_test_example']);
});
