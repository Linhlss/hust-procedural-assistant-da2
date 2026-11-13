// Loaded only by verification scripts; never by application runtime.
const cookie=process.env.HUST_TEST_COOKIE,base=process.env.DEMO_BASE_URL;
if(!cookie||!base)throw new Error('Missing authorized in-memory test session');
const native=globalThis.fetch;
globalThis.fetch=(input,init={})=>{
 const url=new URL(typeof input==='string'?input:input instanceof URL?input:input.url);
 if(url.origin!==new URL(base).origin)throw new Error('Protected verifier only calls the verified deployment');
 const headers=new Headers(init.headers);headers.set('Cookie',cookie);return native(input,{...init,headers});
};
