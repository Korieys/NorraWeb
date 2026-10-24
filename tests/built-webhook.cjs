// Run after next build: exercise the actual bundled route, not the TS mock loader.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Stripe=require('stripe');
const secret='whsec_local_built_fixture_only';
process.env.VERCEL_ENV='preview';
process.env.STRIPE_SECRET_KEY='sk_test_local_built_fixture_only';
process.env.STRIPE_WEBHOOK_SECRET=' \r\n'+secret+'\n ';
process.env.DAYPACK_CHECKOUT_ENABLED='false';
const signer=new Stripe(process.env.STRIPE_SECRET_KEY);
const {POST}=require('../.next/server/app/api/stripe-webhook/route.js').routeModule.userland;
const body=(livemode=false)=>JSON.stringify({id:'evt_local_built_fixture',object:'event',type:'unrelated.event',created:Math.floor(Date.now()/1000),livemode,data:{object:{id:'obj_local_built_fixture'}}});
const send=(payload,header)=>POST(new Request('https://fixture.invalid/api/stripe-webhook',{method:'POST',body:payload,headers:header?{'stripe-signature':header}:{}}));

test('built route accepts a valid signed sandbox event and copied whitespace',async()=>{
 const payload=body();const response=await send(payload,signer.webhooks.generateTestHeaderString({payload,secret}));
 assert.equal(response.status,200);assert.deepEqual(await response.json(),{received:true,test:true,notification:null});
});
test('built route rejects missing signatures and changed payloads',async()=>{
 const payload=body();const signature=signer.webhooks.generateTestHeaderString({payload,secret});
 assert.equal((await send(payload)).status,400);
 assert.equal((await send(payload+' ',signature)).status,400);
});
test('built route rejects correctly signed stale events',async()=>{
 const payload=body();const signature=signer.webhooks.generateTestHeaderString({payload,secret,timestamp:Math.floor(Date.now()/1000)-600});
 assert.equal((await send(payload,signature)).status,400);
});
test('built route rejects a correctly signed live event in preview',async()=>{
 const payload=body(true);const signature=signer.webhooks.generateTestHeaderString({payload,secret});
 const response=await send(payload,signature);assert.equal(response.status,400);
 assert.match((await response.json()).error,/payment mode/);
});
