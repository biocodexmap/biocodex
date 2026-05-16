const https = require("https");
exports.handler = async function(event) {
  if(event.httpMethod==="OPTIONS"){return{statusCode:200,headers:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"POST,OPTIONS"},body:""};}
  const KEY = process.env.ANTHROPIC_API_KEY;
  if(!KEY) return{statusCode:500,headers:{"Access-Control-Allow-Origin":"*"},body:JSON.stringify({error:"No API key"})};
  let body;
  try{body=JSON.parse(event.body);}catch(e){return{statusCode:400,body:JSON.stringify({error:"Bad JSON"})};}
  const payload=JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,messages:body.messages||[]});
  return new Promise(resolve=>{
    const req=https.request({hostname:"api.anthropic.com",path:"/v1/messages",method:"POST",headers:{"Content-Type":"application/json","x-api-key":KEY,"anthropic-version":"2023-06-01","Content-Length":Buffer.byteLength(payload)}},(res)=>{
      let d="";res.on("data",c=>d+=c);res.on("end",()=>resolve({statusCode:200,headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"},body:d}));
    });
    req.on("error",e=>resolve({statusCode:500,headers:{"Access-Control-Allow-Origin":"*"},body:JSON.stringify({error:e.message})}));
    req.write(payload);req.end();
  });
};
