const {test}=require('node:test');
const assert=require('node:assert/strict');
const {load}=require('./load-ts.cjs');

function client(env){
 const calls=[];
 const api=load('lib/stripe.ts',{stripe:{default:class {constructor(key){calls.push(key);this.key=key}}}},{process:{env}});
 return {...api,calls};
}

test('previews and local development refuse live keys before constructing a client',()=>{
 for(const VERCEL_ENV of ['preview','development',undefined])for(const prefix of ['sk_live_','rk_live_']){
  const r=client({VERCEL_ENV,STRIPE_SECRET_KEY:prefix+'fixture'});
  assert.equal(r.getStripe(),null);assert.equal(r.calls.length,0);
 }
});

test('production refuses test, missing and malformed credentials',()=>{
 for(const STRIPE_SECRET_KEY of ['sk_test_fixture','rk_test_fixture','invalid',undefined]){
  const r=client({VERCEL_ENV:'production',STRIPE_SECRET_KEY});
  assert.equal(r.getStripe(),null);assert.equal(r.calls.length,0);
 }
});

test('restricted keys work only in their matching environment',()=>{
 for(const [VERCEL_ENV,prefix,mode] of [['production','rk_live_','live'],['preview','rk_test_','test'],[undefined,'rk_test_','test']]){
  const r=client({VERCEL_ENV,STRIPE_SECRET_KEY:prefix+'fixture'});
  assert.equal(r.stripePaymentMode(),mode);assert.ok(r.getStripe());
 }
});

test('cached clients cannot survive key removal or a wrong-mode replacement',()=>{
 const env={VERCEL_ENV:'preview',STRIPE_SECRET_KEY:'rk_test_first'};
 const r=client(env),first=r.getStripe();
 assert.equal(r.getStripe(),first);
 delete env.STRIPE_SECRET_KEY;assert.equal(r.getStripe(),null);
 env.STRIPE_SECRET_KEY='sk_live_fixture';assert.equal(r.getStripe(),null);
 env.STRIPE_SECRET_KEY='rk_test_second';assert.notEqual(r.getStripe(),first);
 assert.deepEqual(r.calls,['rk_test_first','rk_test_second']);
});
