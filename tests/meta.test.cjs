const {test}=require('node:test');
const assert=require('node:assert/strict');
const {load}=require('./load-ts.cjs');

test('ad event uses full payment identity, original time and purchased quantity without logging sensitive data',async()=>{
 const logs=[];let body;
 const {sendPurchaseToMeta}=load('lib/meta.ts',{}, {
  process:{env:{NEXT_PUBLIC_META_PIXEL_ID:'synthetic-pixel',META_CAPI_TOKEN:'synthetic-token'}},
  console:{log:(...args)=>logs.push(args),error:(...args)=>logs.push(args)},
  fetch:async(url,options)=>{assert.ok(options.signal);body=JSON.parse(options.body);return {ok:false,status:500,body:{cancel:async()=>{}}}}
 });
 const result=await sendPurchaseToMeta({eventId:'pi_full_reference',eventTime:1792800000,email:'fixture@example.test',eventSourceUrl:'https://example.test',reservedPack:'170',quantity:3,value:159.98});
 assert.equal(result.ok,false);assert.equal(body.data[0].event_id,'pi_full_reference');assert.equal(body.data[0].event_time,1792800000);
 assert.equal(body.data[0].custom_data.contents[0].quantity,3);assert.equal(body.data[0].custom_data.value,159.98);
 assert.match(body.data[0].user_data.em[0],/^[a-f0-9]{64}$/);
 assert.doesNotMatch(JSON.stringify(logs),/synthetic-token|fixture@example/);
});

test('ad provider rejection cannot throw through the order webhook',async()=>{
 const {sendPurchaseToMeta}=load('lib/meta.ts',{}, {
  process:{env:{NEXT_PUBLIC_META_PIXEL_ID:'synthetic-pixel',META_CAPI_TOKEN:'synthetic-token'}},console:{error(){}},
  fetch:async()=>{throw new Error('provider failure containing sensitive details')}
 });
 const result=await sendPurchaseToMeta({eventId:'pi_fixture',email:'fixture@example.test',eventSourceUrl:'https://example.test',reservedPack:'170'});
 assert.equal(result.ok,false);assert.equal(result.error,'request failed');
});
