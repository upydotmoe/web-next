const n={},u=defineEventHandler(l=>{const o=[],a="bin",e=new Date,i=e.getHours()+":"+e.getMinutes(),d=String(e.getDate()).padStart(2,"0"),p=String(e.getMonth()+1).padStart(2,"0"),y=e.getFullYear(),g=`${p}-${d}-${y}`,c=n.join(a,`log__${g}.log`),s=r=>Math.round(r/1e3,2)/1e3,t=process.memoryUsage(),h={url:l.req.url,time:i,rss:s(t.rss),heapTotal:s(t.heapTotal),heapUsed:s(t.heapUsed),external:s(t.external),stack:s(t.rss-t.heapTotal)};o.push(h);try{n.existsSync(a)||n.mkdirSync(a),n.appendFileSync(c,JSON.stringify(o),"utf8"),n.appendFileSync(c,`
`,"utf8")}catch(r){console.error(r,"file write error")}console.table(o)});export{u as default};
