const {test}=require('node:test');
const assert=require('node:assert/strict');
const {renderToStaticMarkup}=require('react-dom/server');
const {load}=require('./load-ts.cjs');
const metadata=(offer='single')=>({sku:'170',offer,pack_quantity:offer==='single'?'1':'3',kind:offer==='core3-subscription'?'daypack_170_subscription':'daypack_170_preorder'});
const session=(extra={})=>({id:'cs_test_receipt',status:'complete',mode:'payment',payment_status:'paid',currency:'usd',amount_total:6498,metadata:metadata(),...extra});
function page(s){
 const calls=[];
 const exports=load('app/reserved/page.tsx',{
  'next/link':{default:()=>null},
  'next/navigation':{redirect:path=>{throw new Error('redirect:'+path)}},
  '@/lib/stripe':{getStripe:()=>s&&{checkout:{sessions:{retrieve:async id=>{calls.push(id);if(s instanceof Error)throw s;return s}}}}},
  '@/components/ui/Button':{Button:()=>null},'@/components/Nav':{Nav:()=>null},'@/components/Footer':{Footer:()=>null}
 });
 return {calls,read:async(search={session_id:'cs_test_receipt'})=>renderToStaticMarkup(await exports.default({searchParams:Promise.resolve(search)}))};
}
test('paid receipt verifies Stripe and shows purchased quantity and paid total',async()=>{
 const p=page(session());const html=await p.read();
 assert.deepEqual(p.calls,['cs_test_receipt']);assert.match(html,/1 single-day pack/);assert.match(html,/\$64\.98 paid/);assert.match(html,/cs_test_receipt/);
});
test('subscription receipt discloses recurring total and cancellation contact',async()=>{
 const html=await page(session({mode:'subscription',metadata:metadata('core3-subscription'),amount_total:14998})).read();
 assert.match(html,/3 single-day packs/);assert.match(html,/\$149\.98 paid/);assert.match(html,/renews monthly at \$149\.98/);assert.match(html,/mailto:team@eatdaypack.com/);
});
test('completed delayed payment shows processing without claiming payment or encouraging duplicate order',async()=>{
 const html=await page(session({payment_status:'unpaid'})).read();
 assert.match(html,/PAYMENT PROCESSING/);assert.match(html,/not confirmed until payment succeeds/);assert.match(html,/do not place a second order/);assert.doesNotMatch(html,/paid, including shipping|CONFIRMED · FIRST RUN/);
});
test('query-only development bypass cannot display a confirmed order',async()=>{
 const p=page(null);await assert.rejects(p.read({dev:'1',sku:'170'}),/redirect:\/cancelled/);assert.equal(p.calls.length,0);
});
for(const [label,value] of [['missing configuration',null],['provider outage',new Error('temporary failure')]])test(label+' cannot tell a paid customer to pay again',async()=>{
 const html=await page(value).read();assert.match(html,/does not mean your payment failed/);assert.match(html,/do not place another order/);assert.doesNotMatch(html,/CONFIRMED · FIRST RUN/);
});
for(const [label,data] of [
 ['no payment required',session({payment_status:'no_payment_required'})],
 ['open checkout',session({status:'open',payment_status:'unpaid'})],
 ['legacy deposit',session({metadata:{sku:'170'},amount_total:100})],
 ['unrelated product',session({metadata:{sku:'other'}})],
 ['wrong checkout mode',session({mode:'subscription'})],
 ['zero amount',session({amount_total:0})],
 ['wrong currency',session({currency:'eur'})]
])test(label+' cannot appear as a confirmed preorder',async()=>{
 await assert.rejects(page(data).read(),/redirect:\/cancelled/);
});
