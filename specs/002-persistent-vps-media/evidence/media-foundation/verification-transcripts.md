# Retained verification transcripts

Original captured outputs consolidated during the 2026-11-01 final review. Successful, failed and interrupted runs remain distinct; a capture alone does not establish a pass. The [capture index](verification-transcripts.index.json) retains each former path, byte count and SHA-256. Historical JSON paths are execution identifiers resolved through that index. Displays may normalize carriage returns, trailing spaces or terminal blank lines; the index preserves the exact original bytes as base64 wherever the rendered capture differs. No result is replaced by a new execution.

## after-narrow-slow

Original capture: `after-narrow-slow.txt`. Bytes: 11454. SHA-256: `15a1d3059445aadd60736b410cbe1787bd9116ef39661738e6c4a0a3f967134d`.

````text
### Result
{"passed":true,"version":"after","cdpMax":2,"cdpEvents":[{"id":"22810.314","index":1,"kind":"start","time":286759.499952},{"id":"22810.346","index":2,"kind":"start","time":286762.32275},{"id":"22810.347","index":3,"kind":"start","time":286762.323002},{"id":"22810.314","kind":"finish","time":286762.316912},{"id":"22810.346","kind":"finish","time":286762.406624},{"id":"22810.347","kind":"finish","time":286762.40667}],"cdpScope":"GET content only; CORS preflight excluded","viewport":320,"profile":{"slow":true,"latencyMs":150,"downloadBytesPerSecond":196608},"persistedPages":30,"firstUsefulMs":2877,"encodedDataBytesBeforeUseful":375161,"initialRequests":[1,2,3],"initialWindowRequests":[1,2,3],"initialPreparedMs":2912,"maxApplicationOutstandingContentRequests":3,"requests":[{"index":1,"startedMs":53},{"index":2,"startedMs":2876},{"index":3,"startedMs":2876}],"boundaries":[],"resources":{"base":{"active":0,"bytes":0,"maximum":0,"maxBytes":0},"firstReady":{"active":1,"bytes":375161,"maximum":1,"maxBytes":375161},"atEnd":{"active":1,"bytes":375161,"maximum":1,"maxBytes":375161},"afterClose":{"active":0,"bytes":0,"maximum":1,"maxBytes":375161}},"layout":{"width":320,"scrollWidth":320,"initialFirstPageHeight":317.328125,"readyFirstPageHeight":317.328125,"shifts":[]},"heap":{"usedSize":20094804,"totalSize":34586624,"limit":"JavaScript heap only; excludes native decoder/GPU animation memory"},"measurement":"One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence"}
### Ran Playwright code
```js
await (async (originalPage) => {
 const version="after", slow=true, width=320, expected=10;
 const context=await originalPage.context().browser().newContext({viewport:{width,height:900}});const page=await context.newPage();
 const ids=["702ca060-113c-49e9-8235-4bd14c292127", "9d7807b2-adf8-4eb5-a4cb-6883e493f054", "70f3d46a-76fd-4c8b-870f-64a8a3990231", "d342bfef-ff2a-4b80-b7db-764fd36c8c95", "1b570b8c-362d-4ac0-abf2-9b3151a0b618", "1fea6885-f78a-4836-b1d2-39c7ba9f0a3f", "172478d5-803c-4fa7-b565-8eba78542785", "8674ca88-fc03-4f3a-a9e0-9efd158f40af", "00de1e95-18e5-4644-9d60-f989bd6c3dbc", "fe73894d-5fab-4722-88b1-bfb1324b8c5b", "cdeb1a27-050f-45c4-bbd7-99f1734da809", "95f03346-ea9b-400c-bf7a-1cce242d6d03", "b24e75aa-3754-4d58-afad-446f3d88977d", "8d21c8f9-b75f-42a1-a041-3f4c342ae897", "a9a67407-1fe7-4521-9c6b-7c9bcd13173a", "bfd49603-7b60-41fe-8742-a989c6e87e87", "709f2447-16e4-4b85-91ca-4cd57b82c7b9", "0910e682-f9ce-4ea3-86ae-b8a039602d52", "c89efa47-a3b0-4d63-ad31-099e3644fa04", "0b1b1096-3557-422e-9679-6b78e410b3fe", "dcc4e02c-6625-4711-b37d-bd6d5a6911d8", "f16dea88-79c9-4620-b2ed-01f8b75e85c5", "acdcd6b4-26fe-46e0-8b1d-e43c68459aeb", "e963eba1-2674-4ed6-838a-313b3d7a4846", "a412c4d5-bf3b-4a12-8058-aac868590975", "c9a21547-1e6a-40a7-8355-1c6934fddc00", "daecdc57-4700-489c-8e09-899da8ca0adb", "8af1ee40-ef2f-41c7-ad42-dcaa6c60932c", "54cd25f0-d2f1-4ea6-8620-043476e09ace", "6926b230-0f36-47da-96a0-bf6ae2ecdebf"];let started=0;const requests=[],finished=new Set(),active=new Set();let maxOutstanding=0,firstUsefulBytes;const bytesById=new Map();let stage='login';
 try {
  await page.addInitScript(()=>{const active=new Map();let maximum=0,maxBytes=0;const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=blob=>{const url=create(blob);active.set(url,blob.size);maximum=Math.max(maximum,active.size);maxBytes=Math.max(maxBytes,[...active.values()].reduce((sum,n)=>sum+n,0));return url;};URL.revokeObjectURL=url=>{active.delete(url);revoke(url);};window.__furyMediaResources=()=>({active:active.size,bytes:[...active.values()].reduce((sum,n)=>sum+n,0),maximum,maxBytes});window.__furyShifts=[];new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__furyShifts.push({value:entry.value,hadRecentInput:entry.hadRecentInput});}).observe({type:'layout-shift',buffered:true});});
  await page.goto('http://127.0.0.1:4316/auth/login');await page.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill('media-foundation-admin@example.test');await page.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill("<redacted disposable credential>");await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(url=>['/dashboard','/admin'].includes(url.pathname));
  stage='saved editor';const detail=page.waitForResponse(r=>r.request().method()==='GET'&&r.url().includes('/api/v1/content/admin/')&&r.url().includes("8639544a-33e8-45d3-a3b9-5ef36d51f43b"));await page.goto('http://127.0.0.1:4316/admin/works/'+"7ea307e9-5953-49c1-bae3-4667de99c989"+'/chapters/'+"8639544a-33e8-45d3-a3b9-5ef36d51f43b"+'/edit');const saved=await detail;if(saved.status()!==200)throw Error('Saved Chapter read failed');const payload=await saved.json();if(payload.data?.chapter.pages.length!==30)throw Error('Persisted thirty-page chapter missing');await page.getByRole('button',{name:'معاينة خاصة',exact:true}).waitFor();
  const session=await context.newCDPSession(page);await session.send('Network.enable');await session.send('Network.emulateNetworkConditions',{offline:false,latency:slow?150:20,downloadThroughput:slow?192*1024:10*1024*1024,uploadThroughput:128*1024,connectionType:slow?'cellular3g':'wifi'});
  const resourceIndex=url=>{const m=new URL(url).pathname.match(/\/media\/assets\/([a-f0-9-]+)\/content$/);return m?ids.indexOf(m[1]):-1;};const cdpIds=new Map();const cdpEvents=[];session.on('Network.requestWillBeSent',event=>{const index=resourceIndex(event.request.url);if(index>=0&&event.request.method==='GET'){cdpIds.set(event.requestId,index);cdpEvents.push({id:event.requestId,index:index+1,kind:"start",time:event.timestamp});bytesById.set(event.requestId,0);}});session.on('Network.loadingFinished',event=>{if(cdpIds.has(event.requestId))cdpEvents.push({id:event.requestId,kind:'finish',time:event.timestamp});});session.on('Network.loadingFailed',event=>{if(cdpIds.has(event.requestId))cdpEvents.push({id:event.requestId,kind:'finish',time:event.timestamp});});session.on('Network.dataReceived',event=>{if(cdpIds.has(event.requestId))bytesById.set(event.requestId,(bytesById.get(event.requestId)||0)+event.encodedDataLength);});
  page.on('request',request=>{const index=resourceIndex(request.url());if(index>=0){requests.push({index:index+1,startedMs:Date.now()-started});active.add(request);maxOutstanding=Math.max(maxOutstanding,active.size);}});page.on('requestfinished',request=>{const index=resourceIndex(request.url());if(index>=0){active.delete(request);finished.add(index);}});page.on('requestfailed',request=>active.delete(request));
  const baseResources=await page.evaluate(()=>window.__furyMediaResources());started=Date.now();stage='first useful';await page.getByRole('button',{name:'معاينة خاصة',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.waitFor();const initialHeight=await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').first().evaluate(node=>node.getBoundingClientRect().height);await page.waitForFunction(()=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة 1"]');return image?.complete&&image.naturalWidth>0;},{},{timeout:60000});const firstUsefulMs=Date.now()-started;firstUsefulBytes=[...bytesById.values()].reduce((sum,n)=>sum+n,0);await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));const initialRequests=requests.map(r=>r.index);const firstReadyResources=await page.evaluate(()=>window.__furyMediaResources());const finalHeight=await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').first().evaluate(node=>node.getBoundingClientRect().height);
  stage='initial window';if(!slow)await page.waitForFunction(count=>window.__furyMediaResources().active>=count,expected,{timeout:30000});const initialPreparedMs=Date.now()-started;const initialWindowRequests=requests.map(r=>r.index);if(initialWindowRequests.some(i=>i>10))throw Error('Far page requested at initial open');if(Math.abs(initialHeight-finalHeight)>1)throw Error('Page geometry shifted');const boundaries=[];
  if(!slow){for(const index of [4,9,14]){const since=Date.now();await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').nth(index).scrollIntoViewIfNeeded();await page.waitForFunction(position=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة '+position+'"]');return image?.complete&&image.naturalWidth>0;},index+1,{timeout:30000});await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));boundaries.push({page:index+1,stallMs:Date.now()-since,requested:requests.map(r=>r.index)});}await dialog.locator('img[alt="صفحة 13"]').waitFor();const since=Date.now(),count=requests.length,targetCount=requests.filter(r=>r.index===13).length;await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').nth(12).scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة 13"]');return image?.complete&&image.naturalWidth>0;});boundaries.push({kind:'warm reversal',page:13,stallMs:Date.now()-since,newRequests:requests.length-count,newTargetRequests:requests.filter(r=>r.index===13).length-targetCount});}
  const resources=await page.evaluate(()=>window.__furyMediaResources());const heap=await session.send('Runtime.getHeapUsage');const shifts=await page.evaluate(()=>window.__furyShifts);const layout={width:await page.evaluate(()=>innerWidth),scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth),initialFirstPageHeight:initialHeight,readyFirstPageHeight:finalHeight,shifts};stage='close';await dialog.getByRole('button',{name:'إغلاق',exact:true}).click();await dialog.waitFor({state:'hidden'});await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));const afterClose=await page.evaluate(()=>window.__furyMediaResources());if(afterClose.active!==baseResources.active)throw Error('Owned image URLs remain after preview close');
  let cdpActive=0,cdpMax=0;for(const event of cdpEvents.toSorted((a,b)=>a.time-b.time||(a.kind==='finish'?-1:1))){cdpActive+=event.kind==='start'?1:-1;cdpMax=Math.max(cdpMax,cdpActive);}return {passed:true,version,cdpMax,cdpEvents,cdpScope:"GET content only; CORS preflight excluded",viewport:width,profile:{slow,latencyMs:slow?150:20,downloadBytesPerSecond:slow?192*1024:10*1024*1024},persistedPages:30,firstUsefulMs,encodedDataBytesBeforeUseful:firstUsefulBytes,initialRequests,initialWindowRequests,initialPreparedMs,maxApplicationOutstandingContentRequests:maxOutstanding,requests,boundaries,resources:{base:baseResources,firstReady:firstReadyResources,atEnd:resources,afterClose},layout,heap:{usedSize:heap.usedSize,totalSize:heap.totalSize,limit:'JavaScript heap only; excludes native decoder/GPU animation memory'},measurement:'One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence'};
 } catch(error){throw Error(JSON.stringify({stage,error:String(error),url:page.url(),headings:await page.locator('h1,h2').allTextContents(),alerts:await page.getByRole('alert').allTextContents(),requests}));} finally {await context.close();}
}
)(page);
```
````

## after-wide-cold-warm-cdp

Original capture: `after-wide-cold-warm-cdp.txt`. Bytes: 17036. SHA-256: `3f1011e2d7a760e411fdde6a4d188c7dca2a7a907e81a0564cf4ef063918f361`.

````text
### Result
{"passed":true,"version":"after","cdpMax":4,"cdpEvents":[{"id":"6A21B1244FBC66F67A8A67F48BA44DBE","index":1,"kind":"start","time":286607.537793},{"id":"22110.359","index":1,"kind":"start","time":286607.537512},{"id":"6A21B1244FBC66F67A8A67F48BA44DBE","kind":"finish","time":286607.538637},{"id":"A92D710DC49550E23BD878CCF45F5DA1","index":2,"kind":"start","time":286607.604947},{"id":"22110.379","index":2,"kind":"start","time":286607.604695},{"id":"22110.380","index":3,"kind":"start","time":286607.604807},{"id":"22110.359","kind":"finish","time":286607.602397},{"id":"5A5E2437590CFCB2061C597C29FFCA9B","index":3,"kind":"start","time":286607.605285},{"id":"A92D710DC49550E23BD878CCF45F5DA1","kind":"finish","time":286607.605608},{"id":"5A5E2437590CFCB2061C597C29FFCA9B","kind":"finish","time":286607.605956},{"id":"22110.379","kind":"finish","time":286607.627608},{"id":"22110.386","index":4,"kind":"start","time":286607.629693},{"id":"71CB67110B035D915A61FFBFB9A31CC5","index":4,"kind":"start","time":286607.630029},{"id":"71CB67110B035D915A61FFBFB9A31CC5","kind":"finish","time":286607.630711},{"id":"22110.392","index":5,"kind":"start","time":286607.680612},{"id":"22110.380","kind":"finish","time":286607.679217},{"id":"5FF1D5582930183ED15F5AAE8E14932C","index":5,"kind":"start","time":286607.681003},{"id":"5FF1D5582930183ED15F5AAE8E14932C","kind":"finish","time":286607.681751},{"id":"22110.397","index":6,"kind":"start","time":286607.702872},{"id":"22110.386","kind":"finish","time":286607.701517},{"id":"E073D524B5C41E95A7600C1BF41EA5EF","index":6,"kind":"start","time":286607.703193},{"id":"E073D524B5C41E95A7600C1BF41EA5EF","kind":"finish","time":286607.703943},{"id":"22110.397","kind":"finish","time":286607.724665},{"id":"22110.403","index":7,"kind":"start","time":286607.726076},{"id":"CEDEEB7EB10B3C9FF8435E7DA716AE14","index":7,"kind":"start","time":286607.726371},{"id":"CEDEEB7EB10B3C9FF8435E7DA716AE14","kind":"finish","time":286607.727001},{"id":"22110.410","index":8,"kind":"start","time":286607.739849},{"id":"22110.392","kind":"finish","time":286607.738674},{"id":"4B31279C40730516EE78E057EFF983C4","index":8,"kind":"start","time":286607.740088},{"id":"4B31279C40730516EE78E057EFF983C4","kind":"finish","time":286607.740585},{"id":"22110.418","index":9,"kind":"start","time":286607.807649},{"id":"22110.403","kind":"finish","time":286607.806329},{"id":"B8B9176C68E38F9C85FCA2F3EDA8C33D","index":9,"kind":"start","time":286607.80799},{"id":"B8B9176C68E38F9C85FCA2F3EDA8C33D","kind":"finish","time":286607.808502},{"id":"22110.427","index":10,"kind":"start","time":286607.820854},{"id":"22110.410","kind":"finish","time":286607.819608},{"id":"8D3375865D64846003EE1E07996DA589","index":10,"kind":"start","time":286607.821105},{"id":"8D3375865D64846003EE1E07996DA589","kind":"finish","time":286607.821576},{"id":"22110.418","kind":"finish","time":286607.88756},{"id":"22110.427","kind":"finish","time":286607.90056},{"id":"22110.471","index":11,"kind":"start","time":286607.967607},{"id":"22110.472","index":12,"kind":"start","time":286607.967727},{"id":"F0B0F08FEA811C8451C28451361E175B","index":11,"kind":"start","time":286607.968113},{"id":"567BB887432E5462298E1329116AAAD2","index":12,"kind":"start","time":286607.968168},{"id":"F0B0F08FEA811C8451C28451361E175B","kind":"finish","time":286607.968725},{"id":"567BB887432E5462298E1329116AAAD2","kind":"finish","time":286607.969165},{"id":"22110.491","index":13,"kind":"start","time":286608.068176},{"id":"22110.471","kind":"finish","time":286608.067033},{"id":"E88797AAEC6C8CF4C9EA63D2E45F4FA8","index":13,"kind":"start","time":286608.068497},{"id":"22110.497","index":14,"kind":"start","time":286608.068981},{"id":"22110.472","kind":"finish","time":286608.067313},{"id":"E88797AAEC6C8CF4C9EA63D2E45F4FA8","kind":"finish","time":286608.069148},{"id":"9173F5110BDAA55F14EA5096B53BC357","index":14,"kind":"start","time":286608.069528},{"id":"9173F5110BDAA55F14EA5096B53BC357","kind":"finish","time":286608.070493},{"id":"22110.505","index":15,"kind":"start","time":286608.16647},{"id":"D998A0F194DDA6D0567E7DA95A13FFA3","index":15,"kind":"start","time":286608.166864},{"id":"22110.491","kind":"finish","time":286608.166692},{"id":"22110.497","kind":"finish","time":286608.166718},{"id":"D998A0F194DDA6D0567E7DA95A13FFA3","kind":"finish","time":286608.167781},{"id":"22110.507","index":16,"kind":"start","time":286608.231333},{"id":"22110.508","index":14,"kind":"start","time":286608.23146},{"id":"22110.505","kind":"finish","time":286608.230067},{"id":"D8BB9925C5502F55EAF75C3B5A96323A","index":16,"kind":"start","time":286608.231746},{"id":"D8BB9925C5502F55EAF75C3B5A96323A","kind":"finish","time":286608.232366},{"id":"22110.511","index":17,"kind":"start","time":286608.326071},{"id":"22110.508","kind":"finish","time":286608.324838},{"id":"6145422E8B73FAA5A97954FDA5B01C09","index":17,"kind":"start","time":286608.326425},{"id":"22110.515","index":13,"kind":"start","time":286608.327053},{"id":"22110.507","kind":"finish","time":286608.325057},{"id":"6145422E8B73FAA5A97954FDA5B01C09","kind":"finish","time":286608.327041},{"id":"22110.511","kind":"finish","time":286608.330852},{"id":"22110.531","index":12,"kind":"start","time":286608.385738},{"id":"22110.532","index":11,"kind":"start","time":286608.385843},{"id":"22110.515","kind":"finish","time":286608.384623},{"id":"22110.531","kind":"finish","time":286608.44449},{"id":"22110.532","kind":"finish","time":286608.444517}],"viewport":1280,"profile":{"slow":false,"latencyMs":20,"downloadBytesPerSecond":10485760},"persistedPages":30,"firstUsefulMs":119,"encodedDataBytesBeforeUseful":375161,"initialRequests":[1,2,3,4],"initialWindowRequests":[1,2,3,4,5,6,7,8,9,10],"initialPreparedMs":418,"maxApplicationOutstandingContentRequests":3,"requests":[{"index":1,"startedMs":45},{"index":2,"startedMs":112},{"index":3,"startedMs":112},{"index":4,"startedMs":136},{"index":5,"startedMs":187},{"index":6,"startedMs":209},{"index":7,"startedMs":233},{"index":8,"startedMs":246},{"index":9,"startedMs":314},{"index":10,"startedMs":327},{"index":11,"startedMs":474},{"index":12,"startedMs":475},{"index":13,"startedMs":575},{"index":14,"startedMs":576},{"index":15,"startedMs":673},{"index":16,"startedMs":738},{"index":14,"startedMs":738},{"index":17,"startedMs":833},{"index":13,"startedMs":834},{"index":12,"startedMs":893},{"index":11,"startedMs":893}],"boundaries":[{"page":5,"stallMs":98,"requested":[1,2,3,4,5,6,7,8,9,10,11,12]},{"page":10,"stallMs":100,"requested":[1,2,3,4,5,6,7,8,9,10,11,12,13,14]},{"page":15,"stallMs":167,"requested":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,14]},{"kind":"warm reversal","page":13,"stallMs":117,"newRequests":4}],"resources":{"base":{"active":0,"bytes":0,"maximum":0,"maxBytes":0},"firstReady":{"active":2,"bytes":375437,"maximum":2,"maxBytes":375437},"atEnd":{"active":4,"bytes":1500644,"maximum":10,"maxBytes":3001840},"afterClose":{"active":0,"bytes":0,"maximum":10,"maxBytes":3001840}},"layout":{"width":1280,"scrollWidth":1280,"initialFirstPageHeight":1000,"readyFirstPageHeight":1000,"shifts":[{"value":0.027480468749999997,"hadRecentInput":false}]},"heap":{"usedSize":21909244,"totalSize":36945920,"limit":"JavaScript heap only; excludes native decoder/GPU animation memory"},"measurement":"One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence"}
### Ran Playwright code
```js
await (async (originalPage) => {
 const version="after", slow=false, width=1280, expected=10;
 const context=await originalPage.context().browser().newContext({viewport:{width,height:900}});const page=await context.newPage();
 const ids=["702ca060-113c-49e9-8235-4bd14c292127", "9d7807b2-adf8-4eb5-a4cb-6883e493f054", "70f3d46a-76fd-4c8b-870f-64a8a3990231", "d342bfef-ff2a-4b80-b7db-764fd36c8c95", "1b570b8c-362d-4ac0-abf2-9b3151a0b618", "1fea6885-f78a-4836-b1d2-39c7ba9f0a3f", "172478d5-803c-4fa7-b565-8eba78542785", "8674ca88-fc03-4f3a-a9e0-9efd158f40af", "00de1e95-18e5-4644-9d60-f989bd6c3dbc", "fe73894d-5fab-4722-88b1-bfb1324b8c5b", "cdeb1a27-050f-45c4-bbd7-99f1734da809", "95f03346-ea9b-400c-bf7a-1cce242d6d03", "b24e75aa-3754-4d58-afad-446f3d88977d", "8d21c8f9-b75f-42a1-a041-3f4c342ae897", "a9a67407-1fe7-4521-9c6b-7c9bcd13173a", "bfd49603-7b60-41fe-8742-a989c6e87e87", "709f2447-16e4-4b85-91ca-4cd57b82c7b9", "0910e682-f9ce-4ea3-86ae-b8a039602d52", "c89efa47-a3b0-4d63-ad31-099e3644fa04", "0b1b1096-3557-422e-9679-6b78e410b3fe", "dcc4e02c-6625-4711-b37d-bd6d5a6911d8", "f16dea88-79c9-4620-b2ed-01f8b75e85c5", "acdcd6b4-26fe-46e0-8b1d-e43c68459aeb", "e963eba1-2674-4ed6-838a-313b3d7a4846", "a412c4d5-bf3b-4a12-8058-aac868590975", "c9a21547-1e6a-40a7-8355-1c6934fddc00", "daecdc57-4700-489c-8e09-899da8ca0adb", "8af1ee40-ef2f-41c7-ad42-dcaa6c60932c", "54cd25f0-d2f1-4ea6-8620-043476e09ace", "6926b230-0f36-47da-96a0-bf6ae2ecdebf"];let started=0;const requests=[],finished=new Set(),active=new Set();let maxOutstanding=0,firstUsefulBytes;const bytesById=new Map();let stage='login';
 try {
  await page.addInitScript(()=>{const active=new Map();let maximum=0,maxBytes=0;const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=blob=>{const url=create(blob);active.set(url,blob.size);maximum=Math.max(maximum,active.size);maxBytes=Math.max(maxBytes,[...active.values()].reduce((sum,n)=>sum+n,0));return url;};URL.revokeObjectURL=url=>{active.delete(url);revoke(url);};window.__furyMediaResources=()=>({active:active.size,bytes:[...active.values()].reduce((sum,n)=>sum+n,0),maximum,maxBytes});window.__furyShifts=[];new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__furyShifts.push({value:entry.value,hadRecentInput:entry.hadRecentInput});}).observe({type:'layout-shift',buffered:true});});
  await page.goto('http://127.0.0.1:4316/auth/login');await page.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill('media-foundation-admin@example.test');await page.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill("<redacted disposable credential>");await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(url=>['/dashboard','/admin'].includes(url.pathname));
  stage='saved editor';const detail=page.waitForResponse(r=>r.request().method()==='GET'&&r.url().includes('/api/v1/content/admin/')&&r.url().includes("8639544a-33e8-45d3-a3b9-5ef36d51f43b"));await page.goto('http://127.0.0.1:4316/admin/works/'+"7ea307e9-5953-49c1-bae3-4667de99c989"+'/chapters/'+"8639544a-33e8-45d3-a3b9-5ef36d51f43b"+'/edit');const saved=await detail;if(saved.status()!==200)throw Error('Saved Chapter read failed');const payload=await saved.json();if(payload.data?.chapter.pages.length!==30)throw Error('Persisted thirty-page chapter missing');await page.getByRole('button',{name:'معاينة خاصة',exact:true}).waitFor();
  const session=await context.newCDPSession(page);await session.send('Network.enable');await session.send('Network.emulateNetworkConditions',{offline:false,latency:slow?150:20,downloadThroughput:slow?192*1024:10*1024*1024,uploadThroughput:128*1024,connectionType:slow?'cellular3g':'wifi'});
  const resourceIndex=url=>{const m=new URL(url).pathname.match(/\/media\/assets\/([a-f0-9-]+)\/content$/);return m?ids.indexOf(m[1]):-1;};const cdpIds=new Map();const cdpEvents=[];session.on('Network.requestWillBeSent',event=>{const index=resourceIndex(event.request.url);if(index>=0){cdpIds.set(event.requestId,index);cdpEvents.push({id:event.requestId,index:index+1,kind:"start",time:event.timestamp});bytesById.set(event.requestId,0);}});session.on('Network.loadingFinished',event=>{if(cdpIds.has(event.requestId))cdpEvents.push({id:event.requestId,kind:'finish',time:event.timestamp});});session.on('Network.loadingFailed',event=>{if(cdpIds.has(event.requestId))cdpEvents.push({id:event.requestId,kind:'finish',time:event.timestamp});});session.on('Network.dataReceived',event=>{if(cdpIds.has(event.requestId))bytesById.set(event.requestId,(bytesById.get(event.requestId)||0)+event.encodedDataLength);});
  page.on('request',request=>{const index=resourceIndex(request.url());if(index>=0){requests.push({index:index+1,startedMs:Date.now()-started});active.add(request);maxOutstanding=Math.max(maxOutstanding,active.size);}});page.on('requestfinished',request=>{const index=resourceIndex(request.url());if(index>=0){active.delete(request);finished.add(index);}});page.on('requestfailed',request=>active.delete(request));
  const baseResources=await page.evaluate(()=>window.__furyMediaResources());started=Date.now();stage='first useful';await page.getByRole('button',{name:'معاينة خاصة',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.waitFor();const initialHeight=await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').first().evaluate(node=>node.getBoundingClientRect().height);await page.waitForFunction(()=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة 1"]');return image?.complete&&image.naturalWidth>0;},{},{timeout:60000});const firstUsefulMs=Date.now()-started;firstUsefulBytes=[...bytesById.values()].reduce((sum,n)=>sum+n,0);await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));const initialRequests=requests.map(r=>r.index);const firstReadyResources=await page.evaluate(()=>window.__furyMediaResources());const finalHeight=await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').first().evaluate(node=>node.getBoundingClientRect().height);
  stage='initial window';if(!slow)await page.waitForFunction(count=>window.__furyMediaResources().active>=count,expected,{timeout:30000});const initialPreparedMs=Date.now()-started;const initialWindowRequests=requests.map(r=>r.index);if(initialWindowRequests.some(i=>i>10))throw Error('Far page requested at initial open');if(Math.abs(initialHeight-finalHeight)>1)throw Error('Page geometry shifted');const boundaries=[];
  if(!slow){for(const index of [4,9,14]){const since=Date.now();await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').nth(index).scrollIntoViewIfNeeded();await page.waitForFunction(position=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة '+position+'"]');return image?.complete&&image.naturalWidth>0;},index+1,{timeout:30000});await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));boundaries.push({page:index+1,stallMs:Date.now()-since,requested:requests.map(r=>r.index)});}const since=Date.now(),count=requests.length;await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').nth(12).scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة 13"]');return image?.complete&&image.naturalWidth>0;});boundaries.push({kind:'warm reversal',page:13,stallMs:Date.now()-since,newRequests:requests.length-count});}
  const resources=await page.evaluate(()=>window.__furyMediaResources());const heap=await session.send('Runtime.getHeapUsage');const shifts=await page.evaluate(()=>window.__furyShifts);const layout={width:await page.evaluate(()=>innerWidth),scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth),initialFirstPageHeight:initialHeight,readyFirstPageHeight:finalHeight,shifts};stage='close';await dialog.getByRole('button',{name:'إغلاق',exact:true}).click();await dialog.waitFor({state:'hidden'});await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));const afterClose=await page.evaluate(()=>window.__furyMediaResources());if(afterClose.active!==baseResources.active)throw Error('Owned image URLs remain after preview close');
  let cdpActive=0,cdpMax=0;for(const event of cdpEvents.toSorted((a,b)=>a.time-b.time||(a.kind==='finish'?-1:1))){cdpActive+=event.kind==='start'?1:-1;cdpMax=Math.max(cdpMax,cdpActive);}return {passed:true,version,cdpMax,cdpEvents,viewport:width,profile:{slow,latencyMs:slow?150:20,downloadBytesPerSecond:slow?192*1024:10*1024*1024},persistedPages:30,firstUsefulMs,encodedDataBytesBeforeUseful:firstUsefulBytes,initialRequests,initialWindowRequests,initialPreparedMs,maxApplicationOutstandingContentRequests:maxOutstanding,requests,boundaries,resources:{base:baseResources,firstReady:firstReadyResources,atEnd:resources,afterClose},layout,heap:{usedSize:heap.usedSize,totalSize:heap.totalSize,limit:'JavaScript heap only; excludes native decoder/GPU animation memory'},measurement:'One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence'};
 } catch(error){throw Error(JSON.stringify({stage,error:String(error),url:page.url(),headings:await page.locator('h1,h2').allTextContents(),alerts:await page.getByRole('alert').allTextContents(),requests}));} finally {await context.close();}
}
)(page);
```
````

## after-wide-cold-warm-get

Original capture: `after-wide-cold-warm-get.txt`. Bytes: 14528. SHA-256: `536add23d8f9f305dec8b611d574609451ce5914bbfd532060fdb09ed37e0dec`.

````text
### Result
{"passed":true,"version":"after","cdpMax":3,"cdpEvents":[{"id":"22496.364","index":1,"kind":"start","time":286701.847676},{"id":"22496.382","index":2,"kind":"start","time":286701.911759},{"id":"22496.383","index":3,"kind":"start","time":286701.91188},{"id":"22496.364","kind":"finish","time":286701.909403},{"id":"22496.382","kind":"finish","time":286701.933855},{"id":"22496.387","index":4,"kind":"start","time":286701.935829},{"id":"22496.392","index":5,"kind":"start","time":286701.986704},{"id":"22496.383","kind":"finish","time":286701.985325},{"id":"22496.397","index":6,"kind":"start","time":286702.008433},{"id":"22496.387","kind":"finish","time":286702.00705},{"id":"22496.397","kind":"finish","time":286702.029921},{"id":"22496.403","index":7,"kind":"start","time":286702.031356},{"id":"22496.410","index":8,"kind":"start","time":286702.046919},{"id":"22496.392","kind":"finish","time":286702.045766},{"id":"22496.418","index":9,"kind":"start","time":286702.116289},{"id":"22496.403","kind":"finish","time":286702.114906},{"id":"22496.427","index":10,"kind":"start","time":286702.12883},{"id":"22496.410","kind":"finish","time":286702.127465},{"id":"22496.418","kind":"finish","time":286702.198691},{"id":"22496.427","kind":"finish","time":286702.210238},{"id":"22496.471","index":11,"kind":"start","time":286702.274681},{"id":"22496.472","index":12,"kind":"start","time":286702.274808},{"id":"22496.491","index":13,"kind":"start","time":286702.374692},{"id":"22496.471","kind":"finish","time":286702.373143},{"id":"22496.497","index":14,"kind":"start","time":286702.375649},{"id":"22496.472","kind":"finish","time":286702.373416},{"id":"22496.505","index":15,"kind":"start","time":286702.472889},{"id":"22496.491","kind":"finish","time":286702.473049},{"id":"22496.497","kind":"finish","time":286702.473081},{"id":"22496.507","index":16,"kind":"start","time":286702.53633},{"id":"22496.508","index":14,"kind":"start","time":286702.536448},{"id":"22496.505","kind":"finish","time":286702.535144},{"id":"22496.511","index":17,"kind":"start","time":286702.632177},{"id":"22496.508","kind":"finish","time":286702.630858},{"id":"22496.515","index":13,"kind":"start","time":286702.633179},{"id":"22496.507","kind":"finish","time":286702.63104},{"id":"22496.522","index":18,"kind":"start","time":286702.727364},{"id":"22496.515","kind":"finish","time":286702.726061},{"id":"22496.528","index":19,"kind":"start","time":286702.728251},{"id":"22496.511","kind":"finish","time":286702.726287},{"id":"22496.522","kind":"finish","time":286702.820014},{"id":"22496.528","kind":"finish","time":286702.820039}],"cdpScope":"GET content only; CORS preflight excluded","viewport":1280,"profile":{"slow":false,"latencyMs":20,"downloadBytesPerSecond":10485760},"persistedPages":30,"firstUsefulMs":121,"encodedDataBytesBeforeUseful":375161,"initialRequests":[1,2,3,4],"initialWindowRequests":[1,2,3,4,5,6,7,8,9,10],"initialPreparedMs":420,"maxApplicationOutstandingContentRequests":3,"requests":[{"index":1,"startedMs":49},{"index":2,"startedMs":113},{"index":3,"startedMs":113},{"index":4,"startedMs":136},{"index":5,"startedMs":187},{"index":6,"startedMs":209},{"index":7,"startedMs":232},{"index":8,"startedMs":247},{"index":9,"startedMs":317},{"index":10,"startedMs":329},{"index":11,"startedMs":475},{"index":12,"startedMs":475},{"index":13,"startedMs":575},{"index":14,"startedMs":576},{"index":15,"startedMs":674},{"index":16,"startedMs":737},{"index":14,"startedMs":737},{"index":17,"startedMs":833},{"index":13,"startedMs":834},{"index":18,"startedMs":928},{"index":19,"startedMs":929}],"boundaries":[{"page":5,"stallMs":99,"requested":[1,2,3,4,5,6,7,8,9,10,11,12]},{"page":10,"stallMs":100,"requested":[1,2,3,4,5,6,7,8,9,10,11,12,13,14]},{"page":15,"stallMs":150,"requested":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,14]},{"kind":"warm reversal","page":13,"stallMs":22,"newRequests":0,"newTargetRequests":0}],"resources":{"base":{"active":0,"bytes":0,"maximum":0,"maxBytes":0},"firstReady":{"active":2,"bytes":375437,"maximum":2,"maxBytes":375437},"atEnd":{"active":5,"bytes":1875805,"maximum":10,"maxBytes":3001840},"afterClose":{"active":0,"bytes":0,"maximum":10,"maxBytes":3001840}},"layout":{"width":1280,"scrollWidth":1280,"initialFirstPageHeight":1000,"readyFirstPageHeight":1000,"shifts":[{"value":0.027480468749999997,"hadRecentInput":false}]},"heap":{"usedSize":23977848,"totalSize":35110912,"limit":"JavaScript heap only; excludes native decoder/GPU animation memory"},"measurement":"One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence"}
### Ran Playwright code
```js
await (async (originalPage) => {
 const version="after", slow=false, width=1280, expected=10;
 const context=await originalPage.context().browser().newContext({viewport:{width,height:900}});const page=await context.newPage();
 const ids=["702ca060-113c-49e9-8235-4bd14c292127", "9d7807b2-adf8-4eb5-a4cb-6883e493f054", "70f3d46a-76fd-4c8b-870f-64a8a3990231", "d342bfef-ff2a-4b80-b7db-764fd36c8c95", "1b570b8c-362d-4ac0-abf2-9b3151a0b618", "1fea6885-f78a-4836-b1d2-39c7ba9f0a3f", "172478d5-803c-4fa7-b565-8eba78542785", "8674ca88-fc03-4f3a-a9e0-9efd158f40af", "00de1e95-18e5-4644-9d60-f989bd6c3dbc", "fe73894d-5fab-4722-88b1-bfb1324b8c5b", "cdeb1a27-050f-45c4-bbd7-99f1734da809", "95f03346-ea9b-400c-bf7a-1cce242d6d03", "b24e75aa-3754-4d58-afad-446f3d88977d", "8d21c8f9-b75f-42a1-a041-3f4c342ae897", "a9a67407-1fe7-4521-9c6b-7c9bcd13173a", "bfd49603-7b60-41fe-8742-a989c6e87e87", "709f2447-16e4-4b85-91ca-4cd57b82c7b9", "0910e682-f9ce-4ea3-86ae-b8a039602d52", "c89efa47-a3b0-4d63-ad31-099e3644fa04", "0b1b1096-3557-422e-9679-6b78e410b3fe", "dcc4e02c-6625-4711-b37d-bd6d5a6911d8", "f16dea88-79c9-4620-b2ed-01f8b75e85c5", "acdcd6b4-26fe-46e0-8b1d-e43c68459aeb", "e963eba1-2674-4ed6-838a-313b3d7a4846", "a412c4d5-bf3b-4a12-8058-aac868590975", "c9a21547-1e6a-40a7-8355-1c6934fddc00", "daecdc57-4700-489c-8e09-899da8ca0adb", "8af1ee40-ef2f-41c7-ad42-dcaa6c60932c", "54cd25f0-d2f1-4ea6-8620-043476e09ace", "6926b230-0f36-47da-96a0-bf6ae2ecdebf"];let started=0;const requests=[],finished=new Set(),active=new Set();let maxOutstanding=0,firstUsefulBytes;const bytesById=new Map();let stage='login';
 try {
  await page.addInitScript(()=>{const active=new Map();let maximum=0,maxBytes=0;const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=blob=>{const url=create(blob);active.set(url,blob.size);maximum=Math.max(maximum,active.size);maxBytes=Math.max(maxBytes,[...active.values()].reduce((sum,n)=>sum+n,0));return url;};URL.revokeObjectURL=url=>{active.delete(url);revoke(url);};window.__furyMediaResources=()=>({active:active.size,bytes:[...active.values()].reduce((sum,n)=>sum+n,0),maximum,maxBytes});window.__furyShifts=[];new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__furyShifts.push({value:entry.value,hadRecentInput:entry.hadRecentInput});}).observe({type:'layout-shift',buffered:true});});
  await page.goto('http://127.0.0.1:4316/auth/login');await page.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill('media-foundation-admin@example.test');await page.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill("<redacted disposable credential>");await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(url=>['/dashboard','/admin'].includes(url.pathname));
  stage='saved editor';const detail=page.waitForResponse(r=>r.request().method()==='GET'&&r.url().includes('/api/v1/content/admin/')&&r.url().includes("8639544a-33e8-45d3-a3b9-5ef36d51f43b"));await page.goto('http://127.0.0.1:4316/admin/works/'+"7ea307e9-5953-49c1-bae3-4667de99c989"+'/chapters/'+"8639544a-33e8-45d3-a3b9-5ef36d51f43b"+'/edit');const saved=await detail;if(saved.status()!==200)throw Error('Saved Chapter read failed');const payload=await saved.json();if(payload.data?.chapter.pages.length!==30)throw Error('Persisted thirty-page chapter missing');await page.getByRole('button',{name:'معاينة خاصة',exact:true}).waitFor();
  const session=await context.newCDPSession(page);await session.send('Network.enable');await session.send('Network.emulateNetworkConditions',{offline:false,latency:slow?150:20,downloadThroughput:slow?192*1024:10*1024*1024,uploadThroughput:128*1024,connectionType:slow?'cellular3g':'wifi'});
  const resourceIndex=url=>{const m=new URL(url).pathname.match(/\/media\/assets\/([a-f0-9-]+)\/content$/);return m?ids.indexOf(m[1]):-1;};const cdpIds=new Map();const cdpEvents=[];session.on('Network.requestWillBeSent',event=>{const index=resourceIndex(event.request.url);if(index>=0&&event.request.method==='GET'){cdpIds.set(event.requestId,index);cdpEvents.push({id:event.requestId,index:index+1,kind:"start",time:event.timestamp});bytesById.set(event.requestId,0);}});session.on('Network.loadingFinished',event=>{if(cdpIds.has(event.requestId))cdpEvents.push({id:event.requestId,kind:'finish',time:event.timestamp});});session.on('Network.loadingFailed',event=>{if(cdpIds.has(event.requestId))cdpEvents.push({id:event.requestId,kind:'finish',time:event.timestamp});});session.on('Network.dataReceived',event=>{if(cdpIds.has(event.requestId))bytesById.set(event.requestId,(bytesById.get(event.requestId)||0)+event.encodedDataLength);});
  page.on('request',request=>{const index=resourceIndex(request.url());if(index>=0){requests.push({index:index+1,startedMs:Date.now()-started});active.add(request);maxOutstanding=Math.max(maxOutstanding,active.size);}});page.on('requestfinished',request=>{const index=resourceIndex(request.url());if(index>=0){active.delete(request);finished.add(index);}});page.on('requestfailed',request=>active.delete(request));
  const baseResources=await page.evaluate(()=>window.__furyMediaResources());started=Date.now();stage='first useful';await page.getByRole('button',{name:'معاينة خاصة',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.waitFor();const initialHeight=await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').first().evaluate(node=>node.getBoundingClientRect().height);await page.waitForFunction(()=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة 1"]');return image?.complete&&image.naturalWidth>0;},{},{timeout:60000});const firstUsefulMs=Date.now()-started;firstUsefulBytes=[...bytesById.values()].reduce((sum,n)=>sum+n,0);await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));const initialRequests=requests.map(r=>r.index);const firstReadyResources=await page.evaluate(()=>window.__furyMediaResources());const finalHeight=await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').first().evaluate(node=>node.getBoundingClientRect().height);
  stage='initial window';if(!slow)await page.waitForFunction(count=>window.__furyMediaResources().active>=count,expected,{timeout:30000});const initialPreparedMs=Date.now()-started;const initialWindowRequests=requests.map(r=>r.index);if(initialWindowRequests.some(i=>i>10))throw Error('Far page requested at initial open');if(Math.abs(initialHeight-finalHeight)>1)throw Error('Page geometry shifted');const boundaries=[];
  if(!slow){for(const index of [4,9,14]){const since=Date.now();await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').nth(index).scrollIntoViewIfNeeded();await page.waitForFunction(position=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة '+position+'"]');return image?.complete&&image.naturalWidth>0;},index+1,{timeout:30000});await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));boundaries.push({page:index+1,stallMs:Date.now()-since,requested:requests.map(r=>r.index)});}await dialog.locator('img[alt="صفحة 13"]').waitFor();const since=Date.now(),count=requests.length,targetCount=requests.filter(r=>r.index===13).length;await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').nth(12).scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة 13"]');return image?.complete&&image.naturalWidth>0;});boundaries.push({kind:'warm reversal',page:13,stallMs:Date.now()-since,newRequests:requests.length-count,newTargetRequests:requests.filter(r=>r.index===13).length-targetCount});}
  const resources=await page.evaluate(()=>window.__furyMediaResources());const heap=await session.send('Runtime.getHeapUsage');const shifts=await page.evaluate(()=>window.__furyShifts);const layout={width:await page.evaluate(()=>innerWidth),scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth),initialFirstPageHeight:initialHeight,readyFirstPageHeight:finalHeight,shifts};stage='close';await dialog.getByRole('button',{name:'إغلاق',exact:true}).click();await dialog.waitFor({state:'hidden'});await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));const afterClose=await page.evaluate(()=>window.__furyMediaResources());if(afterClose.active!==baseResources.active)throw Error('Owned image URLs remain after preview close');
  let cdpActive=0,cdpMax=0;for(const event of cdpEvents.toSorted((a,b)=>a.time-b.time||(a.kind==='finish'?-1:1))){cdpActive+=event.kind==='start'?1:-1;cdpMax=Math.max(cdpMax,cdpActive);}return {passed:true,version,cdpMax,cdpEvents,cdpScope:"GET content only; CORS preflight excluded",viewport:width,profile:{slow,latencyMs:slow?150:20,downloadBytesPerSecond:slow?192*1024:10*1024*1024},persistedPages:30,firstUsefulMs,encodedDataBytesBeforeUseful:firstUsefulBytes,initialRequests,initialWindowRequests,initialPreparedMs,maxApplicationOutstandingContentRequests:maxOutstanding,requests,boundaries,resources:{base:baseResources,firstReady:firstReadyResources,atEnd:resources,afterClose},layout,heap:{usedSize:heap.usedSize,totalSize:heap.totalSize,limit:'JavaScript heap only; excludes native decoder/GPU animation memory'},measurement:'One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence'};
 } catch(error){throw Error(JSON.stringify({stage,error:String(error),url:page.url(),headings:await page.locator('h1,h2').allTextContents(),alerts:await page.getByRole('alert').allTextContents(),requests}));} finally {await context.close();}
}
)(page);
```
````

## after-wide-cold-warm

Original capture: `after-wide-cold-warm.txt`. Bytes: 853. SHA-256: `3bb6ccf3d191234057963578fe433a26588e70a6c7b08f0d7a4b0ebe2b02611c`.

```text
### Error
Error: {"stage":"initial window","error":"Error: Application transfer capacity exceeded","url":"http://127.0.0.1:4316/admin/works/7ea307e9-5953-49c1-bae3-4667de99c989/chapters/8639544a-33e8-45d3-a3b9-5ef36d51f43b/edit","headings":["الرئيسية","إدارة المحتوى","المجتمع والإشراف","التواصل والإعلانات","تحرير فصل مصور","بيانات الفصل"," صفحات الفصل المصور (30)","Media Foundation عمل"," معاينة الفصل 1: Persisted thirty-page chapter"],"alerts":[""],"requests":[{"index":1,"startedMs":55},{"index":2,"startedMs":120},{"index":3,"startedMs":120},{"index":4,"startedMs":146},{"index":5,"startedMs":199},{"index":6,"startedMs":226},{"index":7,"startedMs":251},{"index":8,"startedMs":261},{"index":9,"startedMs":337},{"index":10,"startedMs":346}]}
```

## animated-existing-surfaces-compositor

Original capture: `animated-existing-surfaces-compositor.txt`. Bytes: 107. SHA-256: `eed9c62d78be927b86b5056cd0b72d24c5f9784bf775eb08021a9c355805e151`.

```text
### Error
TypeError [ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING]: A dynamic import callback was not specified.
```

## animated-existing-surfaces-screenshots

Original capture: `animated-existing-surfaces-screenshots.txt`. Bytes: 2039. SHA-256: `df3a0c56ec572aaec8eecfdd1e2765d53acdd18eb0dd857bd3183d47d17972a5`.

```text
### Error
Error: {"reduced":false,"privateImages":[{"alt":"صفحة 2","width":600,"height":800,"type":"image/webp","distinctColors":1,"samples":[{"ms":352,"pngFingerprint":"8df45c5d"},{"ms":766,"pngFingerprint":"8df45c5d"},{"ms":1178,"pngFingerprint":"8df45c5d"},{"ms":1574,"pngFingerprint":"8df45c5d"},{"ms":1997,"pngFingerprint":"8df45c5d"},{"ms":2407,"pngFingerprint":"8df45c5d"},{"ms":2802,"pngFingerprint":"8df45c5d"},{"ms":3202,"pngFingerprint":"8df45c5d"},{"ms":3606,"pngFingerprint":"8df45c5d"},{"ms":4019,"pngFingerprint":"8df45c5d"}]},{"alt":"صفحة 6","width":600,"height":800,"type":"image/webp","distinctColors":1,"samples":[{"ms":342,"pngFingerprint":"8df45c5d"},{"ms":737,"pngFingerprint":"8df45c5d"},{"ms":1134,"pngFingerprint":"8df45c5d"},{"ms":1540,"pngFingerprint":"8df45c5d"},{"ms":1949,"pngFingerprint":"8df45c5d"},{"ms":2355,"pngFingerprint":"8df45c5d"},{"ms":2751,"pngFingerprint":"8df45c5d"},{"ms":3152,"pngFingerprint":"8df45c5d"},{"ms":3556,"pngFingerprint":"8df45c5d"},{"ms":3962,"pngFingerprint":"8df45c5d"}]}],"publicImages":[{"alt":"","width":900,"height":500,"type":"image/webp","distinctColors":3,"samples":[{"ms":77,"pngFingerprint":"849a9a1"},{"ms":227,"pngFingerprint":"8f2c8814"},{"ms":382,"pngFingerprint":"8f2c8814"},{"ms":549,"pngFingerprint":"849a9a1"},{"ms":715,"pngFingerprint":"8f2c8814"},{"ms":881,"pngFingerprint":"fdea379e"},{"ms":1049,"pngFingerprint":"8f2c8814"},{"ms":1215,"pngFingerprint":"8f2c8814"},{"ms":1363,"pngFingerprint":"849a9a1"},{"ms":1515,"pngFingerprint":"8f2c8814"}]},{"alt":"Media Foundation عمل","width":600,"height":800,"type":"image/webp","distinctColors":3,"samples":[{"ms":68,"pngFingerprint":"ff3df3c1"},{"ms":218,"pngFingerprint":"b5cac597"},{"ms":369,"pngFingerprint":"9c97f083"},{"ms":519,"pngFingerprint":"b5cac597"},{"ms":669,"pngFingerprint":"9c97f083"},{"ms":818,"pngFingerprint":"9c97f083"},{"ms":972,"pngFingerprint":"b5cac597"},{"ms":1118,"pngFingerprint":"9c97f083"},{"ms":1274,"pngFingerprint":"ff3df3c1"},{"ms":1417,"pngFingerprint":"b5cac597"}]}]}
```

## animated-existing-surfaces-visible-crops

Original capture: `animated-existing-surfaces-visible-crops.txt`. Bytes: 8285. SHA-256: `b56f732aaaa3b832baa76b7a8751a19e41557fe86ba7f45fbfcce62495820e84`.

````text
### Result
{"passed":true,"results":[{"reduced":false,"privateImages":[{"alt":"صفحة 2","width":600,"height":800,"type":"image/webp","distinctColors":3,"samples":[{"ms":39,"pngFingerprint":"4fea5fb3"},{"ms":155,"pngFingerprint":"4d3cd53c"},{"ms":278,"pngFingerprint":"de1ed9e6"},{"ms":393,"pngFingerprint":"de1ed9e6"},{"ms":506,"pngFingerprint":"4fea5fb3"},{"ms":627,"pngFingerprint":"4d3cd53c"},{"ms":743,"pngFingerprint":"de1ed9e6"},{"ms":861,"pngFingerprint":"4fea5fb3"},{"ms":975,"pngFingerprint":"4d3cd53c"},{"ms":1091,"pngFingerprint":"de1ed9e6"}]},{"alt":"صفحة 6","width":600,"height":800,"type":"image/webp","distinctColors":3,"samples":[{"ms":30,"pngFingerprint":"84c1d623"},{"ms":147,"pngFingerprint":"b09fd76d"},{"ms":261,"pngFingerprint":"b09fd76d"},{"ms":381,"pngFingerprint":"60e1eed"},{"ms":498,"pngFingerprint":"84c1d623"},{"ms":616,"pngFingerprint":"b09fd76d"},{"ms":732,"pngFingerprint":"60e1eed"},{"ms":848,"pngFingerprint":"60e1eed"},{"ms":968,"pngFingerprint":"84c1d623"},{"ms":1081,"pngFingerprint":"b09fd76d"}]}],"publicImages":[{"alt":"","width":900,"height":500,"type":"image/webp","distinctColors":3,"samples":[{"ms":38,"pngFingerprint":"d5c13f75"},{"ms":158,"pngFingerprint":"affc7c54"},{"ms":273,"pngFingerprint":"17d6f7f2"},{"ms":395,"pngFingerprint":"17d6f7f2"},{"ms":509,"pngFingerprint":"affc7c54"},{"ms":624,"pngFingerprint":"17d6f7f2"},{"ms":738,"pngFingerprint":"17d6f7f2"},{"ms":858,"pngFingerprint":"d5c13f75"},{"ms":974,"pngFingerprint":"affc7c54"},{"ms":1089,"pngFingerprint":"17d6f7f2"}]},{"alt":"Media Foundation عمل","width":600,"height":800,"type":"image/webp","distinctColors":3,"samples":[{"ms":23,"pngFingerprint":"60e1eed"},{"ms":143,"pngFingerprint":"b09fd76d"},{"ms":259,"pngFingerprint":"b09fd76d"},{"ms":377,"pngFingerprint":"60e1eed"},{"ms":496,"pngFingerprint":"84c1d623"},{"ms":609,"pngFingerprint":"b09fd76d"},{"ms":729,"pngFingerprint":"60e1eed"},{"ms":842,"pngFingerprint":"60e1eed"},{"ms":960,"pngFingerprint":"84c1d623"},{"ms":1075,"pngFingerprint":"b09fd76d"}]}]},{"reduced":true,"privateImages":[{"alt":"صفحة 2","width":600,"height":800,"type":"image/png","distinctColors":1,"samples":[{"ms":37,"pngFingerprint":"4fea5fb3"},{"ms":153,"pngFingerprint":"4fea5fb3"},{"ms":270,"pngFingerprint":"4fea5fb3"},{"ms":389,"pngFingerprint":"4fea5fb3"},{"ms":507,"pngFingerprint":"4fea5fb3"},{"ms":621,"pngFingerprint":"4fea5fb3"},{"ms":738,"pngFingerprint":"4fea5fb3"},{"ms":854,"pngFingerprint":"4fea5fb3"},{"ms":971,"pngFingerprint":"4fea5fb3"},{"ms":1088,"pngFingerprint":"4fea5fb3"}]},{"alt":"صفحة 6","width":600,"height":800,"type":"image/png","distinctColors":1,"samples":[{"ms":29,"pngFingerprint":"84c1d623"},{"ms":143,"pngFingerprint":"84c1d623"},{"ms":262,"pngFingerprint":"84c1d623"},{"ms":379,"pngFingerprint":"84c1d623"},{"ms":496,"pngFingerprint":"84c1d623"},{"ms":613,"pngFingerprint":"84c1d623"},{"ms":729,"pngFingerprint":"84c1d623"},{"ms":846,"pngFingerprint":"84c1d623"},{"ms":963,"pngFingerprint":"84c1d623"},{"ms":1080,"pngFingerprint":"84c1d623"}]}],"publicImages":[{"alt":"","width":900,"height":500,"type":"image/png","distinctColors":1,"samples":[{"ms":28,"pngFingerprint":"d5c13f75"},{"ms":145,"pngFingerprint":"d5c13f75"},{"ms":263,"pngFingerprint":"d5c13f75"},{"ms":380,"pngFingerprint":"d5c13f75"},{"ms":496,"pngFingerprint":"d5c13f75"},{"ms":613,"pngFingerprint":"d5c13f75"},{"ms":730,"pngFingerprint":"d5c13f75"},{"ms":847,"pngFingerprint":"d5c13f75"},{"ms":963,"pngFingerprint":"d5c13f75"},{"ms":1080,"pngFingerprint":"d5c13f75"}]},{"alt":"Media Foundation عمل","width":600,"height":800,"type":"image/png","distinctColors":1,"samples":[{"ms":25,"pngFingerprint":"84c1d623"},{"ms":143,"pngFingerprint":"84c1d623"},{"ms":260,"pngFingerprint":"84c1d623"},{"ms":377,"pngFingerprint":"84c1d623"},{"ms":495,"pngFingerprint":"84c1d623"},{"ms":609,"pngFingerprint":"84c1d623"},{"ms":726,"pngFingerprint":"84c1d623"},{"ms":843,"pngFingerprint":"84c1d623"},{"ms":961,"pngFingerprint":"84c1d623"},{"ms":1075,"pngFingerprint":"84c1d623"}]}]}],"measurement":"Native production Chromium visible compositor crop screenshots, ten timed samples per displayed image; canvas drawImage uses a default still frame and is not animation evidence. Stored originals independently retain three WebP frames"}
### Ran Playwright code
```js
await (async (originalPage) => {
 const results=[];
 let surface=0;
 const sample=async locator=>{const surfaceIndex=surface++;
  await locator.evaluate(async i=>{i.scrollIntoView({block:'center',behavior:'instant'});await i.decode();});const clip=await locator.evaluate(i=>{const r=i.getBoundingClientRect();let root=i.parentElement;while(root&& !['auto','scroll'].includes(getComputedStyle(root).overflowY))root=root.parentElement;const bounds=root?.getBoundingClientRect()??{top:0,bottom:innerHeight};return{x:Math.max(0,r.left+r.width*.1),y:(Math.max(0,r.top,bounds.top)+Math.min(innerHeight,r.bottom,bounds.bottom))/2,width:10,height:10};});
  const hashes=new Set(),samples=[];const started=Date.now();
  for(let index=0;index<10;index++){
   const buffer=await locator.page().screenshot({clip,animations:'allow',path:'/tmp/fury-media-motion-'+surfaceIndex+'-'+index+'.png'});let fingerprint=2166136261;for(const byte of buffer)fingerprint=Math.imul(fingerprint^byte,16777619)>>>0;const hash=fingerprint.toString(16);hashes.add(hash);samples.push({ms:Date.now()-started,pngFingerprint:hash});
   await locator.page().evaluate(()=>new Promise(resolve=>{const target=performance.now()+65;const next=()=>performance.now()>=target?resolve():requestAnimationFrame(next);requestAnimationFrame(next);}));
  }
  const descriptor=await locator.evaluate(async image=>({alt:image.alt,width:image.naturalWidth,height:image.naturalHeight,type:(await(await fetch(image.src)).blob()).type}));
  return {...descriptor,distinctColors:hashes.size,samples};
 };
 for(const reduced of [false,true]){
  const context=await originalPage.context().browser().newContext({viewport:{width:1280,height:900},reducedMotion:reduced?'reduce':'no-preference'});const page=await context.newPage();
  try{
   await page.goto('http://127.0.0.1:4316/auth/login');await page.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill('media-foundation-admin@example.test');await page.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill("<redacted disposable credential>");await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(url=>['/dashboard','/admin'].includes(url.pathname));
   await page.goto('http://127.0.0.1:4316/admin/works/'+"7ea307e9-5953-49c1-bae3-4667de99c989"+'/chapters/'+"8639544a-33e8-45d3-a3b9-5ef36d51f43b"+'/edit');await page.getByRole('button',{name:'معاينة خاصة',exact:true}).click();const dialog=page.getByRole('dialog');const privateImages=[];
   for(const index of [1,5]){await dialog.locator('ol > li').nth(index).scrollIntoViewIfNeeded();const image=dialog.getByRole('img',{name:'صفحة '+(index+1),exact:true});await image.waitFor();await image.evaluate(i=>i.decode());privateImages.push(await sample(image));}
   await dialog.getByRole('button',{name:'إغلاق',exact:true}).click();
   await page.goto('http://127.0.0.1:4316/story/media-foundation');await page.getByRole('heading',{name:'Media Foundation عمل',exact:true}).waitFor();await page.waitForFunction(()=>[...document.images].filter(i=>i.src.startsWith('blob:')&&i.complete&&i.naturalWidth>0).length>=2);const publicImages=[];for(const image of await page.locator('img[src^="blob:"]').all())publicImages.push(await sample(image));
   const all=[...privateImages,...publicImages];if(all.some(i=>reduced?i.distinctColors!==1:i.distinctColors<3))throw Error(JSON.stringify({reduced,privateImages,publicImages}));if(all.some(i=>i.type!==(reduced?'image/png':'image/webp')))throw Error('Motion display container mismatch');
   results.push({reduced,privateImages,publicImages});
  }finally{await context.close();}
 }
 return {passed:true,results,measurement:'Native production Chromium visible compositor crop screenshots, ten timed samples per displayed image; canvas drawImage uses a default still frame and is not animation evidence. Stored originals independently retain three WebP frames'};
}
)(page);
```
````

## animated-existing-surfaces

Original capture: `animated-existing-surfaces.txt`. Bytes: 11199. SHA-256: `8a262a4960029bf1284c74416b0a8e114c45e2fb05e1c04e5e3c3b513e2fd685`.

```text
### Error
Error: {"reduced":false,"privateImages":[{"alt":"صفحة 2","width":600,"height":800,"type":"image/webp","distinctColors":1,"colors":["60,30,200,255"],"samples":[{"ms":112,"rgba":"60,30,200,255"},{"ms":137,"rgba":"60,30,200,255"},{"ms":138,"rgba":"60,30,200,255"},{"ms":149,"rgba":"60,30,200,255"},{"ms":166,"rgba":"60,30,200,255"},{"ms":181,"rgba":"60,30,200,255"},{"ms":199,"rgba":"60,30,200,255"},{"ms":214,"rgba":"60,30,200,255"},{"ms":232,"rgba":"60,30,200,255"},{"ms":249,"rgba":"60,30,200,255"},{"ms":264,"rgba":"60,30,200,255"},{"ms":282,"rgba":"60,30,200,255"},{"ms":297,"rgba":"60,30,200,255"},{"ms":316,"rgba":"60,30,200,255"},{"ms":333,"rgba":"60,30,200,255"},{"ms":349,"rgba":"60,30,200,255"},{"ms":366,"rgba":"60,30,200,255"},{"ms":383,"rgba":"60,30,200,255"},{"ms":398,"rgba":"60,30,200,255"},{"ms":415,"rgba":"60,30,200,255"},{"ms":431,"rgba":"60,30,200,255"},{"ms":449,"rgba":"60,30,200,255"},{"ms":464,"rgba":"60,30,200,255"},{"ms":483,"rgba":"60,30,200,255"},{"ms":499,"rgba":"60,30,200,255"},{"ms":516,"rgba":"60,30,200,255"},{"ms":533,"rgba":"60,30,200,255"},{"ms":548,"rgba":"60,30,200,255"},{"ms":566,"rgba":"60,30,200,255"},{"ms":582,"rgba":"60,30,200,255"},{"ms":598,"rgba":"60,30,200,255"},{"ms":616,"rgba":"60,30,200,255"},{"ms":633,"rgba":"60,30,200,255"},{"ms":649,"rgba":"60,30,200,255"},{"ms":666,"rgba":"60,30,200,255"},{"ms":682,"rgba":"60,30,200,255"},{"ms":699,"rgba":"60,30,200,255"},{"ms":715,"rgba":"60,30,200,255"},{"ms":732,"rgba":"60,30,200,255"},{"ms":748,"rgba":"60,30,200,255"},{"ms":765,"rgba":"60,30,200,255"},{"ms":783,"rgba":"60,30,200,255"},{"ms":799,"rgba":"60,30,200,255"},{"ms":816,"rgba":"60,30,200,255"},{"ms":832,"rgba":"60,30,200,255"},{"ms":848,"rgba":"60,30,200,255"},{"ms":865,"rgba":"60,30,200,255"},{"ms":881,"rgba":"60,30,200,255"},{"ms":899,"rgba":"60,30,200,255"},{"ms":915,"rgba":"60,30,200,255"},{"ms":933,"rgba":"60,30,200,255"},{"ms":948,"rgba":"60,30,200,255"},{"ms":966,"rgba":"60,30,200,255"},{"ms":981,"rgba":"60,30,200,255"},{"ms":998,"rgba":"60,30,200,255"},{"ms":1015,"rgba":"60,30,200,255"},{"ms":1033,"rgba":"60,30,200,255"},{"ms":1049,"rgba":"60,30,200,255"},{"ms":1065,"rgba":"60,30,200,255"},{"ms":1082,"rgba":"60,30,200,255"},{"ms":1098,"rgba":"60,30,200,255"},{"ms":1114,"rgba":"60,30,200,255"},{"ms":1133,"rgba":"60,30,200,255"},{"ms":1148,"rgba":"60,30,200,255"},{"ms":1166,"rgba":"60,30,200,255"},{"ms":1183,"rgba":"60,30,200,255"},{"ms":1199,"rgba":"60,30,200,255"},{"ms":1215,"rgba":"60,30,200,255"},{"ms":1232,"rgba":"60,30,200,255"},{"ms":1249,"rgba":"60,30,200,255"},{"ms":1266,"rgba":"60,30,200,255"},{"ms":1281,"rgba":"60,30,200,255"},{"ms":1299,"rgba":"60,30,200,255"},{"ms":1316,"rgba":"60,30,200,255"}]},{"alt":"صفحة 6","width":600,"height":800,"type":"image/webp","distinctColors":1,"colors":["60,30,201,255"],"samples":[{"ms":5,"rgba":"60,30,201,255"},{"ms":22,"rgba":"60,30,201,255"},{"ms":38,"rgba":"60,30,201,255"},{"ms":53,"rgba":"60,30,201,255"},{"ms":69,"rgba":"60,30,201,255"},{"ms":87,"rgba":"60,30,201,255"},{"ms":102,"rgba":"60,30,201,255"},{"ms":120,"rgba":"60,30,201,255"},{"ms":137,"rgba":"60,30,201,255"},{"ms":153,"rgba":"60,30,201,255"},{"ms":169,"rgba":"60,30,201,255"},{"ms":187,"rgba":"60,30,201,255"},{"ms":202,"rgba":"60,30,201,255"},{"ms":220,"rgba":"60,30,201,255"},{"ms":237,"rgba":"60,30,201,255"},{"ms":254,"rgba":"60,30,201,255"},{"ms":270,"rgba":"60,30,201,255"},{"ms":286,"rgba":"60,30,201,255"},{"ms":304,"rgba":"60,30,201,255"},{"ms":320,"rgba":"60,30,201,255"},{"ms":337,"rgba":"60,30,201,255"},{"ms":354,"rgba":"60,30,201,255"},{"ms":370,"rgba":"60,30,201,255"},{"ms":386,"rgba":"60,30,201,255"},{"ms":402,"rgba":"60,30,201,255"},{"ms":420,"rgba":"60,30,201,255"},{"ms":437,"rgba":"60,30,201,255"},{"ms":453,"rgba":"60,30,201,255"},{"ms":471,"rgba":"60,30,201,255"},{"ms":485,"rgba":"60,30,201,255"},{"ms":503,"rgba":"60,30,201,255"},{"ms":520,"rgba":"60,30,201,255"},{"ms":537,"rgba":"60,30,201,255"},{"ms":554,"rgba":"60,30,201,255"},{"ms":570,"rgba":"60,30,201,255"},{"ms":586,"rgba":"60,30,201,255"},{"ms":602,"rgba":"60,30,201,255"},{"ms":619,"rgba":"60,30,201,255"},{"ms":635,"rgba":"60,30,201,255"},{"ms":654,"rgba":"60,30,201,255"},{"ms":670,"rgba":"60,30,201,255"},{"ms":686,"rgba":"60,30,201,255"},{"ms":704,"rgba":"60,30,201,255"},{"ms":720,"rgba":"60,30,201,255"},{"ms":737,"rgba":"60,30,201,255"},{"ms":753,"rgba":"60,30,201,255"},{"ms":770,"rgba":"60,30,201,255"},{"ms":787,"rgba":"60,30,201,255"},{"ms":804,"rgba":"60,30,201,255"},{"ms":818,"rgba":"60,30,201,255"},{"ms":837,"rgba":"60,30,201,255"},{"ms":852,"rgba":"60,30,201,255"},{"ms":870,"rgba":"60,30,201,255"},{"ms":886,"rgba":"60,30,201,255"},{"ms":903,"rgba":"60,30,201,255"},{"ms":918,"rgba":"60,30,201,255"},{"ms":937,"rgba":"60,30,201,255"},{"ms":954,"rgba":"60,30,201,255"},{"ms":970,"rgba":"60,30,201,255"},{"ms":987,"rgba":"60,30,201,255"},{"ms":1004,"rgba":"60,30,201,255"},{"ms":1019,"rgba":"60,30,201,255"},{"ms":1037,"rgba":"60,30,201,255"},{"ms":1053,"rgba":"60,30,201,255"},{"ms":1069,"rgba":"60,30,201,255"},{"ms":1086,"rgba":"60,30,201,255"},{"ms":1104,"rgba":"60,30,201,255"},{"ms":1120,"rgba":"60,30,201,255"},{"ms":1137,"rgba":"60,30,201,255"},{"ms":1152,"rgba":"60,30,201,255"},{"ms":1169,"rgba":"60,30,201,255"},{"ms":1186,"rgba":"60,30,201,255"},{"ms":1203,"rgba":"60,30,201,255"},{"ms":1219,"rgba":"60,30,201,255"},{"ms":1237,"rgba":"60,30,201,255"},{"ms":1252,"rgba":"60,30,201,255"},{"ms":1270,"rgba":"60,30,201,255"},{"ms":1287,"rgba":"60,30,201,255"},{"ms":1303,"rgba":"60,30,201,255"}]}],"publicImages":[{"alt":"","width":900,"height":500,"type":"image/webp","distinctColors":1,"colors":["60,30,201,255"],"samples":[{"ms":9,"rgba":"60,30,201,255"},{"ms":23,"rgba":"60,30,201,255"},{"ms":35,"rgba":"60,30,201,255"},{"ms":52,"rgba":"60,30,201,255"},{"ms":69,"rgba":"60,30,201,255"},{"ms":86,"rgba":"60,30,201,255"},{"ms":101,"rgba":"60,30,201,255"},{"ms":120,"rgba":"60,30,201,255"},{"ms":136,"rgba":"60,30,201,255"},{"ms":153,"rgba":"60,30,201,255"},{"ms":168,"rgba":"60,30,201,255"},{"ms":184,"rgba":"60,30,201,255"},{"ms":203,"rgba":"60,30,201,255"},{"ms":220,"rgba":"60,30,201,255"},{"ms":236,"rgba":"60,30,201,255"},{"ms":252,"rgba":"60,30,201,255"},{"ms":268,"rgba":"60,30,201,255"},{"ms":285,"rgba":"60,30,201,255"},{"ms":301,"rgba":"60,30,201,255"},{"ms":318,"rgba":"60,30,201,255"},{"ms":336,"rgba":"60,30,201,255"},{"ms":353,"rgba":"60,30,201,255"},{"ms":370,"rgba":"60,30,201,255"},{"ms":386,"rgba":"60,30,201,255"},{"ms":403,"rgba":"60,30,201,255"},{"ms":420,"rgba":"60,30,201,255"},{"ms":435,"rgba":"60,30,201,255"},{"ms":452,"rgba":"60,30,201,255"},{"ms":468,"rgba":"60,30,201,255"},{"ms":487,"rgba":"60,30,201,255"},{"ms":503,"rgba":"60,30,201,255"},{"ms":520,"rgba":"60,30,201,255"},{"ms":536,"rgba":"60,30,201,255"},{"ms":553,"rgba":"60,30,201,255"},{"ms":569,"rgba":"60,30,201,255"},{"ms":585,"rgba":"60,30,201,255"},{"ms":601,"rgba":"60,30,201,255"},{"ms":620,"rgba":"60,30,201,255"},{"ms":636,"rgba":"60,30,201,255"},{"ms":653,"rgba":"60,30,201,255"},{"ms":670,"rgba":"60,30,201,255"},{"ms":685,"rgba":"60,30,201,255"},{"ms":701,"rgba":"60,30,201,255"},{"ms":718,"rgba":"60,30,201,255"},{"ms":736,"rgba":"60,30,201,255"},{"ms":753,"rgba":"60,30,201,255"},{"ms":770,"rgba":"60,30,201,255"},{"ms":786,"rgba":"60,30,201,255"},{"ms":803,"rgba":"60,30,201,255"},{"ms":818,"rgba":"60,30,201,255"},{"ms":836,"rgba":"60,30,201,255"},{"ms":853,"rgba":"60,30,201,255"},{"ms":869,"rgba":"60,30,201,255"},{"ms":885,"rgba":"60,30,201,255"},{"ms":903,"rgba":"60,30,201,255"},{"ms":918,"rgba":"60,30,201,255"},{"ms":936,"rgba":"60,30,201,255"},{"ms":953,"rgba":"60,30,201,255"},{"ms":970,"rgba":"60,30,201,255"},{"ms":986,"rgba":"60,30,201,255"},{"ms":1003,"rgba":"60,30,201,255"},{"ms":1018,"rgba":"60,30,201,255"},{"ms":1036,"rgba":"60,30,201,255"},{"ms":1053,"rgba":"60,30,201,255"},{"ms":1070,"rgba":"60,30,201,255"},{"ms":1086,"rgba":"60,30,201,255"},{"ms":1102,"rgba":"60,30,201,255"},{"ms":1119,"rgba":"60,30,201,255"},{"ms":1136,"rgba":"60,30,201,255"},{"ms":1153,"rgba":"60,30,201,255"},{"ms":1169,"rgba":"60,30,201,255"},{"ms":1186,"rgba":"60,30,201,255"},{"ms":1202,"rgba":"60,30,201,255"},{"ms":1219,"rgba":"60,30,201,255"},{"ms":1236,"rgba":"60,30,201,255"},{"ms":1253,"rgba":"60,30,201,255"},{"ms":1269,"rgba":"60,30,201,255"},{"ms":1286,"rgba":"60,30,201,255"},{"ms":1301,"rgba":"60,30,201,255"}]},{"alt":"Media Foundation عمل","width":600,"height":800,"type":"image/webp","distinctColors":1,"colors":["60,30,201,255"],"samples":[{"ms":11,"rgba":"60,30,201,255"},{"ms":27,"rgba":"60,30,201,255"},{"ms":45,"rgba":"60,30,201,255"},{"ms":59,"rgba":"60,30,201,255"},{"ms":76,"rgba":"60,30,201,255"},{"ms":93,"rgba":"60,30,201,255"},{"ms":109,"rgba":"60,30,201,255"},{"ms":127,"rgba":"60,30,201,255"},{"ms":143,"rgba":"60,30,201,255"},{"ms":159,"rgba":"60,30,201,255"},{"ms":175,"rgba":"60,30,201,255"},{"ms":192,"rgba":"60,30,201,255"},{"ms":208,"rgba":"60,30,201,255"},{"ms":226,"rgba":"60,30,201,255"},{"ms":242,"rgba":"60,30,201,255"},{"ms":260,"rgba":"60,30,201,255"},{"ms":276,"rgba":"60,30,201,255"},{"ms":292,"rgba":"60,30,201,255"},{"ms":309,"rgba":"60,30,201,255"},{"ms":326,"rgba":"60,30,201,255"},{"ms":343,"rgba":"60,30,201,255"},{"ms":359,"rgba":"60,30,201,255"},{"ms":376,"rgba":"60,30,201,255"},{"ms":393,"rgba":"60,30,201,255"},{"ms":408,"rgba":"60,30,201,255"},{"ms":427,"rgba":"60,30,201,255"},{"ms":442,"rgba":"60,30,201,255"},{"ms":460,"rgba":"60,30,201,255"},{"ms":476,"rgba":"60,30,201,255"},{"ms":493,"rgba":"60,30,201,255"},{"ms":510,"rgba":"60,30,201,255"},{"ms":525,"rgba":"60,30,201,255"},{"ms":543,"rgba":"60,30,201,255"},{"ms":560,"rgba":"60,30,201,255"},{"ms":577,"rgba":"60,30,201,255"},{"ms":593,"rgba":"60,30,201,255"},{"ms":609,"rgba":"60,30,201,255"},{"ms":626,"rgba":"60,30,201,255"},{"ms":641,"rgba":"60,30,201,255"},{"ms":660,"rgba":"60,30,201,255"},{"ms":676,"rgba":"60,30,201,255"},{"ms":692,"rgba":"60,30,201,255"},{"ms":710,"rgba":"60,30,201,255"},{"ms":727,"rgba":"60,30,201,255"},{"ms":742,"rgba":"60,30,201,255"},{"ms":760,"rgba":"60,30,201,255"},{"ms":775,"rgba":"60,30,201,255"},{"ms":793,"rgba":"60,30,201,255"},{"ms":809,"rgba":"60,30,201,255"},{"ms":825,"rgba":"60,30,201,255"},{"ms":842,"rgba":"60,30,201,255"},{"ms":860,"rgba":"60,30,201,255"},{"ms":877,"rgba":"60,30,201,255"},{"ms":891,"rgba":"60,30,201,255"},{"ms":910,"rgba":"60,30,201,255"},{"ms":925,"rgba":"60,30,201,255"},{"ms":943,"rgba":"60,30,201,255"},{"ms":960,"rgba":"60,30,201,255"},{"ms":977,"rgba":"60,30,201,255"},{"ms":993,"rgba":"60,30,201,255"},{"ms":1010,"rgba":"60,30,201,255"},{"ms":1026,"rgba":"60,30,201,255"},{"ms":1043,"rgba":"60,30,201,255"},{"ms":1060,"rgba":"60,30,201,255"},{"ms":1076,"rgba":"60,30,201,255"},{"ms":1092,"rgba":"60,30,201,255"},{"ms":1110,"rgba":"60,30,201,255"},{"ms":1127,"rgba":"60,30,201,255"},{"ms":1143,"rgba":"60,30,201,255"},{"ms":1160,"rgba":"60,30,201,255"},{"ms":1176,"rgba":"60,30,201,255"},{"ms":1193,"rgba":"60,30,201,255"},{"ms":1210,"rgba":"60,30,201,255"},{"ms":1226,"rgba":"60,30,201,255"},{"ms":1243,"rgba":"60,30,201,255"},{"ms":1260,"rgba":"60,30,201,255"},{"ms":1277,"rgba":"60,30,201,255"},{"ms":1293,"rgba":"60,30,201,255"},{"ms":1310,"rgba":"60,30,201,255"}]}]}
```

## before-narrow-slow

Original capture: `before-narrow-slow.txt`. Bytes: 10834. SHA-256: `e5ce2e1411ae1ec9f60245649954d8a34f1a896110ee2e11fdda681c2aec241d`.

````text
### Result
{"passed":true,"version":"before","viewport":320,"profile":{"slow":true,"latencyMs":150,"downloadBytesPerSecond":196608},"persistedPages":30,"firstUsefulMs":12603,"encodedDataBytesBeforeUseful":2212207,"initialRequests":[1,2,3,5,8,4,10,9,6,13,14,11,12,7,16,17,18,19,15,21,22,23,24,25,20,26,27,28,29,30],"initialPreparedMs":12644,"maxApplicationOutstandingContentRequests":30,"requests":[{"index":1,"startedMs":253},{"index":2,"startedMs":259},{"index":3,"startedMs":267},{"index":5,"startedMs":274},{"index":8,"startedMs":282},{"index":4,"startedMs":289},{"index":10,"startedMs":459},{"index":9,"startedMs":488},{"index":6,"startedMs":512},{"index":13,"startedMs":518},{"index":14,"startedMs":541},{"index":11,"startedMs":557},{"index":12,"startedMs":659},{"index":7,"startedMs":694},{"index":16,"startedMs":735},{"index":17,"startedMs":755},{"index":18,"startedMs":788},{"index":19,"startedMs":794},{"index":15,"startedMs":847},{"index":21,"startedMs":901},{"index":22,"startedMs":940},{"index":23,"startedMs":963},{"index":24,"startedMs":1007},{"index":25,"startedMs":1016},{"index":20,"startedMs":1085},{"index":26,"startedMs":1124},{"index":27,"startedMs":1145},{"index":28,"startedMs":1160},{"index":29,"startedMs":1184},{"index":30,"startedMs":1192}],"boundaries":[],"resources":{"base":{"active":0,"bytes":0,"maximum":0,"maxBytes":0},"firstReady":{"active":2,"bytes":375437,"maximum":2,"maxBytes":375437},"atEnd":{"active":2,"bytes":375437,"maximum":2,"maxBytes":375437},"afterClose":{"active":0,"bytes":0,"maximum":2,"maxBytes":375437}},"layout":{"width":320,"scrollWidth":320,"initialFirstPageHeight":30,"readyFirstPageHeight":317.328125,"shifts":[{"value":0.09075666763117285,"hadRecentInput":false},{"value":0.09867149329668211,"hadRecentInput":false}]},"heap":{"usedSize":21997488,"totalSize":36159488,"limit":"JavaScript heap only; excludes native decoder/GPU animation memory"},"measurement":"One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence"}
### Ran Playwright code
```js
await (async (originalPage) => {
 const version="before", slow=true, width=320, expected=30;
 const context=await originalPage.context().browser().newContext({viewport:{width,height:900}});const page=await context.newPage();
 const ids=["702ca060-113c-49e9-8235-4bd14c292127", "9d7807b2-adf8-4eb5-a4cb-6883e493f054", "70f3d46a-76fd-4c8b-870f-64a8a3990231", "d342bfef-ff2a-4b80-b7db-764fd36c8c95", "1b570b8c-362d-4ac0-abf2-9b3151a0b618", "1fea6885-f78a-4836-b1d2-39c7ba9f0a3f", "172478d5-803c-4fa7-b565-8eba78542785", "8674ca88-fc03-4f3a-a9e0-9efd158f40af", "00de1e95-18e5-4644-9d60-f989bd6c3dbc", "fe73894d-5fab-4722-88b1-bfb1324b8c5b", "cdeb1a27-050f-45c4-bbd7-99f1734da809", "95f03346-ea9b-400c-bf7a-1cce242d6d03", "b24e75aa-3754-4d58-afad-446f3d88977d", "8d21c8f9-b75f-42a1-a041-3f4c342ae897", "a9a67407-1fe7-4521-9c6b-7c9bcd13173a", "bfd49603-7b60-41fe-8742-a989c6e87e87", "709f2447-16e4-4b85-91ca-4cd57b82c7b9", "0910e682-f9ce-4ea3-86ae-b8a039602d52", "c89efa47-a3b0-4d63-ad31-099e3644fa04", "0b1b1096-3557-422e-9679-6b78e410b3fe", "dcc4e02c-6625-4711-b37d-bd6d5a6911d8", "f16dea88-79c9-4620-b2ed-01f8b75e85c5", "acdcd6b4-26fe-46e0-8b1d-e43c68459aeb", "e963eba1-2674-4ed6-838a-313b3d7a4846", "a412c4d5-bf3b-4a12-8058-aac868590975", "c9a21547-1e6a-40a7-8355-1c6934fddc00", "daecdc57-4700-489c-8e09-899da8ca0adb", "8af1ee40-ef2f-41c7-ad42-dcaa6c60932c", "54cd25f0-d2f1-4ea6-8620-043476e09ace", "6926b230-0f36-47da-96a0-bf6ae2ecdebf"];let started=0;const requests=[],finished=new Set(),active=new Set();let maxOutstanding=0,firstUsefulBytes;const bytesById=new Map();let stage='login';
 try {
  await page.addInitScript(()=>{const active=new Map();let maximum=0,maxBytes=0;const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=blob=>{const url=create(blob);active.set(url,blob.size);maximum=Math.max(maximum,active.size);maxBytes=Math.max(maxBytes,[...active.values()].reduce((sum,n)=>sum+n,0));return url;};URL.revokeObjectURL=url=>{active.delete(url);revoke(url);};window.__furyMediaResources=()=>({active:active.size,bytes:[...active.values()].reduce((sum,n)=>sum+n,0),maximum,maxBytes});window.__furyShifts=[];new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__furyShifts.push({value:entry.value,hadRecentInput:entry.hadRecentInput});}).observe({type:'layout-shift',buffered:true});});
  await page.goto('http://127.0.0.1:4316/auth/login');await page.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill('media-foundation-admin@example.test');await page.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill("<redacted disposable credential>");await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(url=>['/dashboard','/admin'].includes(url.pathname));
  stage='saved editor';const detail=page.waitForResponse(r=>r.request().method()==='GET'&&r.url().includes('/api/v1/content/admin/')&&r.url().includes("8639544a-33e8-45d3-a3b9-5ef36d51f43b"));await page.goto('http://127.0.0.1:4316/admin/works/'+"7ea307e9-5953-49c1-bae3-4667de99c989"+'/chapters/'+"8639544a-33e8-45d3-a3b9-5ef36d51f43b"+'/edit');const saved=await detail;if(saved.status()!==200)throw Error('Saved Chapter read failed');const payload=await saved.json();if(payload.data?.chapter.pages.length!==30)throw Error('Persisted thirty-page chapter missing');await page.getByRole('button',{name:'معاينة خاصة',exact:true}).waitFor();
  const session=await context.newCDPSession(page);await session.send('Network.enable');await session.send('Network.emulateNetworkConditions',{offline:false,latency:slow?150:20,downloadThroughput:slow?192*1024:10*1024*1024,uploadThroughput:128*1024,connectionType:slow?'cellular3g':'wifi'});
  const resourceIndex=url=>{const m=new URL(url).pathname.match(/\/media\/assets\/([a-f0-9-]+)\/content$/);return m?ids.indexOf(m[1]):-1;};const cdpIds=new Map();session.on('Network.requestWillBeSent',event=>{const index=resourceIndex(event.request.url);if(index>=0){cdpIds.set(event.requestId,index);bytesById.set(event.requestId,0);}});session.on('Network.dataReceived',event=>{if(cdpIds.has(event.requestId))bytesById.set(event.requestId,(bytesById.get(event.requestId)||0)+event.encodedDataLength);});
  page.on('request',request=>{const index=resourceIndex(request.url());if(index>=0){requests.push({index:index+1,startedMs:Date.now()-started});active.add(request);maxOutstanding=Math.max(maxOutstanding,active.size);}});page.on('requestfinished',request=>{const index=resourceIndex(request.url());if(index>=0){active.delete(request);finished.add(index);}});page.on('requestfailed',request=>active.delete(request));
  const baseResources=await page.evaluate(()=>window.__furyMediaResources());started=Date.now();stage='first useful';await page.getByRole('button',{name:'معاينة خاصة',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.waitFor();const initialHeight=await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').first().evaluate(node=>node.getBoundingClientRect().height);await page.waitForFunction(()=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة 1"]');return image?.complete&&image.naturalWidth>0;},{},{timeout:60000});const firstUsefulMs=Date.now()-started;firstUsefulBytes=[...bytesById.values()].reduce((sum,n)=>sum+n,0);await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));const initialRequests=requests.map(r=>r.index);const firstReadyResources=await page.evaluate(()=>window.__furyMediaResources());const finalHeight=await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').first().evaluate(node=>node.getBoundingClientRect().height);
  stage='initial window';if(!slow)await page.waitForFunction(count=>window.__furyMediaResources().active>=count,expected,{timeout:30000});const initialPreparedMs=Date.now()-started;const boundaries=[];
  if(!slow){for(const index of [4,9,14]){const since=Date.now();await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').nth(index).scrollIntoViewIfNeeded();await page.waitForFunction(position=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة '+position+'"]');return image?.complete&&image.naturalWidth>0;},index+1,{timeout:30000});await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));boundaries.push({page:index+1,stallMs:Date.now()-since,requested:requests.map(r=>r.index)});}const since=Date.now(),count=requests.length;await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').nth(12).scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة 13"]');return image?.complete&&image.naturalWidth>0;});boundaries.push({kind:'warm reversal',page:13,stallMs:Date.now()-since,newRequests:requests.length-count});}
  const resources=await page.evaluate(()=>window.__furyMediaResources());const heap=await session.send('Runtime.getHeapUsage');const shifts=await page.evaluate(()=>window.__furyShifts);const layout={width:await page.evaluate(()=>innerWidth),scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth),initialFirstPageHeight:initialHeight,readyFirstPageHeight:finalHeight,shifts};stage='close';await dialog.getByRole('button',{name:'إغلاق',exact:true}).click();await dialog.waitFor({state:'hidden'});await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));const afterClose=await page.evaluate(()=>window.__furyMediaResources());if(afterClose.active!==baseResources.active)throw Error('Owned image URLs remain after preview close');
  return {passed:true,version,viewport:width,profile:{slow,latencyMs:slow?150:20,downloadBytesPerSecond:slow?192*1024:10*1024*1024},persistedPages:30,firstUsefulMs,encodedDataBytesBeforeUseful:firstUsefulBytes,initialRequests,initialPreparedMs,maxApplicationOutstandingContentRequests:maxOutstanding,requests,boundaries,resources:{base:baseResources,firstReady:firstReadyResources,atEnd:resources,afterClose},layout,heap:{usedSize:heap.usedSize,totalSize:heap.totalSize,limit:'JavaScript heap only; excludes native decoder/GPU animation memory'},measurement:'One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence'};
 } catch(error){throw Error(JSON.stringify({stage,error:String(error),url:page.url(),headings:await page.locator('h1,h2').allTextContents(),alerts:await page.getByRole('alert').allTextContents(),requests}));} finally {await context.close();}
}
)(page);
```
````

## before-wide-cold-warm-corrected

Original capture: `before-wide-cold-warm-corrected.txt`. Bytes: 11306. SHA-256: `8bae311851b25cb8a2f64ebff6527af12b10662fd380a2d8bfe24e4ede9b2459`.

````text
### Result
{"passed":true,"version":"before","viewport":1280,"profile":{"slow":false,"latencyMs":20,"downloadBytesPerSecond":10485760},"persistedPages":30,"firstUsefulMs":387,"encodedDataBytesBeforeUseful":1864483,"initialRequests":[1,2,3,6,4,5,8,12,9,13,10,11,7,15,16,17,18,14,20,21,22,23,24,19,25,26,27,28,29,30],"initialPreparedMs":1222,"maxApplicationOutstandingContentRequests":30,"requests":[{"index":1,"startedMs":89},{"index":2,"startedMs":98},{"index":3,"startedMs":100},{"index":6,"startedMs":107},{"index":4,"startedMs":107},{"index":5,"startedMs":118},{"index":8,"startedMs":119},{"index":12,"startedMs":119},{"index":9,"startedMs":119},{"index":13,"startedMs":123},{"index":10,"startedMs":123},{"index":11,"startedMs":139},{"index":7,"startedMs":140},{"index":15,"startedMs":140},{"index":16,"startedMs":140},{"index":17,"startedMs":144},{"index":18,"startedMs":145},{"index":14,"startedMs":161},{"index":20,"startedMs":161},{"index":21,"startedMs":162},{"index":22,"startedMs":162},{"index":23,"startedMs":165},{"index":24,"startedMs":166},{"index":19,"startedMs":183},{"index":25,"startedMs":183},{"index":26,"startedMs":184},{"index":27,"startedMs":184},{"index":28,"startedMs":187},{"index":29,"startedMs":187},{"index":30,"startedMs":204}],"boundaries":[{"page":5,"stallMs":66,"requested":[1,2,3,6,4,5,8,12,9,13,10,11,7,15,16,17,18,14,20,21,22,23,24,19,25,26,27,28,29,30]},{"page":10,"stallMs":66,"requested":[1,2,3,6,4,5,8,12,9,13,10,11,7,15,16,17,18,14,20,21,22,23,24,19,25,26,27,28,29,30]},{"page":15,"stallMs":66,"requested":[1,2,3,6,4,5,8,12,9,13,10,11,7,15,16,17,18,14,20,21,22,23,24,19,25,26,27,28,29,30]},{"kind":"warm reversal","page":13,"stallMs":37,"newRequests":0}],"resources":{"base":{"active":0,"bytes":0,"maximum":0,"maxBytes":0},"firstReady":{"active":5,"bytes":1126035,"maximum":5,"maxBytes":1126035},"atEnd":{"active":30,"bytes":10505060,"maximum":30,"maxBytes":10505060},"afterClose":{"active":0,"bytes":0,"maximum":30,"maxBytes":10505060}},"layout":{"width":1280,"scrollWidth":1280,"initialFirstPageHeight":30,"readyFirstPageHeight":1000,"shifts":[{"value":0.027480468749999997,"hadRecentInput":false},{"value":0.2897135416666667,"hadRecentInput":true},{"value":0.23434956868489584,"hadRecentInput":true}]},"heap":{"usedSize":23524364,"totalSize":36159488,"limit":"JavaScript heap only; excludes native decoder/GPU animation memory"},"measurement":"One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence"}
### Ran Playwright code
```js
await (async (originalPage) => {
 const version="before", slow=false, width=1280, expected=30;
 const context=await originalPage.context().browser().newContext({viewport:{width,height:900}});const page=await context.newPage();
 const ids=["702ca060-113c-49e9-8235-4bd14c292127", "9d7807b2-adf8-4eb5-a4cb-6883e493f054", "70f3d46a-76fd-4c8b-870f-64a8a3990231", "d342bfef-ff2a-4b80-b7db-764fd36c8c95", "1b570b8c-362d-4ac0-abf2-9b3151a0b618", "1fea6885-f78a-4836-b1d2-39c7ba9f0a3f", "172478d5-803c-4fa7-b565-8eba78542785", "8674ca88-fc03-4f3a-a9e0-9efd158f40af", "00de1e95-18e5-4644-9d60-f989bd6c3dbc", "fe73894d-5fab-4722-88b1-bfb1324b8c5b", "cdeb1a27-050f-45c4-bbd7-99f1734da809", "95f03346-ea9b-400c-bf7a-1cce242d6d03", "b24e75aa-3754-4d58-afad-446f3d88977d", "8d21c8f9-b75f-42a1-a041-3f4c342ae897", "a9a67407-1fe7-4521-9c6b-7c9bcd13173a", "bfd49603-7b60-41fe-8742-a989c6e87e87", "709f2447-16e4-4b85-91ca-4cd57b82c7b9", "0910e682-f9ce-4ea3-86ae-b8a039602d52", "c89efa47-a3b0-4d63-ad31-099e3644fa04", "0b1b1096-3557-422e-9679-6b78e410b3fe", "dcc4e02c-6625-4711-b37d-bd6d5a6911d8", "f16dea88-79c9-4620-b2ed-01f8b75e85c5", "acdcd6b4-26fe-46e0-8b1d-e43c68459aeb", "e963eba1-2674-4ed6-838a-313b3d7a4846", "a412c4d5-bf3b-4a12-8058-aac868590975", "c9a21547-1e6a-40a7-8355-1c6934fddc00", "daecdc57-4700-489c-8e09-899da8ca0adb", "8af1ee40-ef2f-41c7-ad42-dcaa6c60932c", "54cd25f0-d2f1-4ea6-8620-043476e09ace", "6926b230-0f36-47da-96a0-bf6ae2ecdebf"];let started=0;const requests=[],finished=new Set(),active=new Set();let maxOutstanding=0,firstUsefulBytes;const bytesById=new Map();let stage='login';
 try {
  await page.addInitScript(()=>{const active=new Map();let maximum=0,maxBytes=0;const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=blob=>{const url=create(blob);active.set(url,blob.size);maximum=Math.max(maximum,active.size);maxBytes=Math.max(maxBytes,[...active.values()].reduce((sum,n)=>sum+n,0));return url;};URL.revokeObjectURL=url=>{active.delete(url);revoke(url);};window.__furyMediaResources=()=>({active:active.size,bytes:[...active.values()].reduce((sum,n)=>sum+n,0),maximum,maxBytes});window.__furyShifts=[];new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__furyShifts.push({value:entry.value,hadRecentInput:entry.hadRecentInput});}).observe({type:'layout-shift',buffered:true});});
  await page.goto('http://127.0.0.1:4316/auth/login');await page.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill('media-foundation-admin@example.test');await page.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill("<redacted disposable credential>");await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(url=>['/dashboard','/admin'].includes(url.pathname));
  stage='saved editor';const detail=page.waitForResponse(r=>r.request().method()==='GET'&&r.url().includes('/api/v1/content/admin/')&&r.url().includes("8639544a-33e8-45d3-a3b9-5ef36d51f43b"));await page.goto('http://127.0.0.1:4316/admin/works/'+"7ea307e9-5953-49c1-bae3-4667de99c989"+'/chapters/'+"8639544a-33e8-45d3-a3b9-5ef36d51f43b"+'/edit');const saved=await detail;if(saved.status()!==200)throw Error('Saved Chapter read failed');const payload=await saved.json();if(payload.data?.chapter.pages.length!==30)throw Error('Persisted thirty-page chapter missing');await page.getByRole('button',{name:'معاينة خاصة',exact:true}).waitFor();
  const session=await context.newCDPSession(page);await session.send('Network.enable');await session.send('Network.emulateNetworkConditions',{offline:false,latency:slow?150:20,downloadThroughput:slow?192*1024:10*1024*1024,uploadThroughput:128*1024,connectionType:slow?'cellular3g':'wifi'});
  const resourceIndex=url=>{const m=new URL(url).pathname.match(/\/media\/assets\/([a-f0-9-]+)\/content$/);return m?ids.indexOf(m[1]):-1;};const cdpIds=new Map();session.on('Network.requestWillBeSent',event=>{const index=resourceIndex(event.request.url);if(index>=0){cdpIds.set(event.requestId,index);bytesById.set(event.requestId,0);}});session.on('Network.dataReceived',event=>{if(cdpIds.has(event.requestId))bytesById.set(event.requestId,(bytesById.get(event.requestId)||0)+event.encodedDataLength);});
  page.on('request',request=>{const index=resourceIndex(request.url());if(index>=0){requests.push({index:index+1,startedMs:Date.now()-started});active.add(request);maxOutstanding=Math.max(maxOutstanding,active.size);}});page.on('requestfinished',request=>{const index=resourceIndex(request.url());if(index>=0){active.delete(request);finished.add(index);}});page.on('requestfailed',request=>active.delete(request));
  const baseResources=await page.evaluate(()=>window.__furyMediaResources());started=Date.now();stage='first useful';await page.getByRole('button',{name:'معاينة خاصة',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.waitFor();const initialHeight=await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').first().evaluate(node=>node.getBoundingClientRect().height);await page.waitForFunction(()=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة 1"]');return image?.complete&&image.naturalWidth>0;},{},{timeout:60000});const firstUsefulMs=Date.now()-started;firstUsefulBytes=[...bytesById.values()].reduce((sum,n)=>sum+n,0);await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));const initialRequests=requests.map(r=>r.index);const firstReadyResources=await page.evaluate(()=>window.__furyMediaResources());const finalHeight=await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').first().evaluate(node=>node.getBoundingClientRect().height);
  stage='initial window';if(!slow)await page.waitForFunction(count=>window.__furyMediaResources().active>=count,expected,{timeout:30000});const initialPreparedMs=Date.now()-started;const boundaries=[];
  if(!slow){for(const index of [4,9,14]){const since=Date.now();await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').nth(index).scrollIntoViewIfNeeded();await page.waitForFunction(position=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة '+position+'"]');return image?.complete&&image.naturalWidth>0;},index+1,{timeout:30000});await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));boundaries.push({page:index+1,stallMs:Date.now()-since,requested:requests.map(r=>r.index)});}const since=Date.now(),count=requests.length;await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').nth(12).scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة 13"]');return image?.complete&&image.naturalWidth>0;});boundaries.push({kind:'warm reversal',page:13,stallMs:Date.now()-since,newRequests:requests.length-count});}
  const resources=await page.evaluate(()=>window.__furyMediaResources());const heap=await session.send('Runtime.getHeapUsage');const shifts=await page.evaluate(()=>window.__furyShifts);const layout={width:await page.evaluate(()=>innerWidth),scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth),initialFirstPageHeight:initialHeight,readyFirstPageHeight:finalHeight,shifts};stage='close';await dialog.getByRole('button',{name:'إغلاق',exact:true}).click();await dialog.waitFor({state:'hidden'});await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));const afterClose=await page.evaluate(()=>window.__furyMediaResources());if(afterClose.active!==baseResources.active)throw Error('Owned image URLs remain after preview close');
  return {passed:true,version,viewport:width,profile:{slow,latencyMs:slow?150:20,downloadBytesPerSecond:slow?192*1024:10*1024*1024},persistedPages:30,firstUsefulMs,encodedDataBytesBeforeUseful:firstUsefulBytes,initialRequests,initialPreparedMs,maxApplicationOutstandingContentRequests:maxOutstanding,requests,boundaries,resources:{base:baseResources,firstReady:firstReadyResources,atEnd:resources,afterClose},layout,heap:{usedSize:heap.usedSize,totalSize:heap.totalSize,limit:'JavaScript heap only; excludes native decoder/GPU animation memory'},measurement:'One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence'};
 } catch(error){throw Error(JSON.stringify({stage,error:String(error),url:page.url(),headings:await page.locator('h1,h2').allTextContents(),alerts:await page.getByRole('alert').allTextContents(),requests}));} finally {await context.close();}
}
)(page);
```
````

## before-wide-cold-warm

Original capture: `before-wide-cold-warm.txt`. Bytes: 330. SHA-256: `9f330f02abbdf35081f11c13967f1724430d54f1a6f5a485f2b053e48a00f902`.

```text
### Error
Error: {"stage":"saved editor","error":"SyntaxError: Unexpected token '<', \"<!DOCTYPE \"... is not valid JSON","url":"http://127.0.0.1:4316/admin/works/7ea307e9-5953-49c1-bae3-4667de99c989/chapters/8639544a-33e8-45d3-a3b9-5ef36d51f43b/edit","headings":["جارٍ تحميل حسابك…"],"alerts":[""],"requests":[]}
```

## final-animated-visible-surfaces

Original capture: `final-animated-visible-surfaces.txt`. Bytes: 8285. SHA-256: `42beff480c79a57e9e2f500c79b90e5b2de1d98608344b616e3172fb8e45bcf1`.

````text
### Result
{"passed":true,"results":[{"reduced":false,"privateImages":[{"alt":"صفحة 2","width":600,"height":800,"type":"image/webp","distinctColors":3,"samples":[{"ms":48,"pngFingerprint":"4fea5fb3"},{"ms":167,"pngFingerprint":"4d3cd53c"},{"ms":280,"pngFingerprint":"de1ed9e6"},{"ms":400,"pngFingerprint":"de1ed9e6"},{"ms":517,"pngFingerprint":"4fea5fb3"},{"ms":631,"pngFingerprint":"4d3cd53c"},{"ms":750,"pngFingerprint":"de1ed9e6"},{"ms":862,"pngFingerprint":"4fea5fb3"},{"ms":981,"pngFingerprint":"4d3cd53c"},{"ms":1096,"pngFingerprint":"de1ed9e6"}]},{"alt":"صفحة 6","width":600,"height":800,"type":"image/webp","distinctColors":3,"samples":[{"ms":31,"pngFingerprint":"84c1d623"},{"ms":150,"pngFingerprint":"b09fd76d"},{"ms":265,"pngFingerprint":"60e1eed"},{"ms":382,"pngFingerprint":"60e1eed"},{"ms":498,"pngFingerprint":"84c1d623"},{"ms":614,"pngFingerprint":"b09fd76d"},{"ms":732,"pngFingerprint":"60e1eed"},{"ms":850,"pngFingerprint":"60e1eed"},{"ms":968,"pngFingerprint":"b09fd76d"},{"ms":1082,"pngFingerprint":"b09fd76d"}]}],"publicImages":[{"alt":"","width":900,"height":500,"type":"image/webp","distinctColors":3,"samples":[{"ms":37,"pngFingerprint":"d5c13f75"},{"ms":154,"pngFingerprint":"affc7c54"},{"ms":273,"pngFingerprint":"17d6f7f2"},{"ms":390,"pngFingerprint":"17d6f7f2"},{"ms":505,"pngFingerprint":"affc7c54"},{"ms":623,"pngFingerprint":"17d6f7f2"},{"ms":739,"pngFingerprint":"17d6f7f2"},{"ms":858,"pngFingerprint":"d5c13f75"},{"ms":971,"pngFingerprint":"affc7c54"},{"ms":1089,"pngFingerprint":"17d6f7f2"}]},{"alt":"Media Foundation عمل","width":600,"height":800,"type":"image/webp","distinctColors":3,"samples":[{"ms":40,"pngFingerprint":"60e1eed"},{"ms":160,"pngFingerprint":"b09fd76d"},{"ms":275,"pngFingerprint":"60e1eed"},{"ms":393,"pngFingerprint":"60e1eed"},{"ms":509,"pngFingerprint":"84c1d623"},{"ms":626,"pngFingerprint":"b09fd76d"},{"ms":741,"pngFingerprint":"60e1eed"},{"ms":859,"pngFingerprint":"60e1eed"},{"ms":974,"pngFingerprint":"b09fd76d"},{"ms":1093,"pngFingerprint":"b09fd76d"}]}]},{"reduced":true,"privateImages":[{"alt":"صفحة 2","width":600,"height":800,"type":"image/png","distinctColors":1,"samples":[{"ms":52,"pngFingerprint":"4fea5fb3"},{"ms":162,"pngFingerprint":"4fea5fb3"},{"ms":281,"pngFingerprint":"4fea5fb3"},{"ms":396,"pngFingerprint":"4fea5fb3"},{"ms":515,"pngFingerprint":"4fea5fb3"},{"ms":637,"pngFingerprint":"4fea5fb3"},{"ms":748,"pngFingerprint":"4fea5fb3"},{"ms":867,"pngFingerprint":"4fea5fb3"},{"ms":980,"pngFingerprint":"4fea5fb3"},{"ms":1097,"pngFingerprint":"4fea5fb3"}]},{"alt":"صفحة 6","width":600,"height":800,"type":"image/png","distinctColors":1,"samples":[{"ms":28,"pngFingerprint":"84c1d623"},{"ms":144,"pngFingerprint":"84c1d623"},{"ms":263,"pngFingerprint":"84c1d623"},{"ms":381,"pngFingerprint":"84c1d623"},{"ms":496,"pngFingerprint":"84c1d623"},{"ms":615,"pngFingerprint":"84c1d623"},{"ms":730,"pngFingerprint":"84c1d623"},{"ms":850,"pngFingerprint":"84c1d623"},{"ms":963,"pngFingerprint":"84c1d623"},{"ms":1079,"pngFingerprint":"84c1d623"}]}],"publicImages":[{"alt":"","width":900,"height":500,"type":"image/png","distinctColors":1,"samples":[{"ms":47,"pngFingerprint":"d5c13f75"},{"ms":161,"pngFingerprint":"d5c13f75"},{"ms":288,"pngFingerprint":"d5c13f75"},{"ms":435,"pngFingerprint":"d5c13f75"},{"ms":551,"pngFingerprint":"d5c13f75"},{"ms":679,"pngFingerprint":"d5c13f75"},{"ms":795,"pngFingerprint":"d5c13f75"},{"ms":915,"pngFingerprint":"d5c13f75"},{"ms":1032,"pngFingerprint":"d5c13f75"},{"ms":1149,"pngFingerprint":"d5c13f75"}]},{"alt":"Media Foundation عمل","width":600,"height":800,"type":"image/png","distinctColors":1,"samples":[{"ms":57,"pngFingerprint":"84c1d623"},{"ms":173,"pngFingerprint":"84c1d623"},{"ms":290,"pngFingerprint":"84c1d623"},{"ms":434,"pngFingerprint":"84c1d623"},{"ms":561,"pngFingerprint":"84c1d623"},{"ms":672,"pngFingerprint":"84c1d623"},{"ms":791,"pngFingerprint":"84c1d623"},{"ms":905,"pngFingerprint":"84c1d623"},{"ms":1021,"pngFingerprint":"84c1d623"},{"ms":1141,"pngFingerprint":"84c1d623"}]}]}],"measurement":"Native production Chromium visible compositor crop screenshots, ten timed samples per displayed image; canvas drawImage uses a default still frame and is not animation evidence. Stored originals independently retain three WebP frames"}
### Ran Playwright code
```js
await (async (originalPage) => {
 const results=[];
 let surface=0;
 const sample=async locator=>{const surfaceIndex=surface++;
  await locator.evaluate(async i=>{i.scrollIntoView({block:'center',behavior:'instant'});await i.decode();});const clip=await locator.evaluate(i=>{const r=i.getBoundingClientRect();let root=i.parentElement;while(root&& !['auto','scroll'].includes(getComputedStyle(root).overflowY))root=root.parentElement;const bounds=root?.getBoundingClientRect()??{top:0,bottom:innerHeight};return{x:Math.max(0,r.left+r.width*.1),y:(Math.max(0,r.top,bounds.top)+Math.min(innerHeight,r.bottom,bounds.bottom))/2,width:10,height:10};});
  const hashes=new Set(),samples=[];const started=Date.now();
  for(let index=0;index<10;index++){
   const buffer=await locator.page().screenshot({clip,animations:'allow',path:'/tmp/fury-media-motion-'+surfaceIndex+'-'+index+'.png'});let fingerprint=2166136261;for(const byte of buffer)fingerprint=Math.imul(fingerprint^byte,16777619)>>>0;const hash=fingerprint.toString(16);hashes.add(hash);samples.push({ms:Date.now()-started,pngFingerprint:hash});
   await locator.page().evaluate(()=>new Promise(resolve=>{const target=performance.now()+65;const next=()=>performance.now()>=target?resolve():requestAnimationFrame(next);requestAnimationFrame(next);}));
  }
  const descriptor=await locator.evaluate(async image=>({alt:image.alt,width:image.naturalWidth,height:image.naturalHeight,type:(await(await fetch(image.src)).blob()).type}));
  return {...descriptor,distinctColors:hashes.size,samples};
 };
 for(const reduced of [false,true]){
  const context=await originalPage.context().browser().newContext({viewport:{width:1280,height:900},reducedMotion:reduced?'reduce':'no-preference'});const page=await context.newPage();
  try{
   await page.goto('http://127.0.0.1:4316/auth/login');await page.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill('media-foundation-admin@example.test');await page.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill("<redacted disposable credential>");await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(url=>['/dashboard','/admin'].includes(url.pathname));
   await page.goto('http://127.0.0.1:4316/admin/works/'+"7ea307e9-5953-49c1-bae3-4667de99c989"+'/chapters/'+"8639544a-33e8-45d3-a3b9-5ef36d51f43b"+'/edit');await page.getByRole('button',{name:'معاينة خاصة',exact:true}).click();const dialog=page.getByRole('dialog');const privateImages=[];
   for(const index of [1,5]){await dialog.locator('ol > li').nth(index).scrollIntoViewIfNeeded();const image=dialog.getByRole('img',{name:'صفحة '+(index+1),exact:true});await image.waitFor();await image.evaluate(i=>i.decode());privateImages.push(await sample(image));}
   await dialog.getByRole('button',{name:'إغلاق',exact:true}).click();
   await page.goto('http://127.0.0.1:4316/story/media-foundation');await page.getByRole('heading',{name:'Media Foundation عمل',exact:true}).waitFor();await page.waitForFunction(()=>[...document.images].filter(i=>i.src.startsWith('blob:')&&i.complete&&i.naturalWidth>0).length>=2);const publicImages=[];for(const image of await page.locator('img[src^="blob:"]').all())publicImages.push(await sample(image));
   const all=[...privateImages,...publicImages];if(all.some(i=>reduced?i.distinctColors!==1:i.distinctColors<3))throw Error(JSON.stringify({reduced,privateImages,publicImages}));if(all.some(i=>i.type!==(reduced?'image/png':'image/webp')))throw Error('Motion display container mismatch');
   results.push({reduced,privateImages,publicImages});
  }finally{await context.close();}
 }
 return {passed:true,results,measurement:'Native production Chromium visible compositor crop screenshots, ten timed samples per displayed image; canvas drawImage uses a default still frame and is not animation evidence. Stored originals independently retain three WebP frames'};
}
)(page);
```
````

## final-narrow-slow

Original capture: `final-narrow-slow.txt`. Bytes: 11456. SHA-256: `4e5a4e3fce6c9dd96c6d7558116e84e8b15f726886eea181ae47e0c80b89a1d6`.

````text
### Result
{"passed":true,"version":"after","cdpMax":2,"cdpEvents":[{"id":"33536.319","index":1,"kind":"start","time":289082.693366},{"id":"33536.351","index":2,"kind":"start","time":289085.496765},{"id":"33536.352","index":3,"kind":"start","time":289085.496969},{"id":"33536.319","kind":"finish","time":289085.492591},{"id":"33536.351","kind":"finish","time":289085.583317},{"id":"33536.352","kind":"finish","time":289085.583344}],"cdpScope":"GET content only; CORS preflight excluded","viewport":320,"profile":{"slow":true,"latencyMs":150,"downloadBytesPerSecond":196608},"persistedPages":30,"firstUsefulMs":2854,"encodedDataBytesBeforeUseful":375161,"initialRequests":[1,2,3],"initialWindowRequests":[1,2,3],"initialPreparedMs":2891,"maxApplicationOutstandingContentRequests":3,"requests":[{"index":1,"startedMs":47},{"index":2,"startedMs":2851},{"index":3,"startedMs":2851}],"boundaries":[],"resources":{"base":{"active":0,"bytes":0,"maximum":0,"maxBytes":0},"firstReady":{"active":1,"bytes":375161,"maximum":1,"maxBytes":375161},"atEnd":{"active":1,"bytes":375161,"maximum":1,"maxBytes":375161},"afterClose":{"active":0,"bytes":0,"maximum":1,"maxBytes":375161}},"layout":{"width":320,"scrollWidth":320,"initialFirstPageHeight":317.328125,"readyFirstPageHeight":317.328125,"shifts":[]},"heap":{"usedSize":20159224,"totalSize":35373056,"limit":"JavaScript heap only; excludes native decoder/GPU animation memory"},"measurement":"One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence"}
### Ran Playwright code
```js
await (async (originalPage) => {
 const version="after", slow=true, width=320, expected=10;
 const context=await originalPage.context().browser().newContext({viewport:{width,height:900}});const page=await context.newPage();
 const ids=["702ca060-113c-49e9-8235-4bd14c292127", "9d7807b2-adf8-4eb5-a4cb-6883e493f054", "70f3d46a-76fd-4c8b-870f-64a8a3990231", "d342bfef-ff2a-4b80-b7db-764fd36c8c95", "1b570b8c-362d-4ac0-abf2-9b3151a0b618", "1fea6885-f78a-4836-b1d2-39c7ba9f0a3f", "172478d5-803c-4fa7-b565-8eba78542785", "8674ca88-fc03-4f3a-a9e0-9efd158f40af", "00de1e95-18e5-4644-9d60-f989bd6c3dbc", "fe73894d-5fab-4722-88b1-bfb1324b8c5b", "cdeb1a27-050f-45c4-bbd7-99f1734da809", "95f03346-ea9b-400c-bf7a-1cce242d6d03", "b24e75aa-3754-4d58-afad-446f3d88977d", "8d21c8f9-b75f-42a1-a041-3f4c342ae897", "a9a67407-1fe7-4521-9c6b-7c9bcd13173a", "bfd49603-7b60-41fe-8742-a989c6e87e87", "709f2447-16e4-4b85-91ca-4cd57b82c7b9", "0910e682-f9ce-4ea3-86ae-b8a039602d52", "c89efa47-a3b0-4d63-ad31-099e3644fa04", "0b1b1096-3557-422e-9679-6b78e410b3fe", "dcc4e02c-6625-4711-b37d-bd6d5a6911d8", "f16dea88-79c9-4620-b2ed-01f8b75e85c5", "acdcd6b4-26fe-46e0-8b1d-e43c68459aeb", "e963eba1-2674-4ed6-838a-313b3d7a4846", "a412c4d5-bf3b-4a12-8058-aac868590975", "c9a21547-1e6a-40a7-8355-1c6934fddc00", "daecdc57-4700-489c-8e09-899da8ca0adb", "8af1ee40-ef2f-41c7-ad42-dcaa6c60932c", "54cd25f0-d2f1-4ea6-8620-043476e09ace", "6926b230-0f36-47da-96a0-bf6ae2ecdebf"];let started=0;const requests=[],finished=new Set(),active=new Set();let maxOutstanding=0,firstUsefulBytes;const bytesById=new Map();let stage='login';
 try {
  await page.addInitScript(()=>{const active=new Map();let maximum=0,maxBytes=0;const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=blob=>{const url=create(blob);active.set(url,blob.size);maximum=Math.max(maximum,active.size);maxBytes=Math.max(maxBytes,[...active.values()].reduce((sum,n)=>sum+n,0));return url;};URL.revokeObjectURL=url=>{active.delete(url);revoke(url);};window.__furyMediaResources=()=>({active:active.size,bytes:[...active.values()].reduce((sum,n)=>sum+n,0),maximum,maxBytes});window.__furyShifts=[];new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__furyShifts.push({value:entry.value,hadRecentInput:entry.hadRecentInput});}).observe({type:'layout-shift',buffered:true});});
  await page.goto('http://127.0.0.1:4316/auth/login');await page.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill('media-foundation-admin@example.test');await page.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill("<redacted disposable credential>");await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(url=>['/dashboard','/admin'].includes(url.pathname));
  stage='saved editor';const detail=page.waitForResponse(r=>r.request().method()==='GET'&&r.url().includes('/api/v1/content/admin/')&&r.url().includes("8639544a-33e8-45d3-a3b9-5ef36d51f43b"));await page.goto('http://127.0.0.1:4316/admin/works/'+"7ea307e9-5953-49c1-bae3-4667de99c989"+'/chapters/'+"8639544a-33e8-45d3-a3b9-5ef36d51f43b"+'/edit');const saved=await detail;if(saved.status()!==200)throw Error('Saved Chapter read failed');const payload=await saved.json();if(payload.data?.chapter.pages.length!==30)throw Error('Persisted thirty-page chapter missing');await page.getByRole('button',{name:'معاينة خاصة',exact:true}).waitFor();
  const session=await context.newCDPSession(page);await session.send('Network.enable');await session.send('Network.emulateNetworkConditions',{offline:false,latency:slow?150:20,downloadThroughput:slow?192*1024:10*1024*1024,uploadThroughput:128*1024,connectionType:slow?'cellular3g':'wifi'});
  const resourceIndex=url=>{const m=new URL(url).pathname.match(/\/media\/assets\/([a-f0-9-]+)\/content$/);return m?ids.indexOf(m[1]):-1;};const cdpIds=new Map();const cdpEvents=[];session.on('Network.requestWillBeSent',event=>{const index=resourceIndex(event.request.url);if(index>=0&&event.request.method==='GET'){cdpIds.set(event.requestId,index);cdpEvents.push({id:event.requestId,index:index+1,kind:"start",time:event.timestamp});bytesById.set(event.requestId,0);}});session.on('Network.loadingFinished',event=>{if(cdpIds.has(event.requestId))cdpEvents.push({id:event.requestId,kind:'finish',time:event.timestamp});});session.on('Network.loadingFailed',event=>{if(cdpIds.has(event.requestId))cdpEvents.push({id:event.requestId,kind:'finish',time:event.timestamp});});session.on('Network.dataReceived',event=>{if(cdpIds.has(event.requestId))bytesById.set(event.requestId,(bytesById.get(event.requestId)||0)+event.encodedDataLength);});
  page.on('request',request=>{const index=resourceIndex(request.url());if(index>=0){requests.push({index:index+1,startedMs:Date.now()-started});active.add(request);maxOutstanding=Math.max(maxOutstanding,active.size);}});page.on('requestfinished',request=>{const index=resourceIndex(request.url());if(index>=0){active.delete(request);finished.add(index);}});page.on('requestfailed',request=>active.delete(request));
  const baseResources=await page.evaluate(()=>window.__furyMediaResources());started=Date.now();stage='first useful';await page.getByRole('button',{name:'معاينة خاصة',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.waitFor();const initialHeight=await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').first().evaluate(node=>node.getBoundingClientRect().height);await page.waitForFunction(()=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة 1"]');return image?.complete&&image.naturalWidth>0;},{},{timeout:60000});const firstUsefulMs=Date.now()-started;firstUsefulBytes=[...bytesById.values()].reduce((sum,n)=>sum+n,0);await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));const initialRequests=requests.map(r=>r.index);const firstReadyResources=await page.evaluate(()=>window.__furyMediaResources());const finalHeight=await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').first().evaluate(node=>node.getBoundingClientRect().height);
  stage='initial window';if(!slow)await page.waitForFunction(count=>window.__furyMediaResources().active>=count,expected,{timeout:30000});const initialPreparedMs=Date.now()-started;const initialWindowRequests=requests.map(r=>r.index);if(initialWindowRequests.some(i=>i>10))throw Error('Far page requested at initial open');if(Math.abs(initialHeight-finalHeight)>1)throw Error('Page geometry shifted');const boundaries=[];
  if(!slow){for(const index of [4,9,14]){const since=Date.now();await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').nth(index).scrollIntoViewIfNeeded();await page.waitForFunction(position=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة '+position+'"]');return image?.complete&&image.naturalWidth>0;},index+1,{timeout:30000});await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));boundaries.push({page:index+1,stallMs:Date.now()-since,requested:requests.map(r=>r.index)});}await dialog.locator('img[alt="صفحة 13"]').waitFor();const since=Date.now(),count=requests.length,targetCount=requests.filter(r=>r.index===13).length;await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').nth(12).scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة 13"]');return image?.complete&&image.naturalWidth>0;});boundaries.push({kind:'warm reversal',page:13,stallMs:Date.now()-since,newRequests:requests.length-count,newTargetRequests:requests.filter(r=>r.index===13).length-targetCount});}
  const resources=await page.evaluate(()=>window.__furyMediaResources());const heap=await session.send('Runtime.getHeapUsage');const shifts=await page.evaluate(()=>window.__furyShifts);const layout={width:await page.evaluate(()=>innerWidth),scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth),initialFirstPageHeight:initialHeight,readyFirstPageHeight:finalHeight,shifts};stage='close';await dialog.getByRole('button',{name:'إغلاق',exact:true}).click();await dialog.waitFor({state:'hidden'});await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));const afterClose=await page.evaluate(()=>window.__furyMediaResources());if(afterClose.active!==baseResources.active)throw Error('Owned image URLs remain after preview close');
  let cdpActive=0,cdpMax=0;for(const event of cdpEvents.toSorted((a,b)=>a.time-b.time||(a.kind==='finish'?-1:1))){cdpActive+=event.kind==='start'?1:-1;cdpMax=Math.max(cdpMax,cdpActive);}return {passed:true,version,cdpMax,cdpEvents,cdpScope:"GET content only; CORS preflight excluded",viewport:width,profile:{slow,latencyMs:slow?150:20,downloadBytesPerSecond:slow?192*1024:10*1024*1024},persistedPages:30,firstUsefulMs,encodedDataBytesBeforeUseful:firstUsefulBytes,initialRequests,initialWindowRequests,initialPreparedMs,maxApplicationOutstandingContentRequests:maxOutstanding,requests,boundaries,resources:{base:baseResources,firstReady:firstReadyResources,atEnd:resources,afterClose},layout,heap:{usedSize:heap.usedSize,totalSize:heap.totalSize,limit:'JavaScript heap only; excludes native decoder/GPU animation memory'},measurement:'One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence'};
 } catch(error){throw Error(JSON.stringify({stage,error:String(error),url:page.url(),headings:await page.locator('h1,h2').allTextContents(),alerts:await page.getByRole('alert').allTextContents(),requests}));} finally {await context.close();}
}
)(page);
```
````

## final-progressive-recovery-jump

Original capture: `final-progressive-recovery-jump.txt`. Bytes: 9866. SHA-256: `0e7e14d68e0a09a64f2c3697edd0d760958ca3660d2d1be9948e5a0ed14ef8a2`.

````text
### Result
{"passed":true,"reportedConnection":{"saveData":true,"effectiveType":"4g","source":"Controlled native EventTarget network-preference boundary, not a physical data-saver/device claim"},"initialRequests":[1,1,2,3,4,5],"afterJump":[1,1,2,3,4,5,25,26,24],"requests":[1,1,2,3,4,5,25,26,24,27,23,28,29,5,6,4,7,3,8,11,11,25,26,24,27,23,28,1,2,3,4,5],"failed":[{"url":"54cd25f0-d2f1-4ea6-8620-043476e09ace/content","failure":{"errorText":"net::ERR_ABORTED"}},{"url":"8674ca88-fc03-4f3a-a9e0-9efd158f40af/content","failure":{"errorText":"net::ERR_ABORTED"}},{"url":"cdeb1a27-050f-45c4-bbd7-99f1734da809/content","failure":{"errorText":"net::ERR_ABORTED"}},{"url":"8af1ee40-ef2f-41c7-ad42-dcaa6c60932c/content","failure":{"errorText":"net::ERR_ABORTED"}}],"actualExpressPrivateWrongActor":404,"actualExpressAdminEndpointDenial":403,"denialInjection":"Real USER content GET returns non-disclosing 404; real administrator Chapter endpoint returns403, replayed at controlled media transport boundary to verify global denial fencing","individual503":"Controlled network fault then actual authenticated read retry","deniedRecoveryJump":"Retry11 then immediate jump25 under250ms latency; explicit retry surface at25 recovered","ownedUrlsAfterClose":0,"scope":"Current draft to saved persisted preview; exact Chapter/account/unmount races also covered at real QueryClient/transport boundary"}
### Ran Playwright code
```js
await (async (originalPage) => {
 const browser=originalPage.context().browser();const ids=["702ca060-113c-49e9-8235-4bd14c292127", "9d7807b2-adf8-4eb5-a4cb-6883e493f054", "70f3d46a-76fd-4c8b-870f-64a8a3990231", "d342bfef-ff2a-4b80-b7db-764fd36c8c95", "1b570b8c-362d-4ac0-abf2-9b3151a0b618", "1fea6885-f78a-4836-b1d2-39c7ba9f0a3f", "172478d5-803c-4fa7-b565-8eba78542785", "8674ca88-fc03-4f3a-a9e0-9efd158f40af", "00de1e95-18e5-4644-9d60-f989bd6c3dbc", "fe73894d-5fab-4722-88b1-bfb1324b8c5b", "cdeb1a27-050f-45c4-bbd7-99f1734da809", "95f03346-ea9b-400c-bf7a-1cce242d6d03", "b24e75aa-3754-4d58-afad-446f3d88977d", "8d21c8f9-b75f-42a1-a041-3f4c342ae897", "a9a67407-1fe7-4521-9c6b-7c9bcd13173a", "bfd49603-7b60-41fe-8742-a989c6e87e87", "709f2447-16e4-4b85-91ca-4cd57b82c7b9", "0910e682-f9ce-4ea3-86ae-b8a039602d52", "c89efa47-a3b0-4d63-ad31-099e3644fa04", "0b1b1096-3557-422e-9679-6b78e410b3fe", "dcc4e02c-6625-4711-b37d-bd6d5a6911d8", "f16dea88-79c9-4620-b2ed-01f8b75e85c5", "acdcd6b4-26fe-46e0-8b1d-e43c68459aeb", "e963eba1-2674-4ed6-838a-313b3d7a4846", "a412c4d5-bf3b-4a12-8058-aac868590975", "c9a21547-1e6a-40a7-8355-1c6934fddc00", "daecdc57-4700-489c-8e09-899da8ca0adb", "8af1ee40-ef2f-41c7-ad42-dcaa6c60932c", "54cd25f0-d2f1-4ea6-8620-043476e09ace", "6926b230-0f36-47da-96a0-bf6ae2ecdebf"];
 const login=async(page,email)=>{await page.goto('http://127.0.0.1:4316/auth/login');await page.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill(email);await page.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill("<redacted disposable credential>");const response=page.waitForResponse(r=>r.request().method()==='POST'&&r.url().endsWith('/auth/login'));await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();const body=await(await response).json();await page.waitForURL(url=>['/dashboard','/admin'].includes(url.pathname));return body.data.tokens.accessToken;};
 const ordinary=await browser.newContext();let readerToken;try{readerToken=await login(await ordinary.newPage(),'media-foundation-reader@example.test');}finally{await ordinary.close();}
 const context=await browser.newContext({viewport:{width:320,height:900}});const page=await context.newPage();let stage='login';const requested=[],failed=[];let fault='503',denialStatus,wrongActorPrivateStatus;
 try {
  await page.addInitScript(()=>{const active=new Set(),create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=blob=>{const url=create(blob);active.add(url);return url;};URL.revokeObjectURL=url=>{active.delete(url);revoke(url);};window.__liveImages=()=>active.size;const connection=new EventTarget();connection.saveData=true;connection.effectiveType='4g';Object.defineProperty(navigator,'connection',{configurable:true,value:connection});});
  await login(page,'media-foundation-admin@example.test');
  await page.route('**/media/assets/*/content',async route=>{if(route.request().method()!=='GET')return route.continue();const index=ids.indexOf(route.request().url().split('/').at(-2));requested.push(index+1);if(fault==='503'&&index===0){fault='none';return route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({success:false,statusCode:503,code:'MEDIA_UNAVAILABLE',message:'Controlled unavailable transport',requestId:'browser-transient-503'})});}if(fault==='deny'&&index===10){fault='none';const headers={...route.request().headers(),authorization:'Bearer '+readerToken};wrongActorPrivateStatus=(await route.fetch({headers})).status();const response=await route.fetch({url:'http://127.0.0.1:4315/api/v1/content/admin/works/'+"7ea307e9-5953-49c1-bae3-4667de99c989"+'/chapters/'+"8639544a-33e8-45d3-a3b9-5ef36d51f43b",headers});denialStatus=response.status();return route.fulfill({response});}return route.continue();});
  page.on('requestfailed',request=>{if(request.url().includes('/content'))failed.push({url:request.url().split('/').slice(-2).join('/'),failure:request.failure()});});
  await page.goto('http://127.0.0.1:4316/admin/works/'+"7ea307e9-5953-49c1-bae3-4667de99c989"+'/chapters/'+"8639544a-33e8-45d3-a3b9-5ef36d51f43b"+'/edit');await page.getByRole('button',{name:'معاينة خاصة',exact:true}).click();const dialog=page.getByRole('dialog');const list=dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li');
  stage='retry';await dialog.getByRole('button',{name:'إعادة تحميل الصفحة 1',exact:true}).click();await page.waitForFunction(()=>document.querySelector('[role="dialog"] img[alt="صفحة 1"]')?.complete);await page.waitForFunction(()=>document.querySelectorAll('[role="dialog"] img[src^="blob:"]').length===5);const initial=requested.slice();if(initial.some(index=>index>5)||initial.filter(i=>i===1).length!==2)throw Error('Constrained initial/retry policy failed');
  stage='jump';await list.nth(24).scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const i=document.querySelector('[role="dialog"] img[alt="صفحة 25"]');return i?.complete&&i.naturalWidth;});const jump=requested.slice();if(!jump.includes(25))throw Error('Jump did not fetch visible page');
  stage='reversal';await list.nth(4).scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const i=document.querySelector('[role="dialog"] img[alt="صفحة 5"]');return i?.complete&&i.naturalWidth;});
  stage='denial';fault='deny';await list.nth(10).scrollIntoViewIfNeeded();const retry=dialog.getByRole('button',{name:'إعادة تحميل الصفحة 11',exact:true});await retry.waitFor();if(await page.evaluate(()=>window.__liveImages())!==0)throw Error('Private URLs survived confirmed denial');const deniedCount=requested.length;await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));if(requested.length!==deniedCount)throw Error('Denial automatically resumed');const session=await context.newCDPSession(page);await session.send('Network.enable');await session.send('Network.emulateNetworkConditions',{offline:false,latency:250,downloadThroughput:10*1024*1024,uploadThroughput:128*1024});await retry.click();await list.nth(24).scrollIntoViewIfNeeded();const recoveryAtNewPosition=dialog.getByRole('button',{name:'إعادة تحميل الصفحة 25',exact:true});await recoveryAtNewPosition.waitFor();await recoveryAtNewPosition.click();await page.waitForFunction(()=>{const i=document.querySelector('[role="dialog"] img[alt="صفحة 25"]');return i?.complete&&i.naturalWidth;});await session.send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  if(denialStatus!==403||wrongActorPrivateStatus!==404)throw Error('Actual authority outcomes changed');stage='scope';const previous=await dialog.getByRole('img',{name:'صفحة 25',exact:true}).getAttribute('src');await dialog.getByRole('button',{name:'النسخة المحفوظة',exact:true}).click();await page.waitForFunction(old=>![...document.querySelectorAll('[role="dialog"] img')].some(i=>i.src===old),previous);await page.waitForFunction(()=>{const i=document.querySelector('[role="dialog"] img[alt="صفحة 1"]');return i?.complete&&i.naturalWidth;});
  stage='close';await dialog.getByRole('button',{name:'إغلاق',exact:true}).click();await page.waitForFunction(()=>window.__liveImages()===0);
  return {passed:true,reportedConnection:{saveData:true,effectiveType:'4g',source:'Controlled native EventTarget network-preference boundary, not a physical data-saver/device claim'},initialRequests:initial,afterJump:jump,requests:requested,failed,actualExpressPrivateWrongActor:wrongActorPrivateStatus,actualExpressAdminEndpointDenial:denialStatus,denialInjection:'Real USER content GET returns non-disclosing 404; real administrator Chapter endpoint returns403, replayed at controlled media transport boundary to verify global denial fencing',individual503:'Controlled network fault then actual authenticated read retry',deniedRecoveryJump:'Retry11 then immediate jump25 under250ms latency; explicit retry surface at25 recovered',ownedUrlsAfterClose:await page.evaluate(()=>window.__liveImages()),scope:'Current draft to saved persisted preview; exact Chapter/account/unmount races also covered at real QueryClient/transport boundary'};
 }catch(error){throw Error(JSON.stringify({stage,error:String(error),requests:requested,failed,alerts:await page.getByRole('alert').allTextContents()}));}finally{await context.close();}
}
)(page);
```
````

## final-wide-cold-warm-awake

Original capture: `final-wide-cold-warm-awake.txt`. Bytes: 14383. SHA-256: `d5d50d2b0bc13f9cf2e7b745555463eafbc4ecc183d1e66d923ef14776e6dbe4`.

````text
### Result
{"passed":true,"version":"after","cdpMax":2,"cdpEvents":[{"id":"33307.346","index":1,"kind":"start","time":289022.278914},{"id":"33307.365","index":2,"kind":"start","time":289022.34371},{"id":"33307.366","index":3,"kind":"start","time":289022.343833},{"id":"33307.346","kind":"finish","time":289022.340738},{"id":"33307.365","kind":"finish","time":289022.36703},{"id":"33307.373","index":4,"kind":"start","time":289022.369475},{"id":"33307.388","index":5,"kind":"start","time":289022.424643},{"id":"33307.366","kind":"finish","time":289022.423246},{"id":"33307.393","index":6,"kind":"start","time":289022.447765},{"id":"33307.373","kind":"finish","time":289022.446176},{"id":"33307.393","kind":"finish","time":289022.469274},{"id":"33307.399","index":7,"kind":"start","time":289022.471089},{"id":"33307.406","index":8,"kind":"start","time":289022.488781},{"id":"33307.388","kind":"finish","time":289022.487346},{"id":"33307.414","index":9,"kind":"start","time":289022.552859},{"id":"33307.399","kind":"finish","time":289022.551265},{"id":"33307.423","index":10,"kind":"start","time":289022.568455},{"id":"33307.406","kind":"finish","time":289022.566884},{"id":"33307.414","kind":"finish","time":289022.634298},{"id":"33307.423","kind":"finish","time":289022.647904},{"id":"33307.467","index":11,"kind":"start","time":289022.706632},{"id":"33307.468","index":12,"kind":"start","time":289022.706773},{"id":"33307.487","index":13,"kind":"start","time":289022.802992},{"id":"33307.467","kind":"finish","time":289022.800257},{"id":"33307.493","index":14,"kind":"start","time":289022.803904},{"id":"33307.468","kind":"finish","time":289022.800495},{"id":"33307.502","index":15,"kind":"start","time":289022.899815},{"id":"33307.487","kind":"finish","time":289022.898585},{"id":"33307.511","index":16,"kind":"start","time":289022.90176},{"id":"33307.493","kind":"finish","time":289022.898883},{"id":"33307.511","kind":"finish","time":289022.905788},{"id":"33307.527","index":16,"kind":"start","time":289022.958334},{"id":"33307.528","index":17,"kind":"start","time":289022.958466},{"id":"33307.502","kind":"finish","time":289022.957049},{"id":"33307.540","index":12,"kind":"start","time":289023.052349},{"id":"33307.527","kind":"finish","time":289023.051108},{"id":"33307.546","index":11,"kind":"start","time":289023.053514},{"id":"33307.528","kind":"finish","time":289023.051642},{"id":"33307.540","kind":"finish","time":289023.082816},{"id":"33307.546","kind":"finish","time":289023.082869}],"cdpScope":"GET content only; CORS preflight excluded","viewport":1280,"profile":{"slow":false,"latencyMs":20,"downloadBytesPerSecond":10485760},"persistedPages":30,"firstUsefulMs":111,"encodedDataBytesBeforeUseful":375161,"initialRequests":[1,2,3,4],"initialWindowRequests":[1,2,3,4,5,6,7,8,9,10],"initialPreparedMs":410,"maxApplicationOutstandingContentRequests":3,"requests":[{"index":1,"startedMs":41},{"index":2,"startedMs":105},{"index":3,"startedMs":105},{"index":4,"startedMs":131},{"index":5,"startedMs":186},{"index":6,"startedMs":209},{"index":7,"startedMs":232},{"index":8,"startedMs":250},{"index":9,"startedMs":314},{"index":10,"startedMs":330},{"index":11,"startedMs":468},{"index":12,"startedMs":468},{"index":13,"startedMs":564},{"index":14,"startedMs":565},{"index":15,"startedMs":661},{"index":16,"startedMs":663},{"index":16,"startedMs":720},{"index":17,"startedMs":720},{"index":12,"startedMs":814},{"index":11,"startedMs":815}],"boundaries":[{"page":5,"stallMs":100,"requested":[1,2,3,4,5,6,7,8,9,10,11,12]},{"page":10,"stallMs":100,"requested":[1,2,3,4,5,6,7,8,9,10,11,12,13,14]},{"page":15,"stallMs":150,"requested":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,16,17]},{"kind":"warm reversal","page":13,"stallMs":33,"newRequests":0,"newTargetRequests":0}],"resources":{"base":{"active":0,"bytes":0,"maximum":0,"maxBytes":0},"firstReady":{"active":2,"bytes":375437,"maximum":2,"maxBytes":375437},"atEnd":{"active":3,"bytes":1125483,"maximum":10,"maxBytes":3001840},"afterClose":{"active":0,"bytes":0,"maximum":10,"maxBytes":3001840}},"layout":{"width":1280,"scrollWidth":1280,"initialFirstPageHeight":1000,"readyFirstPageHeight":1000,"shifts":[{"value":0.027480468749999997,"hadRecentInput":false}]},"heap":{"usedSize":23964928,"totalSize":35635200,"limit":"JavaScript heap only; excludes native decoder/GPU animation memory"},"measurement":"One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence"}
### Ran Playwright code
```js
await (async (originalPage) => {
 const version="after", slow=false, width=1280, expected=10;
 const context=await originalPage.context().browser().newContext({viewport:{width,height:900}});const page=await context.newPage();
 const ids=["702ca060-113c-49e9-8235-4bd14c292127", "9d7807b2-adf8-4eb5-a4cb-6883e493f054", "70f3d46a-76fd-4c8b-870f-64a8a3990231", "d342bfef-ff2a-4b80-b7db-764fd36c8c95", "1b570b8c-362d-4ac0-abf2-9b3151a0b618", "1fea6885-f78a-4836-b1d2-39c7ba9f0a3f", "172478d5-803c-4fa7-b565-8eba78542785", "8674ca88-fc03-4f3a-a9e0-9efd158f40af", "00de1e95-18e5-4644-9d60-f989bd6c3dbc", "fe73894d-5fab-4722-88b1-bfb1324b8c5b", "cdeb1a27-050f-45c4-bbd7-99f1734da809", "95f03346-ea9b-400c-bf7a-1cce242d6d03", "b24e75aa-3754-4d58-afad-446f3d88977d", "8d21c8f9-b75f-42a1-a041-3f4c342ae897", "a9a67407-1fe7-4521-9c6b-7c9bcd13173a", "bfd49603-7b60-41fe-8742-a989c6e87e87", "709f2447-16e4-4b85-91ca-4cd57b82c7b9", "0910e682-f9ce-4ea3-86ae-b8a039602d52", "c89efa47-a3b0-4d63-ad31-099e3644fa04", "0b1b1096-3557-422e-9679-6b78e410b3fe", "dcc4e02c-6625-4711-b37d-bd6d5a6911d8", "f16dea88-79c9-4620-b2ed-01f8b75e85c5", "acdcd6b4-26fe-46e0-8b1d-e43c68459aeb", "e963eba1-2674-4ed6-838a-313b3d7a4846", "a412c4d5-bf3b-4a12-8058-aac868590975", "c9a21547-1e6a-40a7-8355-1c6934fddc00", "daecdc57-4700-489c-8e09-899da8ca0adb", "8af1ee40-ef2f-41c7-ad42-dcaa6c60932c", "54cd25f0-d2f1-4ea6-8620-043476e09ace", "6926b230-0f36-47da-96a0-bf6ae2ecdebf"];let started=0;const requests=[],finished=new Set(),active=new Set();let maxOutstanding=0,firstUsefulBytes;const bytesById=new Map();let stage='login';
 try {
  await page.addInitScript(()=>{const active=new Map();let maximum=0,maxBytes=0;const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=blob=>{const url=create(blob);active.set(url,blob.size);maximum=Math.max(maximum,active.size);maxBytes=Math.max(maxBytes,[...active.values()].reduce((sum,n)=>sum+n,0));return url;};URL.revokeObjectURL=url=>{active.delete(url);revoke(url);};window.__furyMediaResources=()=>({active:active.size,bytes:[...active.values()].reduce((sum,n)=>sum+n,0),maximum,maxBytes});window.__furyShifts=[];new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__furyShifts.push({value:entry.value,hadRecentInput:entry.hadRecentInput});}).observe({type:'layout-shift',buffered:true});});
  await page.goto('http://127.0.0.1:4316/auth/login');await page.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill('media-foundation-admin@example.test');await page.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill("<redacted disposable credential>");await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(url=>['/dashboard','/admin'].includes(url.pathname));
  stage='saved editor';const detail=page.waitForResponse(r=>r.request().method()==='GET'&&r.url().includes('/api/v1/content/admin/')&&r.url().includes("8639544a-33e8-45d3-a3b9-5ef36d51f43b"));await page.goto('http://127.0.0.1:4316/admin/works/'+"7ea307e9-5953-49c1-bae3-4667de99c989"+'/chapters/'+"8639544a-33e8-45d3-a3b9-5ef36d51f43b"+'/edit');const saved=await detail;if(saved.status()!==200)throw Error('Saved Chapter read failed');const payload=await saved.json();if(payload.data?.chapter.pages.length!==30)throw Error('Persisted thirty-page chapter missing');await page.getByRole('button',{name:'معاينة خاصة',exact:true}).waitFor();
  const session=await context.newCDPSession(page);await session.send('Network.enable');await session.send('Network.emulateNetworkConditions',{offline:false,latency:slow?150:20,downloadThroughput:slow?192*1024:10*1024*1024,uploadThroughput:128*1024,connectionType:slow?'cellular3g':'wifi'});
  const resourceIndex=url=>{const m=new URL(url).pathname.match(/\/media\/assets\/([a-f0-9-]+)\/content$/);return m?ids.indexOf(m[1]):-1;};const cdpIds=new Map();const cdpEvents=[];session.on('Network.requestWillBeSent',event=>{const index=resourceIndex(event.request.url);if(index>=0&&event.request.method==='GET'){cdpIds.set(event.requestId,index);cdpEvents.push({id:event.requestId,index:index+1,kind:"start",time:event.timestamp});bytesById.set(event.requestId,0);}});session.on('Network.loadingFinished',event=>{if(cdpIds.has(event.requestId))cdpEvents.push({id:event.requestId,kind:'finish',time:event.timestamp});});session.on('Network.loadingFailed',event=>{if(cdpIds.has(event.requestId))cdpEvents.push({id:event.requestId,kind:'finish',time:event.timestamp});});session.on('Network.dataReceived',event=>{if(cdpIds.has(event.requestId))bytesById.set(event.requestId,(bytesById.get(event.requestId)||0)+event.encodedDataLength);});
  page.on('request',request=>{const index=resourceIndex(request.url());if(index>=0){requests.push({index:index+1,startedMs:Date.now()-started});active.add(request);maxOutstanding=Math.max(maxOutstanding,active.size);}});page.on('requestfinished',request=>{const index=resourceIndex(request.url());if(index>=0){active.delete(request);finished.add(index);}});page.on('requestfailed',request=>active.delete(request));
  const baseResources=await page.evaluate(()=>window.__furyMediaResources());started=Date.now();stage='first useful';await page.getByRole('button',{name:'معاينة خاصة',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.waitFor();const initialHeight=await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').first().evaluate(node=>node.getBoundingClientRect().height);await page.waitForFunction(()=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة 1"]');return image?.complete&&image.naturalWidth>0;},{},{timeout:60000});const firstUsefulMs=Date.now()-started;firstUsefulBytes=[...bytesById.values()].reduce((sum,n)=>sum+n,0);await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));const initialRequests=requests.map(r=>r.index);const firstReadyResources=await page.evaluate(()=>window.__furyMediaResources());const finalHeight=await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').first().evaluate(node=>node.getBoundingClientRect().height);
  stage='initial window';if(!slow)await page.waitForFunction(count=>window.__furyMediaResources().active>=count,expected,{timeout:30000});const initialPreparedMs=Date.now()-started;const initialWindowRequests=requests.map(r=>r.index);if(initialWindowRequests.some(i=>i>10))throw Error('Far page requested at initial open');if(Math.abs(initialHeight-finalHeight)>1)throw Error('Page geometry shifted');const boundaries=[];
  if(!slow){for(const index of [4,9,14]){const since=Date.now();await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').nth(index).scrollIntoViewIfNeeded();await page.waitForFunction(position=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة '+position+'"]');return image?.complete&&image.naturalWidth>0;},index+1,{timeout:30000});await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));boundaries.push({page:index+1,stallMs:Date.now()-since,requested:requests.map(r=>r.index)});}await dialog.locator('img[alt="صفحة 13"]').waitFor();const since=Date.now(),count=requests.length,targetCount=requests.filter(r=>r.index===13).length;await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').nth(12).scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة 13"]');return image?.complete&&image.naturalWidth>0;});boundaries.push({kind:'warm reversal',page:13,stallMs:Date.now()-since,newRequests:requests.length-count,newTargetRequests:requests.filter(r=>r.index===13).length-targetCount});}
  const resources=await page.evaluate(()=>window.__furyMediaResources());const heap=await session.send('Runtime.getHeapUsage');const shifts=await page.evaluate(()=>window.__furyShifts);const layout={width:await page.evaluate(()=>innerWidth),scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth),initialFirstPageHeight:initialHeight,readyFirstPageHeight:finalHeight,shifts};stage='close';await dialog.getByRole('button',{name:'إغلاق',exact:true}).click();await dialog.waitFor({state:'hidden'});await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));const afterClose=await page.evaluate(()=>window.__furyMediaResources());if(afterClose.active!==baseResources.active)throw Error('Owned image URLs remain after preview close');
  let cdpActive=0,cdpMax=0;for(const event of cdpEvents.toSorted((a,b)=>a.time-b.time||(a.kind==='finish'?-1:1))){cdpActive+=event.kind==='start'?1:-1;cdpMax=Math.max(cdpMax,cdpActive);}return {passed:true,version,cdpMax,cdpEvents,cdpScope:"GET content only; CORS preflight excluded",viewport:width,profile:{slow,latencyMs:slow?150:20,downloadBytesPerSecond:slow?192*1024:10*1024*1024},persistedPages:30,firstUsefulMs,encodedDataBytesBeforeUseful:firstUsefulBytes,initialRequests,initialWindowRequests,initialPreparedMs,maxApplicationOutstandingContentRequests:maxOutstanding,requests,boundaries,resources:{base:baseResources,firstReady:firstReadyResources,atEnd:resources,afterClose},layout,heap:{usedSize:heap.usedSize,totalSize:heap.totalSize,limit:'JavaScript heap only; excludes native decoder/GPU animation memory'},measurement:'One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence'};
 } catch(error){throw Error(JSON.stringify({stage,error:String(error),url:page.url(),headings:await page.locator('h1,h2').allTextContents(),alerts:await page.getByRole('alert').allTextContents(),requests}));} finally {await context.close();}
}
)(page);
```
````

## final-wide-cold-warm

Original capture: `final-wide-cold-warm.txt`. Bytes: 128. SHA-256: `4aa3d1f65a80938360696ad4cea2799f94d95354109515d43cb89df7b9f8cd86`.

```text
The browser 'fury-media-foundation' is not open, please run open first

  playwright-cli -s=fury-media-foundation open [params]
```

## fury-media-act-format

Original capture: `fury-media-act-format.txt`. Bytes: 91. SHA-256: `82dedfec12f7c092d23df144a50db263200f8bc0120422ad22e7dfeda8befcad`.

```text
apps/web/src/features/content/components/ChapterContentRenderer.test.tsx 120ms (unchanged)
```

## fury-media-after-1280.js

Original capture: `fury-media-after-1280.js.txt`. Bytes: 8528. SHA-256: `811b083b28207178345a40ae315d8f4f70f58d75e833cef79e5543222d5b480c`.

```text
async (originalPage) => {
 const version="after", slow=false, width=1280, expected=10;
 const context=await originalPage.context().browser().newContext({viewport:{width,height:900}});const page=await context.newPage();
 const ids=__ASSET_IDS__;let started=0;const requests=[],finished=new Set(),active=new Set();let maxOutstanding=0,firstUsefulBytes;const bytesById=new Map();let stage='login';
 try {
  await page.addInitScript(()=>{const active=new Map();let maximum=0,maxBytes=0;const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=blob=>{const url=create(blob);active.set(url,blob.size);maximum=Math.max(maximum,active.size);maxBytes=Math.max(maxBytes,[...active.values()].reduce((sum,n)=>sum+n,0));return url;};URL.revokeObjectURL=url=>{active.delete(url);revoke(url);};window.__furyMediaResources=()=>({active:active.size,bytes:[...active.values()].reduce((sum,n)=>sum+n,0),maximum,maxBytes});window.__furyShifts=[];new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__furyShifts.push({value:entry.value,hadRecentInput:entry.hadRecentInput});}).observe({type:'layout-shift',buffered:true});});
  await page.goto('http://127.0.0.1:4316/auth/login');await page.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill('media-foundation-admin@example.test');await page.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill(__PASSWORD__);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(url=>['/dashboard','/admin'].includes(url.pathname));
  stage='saved editor';const detail=page.waitForResponse(r=>r.request().method()==='GET'&&r.url().includes('/api/v1/content/admin/')&&r.url().includes(__CHAPTER__));await page.goto('http://127.0.0.1:4316/admin/works/'+__WORK__+'/chapters/'+__CHAPTER__+'/edit');const saved=await detail;if(saved.status()!==200)throw Error('Saved Chapter read failed');const payload=await saved.json();if(payload.data?.chapter.pages.length!==30)throw Error('Persisted thirty-page chapter missing');await page.getByRole('button',{name:'معاينة خاصة',exact:true}).waitFor();
  const session=await context.newCDPSession(page);await session.send('Network.enable');await session.send('Network.emulateNetworkConditions',{offline:false,latency:slow?150:20,downloadThroughput:slow?192*1024:10*1024*1024,uploadThroughput:128*1024,connectionType:slow?'cellular3g':'wifi'});
  const resourceIndex=url=>{const m=new URL(url).pathname.match(/\/media\/assets\/([a-f0-9-]+)\/content$/);return m?ids.indexOf(m[1]):-1;};const cdpIds=new Map();const cdpEvents=[];session.on('Network.requestWillBeSent',event=>{const index=resourceIndex(event.request.url);if(index>=0&&event.request.method==='GET'){cdpIds.set(event.requestId,index);cdpEvents.push({id:event.requestId,index:index+1,kind:"start",time:event.timestamp});bytesById.set(event.requestId,0);}});session.on('Network.loadingFinished',event=>{if(cdpIds.has(event.requestId))cdpEvents.push({id:event.requestId,kind:'finish',time:event.timestamp});});session.on('Network.loadingFailed',event=>{if(cdpIds.has(event.requestId))cdpEvents.push({id:event.requestId,kind:'finish',time:event.timestamp});});session.on('Network.dataReceived',event=>{if(cdpIds.has(event.requestId))bytesById.set(event.requestId,(bytesById.get(event.requestId)||0)+event.encodedDataLength);});
  page.on('request',request=>{const index=resourceIndex(request.url());if(index>=0){requests.push({index:index+1,startedMs:Date.now()-started});active.add(request);maxOutstanding=Math.max(maxOutstanding,active.size);}});page.on('requestfinished',request=>{const index=resourceIndex(request.url());if(index>=0){active.delete(request);finished.add(index);}});page.on('requestfailed',request=>active.delete(request));
  const baseResources=await page.evaluate(()=>window.__furyMediaResources());started=Date.now();stage='first useful';await page.getByRole('button',{name:'معاينة خاصة',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.waitFor();const initialHeight=await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').first().evaluate(node=>node.getBoundingClientRect().height);await page.waitForFunction(()=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة 1"]');return image?.complete&&image.naturalWidth>0;},{},{timeout:60000});const firstUsefulMs=Date.now()-started;firstUsefulBytes=[...bytesById.values()].reduce((sum,n)=>sum+n,0);await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));const initialRequests=requests.map(r=>r.index);const firstReadyResources=await page.evaluate(()=>window.__furyMediaResources());const finalHeight=await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').first().evaluate(node=>node.getBoundingClientRect().height);
  stage='initial window';if(!slow)await page.waitForFunction(count=>window.__furyMediaResources().active>=count,expected,{timeout:30000});const initialPreparedMs=Date.now()-started;const initialWindowRequests=requests.map(r=>r.index);if(initialWindowRequests.some(i=>i>10))throw Error('Far page requested at initial open');if(Math.abs(initialHeight-finalHeight)>1)throw Error('Page geometry shifted');const boundaries=[];
  if(!slow){for(const index of [4,9,14]){const since=Date.now();await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').nth(index).scrollIntoViewIfNeeded();await page.waitForFunction(position=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة '+position+'"]');return image?.complete&&image.naturalWidth>0;},index+1,{timeout:30000});await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));boundaries.push({page:index+1,stallMs:Date.now()-since,requested:requests.map(r=>r.index)});}await dialog.locator('img[alt="صفحة 13"]').waitFor();const since=Date.now(),count=requests.length,targetCount=requests.filter(r=>r.index===13).length;await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').nth(12).scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة 13"]');return image?.complete&&image.naturalWidth>0;});boundaries.push({kind:'warm reversal',page:13,stallMs:Date.now()-since,newRequests:requests.length-count,newTargetRequests:requests.filter(r=>r.index===13).length-targetCount});}
  const resources=await page.evaluate(()=>window.__furyMediaResources());const heap=await session.send('Runtime.getHeapUsage');const shifts=await page.evaluate(()=>window.__furyShifts);const layout={width:await page.evaluate(()=>innerWidth),scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth),initialFirstPageHeight:initialHeight,readyFirstPageHeight:finalHeight,shifts};stage='close';await dialog.getByRole('button',{name:'إغلاق',exact:true}).click();await dialog.waitFor({state:'hidden'});await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));const afterClose=await page.evaluate(()=>window.__furyMediaResources());if(afterClose.active!==baseResources.active)throw Error('Owned image URLs remain after preview close');
  let cdpActive=0,cdpMax=0;for(const event of cdpEvents.toSorted((a,b)=>a.time-b.time||(a.kind==='finish'?-1:1))){cdpActive+=event.kind==='start'?1:-1;cdpMax=Math.max(cdpMax,cdpActive);}return {passed:true,version,cdpMax,cdpEvents,cdpScope:"GET content only; CORS preflight excluded",viewport:width,profile:{slow,latencyMs:slow?150:20,downloadBytesPerSecond:slow?192*1024:10*1024*1024},persistedPages:30,firstUsefulMs,encodedDataBytesBeforeUseful:firstUsefulBytes,initialRequests,initialWindowRequests,initialPreparedMs,maxApplicationOutstandingContentRequests:maxOutstanding,requests,boundaries,resources:{base:baseResources,firstReady:firstReadyResources,atEnd:resources,afterClose},layout,heap:{usedSize:heap.usedSize,totalSize:heap.totalSize,limit:'JavaScript heap only; excludes native decoder/GPU animation memory'},measurement:'One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence'};
 } catch(error){throw Error(JSON.stringify({stage,error:String(error),url:page.url(),headings:await page.locator('h1,h2').allTextContents(),alerts:await page.getByRole('alert').allTextContents(),requests}));} finally {await context.close();}
}
```

## fury-media-after-320.js

Original capture: `fury-media-after-320.js.txt`. Bytes: 8526. SHA-256: `9ed503b39f9c9bd8aa3e6e105ebfeda580724ab195afc2cf3de03af6a639a1f8`.

```text
async (originalPage) => {
 const version="after", slow=true, width=320, expected=10;
 const context=await originalPage.context().browser().newContext({viewport:{width,height:900}});const page=await context.newPage();
 const ids=__ASSET_IDS__;let started=0;const requests=[],finished=new Set(),active=new Set();let maxOutstanding=0,firstUsefulBytes;const bytesById=new Map();let stage='login';
 try {
  await page.addInitScript(()=>{const active=new Map();let maximum=0,maxBytes=0;const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=blob=>{const url=create(blob);active.set(url,blob.size);maximum=Math.max(maximum,active.size);maxBytes=Math.max(maxBytes,[...active.values()].reduce((sum,n)=>sum+n,0));return url;};URL.revokeObjectURL=url=>{active.delete(url);revoke(url);};window.__furyMediaResources=()=>({active:active.size,bytes:[...active.values()].reduce((sum,n)=>sum+n,0),maximum,maxBytes});window.__furyShifts=[];new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__furyShifts.push({value:entry.value,hadRecentInput:entry.hadRecentInput});}).observe({type:'layout-shift',buffered:true});});
  await page.goto('http://127.0.0.1:4316/auth/login');await page.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill('media-foundation-admin@example.test');await page.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill(__PASSWORD__);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(url=>['/dashboard','/admin'].includes(url.pathname));
  stage='saved editor';const detail=page.waitForResponse(r=>r.request().method()==='GET'&&r.url().includes('/api/v1/content/admin/')&&r.url().includes(__CHAPTER__));await page.goto('http://127.0.0.1:4316/admin/works/'+__WORK__+'/chapters/'+__CHAPTER__+'/edit');const saved=await detail;if(saved.status()!==200)throw Error('Saved Chapter read failed');const payload=await saved.json();if(payload.data?.chapter.pages.length!==30)throw Error('Persisted thirty-page chapter missing');await page.getByRole('button',{name:'معاينة خاصة',exact:true}).waitFor();
  const session=await context.newCDPSession(page);await session.send('Network.enable');await session.send('Network.emulateNetworkConditions',{offline:false,latency:slow?150:20,downloadThroughput:slow?192*1024:10*1024*1024,uploadThroughput:128*1024,connectionType:slow?'cellular3g':'wifi'});
  const resourceIndex=url=>{const m=new URL(url).pathname.match(/\/media\/assets\/([a-f0-9-]+)\/content$/);return m?ids.indexOf(m[1]):-1;};const cdpIds=new Map();const cdpEvents=[];session.on('Network.requestWillBeSent',event=>{const index=resourceIndex(event.request.url);if(index>=0&&event.request.method==='GET'){cdpIds.set(event.requestId,index);cdpEvents.push({id:event.requestId,index:index+1,kind:"start",time:event.timestamp});bytesById.set(event.requestId,0);}});session.on('Network.loadingFinished',event=>{if(cdpIds.has(event.requestId))cdpEvents.push({id:event.requestId,kind:'finish',time:event.timestamp});});session.on('Network.loadingFailed',event=>{if(cdpIds.has(event.requestId))cdpEvents.push({id:event.requestId,kind:'finish',time:event.timestamp});});session.on('Network.dataReceived',event=>{if(cdpIds.has(event.requestId))bytesById.set(event.requestId,(bytesById.get(event.requestId)||0)+event.encodedDataLength);});
  page.on('request',request=>{const index=resourceIndex(request.url());if(index>=0){requests.push({index:index+1,startedMs:Date.now()-started});active.add(request);maxOutstanding=Math.max(maxOutstanding,active.size);}});page.on('requestfinished',request=>{const index=resourceIndex(request.url());if(index>=0){active.delete(request);finished.add(index);}});page.on('requestfailed',request=>active.delete(request));
  const baseResources=await page.evaluate(()=>window.__furyMediaResources());started=Date.now();stage='first useful';await page.getByRole('button',{name:'معاينة خاصة',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.waitFor();const initialHeight=await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').first().evaluate(node=>node.getBoundingClientRect().height);await page.waitForFunction(()=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة 1"]');return image?.complete&&image.naturalWidth>0;},{},{timeout:60000});const firstUsefulMs=Date.now()-started;firstUsefulBytes=[...bytesById.values()].reduce((sum,n)=>sum+n,0);await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));const initialRequests=requests.map(r=>r.index);const firstReadyResources=await page.evaluate(()=>window.__furyMediaResources());const finalHeight=await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').first().evaluate(node=>node.getBoundingClientRect().height);
  stage='initial window';if(!slow)await page.waitForFunction(count=>window.__furyMediaResources().active>=count,expected,{timeout:30000});const initialPreparedMs=Date.now()-started;const initialWindowRequests=requests.map(r=>r.index);if(initialWindowRequests.some(i=>i>10))throw Error('Far page requested at initial open');if(Math.abs(initialHeight-finalHeight)>1)throw Error('Page geometry shifted');const boundaries=[];
  if(!slow){for(const index of [4,9,14]){const since=Date.now();await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').nth(index).scrollIntoViewIfNeeded();await page.waitForFunction(position=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة '+position+'"]');return image?.complete&&image.naturalWidth>0;},index+1,{timeout:30000});await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));boundaries.push({page:index+1,stallMs:Date.now()-since,requested:requests.map(r=>r.index)});}await dialog.locator('img[alt="صفحة 13"]').waitFor();const since=Date.now(),count=requests.length,targetCount=requests.filter(r=>r.index===13).length;await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').nth(12).scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة 13"]');return image?.complete&&image.naturalWidth>0;});boundaries.push({kind:'warm reversal',page:13,stallMs:Date.now()-since,newRequests:requests.length-count,newTargetRequests:requests.filter(r=>r.index===13).length-targetCount});}
  const resources=await page.evaluate(()=>window.__furyMediaResources());const heap=await session.send('Runtime.getHeapUsage');const shifts=await page.evaluate(()=>window.__furyShifts);const layout={width:await page.evaluate(()=>innerWidth),scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth),initialFirstPageHeight:initialHeight,readyFirstPageHeight:finalHeight,shifts};stage='close';await dialog.getByRole('button',{name:'إغلاق',exact:true}).click();await dialog.waitFor({state:'hidden'});await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));const afterClose=await page.evaluate(()=>window.__furyMediaResources());if(afterClose.active!==baseResources.active)throw Error('Owned image URLs remain after preview close');
  let cdpActive=0,cdpMax=0;for(const event of cdpEvents.toSorted((a,b)=>a.time-b.time||(a.kind==='finish'?-1:1))){cdpActive+=event.kind==='start'?1:-1;cdpMax=Math.max(cdpMax,cdpActive);}return {passed:true,version,cdpMax,cdpEvents,cdpScope:"GET content only; CORS preflight excluded",viewport:width,profile:{slow,latencyMs:slow?150:20,downloadBytesPerSecond:slow?192*1024:10*1024*1024},persistedPages:30,firstUsefulMs,encodedDataBytesBeforeUseful:firstUsefulBytes,initialRequests,initialWindowRequests,initialPreparedMs,maxApplicationOutstandingContentRequests:maxOutstanding,requests,boundaries,resources:{base:baseResources,firstReady:firstReadyResources,atEnd:resources,afterClose},layout,heap:{usedSize:heap.usedSize,totalSize:heap.totalSize,limit:'JavaScript heap only; excludes native decoder/GPU animation memory'},measurement:'One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence'};
 } catch(error){throw Error(JSON.stringify({stage,error:String(error),url:page.url(),headings:await page.locator('h1,h2').allTextContents(),alerts:await page.getByRole('alert').allTextContents(),requests}));} finally {await context.close();}
}
```

## fury-media-after-slow-result

Original capture: `fury-media-after-slow-result.txt`. Bytes: 1723. SHA-256: `446711d156b3e9c4918e871ba12ef81d52accee3952339a5234e74dc30ef2a17`.

```text
{"passed": true, "version": "after", "cdpMax": 2, "cdpEvents": [{"id": "22810.314", "index": 1, "kind": "start", "time": 286759.499952}, {"id": "22810.346", "index": 2, "kind": "start", "time": 286762.32275}, {"id": "22810.347", "index": 3, "kind": "start", "time": 286762.323002}, {"id": "22810.314", "kind": "finish", "time": 286762.316912}, {"id": "22810.346", "kind": "finish", "time": 286762.406624}, {"id": "22810.347", "kind": "finish", "time": 286762.40667}], "cdpScope": "GET content only; CORS preflight excluded", "viewport": 320, "profile": {"slow": true, "latencyMs": 150, "downloadBytesPerSecond": 196608}, "persistedPages": 30, "firstUsefulMs": 2877, "encodedDataBytesBeforeUseful": 375161, "initialRequests": [1, 2, 3], "initialWindowRequests": [1, 2, 3], "initialPreparedMs": 2912, "maxApplicationOutstandingContentRequests": 3, "requests": [{"index": 1, "startedMs": 53}, {"index": 2, "startedMs": 2876}, {"index": 3, "startedMs": 2876}], "boundaries": [], "resources": {"base": {"active": 0, "bytes": 0, "maximum": 0, "maxBytes": 0}, "firstReady": {"active": 1, "bytes": 375161, "maximum": 1, "maxBytes": 375161}, "atEnd": {"active": 1, "bytes": 375161, "maximum": 1, "maxBytes": 375161}, "afterClose": {"active": 0, "bytes": 0, "maximum": 1, "maxBytes": 375161}}, "layout": {"width": 320, "scrollWidth": 320, "initialFirstPageHeight": 317.328125, "readyFirstPageHeight": 317.328125, "shifts": []}, "heap": {"usedSize": 20094804, "totalSize": 34586624, "limit": "JavaScript heap only; excludes native decoder/GPU animation memory"}, "measurement": "One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence"}
```

## fury-media-after-wide-cdp-result

Original capture: `fury-media-after-wide-cdp-result.txt`. Bytes: 8201. SHA-256: `cb45ded3f8d10f4e340fa83c97b788cdc3bf55bf4d4d23f6ee854154ec81cd9f`.

```text
{"passed": true, "version": "after", "cdpMax": 4, "cdpEvents": [{"id": "6A21B1244FBC66F67A8A67F48BA44DBE", "index": 1, "kind": "start", "time": 286607.537793}, {"id": "22110.359", "index": 1, "kind": "start", "time": 286607.537512}, {"id": "6A21B1244FBC66F67A8A67F48BA44DBE", "kind": "finish", "time": 286607.538637}, {"id": "A92D710DC49550E23BD878CCF45F5DA1", "index": 2, "kind": "start", "time": 286607.604947}, {"id": "22110.379", "index": 2, "kind": "start", "time": 286607.604695}, {"id": "22110.380", "index": 3, "kind": "start", "time": 286607.604807}, {"id": "22110.359", "kind": "finish", "time": 286607.602397}, {"id": "5A5E2437590CFCB2061C597C29FFCA9B", "index": 3, "kind": "start", "time": 286607.605285}, {"id": "A92D710DC49550E23BD878CCF45F5DA1", "kind": "finish", "time": 286607.605608}, {"id": "5A5E2437590CFCB2061C597C29FFCA9B", "kind": "finish", "time": 286607.605956}, {"id": "22110.379", "kind": "finish", "time": 286607.627608}, {"id": "22110.386", "index": 4, "kind": "start", "time": 286607.629693}, {"id": "71CB67110B035D915A61FFBFB9A31CC5", "index": 4, "kind": "start", "time": 286607.630029}, {"id": "71CB67110B035D915A61FFBFB9A31CC5", "kind": "finish", "time": 286607.630711}, {"id": "22110.392", "index": 5, "kind": "start", "time": 286607.680612}, {"id": "22110.380", "kind": "finish", "time": 286607.679217}, {"id": "5FF1D5582930183ED15F5AAE8E14932C", "index": 5, "kind": "start", "time": 286607.681003}, {"id": "5FF1D5582930183ED15F5AAE8E14932C", "kind": "finish", "time": 286607.681751}, {"id": "22110.397", "index": 6, "kind": "start", "time": 286607.702872}, {"id": "22110.386", "kind": "finish", "time": 286607.701517}, {"id": "E073D524B5C41E95A7600C1BF41EA5EF", "index": 6, "kind": "start", "time": 286607.703193}, {"id": "E073D524B5C41E95A7600C1BF41EA5EF", "kind": "finish", "time": 286607.703943}, {"id": "22110.397", "kind": "finish", "time": 286607.724665}, {"id": "22110.403", "index": 7, "kind": "start", "time": 286607.726076}, {"id": "CEDEEB7EB10B3C9FF8435E7DA716AE14", "index": 7, "kind": "start", "time": 286607.726371}, {"id": "CEDEEB7EB10B3C9FF8435E7DA716AE14", "kind": "finish", "time": 286607.727001}, {"id": "22110.410", "index": 8, "kind": "start", "time": 286607.739849}, {"id": "22110.392", "kind": "finish", "time": 286607.738674}, {"id": "4B31279C40730516EE78E057EFF983C4", "index": 8, "kind": "start", "time": 286607.740088}, {"id": "4B31279C40730516EE78E057EFF983C4", "kind": "finish", "time": 286607.740585}, {"id": "22110.418", "index": 9, "kind": "start", "time": 286607.807649}, {"id": "22110.403", "kind": "finish", "time": 286607.806329}, {"id": "B8B9176C68E38F9C85FCA2F3EDA8C33D", "index": 9, "kind": "start", "time": 286607.80799}, {"id": "B8B9176C68E38F9C85FCA2F3EDA8C33D", "kind": "finish", "time": 286607.808502}, {"id": "22110.427", "index": 10, "kind": "start", "time": 286607.820854}, {"id": "22110.410", "kind": "finish", "time": 286607.819608}, {"id": "8D3375865D64846003EE1E07996DA589", "index": 10, "kind": "start", "time": 286607.821105}, {"id": "8D3375865D64846003EE1E07996DA589", "kind": "finish", "time": 286607.821576}, {"id": "22110.418", "kind": "finish", "time": 286607.88756}, {"id": "22110.427", "kind": "finish", "time": 286607.90056}, {"id": "22110.471", "index": 11, "kind": "start", "time": 286607.967607}, {"id": "22110.472", "index": 12, "kind": "start", "time": 286607.967727}, {"id": "F0B0F08FEA811C8451C28451361E175B", "index": 11, "kind": "start", "time": 286607.968113}, {"id": "567BB887432E5462298E1329116AAAD2", "index": 12, "kind": "start", "time": 286607.968168}, {"id": "F0B0F08FEA811C8451C28451361E175B", "kind": "finish", "time": 286607.968725}, {"id": "567BB887432E5462298E1329116AAAD2", "kind": "finish", "time": 286607.969165}, {"id": "22110.491", "index": 13, "kind": "start", "time": 286608.068176}, {"id": "22110.471", "kind": "finish", "time": 286608.067033}, {"id": "E88797AAEC6C8CF4C9EA63D2E45F4FA8", "index": 13, "kind": "start", "time": 286608.068497}, {"id": "22110.497", "index": 14, "kind": "start", "time": 286608.068981}, {"id": "22110.472", "kind": "finish", "time": 286608.067313}, {"id": "E88797AAEC6C8CF4C9EA63D2E45F4FA8", "kind": "finish", "time": 286608.069148}, {"id": "9173F5110BDAA55F14EA5096B53BC357", "index": 14, "kind": "start", "time": 286608.069528}, {"id": "9173F5110BDAA55F14EA5096B53BC357", "kind": "finish", "time": 286608.070493}, {"id": "22110.505", "index": 15, "kind": "start", "time": 286608.16647}, {"id": "D998A0F194DDA6D0567E7DA95A13FFA3", "index": 15, "kind": "start", "time": 286608.166864}, {"id": "22110.491", "kind": "finish", "time": 286608.166692}, {"id": "22110.497", "kind": "finish", "time": 286608.166718}, {"id": "D998A0F194DDA6D0567E7DA95A13FFA3", "kind": "finish", "time": 286608.167781}, {"id": "22110.507", "index": 16, "kind": "start", "time": 286608.231333}, {"id": "22110.508", "index": 14, "kind": "start", "time": 286608.23146}, {"id": "22110.505", "kind": "finish", "time": 286608.230067}, {"id": "D8BB9925C5502F55EAF75C3B5A96323A", "index": 16, "kind": "start", "time": 286608.231746}, {"id": "D8BB9925C5502F55EAF75C3B5A96323A", "kind": "finish", "time": 286608.232366}, {"id": "22110.511", "index": 17, "kind": "start", "time": 286608.326071}, {"id": "22110.508", "kind": "finish", "time": 286608.324838}, {"id": "6145422E8B73FAA5A97954FDA5B01C09", "index": 17, "kind": "start", "time": 286608.326425}, {"id": "22110.515", "index": 13, "kind": "start", "time": 286608.327053}, {"id": "22110.507", "kind": "finish", "time": 286608.325057}, {"id": "6145422E8B73FAA5A97954FDA5B01C09", "kind": "finish", "time": 286608.327041}, {"id": "22110.511", "kind": "finish", "time": 286608.330852}, {"id": "22110.531", "index": 12, "kind": "start", "time": 286608.385738}, {"id": "22110.532", "index": 11, "kind": "start", "time": 286608.385843}, {"id": "22110.515", "kind": "finish", "time": 286608.384623}, {"id": "22110.531", "kind": "finish", "time": 286608.44449}, {"id": "22110.532", "kind": "finish", "time": 286608.444517}], "viewport": 1280, "profile": {"slow": false, "latencyMs": 20, "downloadBytesPerSecond": 10485760}, "persistedPages": 30, "firstUsefulMs": 119, "encodedDataBytesBeforeUseful": 375161, "initialRequests": [1, 2, 3, 4], "initialWindowRequests": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "initialPreparedMs": 418, "maxApplicationOutstandingContentRequests": 3, "requests": [{"index": 1, "startedMs": 45}, {"index": 2, "startedMs": 112}, {"index": 3, "startedMs": 112}, {"index": 4, "startedMs": 136}, {"index": 5, "startedMs": 187}, {"index": 6, "startedMs": 209}, {"index": 7, "startedMs": 233}, {"index": 8, "startedMs": 246}, {"index": 9, "startedMs": 314}, {"index": 10, "startedMs": 327}, {"index": 11, "startedMs": 474}, {"index": 12, "startedMs": 475}, {"index": 13, "startedMs": 575}, {"index": 14, "startedMs": 576}, {"index": 15, "startedMs": 673}, {"index": 16, "startedMs": 738}, {"index": 14, "startedMs": 738}, {"index": 17, "startedMs": 833}, {"index": 13, "startedMs": 834}, {"index": 12, "startedMs": 893}, {"index": 11, "startedMs": 893}], "boundaries": [{"page": 5, "stallMs": 98, "requested": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}, {"page": 10, "stallMs": 100, "requested": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]}, {"page": 15, "stallMs": 167, "requested": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 14]}, {"kind": "warm reversal", "page": 13, "stallMs": 117, "newRequests": 4}], "resources": {"base": {"active": 0, "bytes": 0, "maximum": 0, "maxBytes": 0}, "firstReady": {"active": 2, "bytes": 375437, "maximum": 2, "maxBytes": 375437}, "atEnd": {"active": 4, "bytes": 1500644, "maximum": 10, "maxBytes": 3001840}, "afterClose": {"active": 0, "bytes": 0, "maximum": 10, "maxBytes": 3001840}}, "layout": {"width": 1280, "scrollWidth": 1280, "initialFirstPageHeight": 1000, "readyFirstPageHeight": 1000, "shifts": [{"value": 0.027480468749999997, "hadRecentInput": false}]}, "heap": {"usedSize": 21909244, "totalSize": 36945920, "limit": "JavaScript heap only; excludes native decoder/GPU animation memory"}, "measurement": "One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence"}
```

## fury-media-after-wide-get-result

Original capture: `fury-media-after-wide-get-result.txt`. Bytes: 5197. SHA-256: `2d9033d63bfb4a3b39a33a53afbedd095b61e253fbaf12a081c4081102beda2a`.

```text
{"passed": true, "version": "after", "cdpMax": 3, "cdpEvents": [{"id": "22496.364", "index": 1, "kind": "start", "time": 286701.847676}, {"id": "22496.382", "index": 2, "kind": "start", "time": 286701.911759}, {"id": "22496.383", "index": 3, "kind": "start", "time": 286701.91188}, {"id": "22496.364", "kind": "finish", "time": 286701.909403}, {"id": "22496.382", "kind": "finish", "time": 286701.933855}, {"id": "22496.387", "index": 4, "kind": "start", "time": 286701.935829}, {"id": "22496.392", "index": 5, "kind": "start", "time": 286701.986704}, {"id": "22496.383", "kind": "finish", "time": 286701.985325}, {"id": "22496.397", "index": 6, "kind": "start", "time": 286702.008433}, {"id": "22496.387", "kind": "finish", "time": 286702.00705}, {"id": "22496.397", "kind": "finish", "time": 286702.029921}, {"id": "22496.403", "index": 7, "kind": "start", "time": 286702.031356}, {"id": "22496.410", "index": 8, "kind": "start", "time": 286702.046919}, {"id": "22496.392", "kind": "finish", "time": 286702.045766}, {"id": "22496.418", "index": 9, "kind": "start", "time": 286702.116289}, {"id": "22496.403", "kind": "finish", "time": 286702.114906}, {"id": "22496.427", "index": 10, "kind": "start", "time": 286702.12883}, {"id": "22496.410", "kind": "finish", "time": 286702.127465}, {"id": "22496.418", "kind": "finish", "time": 286702.198691}, {"id": "22496.427", "kind": "finish", "time": 286702.210238}, {"id": "22496.471", "index": 11, "kind": "start", "time": 286702.274681}, {"id": "22496.472", "index": 12, "kind": "start", "time": 286702.274808}, {"id": "22496.491", "index": 13, "kind": "start", "time": 286702.374692}, {"id": "22496.471", "kind": "finish", "time": 286702.373143}, {"id": "22496.497", "index": 14, "kind": "start", "time": 286702.375649}, {"id": "22496.472", "kind": "finish", "time": 286702.373416}, {"id": "22496.505", "index": 15, "kind": "start", "time": 286702.472889}, {"id": "22496.491", "kind": "finish", "time": 286702.473049}, {"id": "22496.497", "kind": "finish", "time": 286702.473081}, {"id": "22496.507", "index": 16, "kind": "start", "time": 286702.53633}, {"id": "22496.508", "index": 14, "kind": "start", "time": 286702.536448}, {"id": "22496.505", "kind": "finish", "time": 286702.535144}, {"id": "22496.511", "index": 17, "kind": "start", "time": 286702.632177}, {"id": "22496.508", "kind": "finish", "time": 286702.630858}, {"id": "22496.515", "index": 13, "kind": "start", "time": 286702.633179}, {"id": "22496.507", "kind": "finish", "time": 286702.63104}, {"id": "22496.522", "index": 18, "kind": "start", "time": 286702.727364}, {"id": "22496.515", "kind": "finish", "time": 286702.726061}, {"id": "22496.528", "index": 19, "kind": "start", "time": 286702.728251}, {"id": "22496.511", "kind": "finish", "time": 286702.726287}, {"id": "22496.522", "kind": "finish", "time": 286702.820014}, {"id": "22496.528", "kind": "finish", "time": 286702.820039}], "cdpScope": "GET content only; CORS preflight excluded", "viewport": 1280, "profile": {"slow": false, "latencyMs": 20, "downloadBytesPerSecond": 10485760}, "persistedPages": 30, "firstUsefulMs": 121, "encodedDataBytesBeforeUseful": 375161, "initialRequests": [1, 2, 3, 4], "initialWindowRequests": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "initialPreparedMs": 420, "maxApplicationOutstandingContentRequests": 3, "requests": [{"index": 1, "startedMs": 49}, {"index": 2, "startedMs": 113}, {"index": 3, "startedMs": 113}, {"index": 4, "startedMs": 136}, {"index": 5, "startedMs": 187}, {"index": 6, "startedMs": 209}, {"index": 7, "startedMs": 232}, {"index": 8, "startedMs": 247}, {"index": 9, "startedMs": 317}, {"index": 10, "startedMs": 329}, {"index": 11, "startedMs": 475}, {"index": 12, "startedMs": 475}, {"index": 13, "startedMs": 575}, {"index": 14, "startedMs": 576}, {"index": 15, "startedMs": 674}, {"index": 16, "startedMs": 737}, {"index": 14, "startedMs": 737}, {"index": 17, "startedMs": 833}, {"index": 13, "startedMs": 834}, {"index": 18, "startedMs": 928}, {"index": 19, "startedMs": 929}], "boundaries": [{"page": 5, "stallMs": 99, "requested": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}, {"page": 10, "stallMs": 100, "requested": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]}, {"page": 15, "stallMs": 150, "requested": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 14]}, {"kind": "warm reversal", "page": 13, "stallMs": 22, "newRequests": 0, "newTargetRequests": 0}], "resources": {"base": {"active": 0, "bytes": 0, "maximum": 0, "maxBytes": 0}, "firstReady": {"active": 2, "bytes": 375437, "maximum": 2, "maxBytes": 375437}, "atEnd": {"active": 5, "bytes": 1875805, "maximum": 10, "maxBytes": 3001840}, "afterClose": {"active": 0, "bytes": 0, "maximum": 10, "maxBytes": 3001840}}, "layout": {"width": 1280, "scrollWidth": 1280, "initialFirstPageHeight": 1000, "readyFirstPageHeight": 1000, "shifts": [{"value": 0.027480468749999997, "hadRecentInput": false}]}, "heap": {"usedSize": 23977848, "totalSize": 35110912, "limit": "JavaScript heap only; excludes native decoder/GPU animation memory"}, "measurement": "One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence"}
```

## fury-media-after-wide-result

Original capture: `fury-media-after-wide-result.txt`. Bytes: 854. SHA-256: `82cb750553a3e0cd301d4bcee95adafaa08fefc280db74677bf786dab34b27d3`.

```text
### Error
Error: {"stage":"initial window","error":"Error: Application transfer capacity exceeded","url":"http://127.0.0.1:4316/admin/works/7ea307e9-5953-49c1-bae3-4667de99c989/chapters/8639544a-33e8-45d3-a3b9-5ef36d51f43b/edit","headings":["الرئيسية","إدارة المحتوى","المجتمع والإشراف","التواصل والإعلانات","تحرير فصل مصور","بيانات الفصل"," صفحات الفصل المصور (30)","Media Foundation عمل"," معاينة الفصل 1: Persisted thirty-page chapter"],"alerts":[""],"requests":[{"index":1,"startedMs":55},{"index":2,"startedMs":120},{"index":3,"startedMs":120},{"index":4,"startedMs":146},{"index":5,"startedMs":199},{"index":6,"startedMs":226},{"index":7,"startedMs":251},{"index":8,"startedMs":261},{"index":9,"startedMs":337},{"index":10,"startedMs":346}]}

```

## fury-media-animation-after

Original capture: `fury-media-animation-after.txt`. Bytes: 357. SHA-256: `a32bbd31620e641d7731724e0c77667ce0eff90e19832afd95ab964466e9f757`.

```text
$ vitest run --config vitest.config.ts src/infrastructure/media/image-validation.test.ts src/infrastructure/media/animated-image-validation.test.ts

 RUN  v4.1.10 <repository>/apps/api


 Test Files  2 passed (2)
      Tests  18 passed (18)
   Start at  16:13:35
   Duration  2.25s (transform 153ms, setup 36ms, import 490ms, tests 2.12s, environment 0ms)

```

## fury-media-animation-before

Original capture: `fury-media-animation-before.txt`. Bytes: 4758. SHA-256: `98cc463f77a74cf8bba23c3991f9fb7b4939905df5d1b5f228cfb6c5793b5ffe`.

```text
$ vitest run --config vitest.config.ts src/infrastructure/media/animated-image-validation.test.ts

 RUN  v4.1.10 <repository>/apps/api

 ❯ src/infrastructure/media/animated-image-validation.test.ts (8 tests | 8 failed) 579ms
     × preserves GIF/WebP animation for work_cover 66ms
     × preserves GIF/WebP animation for work_background 46ms
     × preserves GIF/WebP animation for chapter_page 50ms
     × keeps user_avatar static 28ms
     × keeps avatar_frame static 19ms
     × keeps comment_decoration static 18ms
     × preserves continuous looping and rejects mismatched, truncated and appended animation 48ms
     × rejects excess frames and aggregate decoded work before canonical output 303ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 8 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/infrastructure/media/animated-image-validation.test.ts > bounded Work-media animation > preserves GIF/WebP animation for work_cover
 FAIL  src/infrastructure/media/animated-image-validation.test.ts > bounded Work-media animation > preserves GIF/WebP animation for work_background
 FAIL  src/infrastructure/media/animated-image-validation.test.ts > bounded Work-media animation > preserves GIF/WebP animation for chapter_page
AppError: Unsupported or mismatched image type.
 ❯ unsupportedImage src/infrastructure/media/image-validation.ts:122:3
    120|   );
    121| const unsupportedImage = () =>
    122|   new AppError(
       |   ^
    123|     "Unsupported or mismatched image type.",
    124|     415,
 ❯ validateImage src/infrastructure/media/image-validation.ts:175:11
 ❯ src/infrastructure/media/animated-image-validation.test.ts:18:21

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/8]⎯

 FAIL  src/infrastructure/media/animated-image-validation.test.ts > bounded Work-media animation > keeps user_avatar static
 FAIL  src/infrastructure/media/animated-image-validation.test.ts > bounded Work-media animation > keeps avatar_frame static
 FAIL  src/infrastructure/media/animated-image-validation.test.ts > bounded Work-media animation > keeps comment_decoration static
AssertionError: expected AppError: The image is invalid for this m… { …(5) } to match object { statusCode: 415, …(1) }
(5 matching properties omitted from actual)

- Expected
+ Received

- {
-   "code": "MEDIA_UNSUPPORTED_TYPE",
-   "statusCode": 415,
+ AppError {
+   "code": "MEDIA_INVALID_FILE",
+   "statusCode": 400,
  }

 ❯ src/infrastructure/media/animated-image-validation.test.ts:33:128


⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/8]⎯

 FAIL  src/infrastructure/media/animated-image-validation.test.ts > bounded Work-media animation > preserves continuous looping and rejects mismatched, truncated and appended animation
AppError: Unsupported or mismatched image type.
 ❯ unsupportedImage src/infrastructure/media/image-validation.ts:122:3
    120|   );
    121| const unsupportedImage = () =>
    122|   new AppError(
       |   ^
    123|     "Unsupported or mismatched image type.",
    124|     415,
 ❯ validateImage src/infrastructure/media/image-validation.ts:175:11
 ❯ src/infrastructure/media/animated-image-validation.test.ts:39:19

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/8]⎯

 FAIL  src/infrastructure/media/animated-image-validation.test.ts > bounded Work-media animation > rejects excess frames and aggregate decoded work before canonical output
AssertionError: expected AppError: The image is invalid for this m… { …(5) } to match object { code: 'MEDIA_LIMIT_EXCEEDED' }
(6 matching properties omitted from actual)

- Expected
+ Received

- {
-   "code": "MEDIA_LIMIT_EXCEEDED",
+ AppError {
+   "code": "MEDIA_INVALID_FILE",
  }

 ❯ src/infrastructure/media/animated-image-validation.test.ts:49:82
     47|   it("rejects excess frames and aggregate decoded work before canonica…
     48|     const frames = await animatedImageFixture("webp", 300, 400, 101);
     49|     await expect(validateImage(frames, "work_cover", "image/webp", "co…
       |                                                                                  ^
     50|     const aggregate = await animatedImageFixture("webp", 600, 800, 67);
     51|     await expect(validateImage(aggregate, "chapter_page", "image/webp"…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/8]⎯


 Test Files  1 failed (1)
      Tests  8 failed (8)
   Start at  16:09:58
   Duration  937ms (transform 72ms, setup 19ms, import 200ms, tests 579ms, environment 0ms)

<repository>/apps/api:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/api@0.1.0 test: `vitest run --config vitest.config.ts src/infrastructure/media/animated-image-validation.test.ts`
Exit status 1
```

## fury-media-animation-bounded

Original capture: `fury-media-animation-bounded.txt`. Bytes: 357. SHA-256: `40a150d7eaf001bb5c6a0e6f890d19a30ed2daba82f8f328a6eae6c8ba242a9c`.

```text
$ vitest run --config vitest.config.ts src/infrastructure/media/image-validation.test.ts src/infrastructure/media/animated-image-validation.test.ts

 RUN  v4.1.10 <repository>/apps/api


 Test Files  2 passed (2)
      Tests  20 passed (20)
   Start at  16:15:28
   Duration  2.33s (transform 181ms, setup 37ms, import 490ms, tests 2.26s, environment 0ms)

```

## fury-media-animation-browser-result

Original capture: `fury-media-animation-browser-result.txt`. Bytes: 3004. SHA-256: `797f710e55c2549a8c4e13b8f94af2a2d56710db976dafecaa5173e26b6d5299`.

```text
rgba":"60,30,201,255"},{"ms":1253,"rgba":"60,30,201,255"},{"ms":1269,"rgba":"60,30,201,255"},{"ms":1286,"rgba":"60,30,201,255"},{"ms":1301,"rgba":"60,30,201,255"}]},{"alt":"Media Foundation عمل","width":600,"height":800,"type":"image/webp","distinctColors":1,"colors":["60,30,201,255"],"samples":[{"ms":11,"rgba":"60,30,201,255"},{"ms":27,"rgba":"60,30,201,255"},{"ms":45,"rgba":"60,30,201,255"},{"ms":59,"rgba":"60,30,201,255"},{"ms":76,"rgba":"60,30,201,255"},{"ms":93,"rgba":"60,30,201,255"},{"ms":109,"rgba":"60,30,201,255"},{"ms":127,"rgba":"60,30,201,255"},{"ms":143,"rgba":"60,30,201,255"},{"ms":159,"rgba":"60,30,201,255"},{"ms":175,"rgba":"60,30,201,255"},{"ms":192,"rgba":"60,30,201,255"},{"ms":208,"rgba":"60,30,201,255"},{"ms":226,"rgba":"60,30,201,255"},{"ms":242,"rgba":"60,30,201,255"},{"ms":260,"rgba":"60,30,201,255"},{"ms":276,"rgba":"60,30,201,255"},{"ms":292,"rgba":"60,30,201,255"},{"ms":309,"rgba":"60,30,201,255"},{"ms":326,"rgba":"60,30,201,255"},{"ms":343,"rgba":"60,30,201,255"},{"ms":359,"rgba":"60,30,201,255"},{"ms":376,"rgba":"60,30,201,255"},{"ms":393,"rgba":"60,30,201,255"},{"ms":408,"rgba":"60,30,201,255"},{"ms":427,"rgba":"60,30,201,255"},{"ms":442,"rgba":"60,30,201,255"},{"ms":460,"rgba":"60,30,201,255"},{"ms":476,"rgba":"60,30,201,255"},{"ms":493,"rgba":"60,30,201,255"},{"ms":510,"rgba":"60,30,201,255"},{"ms":525,"rgba":"60,30,201,255"},{"ms":543,"rgba":"60,30,201,255"},{"ms":560,"rgba":"60,30,201,255"},{"ms":577,"rgba":"60,30,201,255"},{"ms":593,"rgba":"60,30,201,255"},{"ms":609,"rgba":"60,30,201,255"},{"ms":626,"rgba":"60,30,201,255"},{"ms":641,"rgba":"60,30,201,255"},{"ms":660,"rgba":"60,30,201,255"},{"ms":676,"rgba":"60,30,201,255"},{"ms":692,"rgba":"60,30,201,255"},{"ms":710,"rgba":"60,30,201,255"},{"ms":727,"rgba":"60,30,201,255"},{"ms":742,"rgba":"60,30,201,255"},{"ms":760,"rgba":"60,30,201,255"},{"ms":775,"rgba":"60,30,201,255"},{"ms":793,"rgba":"60,30,201,255"},{"ms":809,"rgba":"60,30,201,255"},{"ms":825,"rgba":"60,30,201,255"},{"ms":842,"rgba":"60,30,201,255"},{"ms":860,"rgba":"60,30,201,255"},{"ms":877,"rgba":"60,30,201,255"},{"ms":891,"rgba":"60,30,201,255"},{"ms":910,"rgba":"60,30,201,255"},{"ms":925,"rgba":"60,30,201,255"},{"ms":943,"rgba":"60,30,201,255"},{"ms":960,"rgba":"60,30,201,255"},{"ms":977,"rgba":"60,30,201,255"},{"ms":993,"rgba":"60,30,201,255"},{"ms":1010,"rgba":"60,30,201,255"},{"ms":1026,"rgba":"60,30,201,255"},{"ms":1043,"rgba":"60,30,201,255"},{"ms":1060,"rgba":"60,30,201,255"},{"ms":1076,"rgba":"60,30,201,255"},{"ms":1092,"rgba":"60,30,201,255"},{"ms":1110,"rgba":"60,30,201,255"},{"ms":1127,"rgba":"60,30,201,255"},{"ms":1143,"rgba":"60,30,201,255"},{"ms":1160,"rgba":"60,30,201,255"},{"ms":1176,"rgba":"60,30,201,255"},{"ms":1193,"rgba":"60,30,201,255"},{"ms":1210,"rgba":"60,30,201,255"},{"ms":1226,"rgba":"60,30,201,255"},{"ms":1243,"rgba":"60,30,201,255"},{"ms":1260,"rgba":"60,30,201,255"},{"ms":1277,"rgba":"60,30,201,255"},{"ms":1293,"rgba":"60,30,201,255"},{"ms":1310,"rgba":"60,30,201,255"}]}]}

```

## fury-media-animation-browser.js

Original capture: `fury-media-animation-browser.js.txt`. Bytes: 3871. SHA-256: `4dccae20427608921c5ee6c3e5addca99f3d6f894ecd63e8441b8ba1a95d3ecd`.

```text
async (originalPage) => {
 const results=[];
 let surface=0;
 const sample=async locator=>{const surfaceIndex=surface++;
  await locator.evaluate(async i=>{i.scrollIntoView({block:'center',behavior:'instant'});await i.decode();});const clip=await locator.evaluate(i=>{const r=i.getBoundingClientRect();let root=i.parentElement;while(root&& !['auto','scroll'].includes(getComputedStyle(root).overflowY))root=root.parentElement;const bounds=root?.getBoundingClientRect()??{top:0,bottom:innerHeight};return{x:Math.max(0,r.left+r.width*.1),y:(Math.max(0,r.top,bounds.top)+Math.min(innerHeight,r.bottom,bounds.bottom))/2,width:10,height:10};});
  const hashes=new Set(),samples=[];const started=Date.now();
  for(let index=0;index<10;index++){
   const buffer=await locator.page().screenshot({clip,animations:'allow',path:'/tmp/fury-media-motion-'+surfaceIndex+'-'+index+'.png'});let fingerprint=2166136261;for(const byte of buffer)fingerprint=Math.imul(fingerprint^byte,16777619)>>>0;const hash=fingerprint.toString(16);hashes.add(hash);samples.push({ms:Date.now()-started,pngFingerprint:hash});
   await locator.page().evaluate(()=>new Promise(resolve=>{const target=performance.now()+65;const next=()=>performance.now()>=target?resolve():requestAnimationFrame(next);requestAnimationFrame(next);}));
  }
  const descriptor=await locator.evaluate(async image=>({alt:image.alt,width:image.naturalWidth,height:image.naturalHeight,type:(await(await fetch(image.src)).blob()).type}));
  return {...descriptor,distinctColors:hashes.size,samples};
 };
 for(const reduced of [false,true]){
  const context=await originalPage.context().browser().newContext({viewport:{width:1280,height:900},reducedMotion:reduced?'reduce':'no-preference'});const page=await context.newPage();
  try{
   await page.goto('http://127.0.0.1:4316/auth/login');await page.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill('media-foundation-admin@example.test');await page.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill(__PASSWORD__);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(url=>['/dashboard','/admin'].includes(url.pathname));
   await page.goto('http://127.0.0.1:4316/admin/works/'+__WORK__+'/chapters/'+__CHAPTER__+'/edit');await page.getByRole('button',{name:'معاينة خاصة',exact:true}).click();const dialog=page.getByRole('dialog');const privateImages=[];
   for(const index of [1,5]){await dialog.locator('ol > li').nth(index).scrollIntoViewIfNeeded();const image=dialog.getByRole('img',{name:'صفحة '+(index+1),exact:true});await image.waitFor();await image.evaluate(i=>i.decode());privateImages.push(await sample(image));}
   await dialog.getByRole('button',{name:'إغلاق',exact:true}).click();
   await page.goto('http://127.0.0.1:4316/story/media-foundation');await page.getByRole('heading',{name:'Media Foundation عمل',exact:true}).waitFor();await page.waitForFunction(()=>[...document.images].filter(i=>i.src.startsWith('blob:')&&i.complete&&i.naturalWidth>0).length>=2);const publicImages=[];for(const image of await page.locator('img[src^="blob:"]').all())publicImages.push(await sample(image));
   const all=[...privateImages,...publicImages];if(all.some(i=>reduced?i.distinctColors!==1:i.distinctColors<3))throw Error(JSON.stringify({reduced,privateImages,publicImages}));if(all.some(i=>i.type!==(reduced?'image/png':'image/webp')))throw Error('Motion display container mismatch');
   results.push({reduced,privateImages,publicImages});
  }finally{await context.close();}
 }
 return {passed:true,results,measurement:'Native production Chromium visible compositor crop screenshots, ten timed samples per displayed image; canvas drawImage uses a default still frame and is not animation evidence. Stored originals independently retain three WebP frames'};
}
```

## fury-media-animation-compositor-result

Original capture: `fury-media-animation-compositor-result.txt`. Bytes: 108. SHA-256: `fd12d6b61e08f97e83b3acdb0329e75e1c2fc53ae06cc0c782e65a0ca185a641`.

```text
### Error
TypeError [ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING]: A dynamic import callback was not specified.

```

## fury-media-animation-crops-result

Original capture: `fury-media-animation-crops-result.txt`. Bytes: 4694. SHA-256: `f2f36404b6a5f1170e1ab5d610520a0d98a7b7ff1c75ad963dbad2c0e2ae3873`.

```text
{"passed": true, "results": [{"reduced": false, "privateImages": [{"alt": "صفحة 2", "width": 600, "height": 800, "type": "image/webp", "distinctColors": 3, "samples": [{"ms": 39, "pngFingerprint": "4fea5fb3"}, {"ms": 155, "pngFingerprint": "4d3cd53c"}, {"ms": 278, "pngFingerprint": "de1ed9e6"}, {"ms": 393, "pngFingerprint": "de1ed9e6"}, {"ms": 506, "pngFingerprint": "4fea5fb3"}, {"ms": 627, "pngFingerprint": "4d3cd53c"}, {"ms": 743, "pngFingerprint": "de1ed9e6"}, {"ms": 861, "pngFingerprint": "4fea5fb3"}, {"ms": 975, "pngFingerprint": "4d3cd53c"}, {"ms": 1091, "pngFingerprint": "de1ed9e6"}]}, {"alt": "صفحة 6", "width": 600, "height": 800, "type": "image/webp", "distinctColors": 3, "samples": [{"ms": 30, "pngFingerprint": "84c1d623"}, {"ms": 147, "pngFingerprint": "b09fd76d"}, {"ms": 261, "pngFingerprint": "b09fd76d"}, {"ms": 381, "pngFingerprint": "60e1eed"}, {"ms": 498, "pngFingerprint": "84c1d623"}, {"ms": 616, "pngFingerprint": "b09fd76d"}, {"ms": 732, "pngFingerprint": "60e1eed"}, {"ms": 848, "pngFingerprint": "60e1eed"}, {"ms": 968, "pngFingerprint": "84c1d623"}, {"ms": 1081, "pngFingerprint": "b09fd76d"}]}], "publicImages": [{"alt": "", "width": 900, "height": 500, "type": "image/webp", "distinctColors": 3, "samples": [{"ms": 38, "pngFingerprint": "d5c13f75"}, {"ms": 158, "pngFingerprint": "affc7c54"}, {"ms": 273, "pngFingerprint": "17d6f7f2"}, {"ms": 395, "pngFingerprint": "17d6f7f2"}, {"ms": 509, "pngFingerprint": "affc7c54"}, {"ms": 624, "pngFingerprint": "17d6f7f2"}, {"ms": 738, "pngFingerprint": "17d6f7f2"}, {"ms": 858, "pngFingerprint": "d5c13f75"}, {"ms": 974, "pngFingerprint": "affc7c54"}, {"ms": 1089, "pngFingerprint": "17d6f7f2"}]}, {"alt": "Media Foundation عمل", "width": 600, "height": 800, "type": "image/webp", "distinctColors": 3, "samples": [{"ms": 23, "pngFingerprint": "60e1eed"}, {"ms": 143, "pngFingerprint": "b09fd76d"}, {"ms": 259, "pngFingerprint": "b09fd76d"}, {"ms": 377, "pngFingerprint": "60e1eed"}, {"ms": 496, "pngFingerprint": "84c1d623"}, {"ms": 609, "pngFingerprint": "b09fd76d"}, {"ms": 729, "pngFingerprint": "60e1eed"}, {"ms": 842, "pngFingerprint": "60e1eed"}, {"ms": 960, "pngFingerprint": "84c1d623"}, {"ms": 1075, "pngFingerprint": "b09fd76d"}]}]}, {"reduced": true, "privateImages": [{"alt": "صفحة 2", "width": 600, "height": 800, "type": "image/png", "distinctColors": 1, "samples": [{"ms": 37, "pngFingerprint": "4fea5fb3"}, {"ms": 153, "pngFingerprint": "4fea5fb3"}, {"ms": 270, "pngFingerprint": "4fea5fb3"}, {"ms": 389, "pngFingerprint": "4fea5fb3"}, {"ms": 507, "pngFingerprint": "4fea5fb3"}, {"ms": 621, "pngFingerprint": "4fea5fb3"}, {"ms": 738, "pngFingerprint": "4fea5fb3"}, {"ms": 854, "pngFingerprint": "4fea5fb3"}, {"ms": 971, "pngFingerprint": "4fea5fb3"}, {"ms": 1088, "pngFingerprint": "4fea5fb3"}]}, {"alt": "صفحة 6", "width": 600, "height": 800, "type": "image/png", "distinctColors": 1, "samples": [{"ms": 29, "pngFingerprint": "84c1d623"}, {"ms": 143, "pngFingerprint": "84c1d623"}, {"ms": 262, "pngFingerprint": "84c1d623"}, {"ms": 379, "pngFingerprint": "84c1d623"}, {"ms": 496, "pngFingerprint": "84c1d623"}, {"ms": 613, "pngFingerprint": "84c1d623"}, {"ms": 729, "pngFingerprint": "84c1d623"}, {"ms": 846, "pngFingerprint": "84c1d623"}, {"ms": 963, "pngFingerprint": "84c1d623"}, {"ms": 1080, "pngFingerprint": "84c1d623"}]}], "publicImages": [{"alt": "", "width": 900, "height": 500, "type": "image/png", "distinctColors": 1, "samples": [{"ms": 28, "pngFingerprint": "d5c13f75"}, {"ms": 145, "pngFingerprint": "d5c13f75"}, {"ms": 263, "pngFingerprint": "d5c13f75"}, {"ms": 380, "pngFingerprint": "d5c13f75"}, {"ms": 496, "pngFingerprint": "d5c13f75"}, {"ms": 613, "pngFingerprint": "d5c13f75"}, {"ms": 730, "pngFingerprint": "d5c13f75"}, {"ms": 847, "pngFingerprint": "d5c13f75"}, {"ms": 963, "pngFingerprint": "d5c13f75"}, {"ms": 1080, "pngFingerprint": "d5c13f75"}]}, {"alt": "Media Foundation عمل", "width": 600, "height": 800, "type": "image/png", "distinctColors": 1, "samples": [{"ms": 25, "pngFingerprint": "84c1d623"}, {"ms": 143, "pngFingerprint": "84c1d623"}, {"ms": 260, "pngFingerprint": "84c1d623"}, {"ms": 377, "pngFingerprint": "84c1d623"}, {"ms": 495, "pngFingerprint": "84c1d623"}, {"ms": 609, "pngFingerprint": "84c1d623"}, {"ms": 726, "pngFingerprint": "84c1d623"}, {"ms": 843, "pngFingerprint": "84c1d623"}, {"ms": 961, "pngFingerprint": "84c1d623"}, {"ms": 1075, "pngFingerprint": "84c1d623"}]}]}], "measurement": "Native production Chromium visible compositor crop screenshots, ten timed samples per displayed image; canvas drawImage uses a default still frame and is not animation evidence. Stored originals independently retain three WebP frames"}
```

## fury-media-animation-screenshots-result

Original capture: `fury-media-animation-screenshots-result.txt`. Bytes: 2040. SHA-256: `ac630f31958652843e34289c26ffb354654fa42f5f8545a1b8fb2111f7f99814`.

```text
### Error
Error: {"reduced":false,"privateImages":[{"alt":"صفحة 2","width":600,"height":800,"type":"image/webp","distinctColors":1,"samples":[{"ms":352,"pngFingerprint":"8df45c5d"},{"ms":766,"pngFingerprint":"8df45c5d"},{"ms":1178,"pngFingerprint":"8df45c5d"},{"ms":1574,"pngFingerprint":"8df45c5d"},{"ms":1997,"pngFingerprint":"8df45c5d"},{"ms":2407,"pngFingerprint":"8df45c5d"},{"ms":2802,"pngFingerprint":"8df45c5d"},{"ms":3202,"pngFingerprint":"8df45c5d"},{"ms":3606,"pngFingerprint":"8df45c5d"},{"ms":4019,"pngFingerprint":"8df45c5d"}]},{"alt":"صفحة 6","width":600,"height":800,"type":"image/webp","distinctColors":1,"samples":[{"ms":342,"pngFingerprint":"8df45c5d"},{"ms":737,"pngFingerprint":"8df45c5d"},{"ms":1134,"pngFingerprint":"8df45c5d"},{"ms":1540,"pngFingerprint":"8df45c5d"},{"ms":1949,"pngFingerprint":"8df45c5d"},{"ms":2355,"pngFingerprint":"8df45c5d"},{"ms":2751,"pngFingerprint":"8df45c5d"},{"ms":3152,"pngFingerprint":"8df45c5d"},{"ms":3556,"pngFingerprint":"8df45c5d"},{"ms":3962,"pngFingerprint":"8df45c5d"}]}],"publicImages":[{"alt":"","width":900,"height":500,"type":"image/webp","distinctColors":3,"samples":[{"ms":77,"pngFingerprint":"849a9a1"},{"ms":227,"pngFingerprint":"8f2c8814"},{"ms":382,"pngFingerprint":"8f2c8814"},{"ms":549,"pngFingerprint":"849a9a1"},{"ms":715,"pngFingerprint":"8f2c8814"},{"ms":881,"pngFingerprint":"fdea379e"},{"ms":1049,"pngFingerprint":"8f2c8814"},{"ms":1215,"pngFingerprint":"8f2c8814"},{"ms":1363,"pngFingerprint":"849a9a1"},{"ms":1515,"pngFingerprint":"8f2c8814"}]},{"alt":"Media Foundation عمل","width":600,"height":800,"type":"image/webp","distinctColors":3,"samples":[{"ms":68,"pngFingerprint":"ff3df3c1"},{"ms":218,"pngFingerprint":"b5cac597"},{"ms":369,"pngFingerprint":"9c97f083"},{"ms":519,"pngFingerprint":"b5cac597"},{"ms":669,"pngFingerprint":"9c97f083"},{"ms":818,"pngFingerprint":"9c97f083"},{"ms":972,"pngFingerprint":"b5cac597"},{"ms":1118,"pngFingerprint":"9c97f083"},{"ms":1274,"pngFingerprint":"ff3df3c1"},{"ms":1417,"pngFingerprint":"b5cac597"}]}]}

```

## fury-media-api-types-first

Original capture: `fury-media-api-types-first.txt`. Bytes: 543. SHA-256: `51f1b6c1ff7b9c4de7994f3ecf2c71849db77a552489ab5407d8ed2b4729934a`.

```text
$ tsc --noEmit
src/content.integration.test.ts(76,15): error TS2554: Expected 3 arguments, but got 2.
src/infrastructure/media/image-validation.ts(150,5): error TS18048: 'height' is possibly 'undefined'.
src/modules/content/work-management.integration.test.ts(35,15): error TS2554: Expected 3 arguments, but got 2.
src/modules/content/work-management.integration.test.ts(528,9): error TS2554: Expected 3 arguments, but got 2.
<repository>/apps/api:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/api@0.1.0 check-types: `tsc --noEmit`
Exit status 2
```

## fury-media-api-types-second

Original capture: `fury-media-api-types-second.txt`. Bytes: 15. SHA-256: `8366207267355d3e3d5bf3bf6e8c94c5f93f6078c34f08973fa2b38cdda6cc92`.

```text
$ tsc --noEmit
```

## fury-media-backend-final-focused

Original capture: `fury-media-backend-final-focused.txt`. Bytes: 400. SHA-256: `3c9427284f86b556f1be40af48fc2e61564e6ddab853c1876034df092d298ae9`.

```text
$ vitest run --config vitest.config.ts src/infrastructure/media/image-validation.test.ts src/infrastructure/media/animated-image-validation.test.ts src/modules/content/content.mapper.test.ts

 RUN  v4.1.10 <repository>/apps/api


 Test Files  3 passed (3)
      Tests  27 passed (27)
   Start at  16:34:19
   Duration  2.12s (transform 195ms, setup 56ms, import 514ms, tests 2.09s, environment 0ms)

```

## fury-media-backend-format

Original capture: `fury-media-backend-format.txt`. Bytes: 1112. SHA-256: `f0792336e8596dcea0dd81123ca6fb99c914b5674d0c3b57b26e4e718063110c`.

```text
apps/api/src/infrastructure/media/image-validation.ts 96ms
apps/api/src/infrastructure/media/image-container.ts 14ms
apps/api/src/infrastructure/media/image-processor.ts 4ms
apps/api/src/infrastructure/media/media.errors.ts 2ms
apps/api/src/infrastructure/media/image-validation.test.ts 14ms (unchanged)
apps/api/src/infrastructure/media/animated-image-validation.test.ts 12ms
apps/api/src/test-support/animated-image.test-helper.ts 8ms (unchanged)
apps/api/src/modules/media/media.service.ts 71ms (unchanged)
apps/api/src/modules/media/media.service.integration.test.ts 45ms
apps/api/src/modules/media/media.reconcile.integration.test.ts 11ms
apps/api/src/modules/content/content.mapper.ts 26ms
apps/api/src/modules/content/work-management.integration.test.ts 32ms (unchanged)
apps/api/src/content.integration.test.ts 157ms
apps/api/src/media.integration.test.ts 45ms
apps/api/src/router.ts 3ms
apps/api/src/infrastructure/openapi/openapi.ts 28ms
packages/contracts/src/media/media.schema.ts 12ms
packages/contracts/src/content/content.schema.ts 53ms (unchanged)
packages/contracts/src/index.ts 3ms (unchanged)
```

## fury-media-backend-integration-corrected

Original capture: `fury-media-backend-integration-corrected.txt`. Bytes: 776. SHA-256: `ef499f41c24fae7288ced4b543d88b1bf3370cc48993aca267f849106377897f`.

```text
$ vitest run --config vitest.integration.config.ts src/media.integration.test.ts src/modules/media/media.service.integration.test.ts src/modules/media/media.reconcile.integration.test.ts src/modules/content/work-management.integration.test.ts src/content.integration.test.ts

 RUN  v4.1.10 <repository>/apps/api

(node:13023) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
(Use `node --trace-deprecation ...` to show where the warning was created)

 Test Files  5 passed (5)
      Tests  89 passed (89)
   Start at  16:26:33
   Duration  18.14s (transform 468ms, setup 16ms, import 963ms, tests 11.22s, environment 0ms)

```

## fury-media-backend-integration-first

Original capture: `fury-media-backend-integration-first.txt`. Bytes: 2335. SHA-256: `4f6007f467d6ce87223a753ae7f636210145d5f542f259fd96467ec6a7b706d6`.

```text
$ vitest run --config vitest.integration.config.ts src/media.integration.test.ts src/modules/media/media.service.integration.test.ts src/modules/media/media.reconcile.integration.test.ts src/modules/content/work-management.integration.test.ts src/content.integration.test.ts

 RUN  v4.1.10 <repository>/apps/api

(node:11963) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
 ❯ src/media.integration.test.ts (15 tests | 1 failed) 952ms
     × preserves canonical frames through replay, storage and restarted private HTTP delivery 107ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/media.integration.test.ts > animated editorial media delivery > preserves canonical frames through replay, storage and restarted private HTTP delivery
AssertionError: expected { …(24) } to match object { 'content-type': 'image/webp', …(2) }
(21 matching properties omitted from actual)

- Expected
+ Received

  {
-   "cache-control": "no-store",
+   "cache-control": "private, no-store",
    "content-type": "image/webp",
    "x-content-type-options": "nosniff",
  }

 ❯ src/media.integration.test.ts:838:37
    836|           .set("Authorization", `Bearer ${token}`);
    837|         expect(privateRead.status).toBe(200);
    838|         expect(privateRead.headers).toMatchObject({
       |                                     ^
    839|           "content-type": "image/webp",
    840|           "cache-control": "no-store",

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 4 passed (5)
      Tests  1 failed | 87 passed (88)
   Start at  16:19:22
   Duration  19.30s (transform 463ms, setup 16ms, import 827ms, tests 10.45s, environment 0ms)

<repository>/apps/api:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/api@0.1.0 test:integration: `vitest run --config vitest.integration.config.ts src/media.integration.test.ts src/modules/media/media.service.integration.test.ts src/modules/media/media.reconcile.integration.test.ts src/modules/content/work-management.integration.test.ts src/content.integration.test.ts`
Exit status 1
```

## fury-media-backend-integration-second

Original capture: `fury-media-backend-integration-second.txt`. Bytes: 3140. SHA-256: `5ae432c1efde3c78a7d3cabcf1ce12f8ec4e00b8724722e6e421075f34e8b8f6`.

```text
$ vitest run --config vitest.integration.config.ts src/media.integration.test.ts src/modules/media/media.service.integration.test.ts src/modules/media/media.reconcile.integration.test.ts src/modules/content/work-management.integration.test.ts src/content.integration.test.ts

 RUN  v4.1.10 <repository>/apps/api

 ❯ src/media.integration.test.ts (15 tests | 1 failed) 1850ms
     × preserves canonical frames through replay, storage and fresh private HTTP instances 719ms
(node:12516) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
 ❯ src/modules/media/media.service.integration.test.ts (16 tests | 1 failed) 2311ms
     × keeps public eligibility and byte failures distinct (animated=true) 30ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/media.integration.test.ts > animated editorial media delivery > preserves canonical frames through replay, storage and fresh private HTTP instances
AssertionError: expected 429 to be 200 // Object.is equality

- Expected
+ Received

- 200
+ 429

 ❯ src/media.integration.test.ts:878:29
    876|           .head(asset.contentPath)
    877|           .set("Authorization", `Bearer ${token}`);
    878|         expect(head.status).toBe(200);
       |                             ^
    879|         expect(head.headers["content-length"]).toBe(String(bytes.lengt…
    880|       }

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/modules/media/media.service.integration.test.ts > administrator media service > keeps public eligibility and byte failures distinct (animated=true)
AppError: Unsupported or mismatched image type.
 ❯ validateImage src/infrastructure/media/image-validation.ts:148:11
    146|     (bounds.transparent === true && format === "jpeg")
    147|   ) {
    148|     throw new MediaUnsupportedImageException();
       |           ^
    149|   }
    150|
 ❯ ImageProcessor.process src/infrastructure/media/image-processor.ts:21:14
 ❯ MediaService.completeUpload src/modules/media/media.service.ts:232:19
 ❯ MediaService.upload src/modules/media/media.service.ts:112:20
 ❯ MediaService.uploadAdmin src/modules/media/media.service.ts:100:20
 ❯ src/modules/media/media.service.integration.test.ts:388:21

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  2 failed | 3 passed (5)
      Tests  2 failed | 87 passed (89)
   Start at  16:22:51
   Duration  17.55s (transform 423ms, setup 14ms, import 897ms, tests 10.89s, environment 0ms)

<repository>/apps/api:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/api@0.1.0 test:integration: `vitest run --config vitest.integration.config.ts src/media.integration.test.ts src/modules/media/media.service.integration.test.ts src/modules/media/media.reconcile.integration.test.ts src/modules/content/work-management.integration.test.ts src/content.integration.test.ts`
Exit status 1
```

## fury-media-backend-lint-approved

Original capture: `fury-media-backend-lint-approved.txt`. Bytes: 11. SHA-256: `050c69da23536758722729aeda55a8d0fb9d557495ef6d33d70873a3b64a71c1`.

```text
$ eslint .
```

## fury-media-backend-lint-corrected

Original capture: `fury-media-backend-lint-corrected.txt`. Bytes: 330. SHA-256: `7c16963264fa8e412fe0b3c9dde07a4fe8d9e38d95b5aab257ebdd4423204cb6`.

```text
$ eslint .

<repository>/apps/api/src/infrastructure/media/animated-image-validation.test.ts
  134:9  error  Unsafe assignment of an `any` value  @typescript-eslint/no-unsafe-assignment

✖ 1 problem (1 error, 0 warnings)

<repository>/apps/api:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/api@0.1.0 lint: `eslint .`
Exit status 1
```

## fury-media-backend-lint-final

Original capture: `fury-media-backend-lint-final.txt`. Bytes: 11. SHA-256: `050c69da23536758722729aeda55a8d0fb9d557495ef6d33d70873a3b64a71c1`.

```text
$ eslint .
```

## fury-media-backend-lint

Original capture: `fury-media-backend-lint.txt`. Bytes: 581. SHA-256: `d8c8e2bc7ef419b49c3b9104a2cc4a13bbf75e98e85768ca2ef13015ee0a4fbb`.

```text
$ eslint .

<repository>/apps/api/src/infrastructure/media/animated-image-validation.test.ts
  134:9  error  Unsafe assignment of an `any` value  @typescript-eslint/no-unsafe-assignment

<repository>/apps/api/src/media.integration.test.ts
  789:170  error  Async method 'send' has no 'await' expression  @typescript-eslint/require-await
  833:9    error  Async method 'send' has no 'await' expression  @typescript-eslint/require-await

✖ 3 problems (3 errors, 0 warnings)

<repository>/apps/api:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/api@0.1.0 lint: `eslint .`
Exit status 1
```

## fury-media-backend-types-approved

Original capture: `fury-media-backend-types-approved.txt`. Bytes: 15. SHA-256: `8366207267355d3e3d5bf3bf6e8c94c5f93f6078c34f08973fa2b38cdda6cc92`.

```text
$ tsc --noEmit
```

## fury-media-backend-types-second

Original capture: `fury-media-backend-types-second.txt`. Bytes: 15. SHA-256: `8366207267355d3e3d5bf3bf6e8c94c5f93f6078c34f08973fa2b38cdda6cc92`.

```text
$ tsc --noEmit
```

## fury-media-backend-types

Original capture: `fury-media-backend-types.txt`. Bytes: 493. SHA-256: `9262e65955e8e6dc4789e283d84fbedf1249558c3dfe0d11480b4c3fae61fa38`.

```text
$ tsc --noEmit
src/modules/content/content.mapper.test.ts(88,11): error TS2739: Type '{ status: "AVAILABLE"; mediaClass: "CHAPTER_PAGE"; scope: "ADMIN"; }' is missing the following properties from type '{ width: number | null; height: number | null; byteLength: number | null; status: MediaAssetStatus; mediaClass: MediaClass; scope: MediaScope; }': width, height, byteLength
<repository>/apps/api:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/api@0.1.0 check-types: `tsc --noEmit`
Exit status 2
```

## fury-media-backend-unit

Original capture: `fury-media-backend-unit.txt`. Bytes: 253. SHA-256: `9374daefbbf5c7fc2d537a74a72741546688e339fca39e03a6dea9483a77ec38`.

```text
$ vitest run --config vitest.config.ts

 RUN  v4.1.10 <repository>/apps/api


 Test Files  27 passed (27)
      Tests  164 passed (164)
   Start at  16:19:22
   Duration  3.97s (transform 3.44s, setup 369ms, import 7.48s, tests 5.69s, environment 5ms)

```

## fury-media-baseline-benchmark-template.js

Original capture: `fury-media-baseline-benchmark-template.js.txt`. Bytes: 7449. SHA-256: `94f2f93546658493cd3729bdc361d46c6e48739d77b6f8793a0c95cfce6a1711`.

```text
async (originalPage) => {
 const version=__VERSION__, slow=__SLOW__, width=__WIDTH__, expected=__EXPECTED_INITIAL__;
 const context=await originalPage.context().browser().newContext({viewport:{width,height:900}});const page=await context.newPage();
 const ids=__ASSET_IDS__;let started=0;const requests=[],finished=new Set(),active=new Set();let maxOutstanding=0,firstUsefulBytes;const bytesById=new Map();let stage='login';
 try {
  await page.addInitScript(()=>{const active=new Map();let maximum=0,maxBytes=0;const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=blob=>{const url=create(blob);active.set(url,blob.size);maximum=Math.max(maximum,active.size);maxBytes=Math.max(maxBytes,[...active.values()].reduce((sum,n)=>sum+n,0));return url;};URL.revokeObjectURL=url=>{active.delete(url);revoke(url);};window.__furyMediaResources=()=>({active:active.size,bytes:[...active.values()].reduce((sum,n)=>sum+n,0),maximum,maxBytes});window.__furyShifts=[];new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__furyShifts.push({value:entry.value,hadRecentInput:entry.hadRecentInput});}).observe({type:'layout-shift',buffered:true});});
  await page.goto('http://127.0.0.1:4316/auth/login');await page.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill('media-foundation-admin@example.test');await page.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill(__PASSWORD__);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(url=>['/dashboard','/admin'].includes(url.pathname));
  stage='saved editor';const detail=page.waitForResponse(r=>r.request().method()==='GET'&&r.url().includes('/api/v1/content/admin/')&&r.url().includes(__CHAPTER__));await page.goto('http://127.0.0.1:4316/admin/works/'+__WORK__+'/chapters/'+__CHAPTER__+'/edit');const saved=await detail;if(saved.status()!==200)throw Error('Saved Chapter read failed');const payload=await saved.json();if(payload.data?.chapter.pages.length!==30)throw Error('Persisted thirty-page chapter missing');await page.getByRole('button',{name:'معاينة خاصة',exact:true}).waitFor();
  const session=await context.newCDPSession(page);await session.send('Network.enable');await session.send('Network.emulateNetworkConditions',{offline:false,latency:slow?150:20,downloadThroughput:slow?192*1024:10*1024*1024,uploadThroughput:128*1024,connectionType:slow?'cellular3g':'wifi'});
  const resourceIndex=url=>{const m=new URL(url).pathname.match(/\/media\/assets\/([a-f0-9-]+)\/content$/);return m?ids.indexOf(m[1]):-1;};const cdpIds=new Map();session.on('Network.requestWillBeSent',event=>{const index=resourceIndex(event.request.url);if(index>=0){cdpIds.set(event.requestId,index);bytesById.set(event.requestId,0);}});session.on('Network.dataReceived',event=>{if(cdpIds.has(event.requestId))bytesById.set(event.requestId,(bytesById.get(event.requestId)||0)+event.encodedDataLength);});
  page.on('request',request=>{const index=resourceIndex(request.url());if(index>=0){requests.push({index:index+1,startedMs:Date.now()-started});active.add(request);maxOutstanding=Math.max(maxOutstanding,active.size);}});page.on('requestfinished',request=>{const index=resourceIndex(request.url());if(index>=0){active.delete(request);finished.add(index);}});page.on('requestfailed',request=>active.delete(request));
  const baseResources=await page.evaluate(()=>window.__furyMediaResources());started=Date.now();stage='first useful';await page.getByRole('button',{name:'معاينة خاصة',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.waitFor();const initialHeight=await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').first().evaluate(node=>node.getBoundingClientRect().height);await page.waitForFunction(()=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة 1"]');return image?.complete&&image.naturalWidth>0;},{},{timeout:60000});const firstUsefulMs=Date.now()-started;firstUsefulBytes=[...bytesById.values()].reduce((sum,n)=>sum+n,0);await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));const initialRequests=requests.map(r=>r.index);const firstReadyResources=await page.evaluate(()=>window.__furyMediaResources());const finalHeight=await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').first().evaluate(node=>node.getBoundingClientRect().height);
  stage='initial window';if(!slow)await page.waitForFunction(count=>window.__furyMediaResources().active>=count,expected,{timeout:30000});const initialPreparedMs=Date.now()-started;const boundaries=[];
  if(!slow){for(const index of [4,9,14]){const since=Date.now();await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').nth(index).scrollIntoViewIfNeeded();await page.waitForFunction(position=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة '+position+'"]');return image?.complete&&image.naturalWidth>0;},index+1,{timeout:30000});await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));boundaries.push({page:index+1,stallMs:Date.now()-since,requested:requests.map(r=>r.index)});}const since=Date.now(),count=requests.length;await dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li').nth(12).scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const image=document.querySelector('[role="dialog"] img[alt="صفحة 13"]');return image?.complete&&image.naturalWidth>0;});boundaries.push({kind:'warm reversal',page:13,stallMs:Date.now()-since,newRequests:requests.length-count});}
  const resources=await page.evaluate(()=>window.__furyMediaResources());const heap=await session.send('Runtime.getHeapUsage');const shifts=await page.evaluate(()=>window.__furyShifts);const layout={width:await page.evaluate(()=>innerWidth),scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth),initialFirstPageHeight:initialHeight,readyFirstPageHeight:finalHeight,shifts};stage='close';await dialog.getByRole('button',{name:'إغلاق',exact:true}).click();await dialog.waitFor({state:'hidden'});await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));const afterClose=await page.evaluate(()=>window.__furyMediaResources());if(afterClose.active!==baseResources.active)throw Error('Owned image URLs remain after preview close');
  return {passed:true,version,viewport:width,profile:{slow,latencyMs:slow?150:20,downloadBytesPerSecond:slow?192*1024:10*1024*1024},persistedPages:30,firstUsefulMs,encodedDataBytesBeforeUseful:firstUsefulBytes,initialRequests,initialPreparedMs,maxApplicationOutstandingContentRequests:maxOutstanding,requests,boundaries,resources:{base:baseResources,firstReady:firstReadyResources,atEnd:resources,afterClose},layout,heap:{usedSize:heap.usedSize,totalSize:heap.totalSize,limit:'JavaScript heap only; excludes native decoder/GPU animation memory'},measurement:'One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence'};
 } catch(error){throw Error(JSON.stringify({stage,error:String(error),url:page.url(),headings:await page.locator('h1,h2').allTextContents(),alerts:await page.getByRole('alert').allTextContents(),requests}));} finally {await context.close();}
}
```

## fury-media-baseline-contract-build

Original capture: `fury-media-baseline-contract-build.txt`. Bytes: 91. SHA-256: `60db90306a18653493f746f621a014187be1d4a6c40f426deefe24c78040a4cb`.

```text
$ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
```

## fury-media-baseline-server

Original capture: `fury-media-baseline-server.txt`. Bytes: 307. SHA-256: `857ccb4216ef49f913e13470f352fcfdf197abae7dd2d62917530861ef4d07be`.

```text
$ next start --hostname 127.0.0.1 --port 4316
▲ Next.js 16.2.12
- Local:         http://127.0.0.1:4316
- Network:       http://127.0.0.1:4316
✓ Ready in 324ms
<repository>/apps/web:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/web@0.1.0 start: `next start --hostname 127.0.0.1 --port 4316`
Exit status 130
```

## fury-media-baseline-web-build

Original capture: `fury-media-baseline-web-build.txt`. Bytes: 1622. SHA-256: `d4ca2d4830be3d1e7961f2a63ecff1568374ae36856e07421a8e9042bd17da42`.

```text
$ next build --webpack
▲ Next.js 16.2.12 (webpack)

  Creating an optimized production build ...
✓ Compiled successfully in 5.9s
  Running TypeScript ...
  Finished TypeScript in 6.4s ...
  Collecting page data using 9 workers ...
  Generating static pages using 9 workers (0/28) ...
  Generating static pages using 9 workers (7/28)
  Generating static pages using 9 workers (14/28)
  Generating static pages using 9 workers (21/28)
✓ Generating static pages using 9 workers (28/28) in 299ms
  Finalizing page optimization ...
  Collecting build traces ...

Route (app)
┌ ƒ /
├ ○ /_not-found
├ ○ /admin
├ ○ /admin/ads
├ ○ /admin/categories
├ ○ /admin/comments
├ ○ /admin/contact
├ ƒ /admin/contact/[messageId]
├ ○ /admin/dashboard
├ ○ /admin/gifts
├ ○ /admin/gifts/grants
├ ○ /admin/reports
├ ○ /admin/users
├ ƒ /admin/users/[userId]
├ ○ /admin/works
├ ƒ /admin/works/[workId]/chapters
├ ƒ /admin/works/[workId]/chapters/[chapterId]/edit
├ ƒ /admin/works/[workId]/chapters/new
├ ƒ /admin/works/[workId]/edit
├ ○ /admin/works/new
├ ○ /auth/forgot-password
├ ○ /auth/login
├ ○ /auth/register
├ ○ /auth/reset-password
├ ○ /auth/verify-email
├ ƒ /categories
├ ○ /contact
├ ○ /copyright
├ ○ /dashboard
├ ƒ /discover
├ ○ /library
├ ○ /privacy
├ ƒ /report-issue
├ ƒ /robots.txt
├ ○ /settings
├ ƒ /sitemap.xml
├ ƒ /stories
├ ƒ /story/[id]
├ ƒ /story/[id]/chapter/[chapterId]
└ ○ /terms


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

```

## fury-media-before-aggregate-format

Original capture: `fury-media-before-aggregate-format.txt`. Bytes: 4969. SHA-256: `5ded97e0a83c65843a73c4ab6a4a8b23aafaade29ecd45ec9ec99b0082002b06`.

```text
.specify/feature.json 10ms (unchanged)
.specify/memory/constitution.md 81ms (unchanged)
AGENTS.md 13ms (unchanged)
PLAN.md 110ms (unchanged)
PROJECT_REFERENCE.md 46ms
README.md 40ms
apps/api/src/content.integration.test.ts 344ms (unchanged)
apps/api/src/infrastructure/media/animated-image-validation.test.ts 30ms (unchanged)
apps/api/src/infrastructure/media/image-container.ts 14ms (unchanged)
apps/api/src/infrastructure/media/image-processor.ts 4ms (unchanged)
apps/api/src/infrastructure/media/image-validation.test.ts 14ms (unchanged)
apps/api/src/infrastructure/media/image-validation.ts 13ms (unchanged)
apps/api/src/infrastructure/media/media.errors.ts 3ms (unchanged)
apps/api/src/infrastructure/openapi/openapi.ts 38ms (unchanged)
apps/api/src/media.integration.test.ts 52ms (unchanged)
apps/api/src/modules/content/content.mapper.test.ts 12ms (unchanged)
apps/api/src/modules/content/content.mapper.ts 24ms (unchanged)
apps/api/src/modules/content/work-management.integration.test.ts 39ms (unchanged)
apps/api/src/modules/media/media.reconcile.integration.test.ts 17ms (unchanged)
apps/api/src/modules/media/media.service.integration.test.ts 35ms (unchanged)
apps/api/src/modules/media/media.service.ts 42ms (unchanged)
apps/api/src/router.ts 3ms (unchanged)
apps/api/src/test-support/animated-image.test-helper.ts 8ms (unchanged)
apps/web/src/features/admin/components/AdminChapterForm/AdminChapterForm.tsx 58ms (unchanged)
apps/web/src/features/admin/components/AdminChapterForm/ChapterPreviewModal.tsx 7ms (unchanged)
apps/web/src/features/admin/model/admin-chapter-editor.ts 7ms (unchanged)
apps/web/src/features/content/components/ChapterContentRenderer.test.tsx 21ms (unchanged)
apps/web/src/features/content/components/ChapterContentRenderer.tsx 6ms (unchanged)
apps/web/src/features/content/components/IllustratedChapterPages.tsx 9ms (unchanged)
apps/web/src/features/content/hooks/progressive-image-resources.test.ts 28ms (unchanged)
apps/web/src/features/content/hooks/progressive-image-resources.ts 13ms (unchanged)
apps/web/src/features/content/hooks/use-progressive-chapter-images.ts 7ms (unchanged)
apps/web/src/features/content/model/progressive-images.test.ts 6ms (unchanged)
apps/web/src/features/content/model/progressive-images.ts 5ms (unchanged)
apps/web/src/features/media/components/AdminMediaCandidatePicker.tsx 13ms (unchanged)
apps/web/src/features/media/hooks/media-image-display.ts 7ms (unchanged)
apps/web/src/features/media/hooks/media.hooks.ts 18ms (unchanged)
apps/web/src/features/media/hooks/use-media-preview-source.ts 3ms (unchanged)
apps/web/src/features/public-catalog/components/PublicWorkImage.tsx 8ms (unchanged)
apps/web/src/features/public-catalog/hooks/use-reduced-motion.ts 4ms (unchanged)
apps/web/src/shared/hooks/use-reduced-motion.ts 4ms (unchanged)
apps/web/src/styles/integration.css 36ms (unchanged)
docs/design/design-system.md 18ms (unchanged)
docs/engineering/README.md 34ms (unchanged)
docs/engineering/frontend-standard.md 86ms (unchanged)
docs/product/implementation-status.md 11ms
docs/product/legacy-closeout.md 597ms
docs/workflow/application-audit-prompt.md 3ms (unchanged)
docs/workflow/operating-policy.md 14ms (unchanged)
docs/workflow/prompts.md 7ms (unchanged)
packages/contracts/src/content/content.schema.ts 56ms (unchanged)
packages/contracts/src/index.ts 3ms (unchanged)
packages/contracts/src/media/media.schema.ts 13ms (unchanged)
specs/002-persistent-vps-media/contracts/media-http.md 23ms (unchanged)
specs/002-persistent-vps-media/evidence/media-foundation/README.md 19ms
specs/002-persistent-vps-media/evidence/media-foundation/after-narrow-slow.json 4ms
specs/002-persistent-vps-media/evidence/media-foundation/after-wide-cold-warm-cdp.json 7ms
specs/002-persistent-vps-media/evidence/media-foundation/after-wide-cold-warm-get.json 4ms
specs/002-persistent-vps-media/evidence/media-foundation/animated-existing-surfaces-visible-crops.json 4ms (unchanged)
specs/002-persistent-vps-media/evidence/media-foundation/before-narrow-slow.json 2ms (unchanged)
specs/002-persistent-vps-media/evidence/media-foundation/before-wide-cold-warm-corrected.json 3ms (unchanged)
specs/002-persistent-vps-media/evidence/media-foundation/foundation-dataset.json 2ms
specs/002-persistent-vps-media/evidence/media-foundation/gif-picker-parent-save-patch.json 2ms (unchanged)
specs/002-persistent-vps-media/evidence/media-foundation/processing-measurements.json 1ms
specs/002-persistent-vps-media/evidence/media-foundation/progressive-real-viewer-authority.json 1ms
specs/002-persistent-vps-media/evidence/media-foundation/restart-proof.json 1ms
specs/002-persistent-vps-media/implementation-evidence.md 59ms
specs/002-persistent-vps-media/plan.md 34ms (unchanged)
specs/002-persistent-vps-media/spec.md 43ms (unchanged)
specs/002-persistent-vps-media/tasks.md 45ms (unchanged)
specs/005-admin-chapter-publishing/plan.md 29ms (unchanged)
specs/006-public-catalog-discovery-seo/plan.md 42ms (unchanged)
```

## fury-media-business-after

Original capture: `fury-media-business-after.txt`. Bytes: 44. SHA-256: `3a7b1bbd717c439b26baa65901999a060a4e26a9712f4c4d4844a1b4b27e2bce`.

```text
Owned business-state fingerprints recorded.
```

## fury-media-business-before

Original capture: `fury-media-business-before.txt`. Bytes: 44. SHA-256: `3a7b1bbd717c439b26baa65901999a060a4e26a9712f4c4d4844a1b4b27e2bce`.

```text
Owned business-state fingerprints recorded.
```

## fury-media-busy-integration

Original capture: `fury-media-busy-integration.txt`. Bytes: 687. SHA-256: `e49b8dcaddda20c9fbfcd051df68a4d9a8642eae051c5a17d6bd70abf8a44226`.

```text
$ vitest run --config vitest.integration.config.ts src/media.integration.test.ts src/modules/media/media.service.integration.test.ts src/modules/media/media.reconcile.integration.test.ts

 RUN  v4.1.10 <repository>/apps/api

(node:21638) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
(Use `node --trace-deprecation ...` to show where the warning was created)

 Test Files  3 passed (3)
      Tests  36 passed (36)
   Start at  17:24:10
   Duration  27.67s (transform 830ms, setup 26ms, import 1.44s, tests 7.85s, environment 0ms)

```

## fury-media-busy-lint

Original capture: `fury-media-busy-lint.txt`. Bytes: 11. SHA-256: `050c69da23536758722729aeda55a8d0fb9d557495ef6d33d70873a3b64a71c1`.

```text
$ eslint .
```

## fury-media-busy-types

Original capture: `fury-media-busy-types.txt`. Bytes: 15. SHA-256: `8366207267355d3e3d5bf3bf6e8c94c5f93f6078c34f08973fa2b38cdda6cc92`.

```text
$ tsc --noEmit
```

## fury-media-cache-format

Original capture: `fury-media-cache-format.txt`. Bytes: 165. SHA-256: `85fbec00c3126fd96b3423ff823277f55d2d254a678749919f35daf7723bfd6a`.

```text
apps/web/src/features/content/hooks/use-progressive-chapter-images.ts 96ms (unchanged)
apps/web/src/features/content/components/ChapterContentRenderer.test.tsx 41ms
```

## fury-media-cache-scope

Original capture: `fury-media-cache-scope.txt`. Bytes: 313. SHA-256: `a44b580d0e3860f2d74abeab3a197d4db8130ea0bfa958a7b24ab77d948919cc`.

```text
$ vitest run --config vitest.config.ts src/features/content/components/ChapterContentRenderer.test.tsx

 RUN  v4.1.10 <repository>/apps/web


 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  17:39:49
   Duration  1.82s (transform 122ms, setup 157ms, import 278ms, tests 609ms, environment 636ms)

```

## fury-media-consumer-first

Original capture: `fury-media-consumer-first.txt`. Bytes: 426. SHA-256: `c457b82be14266e884b4bcc45df82c2f54828d86a0b6d4f23fececd2af9ba5b1`.

```text
$ vitest run --config vitest.config.ts src/features/media/components/AdminMediaCandidatePicker.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/hooks/media.hooks.test.tsx

 RUN  v4.1.10 <repository>/apps/web


 Test Files  3 passed (3)
      Tests  30 passed (30)
   Start at  16:57:36
   Duration  1.98s (transform 383ms, setup 642ms, import 636ms, tests 1.21s, environment 2.28s)

```

## fury-media-consumer-guard

Original capture: `fury-media-consumer-guard.txt`. Bytes: 380. SHA-256: `99638ea3feec1e2d6921e1beec24779c9f0fdc611995c8f910b3c723f27730bb`.

```text
$ vitest run --config vitest.config.ts src/features/media/components/AdminMediaCandidatePicker.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx

 RUN  v4.1.10 <repository>/apps/web


 Test Files  2 passed (2)
      Tests  12 passed (12)
   Start at  17:33:57
   Duration  1.49s (transform 232ms, setup 356ms, import 468ms, tests 448ms, environment 1.36s)

```

## fury-media-contracts-current-build

Original capture: `fury-media-contracts-current-build.txt`. Bytes: 91. SHA-256: `60db90306a18653493f746f621a014187be1d4a6c40f426deefe24c78040a4cb`.

```text
$ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
```

## fury-media-contracts

Original capture: `fury-media-contracts.txt`. Bytes: 259. SHA-256: `2b91a80be125eea574df2bd298e759eb92fda9f9b3449685411ac93a6163d84d`.

```text
$ vitest run --config vitest.config.ts

 RUN  v4.1.10 <repository>/packages/contracts


 Test Files  5 passed (5)
      Tests  117 passed (117)
   Start at  16:19:22
   Duration  760ms (transform 270ms, setup 0ms, import 1.03s, tests 199ms, environment 1ms)

```

## fury-media-current-format

Original capture: `fury-media-current-format.txt`. Bytes: 3570. SHA-256: `fc1f1c7e59af870ed1c8c78be60b3b6aa22775e405de5a2ffb18373ab8cd5094`.

```text
.specify/feature.json 10ms (unchanged)
.specify/memory/constitution.md 82ms (unchanged)
AGENTS.md 14ms (unchanged)
README.md 35ms (unchanged)
apps/api/src/content.integration.test.ts 289ms (unchanged)
apps/api/src/infrastructure/media/animated-image-validation.test.ts 21ms
apps/api/src/infrastructure/media/image-container.ts 11ms (unchanged)
apps/api/src/infrastructure/media/image-processor.ts 3ms (unchanged)
apps/api/src/infrastructure/media/image-validation.test.ts 11ms (unchanged)
apps/api/src/infrastructure/media/image-validation.ts 12ms
apps/api/src/infrastructure/media/media.errors.ts 3ms
apps/api/src/infrastructure/openapi/openapi.ts 43ms
apps/api/src/media.integration.test.ts 55ms
apps/api/src/modules/content/content.mapper.test.ts 13ms (unchanged)
apps/api/src/modules/content/content.mapper.ts 23ms (unchanged)
apps/api/src/modules/content/work-management.integration.test.ts 41ms (unchanged)
apps/api/src/modules/media/media.reconcile.integration.test.ts 18ms (unchanged)
apps/api/src/modules/media/media.service.integration.test.ts 36ms
apps/api/src/modules/media/media.service.ts 47ms (unchanged)
apps/api/src/router.ts 4ms (unchanged)
apps/api/src/test-support/animated-image.test-helper.ts 8ms (unchanged)
apps/web/src/features/admin/components/AdminChapterForm/AdminChapterForm.tsx 48ms (unchanged)
apps/web/src/features/admin/components/AdminChapterForm/ChapterPreviewModal.tsx 6ms
apps/web/src/features/admin/model/admin-chapter-editor.ts 7ms
apps/web/src/features/content/components/ChapterContentRenderer.test.tsx 18ms
apps/web/src/features/content/components/ChapterContentRenderer.tsx 5ms
apps/web/src/features/content/components/IllustratedChapterPages.tsx 9ms
apps/web/src/features/content/hooks/progressive-image-resources.test.ts 15ms
apps/web/src/features/content/hooks/progressive-image-resources.ts 12ms
apps/web/src/features/content/hooks/use-progressive-chapter-images.ts 6ms
apps/web/src/features/content/model/progressive-images.test.ts 7ms
apps/web/src/features/content/model/progressive-images.ts 5ms
apps/web/src/features/media/components/AdminMediaCandidatePicker.tsx 16ms
apps/web/src/features/media/hooks/media-image-display.ts 8ms
apps/web/src/features/media/hooks/media.hooks.ts 20ms
apps/web/src/features/media/hooks/use-media-preview-source.ts 4ms
apps/web/src/features/public-catalog/components/PublicWorkImage.tsx 11ms
apps/web/src/features/public-catalog/hooks/use-reduced-motion.ts 5ms (unchanged)
apps/web/src/shared/hooks/use-reduced-motion.ts 5ms
apps/web/src/styles/integration.css 42ms (unchanged)
docs/design/design-system.md 23ms (unchanged)
docs/engineering/README.md 23ms (unchanged)
docs/engineering/frontend-standard.md 81ms (unchanged)
docs/workflow/application-audit-prompt.md 4ms (unchanged)
docs/workflow/operating-policy.md 15ms (unchanged)
docs/workflow/prompts.md 6ms (unchanged)
packages/contracts/src/content/content.schema.ts 42ms (unchanged)
packages/contracts/src/index.ts 3ms (unchanged)
packages/contracts/src/media/media.schema.ts 11ms (unchanged)
specs/002-persistent-vps-media/contracts/media-http.md 20ms
specs/002-persistent-vps-media/evidence/media-foundation/before-narrow-slow.json 4ms
specs/002-persistent-vps-media/evidence/media-foundation/before-wide-cold-warm-corrected.json 3ms
specs/002-persistent-vps-media/implementation-evidence.md 58ms
specs/002-persistent-vps-media/plan.md 39ms
specs/002-persistent-vps-media/spec.md 47ms
specs/002-persistent-vps-media/tasks.md 47ms
specs/005-admin-chapter-publishing/plan.md 27ms
specs/006-public-catalog-discovery-seo/plan.md 42ms
```

## fury-media-final-api-motion

Original capture: `fury-media-final-api-motion.txt`. Bytes: 344. SHA-256: `46736cee8aa266703c2077b50673865a5f13e5c2829327f122fbe49df7532fa2`.

```text
Owned actual Express media API ready on loopback4315.
(node:34090) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
```

## fury-media-final-api-recovery

Original capture: `fury-media-final-api-recovery.txt`. Bytes: 54. SHA-256: `b02b37189b91fe62f57aebbaf5e4967493d4725f736726596ca006709081e3d1`.

```text
Owned actual Express media API ready on loopback4315.
```

## fury-media-final-api-slow

Original capture: `fury-media-final-api-slow.txt`. Bytes: 54. SHA-256: `b02b37189b91fe62f57aebbaf5e4967493d4725f736726596ca006709081e3d1`.

```text
Owned actual Express media API ready on loopback4315.
```

## fury-media-final-api-wide

Original capture: `fury-media-final-api-wide.txt`. Bytes: 344. SHA-256: `aa4dce518bac5431c2ed9e5ae715ccd81fec0ce6eeb947eb266e2481b3750b67`.

```text
Owned actual Express media API ready on loopback4315.
(node:32430) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
```

## fury-media-final-browser-cached-open

Original capture: `fury-media-final-browser-cached-open.txt`. Bytes: 444. SHA-256: `ce94148e420414c84af55ac11558d41ecc37a459170405bb38bcfe5088104c12`.

````text
### Browser `fury-media-foundation` opened with pid 33190.
### Ran Playwright code
```js
await page.goto('http://127.0.0.1:4316/auth/login');
```
### Page
- Page URL: http://127.0.0.1:4316/auth/login
- Page Title: تسجيل الدخول | Fury
- Console: 1 errors, 0 warnings
### Snapshot
- [Snapshot](.playwright-cli/page-2026-11-01T16-55-03-187Z.yml)
### Events
- New console entries: .playwright-cli/console-2026-11-01T16-55-01-864Z.log#L1
````

## fury-media-final-browser-close

Original capture: `fury-media-final-browser-close.txt`. Bytes: 40. SHA-256: `c39fa2da15fc9db4e493f247c536768a1d779ccb4da33555d759933b43346455`.

```text
Browser 'fury-media-foundation' closed

```

## fury-media-final-browser-open

Original capture: `fury-media-final-browser-open.txt`. Bytes: 0. SHA-256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

```text

```

## fury-media-final-doc-format

Original capture: `fury-media-final-doc-format.txt`. Bytes: 149. SHA-256: `535fb8817263a346ae2e5312c329c6925bd3264ed5a3f8ebe78e28b4440194d5`.

```text
specs/002-persistent-vps-media/evidence/media-foundation/README.md 77ms (unchanged)
apps/api/src/infrastructure/openapi/openapi.ts 134ms (unchanged)
```

## fury-media-final-lint

Original capture: `fury-media-final-lint.txt`. Bytes: 456. SHA-256: `07318b7395e057d67c46df05c6e57af13fbeb1df05e8297a8a5913d1606f930b`.

```text
$ eslint .

<repository>/apps/web/src/features/public-catalog/components/PublicWorkImage.tsx
  110:5  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

✖ 1 problem (0 errors, 1 warning)

```

## fury-media-final-motion-result

Original capture: `fury-media-final-motion-result.txt`. Bytes: 4694. SHA-256: `1c3440d9e9496a99ab5358416abc4c8946a91b6b63cb6fdbf39a27d510a856c6`.

```text
{"passed": true, "results": [{"reduced": false, "privateImages": [{"alt": "صفحة 2", "width": 600, "height": 800, "type": "image/webp", "distinctColors": 3, "samples": [{"ms": 48, "pngFingerprint": "4fea5fb3"}, {"ms": 167, "pngFingerprint": "4d3cd53c"}, {"ms": 280, "pngFingerprint": "de1ed9e6"}, {"ms": 400, "pngFingerprint": "de1ed9e6"}, {"ms": 517, "pngFingerprint": "4fea5fb3"}, {"ms": 631, "pngFingerprint": "4d3cd53c"}, {"ms": 750, "pngFingerprint": "de1ed9e6"}, {"ms": 862, "pngFingerprint": "4fea5fb3"}, {"ms": 981, "pngFingerprint": "4d3cd53c"}, {"ms": 1096, "pngFingerprint": "de1ed9e6"}]}, {"alt": "صفحة 6", "width": 600, "height": 800, "type": "image/webp", "distinctColors": 3, "samples": [{"ms": 31, "pngFingerprint": "84c1d623"}, {"ms": 150, "pngFingerprint": "b09fd76d"}, {"ms": 265, "pngFingerprint": "60e1eed"}, {"ms": 382, "pngFingerprint": "60e1eed"}, {"ms": 498, "pngFingerprint": "84c1d623"}, {"ms": 614, "pngFingerprint": "b09fd76d"}, {"ms": 732, "pngFingerprint": "60e1eed"}, {"ms": 850, "pngFingerprint": "60e1eed"}, {"ms": 968, "pngFingerprint": "b09fd76d"}, {"ms": 1082, "pngFingerprint": "b09fd76d"}]}], "publicImages": [{"alt": "", "width": 900, "height": 500, "type": "image/webp", "distinctColors": 3, "samples": [{"ms": 37, "pngFingerprint": "d5c13f75"}, {"ms": 154, "pngFingerprint": "affc7c54"}, {"ms": 273, "pngFingerprint": "17d6f7f2"}, {"ms": 390, "pngFingerprint": "17d6f7f2"}, {"ms": 505, "pngFingerprint": "affc7c54"}, {"ms": 623, "pngFingerprint": "17d6f7f2"}, {"ms": 739, "pngFingerprint": "17d6f7f2"}, {"ms": 858, "pngFingerprint": "d5c13f75"}, {"ms": 971, "pngFingerprint": "affc7c54"}, {"ms": 1089, "pngFingerprint": "17d6f7f2"}]}, {"alt": "Media Foundation عمل", "width": 600, "height": 800, "type": "image/webp", "distinctColors": 3, "samples": [{"ms": 40, "pngFingerprint": "60e1eed"}, {"ms": 160, "pngFingerprint": "b09fd76d"}, {"ms": 275, "pngFingerprint": "60e1eed"}, {"ms": 393, "pngFingerprint": "60e1eed"}, {"ms": 509, "pngFingerprint": "84c1d623"}, {"ms": 626, "pngFingerprint": "b09fd76d"}, {"ms": 741, "pngFingerprint": "60e1eed"}, {"ms": 859, "pngFingerprint": "60e1eed"}, {"ms": 974, "pngFingerprint": "b09fd76d"}, {"ms": 1093, "pngFingerprint": "b09fd76d"}]}]}, {"reduced": true, "privateImages": [{"alt": "صفحة 2", "width": 600, "height": 800, "type": "image/png", "distinctColors": 1, "samples": [{"ms": 52, "pngFingerprint": "4fea5fb3"}, {"ms": 162, "pngFingerprint": "4fea5fb3"}, {"ms": 281, "pngFingerprint": "4fea5fb3"}, {"ms": 396, "pngFingerprint": "4fea5fb3"}, {"ms": 515, "pngFingerprint": "4fea5fb3"}, {"ms": 637, "pngFingerprint": "4fea5fb3"}, {"ms": 748, "pngFingerprint": "4fea5fb3"}, {"ms": 867, "pngFingerprint": "4fea5fb3"}, {"ms": 980, "pngFingerprint": "4fea5fb3"}, {"ms": 1097, "pngFingerprint": "4fea5fb3"}]}, {"alt": "صفحة 6", "width": 600, "height": 800, "type": "image/png", "distinctColors": 1, "samples": [{"ms": 28, "pngFingerprint": "84c1d623"}, {"ms": 144, "pngFingerprint": "84c1d623"}, {"ms": 263, "pngFingerprint": "84c1d623"}, {"ms": 381, "pngFingerprint": "84c1d623"}, {"ms": 496, "pngFingerprint": "84c1d623"}, {"ms": 615, "pngFingerprint": "84c1d623"}, {"ms": 730, "pngFingerprint": "84c1d623"}, {"ms": 850, "pngFingerprint": "84c1d623"}, {"ms": 963, "pngFingerprint": "84c1d623"}, {"ms": 1079, "pngFingerprint": "84c1d623"}]}], "publicImages": [{"alt": "", "width": 900, "height": 500, "type": "image/png", "distinctColors": 1, "samples": [{"ms": 47, "pngFingerprint": "d5c13f75"}, {"ms": 161, "pngFingerprint": "d5c13f75"}, {"ms": 288, "pngFingerprint": "d5c13f75"}, {"ms": 435, "pngFingerprint": "d5c13f75"}, {"ms": 551, "pngFingerprint": "d5c13f75"}, {"ms": 679, "pngFingerprint": "d5c13f75"}, {"ms": 795, "pngFingerprint": "d5c13f75"}, {"ms": 915, "pngFingerprint": "d5c13f75"}, {"ms": 1032, "pngFingerprint": "d5c13f75"}, {"ms": 1149, "pngFingerprint": "d5c13f75"}]}, {"alt": "Media Foundation عمل", "width": 600, "height": 800, "type": "image/png", "distinctColors": 1, "samples": [{"ms": 57, "pngFingerprint": "84c1d623"}, {"ms": 173, "pngFingerprint": "84c1d623"}, {"ms": 290, "pngFingerprint": "84c1d623"}, {"ms": 434, "pngFingerprint": "84c1d623"}, {"ms": 561, "pngFingerprint": "84c1d623"}, {"ms": 672, "pngFingerprint": "84c1d623"}, {"ms": 791, "pngFingerprint": "84c1d623"}, {"ms": 905, "pngFingerprint": "84c1d623"}, {"ms": 1021, "pngFingerprint": "84c1d623"}, {"ms": 1141, "pngFingerprint": "84c1d623"}]}]}], "measurement": "Native production Chromium visible compositor crop screenshots, ten timed samples per displayed image; canvas drawImage uses a default still frame and is not animation evidence. Stored originals independently retain three WebP frames"}
```

## fury-media-final-recovery-result

Original capture: `fury-media-final-recovery-result.txt`. Bytes: 1469. SHA-256: `ceea11a691a782c9b6613c94e565f8a9a51335ef64ef3be214100d0d02c31b0e`.

```text
{"passed": true, "reportedConnection": {"saveData": true, "effectiveType": "4g", "source": "Controlled native EventTarget network-preference boundary, not a physical data-saver/device claim"}, "initialRequests": [1, 1, 2, 3, 4, 5], "afterJump": [1, 1, 2, 3, 4, 5, 25, 26, 24], "requests": [1, 1, 2, 3, 4, 5, 25, 26, 24, 27, 23, 28, 29, 5, 6, 4, 7, 3, 8, 11, 11, 25, 26, 24, 27, 23, 28, 1, 2, 3, 4, 5], "failed": [{"url": "54cd25f0-d2f1-4ea6-8620-043476e09ace/content", "failure": {"errorText": "net::ERR_ABORTED"}}, {"url": "8674ca88-fc03-4f3a-a9e0-9efd158f40af/content", "failure": {"errorText": "net::ERR_ABORTED"}}, {"url": "cdeb1a27-050f-45c4-bbd7-99f1734da809/content", "failure": {"errorText": "net::ERR_ABORTED"}}, {"url": "8af1ee40-ef2f-41c7-ad42-dcaa6c60932c/content", "failure": {"errorText": "net::ERR_ABORTED"}}], "actualExpressPrivateWrongActor": 404, "actualExpressAdminEndpointDenial": 403, "denialInjection": "Real USER content GET returns non-disclosing 404; real administrator Chapter endpoint returns403, replayed at controlled media transport boundary to verify global denial fencing", "individual503": "Controlled network fault then actual authenticated read retry", "deniedRecoveryJump": "Retry11 then immediate jump25 under250ms latency; explicit retry surface at25 recovered", "ownedUrlsAfterClose": 0, "scope": "Current draft to saved persisted preview; exact Chapter/account/unmount races also covered at real QueryClient/transport boundary"}
```

## fury-media-final-repair-format

Original capture: `fury-media-final-repair-format.txt`. Bytes: 504. SHA-256: `a7b487b6ddd840bed7b20f08cebbe79154f24d2a6c6052954d511c786b0c0e3d`.

```text
apps/web/src/features/content/hooks/progressive-image-resources.test.ts 143ms
apps/web/src/features/content/hooks/progressive-image-resources.ts 40ms (unchanged)
apps/web/src/features/content/hooks/use-progressive-chapter-images.ts 17ms
apps/web/src/features/content/components/ChapterContentRenderer.test.tsx 39ms
apps/web/src/features/content/components/IllustratedChapterPages.tsx 18ms
apps/web/src/features/media/hooks/media-image-display.ts 21ms
apps/web/src/shared/hooks/use-reduced-motion.ts 19ms
```

## fury-media-final-repair-lint-second

Original capture: `fury-media-final-repair-lint-second.txt`. Bytes: 456. SHA-256: `07318b7395e057d67c46df05c6e57af13fbeb1df05e8297a8a5913d1606f930b`.

```text
$ eslint .

<repository>/apps/web/src/features/public-catalog/components/PublicWorkImage.tsx
  110:5  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

✖ 1 problem (0 errors, 1 warning)

```

## fury-media-final-repair-lint

Original capture: `fury-media-final-repair-lint.txt`. Bytes: 2596. SHA-256: `28f3a373d61e90b4a6189a09fbf133eef8df150a55aaf394e335eef6b8d85941`.

```text
$ eslint .

<repository>/apps/web/src/features/content/components/ChapterContentRenderer.test.tsx
  150:5   error  Unexpected `await` of a non-Promise (non-"Thenable") value                                              @typescript-eslint/await-thenable
  150:11  error  Placing a void expression inside another expression is forbidden. Move it to its own statement instead  @typescript-eslint/no-confusing-void-expression
  154:5   error  Unexpected `await` of a non-Promise (non-"Thenable") value                                              @typescript-eslint/await-thenable
  154:11  error  Placing a void expression inside another expression is forbidden. Move it to its own statement instead  @typescript-eslint/no-confusing-void-expression
  160:5   error  Unexpected `await` of a non-Promise (non-"Thenable") value                                              @typescript-eslint/await-thenable
  160:11  error  Placing a void expression inside another expression is forbidden. Move it to its own statement instead  @typescript-eslint/no-confusing-void-expression
  166:5   error  Unexpected `await` of a non-Promise (non-"Thenable") value                                              @typescript-eslint/await-thenable
  166:11  error  Placing a void expression inside another expression is forbidden. Move it to its own statement instead  @typescript-eslint/no-confusing-void-expression
  197:5   error  Unexpected `await` of a non-Promise (non-"Thenable") value                                              @typescript-eslint/await-thenable
  197:11  error  Placing a void expression inside another expression is forbidden. Move it to its own statement instead  @typescript-eslint/no-confusing-void-expression
  203:5   error  Unexpected `await` of a non-Promise (non-"Thenable") value                                              @typescript-eslint/await-thenable
  203:11  error  Placing a void expression inside another expression is forbidden. Move it to its own statement instead  @typescript-eslint/no-confusing-void-expression

<repository>/apps/web/src/features/public-catalog/components/PublicWorkImage.tsx
  110:5  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

✖ 13 problems (12 errors, 1 warning)

<repository>/apps/web:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/web@0.1.0 lint: `eslint .`
Exit status 1
```

## fury-media-final-route-smoke

Original capture: `fury-media-final-route-smoke.txt`. Bytes: 1051. SHA-256: `1f1351facc86e1ac3b387b8ac1f00624b435d6050c23b08e0cec15eb6d6b7e22`.

```text
$ node scripts/check-web-routes.mjs http://127.0.0.1:4316 media-foundation
PASS /dashboard
PASS /library
PASS /settings
PASS /admin/ads
PASS /admin/categories
PASS /admin/comments
PASS /admin/contact/msg-1
PASS /admin/contact
PASS /admin/dashboard
PASS /admin/gifts/grants
PASS /admin/gifts
PASS /admin
PASS /admin/reports
PASS /admin/users/user-1
PASS /admin/users
PASS /admin/works/trait-hoarder/chapters/th-43/edit
PASS /admin/works/trait-hoarder/chapters/new
PASS /admin/works/trait-hoarder/chapters
PASS /admin/works/trait-hoarder/edit
PASS /admin/works/new
PASS /admin/works
PASS /auth/forgot-password
PASS /auth/login
PASS /auth/register
PASS /auth/reset-password
PASS /auth/verify-email
PASS /categories
PASS /contact
PASS /copyright
PASS /discover
PASS /
PASS /privacy
PASS /report-issue
PASS /stories
PASS /story/media-foundation/chapter/1
PASS /story/media-foundation
PASS /terms
PASS /story/trait-hoarder/chapter/43
PASS /story/1/chapter/1
PASS /story/1/chapter/2
Verified 40 existing routes and the 404 fallback at http://127.0.0.1:4316.
```

## fury-media-final-slow-result

Original capture: `fury-media-final-slow-result.txt`. Bytes: 1725. SHA-256: `5d24c8a60ab920d57c54a16de4b632b1a4229251d5b857a3fba4fd883d857236`.

```text
{"passed": true, "version": "after", "cdpMax": 2, "cdpEvents": [{"id": "33536.319", "index": 1, "kind": "start", "time": 289082.693366}, {"id": "33536.351", "index": 2, "kind": "start", "time": 289085.496765}, {"id": "33536.352", "index": 3, "kind": "start", "time": 289085.496969}, {"id": "33536.319", "kind": "finish", "time": 289085.492591}, {"id": "33536.351", "kind": "finish", "time": 289085.583317}, {"id": "33536.352", "kind": "finish", "time": 289085.583344}], "cdpScope": "GET content only; CORS preflight excluded", "viewport": 320, "profile": {"slow": true, "latencyMs": 150, "downloadBytesPerSecond": 196608}, "persistedPages": 30, "firstUsefulMs": 2854, "encodedDataBytesBeforeUseful": 375161, "initialRequests": [1, 2, 3], "initialWindowRequests": [1, 2, 3], "initialPreparedMs": 2891, "maxApplicationOutstandingContentRequests": 3, "requests": [{"index": 1, "startedMs": 47}, {"index": 2, "startedMs": 2851}, {"index": 3, "startedMs": 2851}], "boundaries": [], "resources": {"base": {"active": 0, "bytes": 0, "maximum": 0, "maxBytes": 0}, "firstReady": {"active": 1, "bytes": 375161, "maximum": 1, "maxBytes": 375161}, "atEnd": {"active": 1, "bytes": 375161, "maximum": 1, "maxBytes": 375161}, "afterClose": {"active": 0, "bytes": 0, "maximum": 1, "maxBytes": 375161}}, "layout": {"width": 320, "scrollWidth": 320, "initialFirstPageHeight": 317.328125, "readyFirstPageHeight": 317.328125, "shifts": []}, "heap": {"usedSize": 20159224, "totalSize": 35373056, "limit": "JavaScript heap only; excludes native decoder/GPU animation memory"}, "measurement": "One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence"}
```

## fury-media-final-types

Original capture: `fury-media-final-types.txt`. Bytes: 15. SHA-256: `8366207267355d3e3d5bf3bf6e8c94c5f93f6078c34f08973fa2b38cdda6cc92`.

```text
$ tsc --noEmit
```

## fury-media-final-verify

Original capture: `fury-media-final-verify.txt`. Bytes: 33504. SHA-256: `70f1407ce5a6c63246db4469e4263a874dd75a42d653d45f05cd1a89ab1c4a90`.

```text
$ pnpm db:format && pnpm db:validate && pnpm db:generate && pnpm format:check && pnpm lint && pnpm check-types && pnpm test && pnpm test:integration && pnpm build && pnpm verify:build-output && git diff --check
$ pnpm --filter @fury/database db:format
$ prisma format
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
Formatted prisma/schema.prisma in 25ms 🚀
$ pnpm --filter @fury/database db:validate
$ prisma validate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
The schema at prisma/schema.prisma is valid 🚀
$ pnpm --filter @fury/database db:generate
$ prisma generate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.

✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 115ms

$ prettier --check "**/*.{ts,tsx,js,jsx,mjs,cjs,json,md,mdx,yml,yaml,css}"
Checking formatting...
All matched files use Prettier code style!
$ turbo run lint
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running lint in 7 packages
   • Remote caching disabled

@fury/contracts:lint: cache hit, replaying logs 21a414aa92aa86c4
@fury/contracts:lint: $ eslint .
@fury/web:lint: cache miss, executing bdd729793ead4d7d
@fury/database:lint: cache hit, replaying logs 0a545f6444ff982f
@fury/database:lint: $ eslint .
@fury/api:lint: cache hit, replaying logs 12e374fb6c90dd4a
@fury/api:lint: $ eslint .
@fury/web:lint: $ eslint .
@fury/web:lint:
@fury/web:lint: <repository>/apps/web/src/features/public-catalog/components/PublicWorkImage.tsx
@fury/web:lint:   110:5  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
@fury/web:lint:
@fury/web:lint: ✖ 1 problem (0 errors, 1 warning)
@fury/web:lint:

 Tasks:    4 successful, 4 total
Cached:    3 cached, 4 total
  Time:    25.192s

$ turbo run check-types
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running check-types in 7 packages
   • Remote caching disabled

@fury/contracts:check-types: cache miss, executing 5c7aa48e0640518b
@fury/contracts:check-types: $ tsc --noEmit
@fury/web:check-types: cache miss, executing 44c100557eebe29f
@fury/database:check-types: cache miss, executing 1ac1d9d476e21975
@fury/database:check-types: $ pnpm db:generate && tsc --noEmit
@fury/web:check-types: $ tsc --noEmit
@fury/database:check-types: $ prisma generate
@fury/database:check-types: Loaded Prisma config from prisma.config.ts.
@fury/database:check-types:
@fury/database:check-types: Prisma schema loaded from prisma/schema.prisma.
@fury/database:check-types:
@fury/database:check-types: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 109ms
@fury/database:check-types:
@fury/api:check-types: cache miss, executing db8470fcb0802979
@fury/api:check-types: $ tsc --noEmit

 Tasks:    4 successful, 4 total
Cached:    0 cached, 4 total
  Time:    7.072s

$ turbo run test
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running test in 7 packages
   • Remote caching disabled

@fury/contracts:test: cache miss, executing 067936a0fd67b810
@fury/contracts:build: cache miss, executing 5b03c3872de6a790
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/contracts:test: $ vitest run --config vitest.config.ts
@fury/contracts:test:
@fury/contracts:test:  RUN  v4.1.10 <repository>/packages/contracts
@fury/contracts:test:
@fury/contracts:test:  ✓ src/auth/auth.schema.test.ts (3 tests) 6ms
@fury/contracts:test:  ✓ src/account/account.schema.test.ts (2 tests) 6ms
@fury/contracts:test:  ✓ src/http/http.schema.test.ts (13 tests) 11ms
@fury/contracts:test:  ✓ src/media/media.schema.test.ts (12 tests) 18ms
@fury/contracts:test:  ✓ src/content/content.schema.test.ts (87 tests) 52ms
@fury/contracts:test:
@fury/contracts:test:  Test Files  5 passed (5)
@fury/contracts:test:       Tests  117 passed (117)
@fury/contracts:test:    Start at  18:40:38
@fury/contracts:test:    Duration  368ms (transform 369ms, setup 0ms, import 746ms, tests 92ms, environment 0ms)
@fury/contracts:test:
@fury/database:build: cache miss, executing 6b5dc07d9f8fe644
@fury/web:test: cache miss, executing 79df221e040f609b
@fury/database:test: cache miss, executing 91e75f88ef82d874
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/web:test: $ vitest run --config vitest.config.ts
@fury/database:test: $ vitest run --config vitest.config.ts
@fury/database:test:
@fury/database:test:  RUN  v4.1.10 <repository>/packages/database
@fury/database:test:
@fury/web:test:
@fury/web:test:  RUN  v4.1.10 <repository>/apps/web
@fury/web:test:
@fury/database:build: $ prisma generate
@fury/database:test:  ✓ tests/schema-contract.test.ts (3 tests) 5ms
@fury/database:test:  ✓ tests/seed-config.test.ts (7 tests) 203ms
@fury/database:test:
@fury/database:test:  Test Files  2 passed (2)
@fury/database:test:       Tests  10 passed (10)
@fury/database:test:    Start at  18:40:39
@fury/database:test:    Duration  963ms (transform 468ms, setup 0ms, import 686ms, tests 208ms, environment 0ms)
@fury/database:test:
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 199ms
@fury/database:build:
@fury/web:test:  ✓ src/features/public-catalog/components/PublicWorkImage.test.tsx (5 tests) 362ms
@fury/web:test: stderr | src/features/admin/components/AdminGifts/AdminGifts.test.tsx > AdminGifts Component > renders gifts catalog header, stat cards, and gift cards
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/media/components/AdminMediaCandidatePicker.test.tsx (7 tests) 495ms
@fury/web:test:  ✓ src/features/content/components/ChapterContentRenderer.test.tsx (6 tests) 847ms
@fury/web:test:      ✓ renders ordered private images as each arrives, reserves geometry, and retains retry focus after a decode failure  454ms
@fury/web:test:  ✓ src/features/content/hooks/progressive-image-resources.test.ts (7 tests) 1275ms
@fury/web:test:      ✓ loads visible first, bounds background work, deduplicates observer events and extends before the boundary  550ms
@fury/web:test:  ✓ src/features/admin/components/AdminGifts/AdminGifts.test.tsx (6 tests) 1412ms
@fury/web:test:      ✓ opens create gift dialog and creates a new gift design  483ms
@fury/web:test:  ✓ src/features/public-catalog/hooks/public-catalog.hooks.test.tsx (17 tests) 1649ms
@fury/web:test:  ✓ src/features/admin/components/AdminCategories/AdminCategories.test.tsx (12 tests) 2002ms
@fury/web:test:      ✓ changes pages through the server query and supports Escape focus return  409ms
@fury/web:test: stderr | src/features/admin/components/AdminUsers/AdminUsers.test.tsx > AdminUsers Component > renders users list header, stat cards, and table
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/admin/components/AdminChapterForm/AdminChapterForm.test.tsx (19 tests) 2514ms
@fury/api:test: cache miss, executing a32400403bce1d76
@fury/web:test:  ✓ src/features/admin/components/AdminUsers/AdminUsers.test.tsx (7 tests) 1029ms
@fury/web:test:      ✓ renders users list header, stat cards, and table  369ms
@fury/web:test:  ✓ src/features/library/components/LibraryScreen/LibraryScreen.test.tsx (6 tests) 952ms
@fury/web:test:      ✓ filters saved works by type and title without losing the library  318ms
@fury/web:test:  ✓ src/features/admin/components/AdminLayout/AdminLayout.test.tsx (4 tests) 706ms
@fury/web:test:      ✓ renders the FURY brand and navigation groups with correct active state  479ms
@fury/api:test: $ vitest run --config vitest.config.ts
@fury/web:test:  ✓ src/features/admin/components/AdminComments/AdminComments.test.tsx (6 tests) 900ms
@fury/api:test:
@fury/api:test:  RUN  v4.1.10 <repository>/apps/api
@fury/api:test:
@fury/web:test:  ✓ src/features/home/components/public-home.test.tsx (6 tests) 773ms
@fury/web:test:      ✓ uses saved featured order and category shortcuts without an active reader or scores  493ms
@fury/api:test:  ✓ src/core/config/media.config.test.ts (2 tests) 7ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorks/AdminWorks.test.tsx (8 tests) 1237ms
@fury/api:test:  ✓ src/infrastructure/media/media-storage.test.ts (4 tests) 59ms
@fury/api:test:  ✓ src/infrastructure/media/media-read-integrity.test.ts (5 tests) 67ms
@fury/api:test:  ✓ src/infrastructure/security/password-hasher.test.ts (1 test) 22ms
@fury/api:test:  ✓ src/infrastructure/email/email-delivery.test.ts (8 tests) 41ms
@fury/api:test:  ✓ src/infrastructure/media/image-validation.test.ts (10 tests) 400ms
@fury/web:test:  ✓ src/features/admin/hooks/admin-content.hooks.test.tsx (29 tests) 973ms
@fury/api:test:  ✓ src/modules/auth/auth.service.test.ts (6 tests) 55ms
@fury/api:test:  ✓ src/middlewares/error-handler.middleware.test.ts (2 tests) 62ms
@fury/api:test:  ✓ src/modules/content/content.rules.test.ts (16 tests) 12ms
@fury/api:test:  ✓ src/middlewares/validation.middleware.test.ts (2 tests) 11ms
@fury/api:test:  ✓ src/modules/media/media.multipart.test.ts (1 test) 15ms
@fury/api:test:  ✓ src/core/serialization/decimal.test.ts (4 tests) 5ms
@fury/api:test:  ✓ src/infrastructure/database/prisma-error.mapper.test.ts (23 tests) 10ms
@fury/web:test:  ✓ src/features/admin/components/AdminChapters/AdminChapters.test.tsx (9 tests) 2045ms
@fury/web:test:      ✓ shows loading without fixture rows or a false empty state  458ms
@fury/web:test:      ✓ keeps confirmation busy and prevents dismissal while publication is unresolved  315ms
@fury/web:test:      ✓ refuses an action when the selected Chapter version has changed  338ms
@fury/api:test:  ✓ src/infrastructure/security/jwt-tokens.test.ts (2 tests) 15ms
@fury/api:test:  ✓ src/modules/content/content.mapper.test.ts (7 tests) 11ms
@fury/api:test:  ✓ src/middlewares/csrf.middleware.test.ts (3 tests) 8ms
@fury/api:test:  ✓ src/core/pagination/pagination.test.ts (8 tests) 43ms
@fury/api:test:  ✓ src/infrastructure/logger/request-sanitizer.test.ts (19 tests) 8ms
@fury/web:test:  ✓ src/features/media/hooks/media.hooks.test.tsx (18 tests) 913ms
@fury/api:test:  ✓ src/modules/auth/auth.controller.test.ts (3 tests) 6ms
@fury/api:test:  ✓ src/core/date-only.test.ts (3 tests) 7ms
@fury/api:test:  ✓ src/infrastructure/logger/logger.test.ts (2 tests) 6ms
@fury/api:test:  ✓ src/middlewares/authorization.middleware.test.ts (3 tests) 5ms
@fury/api:test:  ✓ src/infrastructure/security/token-hasher.test.ts (1 test) 3ms
@fury/api:test:  ✓ src/infrastructure/email/email.service.test.ts (2 tests) 3ms
@fury/api:test:  ✓ src/modules/media/media.mapper.test.ts (1 test) 5ms
@fury/web:test:  ✓ src/features/story/components/CommentsSection/CommentsSection.test.tsx (6 tests) 1035ms
@fury/web:test:      ✓ offers flat comment actions without reply controls  564ms
@fury/web:test:  ✓ src/features/admin/components/AdminReports/AdminReports.test.tsx (6 tests) 1669ms
@fury/web:test:      ✓ renders reports metrics, controls, and report rows  662ms
@fury/web:test:      ✓ opens details modal, allows starting review, and closing  413ms
@fury/web:test: stderr | src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx > AdminUserDetail Component > renders user information without obsolete account balances
@fury/web:test: Received `true` for a non-boolean attribute `fill`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: fill="true" or fill={value.toString()}.
@fury/web:test: Received `true` for a non-boolean attribute `unoptimized`.
@fury/web:test:
@fury/web:test: If you want to write it to the DOM, pass a string instead: unoptimized="true" or unoptimized={value.toString()}.
@fury/web:test:
@fury/web:test:  ✓ src/features/admin/components/AdminUserDetail/AdminUserDetail.test.tsx (4 tests) 667ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorkForm/AdminWorkForm.test.tsx (33 tests) 7185ms
@fury/web:test:      ✓ checks an unknown edit acknowledgement before allowing another save  422ms
@fury/web:test:      ✓ reports the server state after an ambiguous unpublish instead of claiming success  377ms
@fury/web:test:      ✓ keeps local input after a 404 then explicit same-ID POST 409 without claiming success  542ms
@fury/web:test:      ✓ keeps the original UUID and blocks a third POST after 404, 409, and another 404  684ms
@fury/web:test:      ✓ preserves a post-submit edit until server adoption, then accepts a later refresh  880ms
@fury/web:test:      ✓ does not erase newer draft input when an ambiguous create readback matches the submitted version  404ms
@fury/api:test:  ✓ src/infrastructure/openapi/openapi.test.ts (16 tests) 2332ms
@fury/api:test:      ✓ documents the bounded administrative Work list query and summary  314ms
@fury/web:test:  ✓ src/features/admin/components/AdminGiftGrants/AdminGiftGrants.test.tsx (4 tests) 798ms
@fury/web:test:  ✓ src/features/text-stories/components/TextChapterReader/TextChapterReader.test.tsx (8 tests) 431ms
@fury/web:test:  ✓ src/features/public-catalog/components/PublicCatalogListing.test.tsx (5 tests) 618ms
@fury/api:test:  ✓ src/infrastructure/media/animated-image-validation.test.ts (10 tests) 3652ms
@fury/api:test:      ✓ preserves GIF/WebP animation for work_cover  860ms
@fury/api:test:      ✓ preserves GIF/WebP animation for work_background  613ms
@fury/api:test:      ✓ preserves GIF/WebP animation for chapter_page  460ms
@fury/api:test:      ✓ rejects excess frames and aggregate decoded work before canonical output  1479ms
@fury/api:test:
@fury/api:test:  Test Files  27 passed (27)
@fury/api:test:       Tests  164 passed (164)
@fury/api:test:    Start at  18:40:46
@fury/api:test:    Duration  4.55s (transform 4.40s, setup 578ms, import 9.86s, tests 6.87s, environment 3ms)
@fury/api:test:
@fury/web:test:  ✓ src/features/workspace/components/DashboardOverview/DashboardOverview.test.tsx (2 tests) 591ms
@fury/web:test:      ✓ renders the real session identity with fixture product summaries and valid links  425ms
@fury/web:test:  ✓ src/features/admin/components/AdminContactDetail/AdminContactDetail.test.tsx (4 tests) 423ms
@fury/web:test:      ✓ renders message details, sender info, and action panels  312ms
@fury/web:test:  ✓ src/features/account/components/AppearanceSettings/AppearanceSettings.test.tsx (2 tests) 402ms
@fury/web:test:      ✓ selects one avatar frame or no frame and keeps revoked gifts unavailable  304ms
@fury/web:test:  ✓ src/features/text-stories/components/TextWorkDetails/TextWorkDetails.test.tsx (5 tests) 543ms
@fury/web:test:  ✓ src/features/text-stories/model/catalog.test.tsx (2 tests) 428ms
@fury/web:test:      ✓ restricts type choices to text and preserves saved/unknown category and search  313ms
@fury/web:test:  ✓ src/features/public-catalog/hooks/use-public-work-metadata.test.tsx (9 tests) 618ms
@fury/web:test:  ✓ src/features/home/components/navigation-links.test.tsx (3 tests) 362ms
@fury/web:test:  ✓ src/features/admin/components/AdminAds/AdminAds.test.tsx (4 tests) 341ms
@fury/web:test:  ✓ src/features/legal/components/TermsPage/TermsPage.test.tsx (1 test) 295ms
@fury/web:test:  ✓ src/features/story/routing.test.tsx (5 tests) 332ms
@fury/web:test:  ✓ src/features/admin/components/AdminContact/AdminContact.test.tsx (6 tests) 340ms
@fury/web:test:  ✓ src/components/ui/MangaCard/MangaCard.test.tsx (1 test) 249ms
@fury/web:test:  ✓ src/features/users/components/profile-form.test.tsx (1 test) 214ms
@fury/web:test:  ✓ src/features/account/components/AvatarPicker/AvatarPicker.test.tsx (5 tests) 402ms
@fury/web:test:  ✓ src/features/admin/hooks/admin-chapter.hooks.test.tsx (13 tests) 606ms
@fury/web:test:  ✓ src/features/admin/components/AdminDashboard/AdminDashboard.test.tsx (3 tests) 480ms
@fury/web:test:      ✓ labels the four remaining summary cards as demo data  379ms
@fury/web:test:  ✓ src/features/categories/components/CategoriesDirectory/CategoriesDirectory.test.tsx (2 tests) 451ms
@fury/web:test:      ✓ keeps server order and immutable discovery links without invented descriptions  372ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell.test.tsx (3 tests) 239ms
@fury/web:test:  ✓ src/features/support/components/support-forms.test.tsx (2 tests) 399ms
@fury/web:test:      ✓ shows field-level contact validation then states the request was not delivered  326ms
@fury/web:test:  ✓ src/features/public-catalog/components/PublicWorkNotFound.test.tsx (5 tests) 461ms
@fury/web:test:  ✓ src/features/legal/components/CopyrightPage/CopyrightPage.test.tsx (1 test) 454ms
@fury/web:test:      ✓ renders heading structure, approval notice, takedown checklist, and submission link  452ms
@fury/web:test:  ✓ src/features/account/components/SettingsScreen/SettingsScreen.test.tsx (2 tests) 230ms
@fury/web:test:  ✓ src/features/legal/components/PrivacyPolicyPage/PrivacyPolicyPage.test.tsx (1 test) 341ms
@fury/web:test:      ✓ renders a complete heading structure, approval boundary, and internal section links  340ms
@fury/web:test:  ✓ src/features/auth/components/login-form.test.tsx (1 test) 210ms
@fury/web:test:  ✓ src/components/workspace/workspace-shell-navigation.test.tsx (4 tests) 294ms
@fury/web:test:  ✓ src/app/story/[id]/chapter/[chapterId]/page.test.tsx (5 tests) 163ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-dialog-focus.test.tsx (1 test) 130ms
@fury/web:test:  ✓ src/features/admin/components/AdminConfirmDialog/AdminConfirmDialog.test.tsx (1 test) 173ms
@fury/web:test:  ✓ src/components/auth/routes.test.tsx (8 tests) 170ms
@fury/web:test:  ✓ src/features/admin/components/AdminWorkEdit/AdminWorkEdit.test.tsx (5 tests) 197ms
@fury/web:test:  ✓ src/features/account/components/session-controls.test.tsx (4 tests) 200ms
@fury/web:test:  ✓ src/features/public-catalog/components/PublicCatalogState.test.tsx (6 tests) 287ms
@fury/web:test:  ✓ src/features/admin/context/admin-context.test.tsx (2 tests) 209ms
@fury/web:test:  ✓ src/features/auth/hooks/auth.hooks.test.tsx (22 tests) 37ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.api.test.ts (8 tests) 42ms
@fury/web:test:  ✓ src/features/auth/components/register-form.test.tsx (1 test) 45ms
@fury/web:test:  ✓ src/app/seo.test.ts (4 tests) 13ms
@fury/web:test:  ✓ src/services/api/api-client.test.ts (39 tests) 104ms
@fury/web:test: Not implemented: navigation to another Document
@fury/web:test:  ✓ src/features/admin/api/admin-chapter.api.test.ts (7 tests) 44ms
@fury/web:test:  ✓ src/features/public-catalog/api/public-catalog.server.test.ts (4 tests) 25ms
@fury/web:test:  ✓ src/config/server-environment.test.ts (15 tests) 12ms
@fury/web:test:  ✓ src/features/admin/api/admin-content.api.test.ts (9 tests) 75ms
@fury/web:test:  ✓ src/features/advertising/components/AdvertisementSlot/AdvertisementSlot.test.tsx (3 tests) 32ms
@fury/web:test:  ✓ src/features/admin/hooks/use-admin-pagination.test.tsx (2 tests) 16ms
@fury/web:test:  ✓ src/features/users/hooks/users.hooks.test.tsx (1 test) 18ms
@fury/web:test:  ✓ src/features/media/api/media.api.test.ts (5 tests) 42ms
@fury/web:test:  ✓ src/features/public-catalog/model/catalog-query.test.ts (10 tests) 10ms
@fury/web:test:  ✓ src/features/discover/model/catalog.test.ts (2 tests) 7ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-editor.test.ts (2 tests) 7ms
@fury/web:test:  ✓ src/features/admin/model/admin-work-editor.test.ts (11 tests) 10ms
@fury/web:test:  ✓ src/features/admin/model/admin-chapter-text.test.ts (2 tests) 37ms
@fury/web:test:  ✓ src/features/auth/utils/safe-return-path.test.ts (11 tests) 10ms
@fury/web:test:  ✓ src/shared/query/query-client.test.ts (2 tests) 4ms
@fury/web:test:  ✓ src/shared/forms/form.test.ts (1 test) 4ms
@fury/web:test:  ✓ src/features/admin/model/admin-content.errors.test.ts (2 tests) 3ms
@fury/web:test:  ✓ src/features/content/model/progressive-images.test.ts (3 tests) 5ms
@fury/web:test:  ✓ src/components/auth/route-state.test.ts (4 tests) 3ms
@fury/web:test:  ✓ src/features/admin/types/admin.types.test.ts (1 test) 2ms
@fury/web:test:
@fury/web:test:  Test Files  82 passed (82)
@fury/web:test:       Tests  528 passed (528)
@fury/web:test:    Start at  18:40:39
@fury/web:test:    Duration  19.86s (transform 6.71s, setup 20.29s, import 22.56s, tests 44.33s, environment 73.98s)
@fury/web:test:

 Tasks:    6 successful, 6 total
Cached:    0 cached, 6 total
  Time:    22.457s

$ turbo run test:integration
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running test:integration in 7 packages
   • Remote caching disabled

@fury/contracts:build: cache hit, replaying logs 5b03c3872de6a790
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:test:integration: cache bypass, force executing a98e62c55ce87211
@fury/database:build: cache hit, replaying logs 6b5dc07d9f8fe644
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 199ms
@fury/database:build:
@fury/api:test:integration: cache bypass, force executing d2b2f5b45a7978a6
@fury/api:test:integration: $ vitest run --config vitest.integration.config.ts
@fury/database:test:integration: $ vitest run --config vitest.integration.config.ts
@fury/api:test:integration:
@fury/api:test:integration:  RUN  v4.1.10 <repository>/apps/api
@fury/api:test:integration:
@fury/database:test:integration:
@fury/database:test:integration:  RUN  v4.1.10 <repository>/packages/database
@fury/database:test:integration:
@fury/api:test:integration: (node:31184) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
@fury/api:test:integration: (Use `node --trace-deprecation ...` to show where the warning was created)
@fury/api:test:integration:  ✓ src/modules/content/public-content.integration.test.ts (24 tests) 5742ms
@fury/api:test:integration:      ✓ enforces every parent and Chapter visibility-state combination  362ms
@fury/api:test:integration:      ✓ keeps deterministic publication/title ties, distinct bounded pages and truthful overruns  379ms
@fury/api:test:integration:      ✓ builds bounded saved-order home sections and the first three populated suggestion tabs  305ms
@fury/api:test:integration:      ✓ projects optional detail, enabled saved categories/tags, full-set chapter boundaries and similar Works  483ms
@fury/api:test:integration:      ✓ exports all eligible canonical slugs across bounded batches without private IDs or writes  2167ms
@fury/api:test:integration:  ✓ src/modules/media/media.service.integration.test.ts (16 tests) 2402ms
@fury/api:test:integration:      ✓ has one concurrent reference winner (animated=true)  330ms
@fury/api:test:integration:      ✓ rolls back parent/reference changes (animated=true)  494ms
@fury/database:test:integration:  ✓ tests/integration/migration.integration.test.ts (6 tests) 13530ms
@fury/database:test:integration:      ✓ cascades refresh records and deploys idempotently  1061ms
@fury/database:test:integration:      ✓ retires legacy phone after a populated P01 upgrade without losing account or session data  12323ms
@fury/api:test:integration:  ✓ src/content.integration.test.ts (37 tests) 5720ms
@fury/api:test:integration:      ✓ serves strict detail and optional background bytes without private data or stale visibility  358ms
@fury/api:test:integration:      ✓ keeps every management family server-authoritative before lookup  570ms
@fury/api:test:integration:      ✓ returns the central rate-limit envelope with request identity  762ms
@fury/api:test:integration:      ✓ serves scoped Chapter summaries with validated filters and bounded pages  361ms
@fury/api:test:integration:      ✓ publishes allowlisted metadata credential-free and hides it identically  375ms
@fury/api:test:integration:  ✓ src/media.integration.test.ts (15 tests) 3126ms
@fury/api:test:integration:      ✓ preserves canonical frames through replay, storage and fresh private HTTP instances  1207ms
@fury/api:test:integration:  ✓ src/modules/content/work-management.integration.test.ts (16 tests) 3605ms
@fury/api:test:integration:      ✓ filters saved Works and counts chapters with stable database pages  449ms
@fury/api:test:integration:      ✓ rejects direct retirement of a published cover and advances the parent on replacement  838ms
@fury/api:test:integration:      ✓ rejects a competing published featured position without creating the losing Work  374ms
@fury/api:test:integration:      ✓ rolls back early editorial and cover writes when a combined PATCH loses featured placement  372ms
@fury/api:test:integration:      ✓ persists both Work types, all editorial values, enabled categories, featured preference, tags, and media history  442ms
@fury/api:test:integration:  ✓ src/modules/content/content-management.integration.test.ts (18 tests) 1212ms
@fury/api:test:integration:  ✓ src/modules/content/category-management.integration.test.ts (9 tests) 553ms
@fury/api:test:integration:  ✓ src/modules/media/media.reconcile.integration.test.ts (5 tests) 4330ms
@fury/api:test:integration:      ✓ reconciles complete and interrupted staged uploads (animated=true)  3933ms
@fury/api:test:integration:  ✓ src/app.integration.test.ts (14 tests) 320ms
@fury/api:test:integration:  ✓ src/modules/content/publication-management.integration.test.ts (4 tests) 244ms
@fury/api:test:integration:  ✓ src/modules/auth/auth.service.integration.test.ts (6 tests) 120ms
@fury/api:test:integration:
@fury/api:test:integration:  Test Files  11 passed (11)
@fury/api:test:integration:       Tests  164 passed (164)
@fury/api:test:integration:    Start at  18:41:00
@fury/api:test:integration:    Duration  36.15s (transform 778ms, setup 32ms, import 1.27s, tests 27.38s, environment 0ms)
@fury/api:test:integration:
@fury/database:test:integration:  ✓ tests/integration/chapter-upgrade.integration.test.ts (2 tests) 18885ms
@fury/database:test:integration:      ✓ preserves populated P01–P03 rows through failed, recovered, and repeated expand deploys  18872ms
@fury/database:test:integration:  ✓ tests/integration/content-domain.integration.test.ts (22 tests) 935ms
@fury/database:test:integration:  ✓ tests/integration/media-domain.integration.test.ts (5 tests) 172ms
@fury/database:test:integration:  ✓ tests/integration/media-recovery.integration.test.ts (1 test) 11ms
@fury/database:test:integration:
@fury/database:test:integration:  Test Files  5 passed (5)
@fury/database:test:integration:       Tests  36 passed (36)
@fury/database:test:integration:    Start at  18:41:00
@fury/database:test:integration:    Duration  41.13s (transform 95ms, setup 0ms, import 145ms, tests 33.53s, environment 0ms)
@fury/database:test:integration:

 Tasks:    4 successful, 4 total
Cached:    2 cached, 4 total
  Time:    42.137s

$ turbo run build
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running build in 7 packages
   • Remote caching disabled

@fury/contracts:build: cache hit, replaying logs 5b03c3872de6a790
@fury/contracts:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/web:build: cache miss, executing e319c67bd0e1dcd5
@fury/database:build: cache hit, replaying logs 6b5dc07d9f8fe644
@fury/database:build: $ pnpm db:generate && rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo && tsc -p tsconfig.build.json
@fury/database:build: $ prisma generate
@fury/database:build: Loaded Prisma config from prisma.config.ts.
@fury/database:build:
@fury/database:build: Prisma schema loaded from prisma/schema.prisma.
@fury/database:build:
@fury/database:build: ✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 199ms
@fury/database:build:
@fury/api:build: cache miss, executing 6472ecfcb6464510
@fury/web:build: $ next build --webpack
@fury/api:build: $ pnpm clean && tsc -p tsconfig.build.json
@fury/api:build: $ rimraf dist node_modules/.cache/tsconfig.build.tsbuildinfo
@fury/web:build: ▲ Next.js 16.2.12 (webpack)
@fury/web:build:
@fury/web:build:   Creating an optimized production build ...
@fury/web:build: ✓ Compiled successfully in 5.1min
@fury/web:build:   Running TypeScript ...
@fury/web:build:   Finished TypeScript in 6.8s ...
@fury/web:build:   Collecting page data using 9 workers ...
@fury/web:build:   Generating static pages using 9 workers (0/28) ...
@fury/web:build:   Generating static pages using 9 workers (7/28)
@fury/web:build:   Generating static pages using 9 workers (14/28)
@fury/web:build:   Generating static pages using 9 workers (21/28)
@fury/web:build: ✓ Generating static pages using 9 workers (28/28) in 459ms
@fury/web:build:   Finalizing page optimization ...
@fury/web:build:   Collecting build traces ...
@fury/web:build:
@fury/web:build: Route (app)
@fury/web:build: ┌ ƒ /
@fury/web:build: ├ ○ /_not-found
@fury/web:build: ├ ○ /admin
@fury/web:build: ├ ○ /admin/ads
@fury/web:build: ├ ○ /admin/categories
@fury/web:build: ├ ○ /admin/comments
@fury/web:build: ├ ○ /admin/contact
@fury/web:build: ├ ƒ /admin/contact/[messageId]
@fury/web:build: ├ ○ /admin/dashboard
@fury/web:build: ├ ○ /admin/gifts
@fury/web:build: ├ ○ /admin/gifts/grants
@fury/web:build: ├ ○ /admin/reports
@fury/web:build: ├ ○ /admin/users
@fury/web:build: ├ ƒ /admin/users/[userId]
@fury/web:build: ├ ○ /admin/works
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters/[chapterId]/edit
@fury/web:build: ├ ƒ /admin/works/[workId]/chapters/new
@fury/web:build: ├ ƒ /admin/works/[workId]/edit
@fury/web:build: ├ ○ /admin/works/new
@fury/web:build: ├ ○ /auth/forgot-password
@fury/web:build: ├ ○ /auth/login
@fury/web:build: ├ ○ /auth/register
@fury/web:build: ├ ○ /auth/reset-password
@fury/web:build: ├ ○ /auth/verify-email
@fury/web:build: ├ ƒ /categories
@fury/web:build: ├ ○ /contact
@fury/web:build: ├ ○ /copyright
@fury/web:build: ├ ○ /dashboard
@fury/web:build: ├ ƒ /discover
@fury/web:build: ├ ○ /library
@fury/web:build: ├ ○ /privacy
@fury/web:build: ├ ƒ /report-issue
@fury/web:build: ├ ƒ /robots.txt
@fury/web:build: ├ ○ /settings
@fury/web:build: ├ ƒ /sitemap.xml
@fury/web:build: ├ ƒ /stories
@fury/web:build: ├ ƒ /story/[id]
@fury/web:build: ├ ƒ /story/[id]/chapter/[chapterId]
@fury/web:build: └ ○ /terms
@fury/web:build:
@fury/web:build:
@fury/web:build: ○  (Static)   prerendered as static content
@fury/web:build: ƒ  (Dynamic)  server-rendered on demand
@fury/web:build:

 Tasks:    4 successful, 4 total
Cached:    2 cached, 4 total
  Time:    5m26.95s

$ node scripts/assert-build-output.mjs
Build output verified: 6 required entry artifacts present; 390 emitted files contain no test artifacts.
```

## fury-media-final-web-runtime

Original capture: `fury-media-final-web-runtime.txt`. Bytes: 117. SHA-256: `245d06c926e4ad5c6613ffc8de98bcb5d6169c246399ad5220d5d16af451446f`.

```text
▲ Next.js 16.2.12
- Local:         http://127.0.0.1:4316
- Network:       http://127.0.0.1:4316
✓ Ready in 309ms
```

## fury-media-final-wide-awake-result

Original capture: `fury-media-final-wide-awake-result.txt`. Bytes: 5035. SHA-256: `e137a2981c72e72aa7c9da9131d83e50b1ae4a3c01a6fdf9c88c9f64e1211146`.

```text
{"passed": true, "version": "after", "cdpMax": 2, "cdpEvents": [{"id": "33307.346", "index": 1, "kind": "start", "time": 289022.278914}, {"id": "33307.365", "index": 2, "kind": "start", "time": 289022.34371}, {"id": "33307.366", "index": 3, "kind": "start", "time": 289022.343833}, {"id": "33307.346", "kind": "finish", "time": 289022.340738}, {"id": "33307.365", "kind": "finish", "time": 289022.36703}, {"id": "33307.373", "index": 4, "kind": "start", "time": 289022.369475}, {"id": "33307.388", "index": 5, "kind": "start", "time": 289022.424643}, {"id": "33307.366", "kind": "finish", "time": 289022.423246}, {"id": "33307.393", "index": 6, "kind": "start", "time": 289022.447765}, {"id": "33307.373", "kind": "finish", "time": 289022.446176}, {"id": "33307.393", "kind": "finish", "time": 289022.469274}, {"id": "33307.399", "index": 7, "kind": "start", "time": 289022.471089}, {"id": "33307.406", "index": 8, "kind": "start", "time": 289022.488781}, {"id": "33307.388", "kind": "finish", "time": 289022.487346}, {"id": "33307.414", "index": 9, "kind": "start", "time": 289022.552859}, {"id": "33307.399", "kind": "finish", "time": 289022.551265}, {"id": "33307.423", "index": 10, "kind": "start", "time": 289022.568455}, {"id": "33307.406", "kind": "finish", "time": 289022.566884}, {"id": "33307.414", "kind": "finish", "time": 289022.634298}, {"id": "33307.423", "kind": "finish", "time": 289022.647904}, {"id": "33307.467", "index": 11, "kind": "start", "time": 289022.706632}, {"id": "33307.468", "index": 12, "kind": "start", "time": 289022.706773}, {"id": "33307.487", "index": 13, "kind": "start", "time": 289022.802992}, {"id": "33307.467", "kind": "finish", "time": 289022.800257}, {"id": "33307.493", "index": 14, "kind": "start", "time": 289022.803904}, {"id": "33307.468", "kind": "finish", "time": 289022.800495}, {"id": "33307.502", "index": 15, "kind": "start", "time": 289022.899815}, {"id": "33307.487", "kind": "finish", "time": 289022.898585}, {"id": "33307.511", "index": 16, "kind": "start", "time": 289022.90176}, {"id": "33307.493", "kind": "finish", "time": 289022.898883}, {"id": "33307.511", "kind": "finish", "time": 289022.905788}, {"id": "33307.527", "index": 16, "kind": "start", "time": 289022.958334}, {"id": "33307.528", "index": 17, "kind": "start", "time": 289022.958466}, {"id": "33307.502", "kind": "finish", "time": 289022.957049}, {"id": "33307.540", "index": 12, "kind": "start", "time": 289023.052349}, {"id": "33307.527", "kind": "finish", "time": 289023.051108}, {"id": "33307.546", "index": 11, "kind": "start", "time": 289023.053514}, {"id": "33307.528", "kind": "finish", "time": 289023.051642}, {"id": "33307.540", "kind": "finish", "time": 289023.082816}, {"id": "33307.546", "kind": "finish", "time": 289023.082869}], "cdpScope": "GET content only; CORS preflight excluded", "viewport": 1280, "profile": {"slow": false, "latencyMs": 20, "downloadBytesPerSecond": 10485760}, "persistedPages": 30, "firstUsefulMs": 111, "encodedDataBytesBeforeUseful": 375161, "initialRequests": [1, 2, 3, 4], "initialWindowRequests": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "initialPreparedMs": 410, "maxApplicationOutstandingContentRequests": 3, "requests": [{"index": 1, "startedMs": 41}, {"index": 2, "startedMs": 105}, {"index": 3, "startedMs": 105}, {"index": 4, "startedMs": 131}, {"index": 5, "startedMs": 186}, {"index": 6, "startedMs": 209}, {"index": 7, "startedMs": 232}, {"index": 8, "startedMs": 250}, {"index": 9, "startedMs": 314}, {"index": 10, "startedMs": 330}, {"index": 11, "startedMs": 468}, {"index": 12, "startedMs": 468}, {"index": 13, "startedMs": 564}, {"index": 14, "startedMs": 565}, {"index": 15, "startedMs": 661}, {"index": 16, "startedMs": 663}, {"index": 16, "startedMs": 720}, {"index": 17, "startedMs": 720}, {"index": 12, "startedMs": 814}, {"index": 11, "startedMs": 815}], "boundaries": [{"page": 5, "stallMs": 100, "requested": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}, {"page": 10, "stallMs": 100, "requested": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]}, {"page": 15, "stallMs": 150, "requested": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16, 17]}, {"kind": "warm reversal", "page": 13, "stallMs": 33, "newRequests": 0, "newTargetRequests": 0}], "resources": {"base": {"active": 0, "bytes": 0, "maximum": 0, "maxBytes": 0}, "firstReady": {"active": 2, "bytes": 375437, "maximum": 2, "maxBytes": 375437}, "atEnd": {"active": 3, "bytes": 1125483, "maximum": 10, "maxBytes": 3001840}, "afterClose": {"active": 0, "bytes": 0, "maximum": 10, "maxBytes": 3001840}}, "layout": {"width": 1280, "scrollWidth": 1280, "initialFirstPageHeight": 1000, "readyFirstPageHeight": 1000, "shifts": [{"value": 0.027480468749999997, "hadRecentInput": false}]}, "heap": {"usedSize": 23964928, "totalSize": 35635200, "limit": "JavaScript heap only; excludes native decoder/GPU animation memory"}, "measurement": "One controlled real-Chromium/Express/PostgreSQL sample; warm means retained ready pages within this open viewer, not cross-session protected persistence"}
```

## fury-media-final-wide-result

Original capture: `fury-media-final-wide-result.txt`. Bytes: 129. SHA-256: `95636eaf79e769f3af0ee0776f931565441711e5aa52e08de8d995eec1abee46`.

```text
The browser 'fury-media-foundation' is not open, please run open first

  playwright-cli -s=fury-media-foundation open [params]

```

## fury-media-foundation-migrations

Original capture: `fury-media-foundation-migrations.txt`. Bytes: 1671. SHA-256: `662230f8624f92b9e4c95547453be88e1fea03e43745fd5bb3691ef73926a33b`.

```text
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
Datasource "db": PostgreSQL database "fury_media_foundation", schema "public" at "127.0.0.1:32771"

10 migrations found in prisma/migrations

Applying migration `20260818000000_init_authentication`
Applying migration `20260922010000_content_domain_foundation`
Applying migration `20260923000000_remove_obsolete_phone`
Applying migration `20260923010000_persistent_vps_media`
Applying migration `20260925010000_p03_editorial_foundation`
Applying migration `20260925020000_p03_published_readiness`
Applying migration `20260926010000_p03_work_category_limit`
Applying migration `20260926020000_p03_enabled_category_assignments`
Applying migration `20260926030000_p04_chapter_expand`
Applying migration `20260926040000_p04_chapter_enforce`

The following migration(s) have been applied:

migrations/
  └─ 20260818000000_init_authentication/
    └─ migration.sql
  └─ 20260922010000_content_domain_foundation/
    └─ migration.sql
  └─ 20260923000000_remove_obsolete_phone/
    └─ migration.sql
  └─ 20260923010000_persistent_vps_media/
    └─ migration.sql
  └─ 20260925010000_p03_editorial_foundation/
    └─ migration.sql
  └─ 20260925020000_p03_published_readiness/
    └─ migration.sql
  └─ 20260926010000_p03_work_category_limit/
    └─ migration.sql
  └─ 20260926020000_p03_enabled_category_assignments/
    └─ migration.sql
  └─ 20260926030000_p04_chapter_expand/
    └─ migration.sql
  └─ 20260926040000_p04_chapter_enforce/
    └─ migration.sql

All migrations have been successfully applied.
```

## fury-media-foundation-runtime-after-slow

Original capture: `fury-media-foundation-runtime-after-slow.txt`. Bytes: 344. SHA-256: `eedf41a496a98157b94a2baf19ae2e062abaec56755871ba2e97f2bfe0ec1ac4`.

```text
Owned actual Express media API ready on loopback4315.
(node:22770) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
```

## fury-media-foundation-runtime-after-wide-cdp

Original capture: `fury-media-foundation-runtime-after-wide-cdp.txt`. Bytes: 54. SHA-256: `b02b37189b91fe62f57aebbaf5e4967493d4725f736726596ca006709081e3d1`.

```text
Owned actual Express media API ready on loopback4315.
```

## fury-media-foundation-runtime-after-wide-get

Original capture: `fury-media-foundation-runtime-after-wide-get.txt`. Bytes: 54. SHA-256: `b02b37189b91fe62f57aebbaf5e4967493d4725f736726596ca006709081e3d1`.

```text
Owned actual Express media API ready on loopback4315.
```

## fury-media-foundation-runtime-after-wide

Original capture: `fury-media-foundation-runtime-after-wide.txt`. Bytes: 54. SHA-256: `b02b37189b91fe62f57aebbaf5e4967493d4725f736726596ca006709081e3d1`.

```text
Owned actual Express media API ready on loopback4315.
```

## fury-media-foundation-runtime-before-slow

Original capture: `fury-media-foundation-runtime-before-slow.txt`. Bytes: 54. SHA-256: `b02b37189b91fe62f57aebbaf5e4967493d4725f736726596ca006709081e3d1`.

```text
Owned actual Express media API ready on loopback4315.
```

## fury-media-foundation-runtime-corrected

Original capture: `fury-media-foundation-runtime-corrected.txt`. Bytes: 54. SHA-256: `b02b37189b91fe62f57aebbaf5e4967493d4725f736726596ca006709081e3d1`.

```text
Owned actual Express media API ready on loopback4315.
```

## fury-media-foundation-runtime-motion

Original capture: `fury-media-foundation-runtime-motion.txt`. Bytes: 344. SHA-256: `5f73583564b3bff9aca7a97514cd01405a53e28bb481fc3ed75f212c18cd838f`.

```text
Owned actual Express media API ready on loopback4315.
(node:23130) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
```

## fury-media-foundation-runtime-progressive-authority

Original capture: `fury-media-foundation-runtime-progressive-authority.txt`. Bytes: 54. SHA-256: `b02b37189b91fe62f57aebbaf5e4967493d4725f736726596ca006709081e3d1`.

```text
Owned actual Express media API ready on loopback4315.
```

## fury-media-foundation-runtime-progressive

Original capture: `fury-media-foundation-runtime-progressive.txt`. Bytes: 54. SHA-256: `b02b37189b91fe62f57aebbaf5e4967493d4725f736726596ca006709081e3d1`.

```text
Owned actual Express media API ready on loopback4315.
```

## fury-media-foundation-runtime-restarted

Original capture: `fury-media-foundation-runtime-restarted.txt`. Bytes: 54. SHA-256: `b02b37189b91fe62f57aebbaf5e4967493d4725f736726596ca006709081e3d1`.

```text
Owned actual Express media API ready on loopback4315.
```

## fury-media-foundation-runtime

Original capture: `fury-media-foundation-runtime.txt`. Bytes: 1107. SHA-256: `636ca8b615a9d2e60d480700bb619bdccefa631e7c6e6b644caea14722301a89`.

```text
(node:13528) DeprecationWarning: Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
Owned persisted thirty-page dataset created using actual media and content services.
<repository>/apps/api/src/core/config/env.ts:35
    throw new Error(
          ^

Error: Environment variable DATABASE_URL is not set and no default value was provided.
    at getEnvVariable (<repository>/apps/api/src/core/config/env.ts:35:11)
    at <anonymous> (<repository>/apps/api/src/core/config/database.config.ts:3:21)
    at ModuleJob.run (node:internal/modules/esm/module_job:439:25)
    at async node:internal/modules/esm/loader:643:26
    at async <anonymous> (/private/tmp/fury-media-foundation-runtime.mjs:23:19)

Node.js v24.18.1
undefined
<repository>/apps/api:
[ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL] Command failed with exit code 1: node '--conditions=development' --import tsx /tmp/fury-media-foundation-runtime.mjs
```

## fury-media-foundation-web-after

Original capture: `fury-media-foundation-web-after.txt`. Bytes: 117. SHA-256: `d9e8154ac21b8bf9e11648bef3a2610614007fa5b37fcd5d72c16c8ebbb1ca50`.

```text
▲ Next.js 16.2.12
- Local:         http://127.0.0.1:4316
- Network:       http://127.0.0.1:4316
✓ Ready in 248ms
```

## fury-media-governance-format

Original capture: `fury-media-governance-format.txt`. Bytes: 399. SHA-256: `4911193a6b115a0d4e0a9e1a06b9b586fee67d715f47e13dc7fdaa8eea97cb81`.

```text
.specify/memory/constitution.md 84ms (unchanged)
AGENTS.md 15ms (unchanged)
README.md 32ms (unchanged)
docs/engineering/README.md 19ms (unchanged)
docs/engineering/frontend-standard.md 167ms (unchanged)
docs/design/design-system.md 25ms (unchanged)
docs/workflow/operating-policy.md 21ms (unchanged)
docs/workflow/prompts.md 7ms (unchanged)
docs/workflow/application-audit-prompt.md 4ms (unchanged)
```

## fury-media-guard-format

Original capture: `fury-media-guard-format.txt`. Bytes: 220. SHA-256: `ce694fa2637bfdc8768a816d6d236bfb2f3177b9e36aed3bd34d070a8310a248`.

```text
apps/web/src/features/content/hooks/progressive-image-resources.ts 108ms
apps/web/src/features/content/hooks/progressive-image-resources.test.ts 24ms
PLAN.md 144ms (unchanged)
docs/engineering/frontend-standard.md 111ms
```

## fury-media-guard-lint

Original capture: `fury-media-guard-lint.txt`. Bytes: 3408. SHA-256: `78367a7638d5968707335470c64ed99f2919f25ae9178417143bca03b47fe182`.

```text
$ eslint .

<repository>/apps/web/src/features/content/components/ChapterContentRenderer.test.tsx
   22:21  error  Invalid type "number" of template literal expression  @typescript-eslint/restrict-template-expressions
   54:33  error  Invalid type "number" of template literal expression  @typescript-eslint/restrict-template-expressions
   81:46  error  Async arrow function has no 'await' expression        @typescript-eslint/require-await
  147:24  error  Async arrow function has no 'await' expression        @typescript-eslint/require-await
  151:24  error  Async arrow function has no 'await' expression        @typescript-eslint/require-await
  157:24  error  Async arrow function has no 'await' expression        @typescript-eslint/require-await
  163:24  error  Async arrow function has no 'await' expression        @typescript-eslint/require-await

<repository>/apps/web/src/features/content/components/IllustratedChapterPages.tsx
  147:31  error  Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function  @typescript-eslint/no-confusing-void-expression
  148:32  error  Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function  @typescript-eslint/no-confusing-void-expression

<repository>/apps/web/src/features/content/hooks/progressive-image-resources.test.ts
    7:20  error  Invalid type "number" of template literal expression  @typescript-eslint/restrict-template-expressions
   26:30  error  Invalid type "number" of template literal expression  @typescript-eslint/restrict-template-expressions
   79:67  error  Invalid type "number" of template literal expression  @typescript-eslint/restrict-template-expressions
  170:18  error  Async arrow function has no 'await' expression        @typescript-eslint/require-await

<repository>/apps/web/src/features/content/hooks/use-progressive-chapter-images.ts
  40:16  error  Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function  @typescript-eslint/no-confusing-void-expression

<repository>/apps/web/src/features/media/hooks/media-image-display.ts
  17:7   error  Expected the Promise rejection reason to be an Error  @typescript-eslint/prefer-promise-reject-errors
  41:13  error  Expected the Promise rejection reason to be an Error  @typescript-eslint/prefer-promise-reject-errors
  52:9   error  Expected the Promise rejection reason to be an Error  @typescript-eslint/prefer-promise-reject-errors

<repository>/apps/web/src/features/public-catalog/components/PublicWorkImage.tsx
  110:5  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

<repository>/apps/web/src/shared/hooks/use-reduced-motion.ts
  9:16  error  Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function  @typescript-eslint/no-confusing-void-expression

✖ 19 problems (18 errors, 1 warning)
  4 errors and 0 warnings potentially fixable with the `--fix` option.

<repository>/apps/web:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/web@0.1.0 lint: `eslint .`
Exit status 1
```

## fury-media-guard-types

Original capture: `fury-media-guard-types.txt`. Bytes: 15. SHA-256: `8366207267355d3e3d5bf3bf6e8c94c5f93f6078c34f08973fa2b38cdda6cc92`.

```text
$ tsc --noEmit
```

## fury-media-host-sleep-proof

Original capture: `fury-media-host-sleep-proof.txt`. Bytes: 467. SHA-256: `b3d4673be54431dc833fe4c6af043250fe72d7578ecb4ff0276c372ae78fdf7a`.

```text
2026-11-01 17:54:00 +0200 Sleep               	Entering Sleep state due to 'Maintenance Sleep':TCPKeepAlive=active Using Batt (Charge:93%) 565 secs
2026-11-01 18:03:25 +0200 DarkWake            	DarkWake from Deep Idle [CDNP] : due to NUB.SPMI0.SW3 nub-spmi0.0x02 rtc/Maintenance Using BATT (Charge:93%) 6 secs
2026-11-01 18:03:31 +0200 Sleep               	Entering Sleep state due to 'Maintenance Sleep':TCPKeepAlive=active Using Batt (Charge:93%) 386 secs
```

## fury-media-loader-types-first

Original capture: `fury-media-loader-types-first.txt`. Bytes: 531. SHA-256: `816d115e49605eca1bf36781178535dc6e3c12771fa51ef72df86e148fb27d61`.

```text
$ tsc --noEmit
src/features/content/components/ChapterContentRenderer.tsx(68,3): error TS2339: Property 'scopeKey' does not exist on type 'Readonly<{ pages: readonly Readonly<{ id?: string; assetId: string; width?: number; height?: number; byteLength?: number; }>[]; document?: never; scopeKey?: string; } | { pages?: never; document: { version: 1; blocks: ({ ...; } | ... 1 more ... | { ...; })[]; } | null; }>'.
<repository>/apps/web:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/web@0.1.0 check-types: `tsc --noEmit`
Exit status 2
```

## fury-media-picker-browser.js

Original capture: `fury-media-picker-browser.js.txt`. Bytes: 4546. SHA-256: `a984aff0fd657397ee551c354e7f530cc1616fcc75a0e0e6e2765a3a73d1a0f9`.

```text
async (originalPage) => {
 let surface=0;
 const sample=async locator=>{const surfaceIndex=surface++;
  await locator.evaluate(async i=>{i.scrollIntoView({block:'center',behavior:'instant'});await i.decode();});const clip=await locator.evaluate(i=>{const r=i.getBoundingClientRect();let root=i.parentElement;while(root&& !['auto','scroll'].includes(getComputedStyle(root).overflowY))root=root.parentElement;const bounds=root?.getBoundingClientRect()??{top:0,bottom:innerHeight};return{x:Math.max(0,r.left+r.width*.1),y:(Math.max(0,r.top,bounds.top)+Math.min(innerHeight,r.bottom,bounds.bottom))/2,width:10,height:10};});
  const hashes=new Set(),samples=[];const started=Date.now();
  for(let index=0;index<10;index++){
   const buffer=await locator.page().screenshot({clip,animations:'allow',path:'/tmp/fury-media-picker-'+surfaceIndex+'-'+index+'.png'});let fingerprint=2166136261;for(const byte of buffer)fingerprint=Math.imul(fingerprint^byte,16777619)>>>0;const hash=fingerprint.toString(16);hashes.add(hash);samples.push({ms:Date.now()-started,pngFingerprint:hash});
   await locator.page().evaluate(()=>new Promise(resolve=>{const target=performance.now()+65;const next=()=>performance.now()>=target?resolve():requestAnimationFrame(next);requestAnimationFrame(next);}));
  }
  const descriptor=await locator.evaluate(async image=>({alt:image.alt,width:image.naturalWidth,height:image.naturalHeight,type:(await(await fetch(image.src)).blob()).type}));
  return {...descriptor,distinctColors:hashes.size,samples};
 };

 const context=await originalPage.context().browser().newContext({viewport:{width:1280,height:900},reducedMotion:'no-preference'});const page=await context.newPage();
 try {
  await page.goto('http://127.0.0.1:4316/auth/login');await page.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill('media-foundation-admin@example.test');await page.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill(__PASSWORD__);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(url=>['/dashboard','/admin'].includes(url.pathname));
  await page.goto('http://127.0.0.1:4316/admin/works/'+__WORK__+'/edit');const uploads=[];
  for(const [label,file] of [['رفع غلاف جديد','animated-cover.gif'],['رفع خلفية جديدة','animated-background.gif']]){
   const input=page.getByLabel(label,{exact:true});await input.waitFor();await input.waitFor({state:'visible'});if(!(await input.getAttribute('accept')).includes('image/gif'))throw Error('GIF hint absent');
   const accepted=page.waitForResponse(r=>r.request().method()==='POST'&&r.url().endsWith('/media/assets'));await input.setInputFiles('/private/tmp/fury-media-foundation-20261101/uploads/'+file);const response=await accepted;const payload=await response.json();if(response.status()!==201||payload.data.contentType!=='image/webp')throw Error('GIF upload not accepted as canonical WebP');
   const image=page.getByRole('img',{name:'معاينة '+label,exact:true});await image.waitFor();const normal=await sample(image);if(normal.distinctColors<3||normal.type!=='image/webp')throw Error('Private candidate flattened');
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(label=>{const i=[...document.images].find(i=>i.alt==='معاينة '+label);return i?.complete&&i.naturalWidth>0;},label);const reduced=await sample(image);if(reduced.distinctColors!==1||reduced.type!=='image/png')throw Error('Private reduced-motion display failed');await page.emulateMedia({reducedMotion:'no-preference'});uploads.push({mediaClass:payload.data.mediaClass,assetId:payload.data.id,normal,reduced});
  }
  const saved=page.waitForResponse(r=>r.request().method()==='PATCH'&&r.url().endsWith('/content/admin/works/'+__WORK__));await page.getByRole('button',{name:'حفظ التعديلات',exact:true}).click();const response=await saved;if(response.status()!==200)throw Error('Parent Work save failed');
  await page.goto('http://127.0.0.1:4316/story/media-foundation');await page.getByRole('heading',{name:'Media Foundation عمل',exact:true}).waitFor();await page.waitForFunction(()=>[...document.images].filter(i=>i.src.startsWith('blob:')&&i.complete&&i.naturalWidth).length>=2);
  return {passed:true,uploads,parentSaveStatus:response.status(),publication:'Actual existing published Work and references saved through the existing UI; no production data',publicImages:await page.locator('img[src^="blob:"]').count()};
 }finally{await context.close();}
}
```

## fury-media-picker-patch-result

Original capture: `fury-media-picker-patch-result.txt`. Bytes: 2654. SHA-256: `ce969967953cb86fb8fbc6eb25f725fa50c305421114aa93de42d3b6a00cb724`.

```text
{"passed": true, "uploads": [{"mediaClass": "work_cover", "assetId": "e892b094-466e-4c1e-a806-33b61a33dcf3", "normal": {"alt": "معاينة رفع غلاف جديد", "width": 600, "height": 800, "type": "image/webp", "distinctColors": 3, "samples": [{"ms": 33, "pngFingerprint": "84c1d623"}, {"ms": 150, "pngFingerprint": "b09fd76d"}, {"ms": 267, "pngFingerprint": "60e1eed"}, {"ms": 383, "pngFingerprint": "60e1eed"}, {"ms": 501, "pngFingerprint": "b09fd76d"}, {"ms": 619, "pngFingerprint": "60e1eed"}, {"ms": 734, "pngFingerprint": "60e1eed"}, {"ms": 852, "pngFingerprint": "84c1d623"}, {"ms": 968, "pngFingerprint": "b09fd76d"}, {"ms": 1084, "pngFingerprint": "60e1eed"}]}, "reduced": {"alt": "معاينة رفع غلاف جديد", "width": 600, "height": 800, "type": "image/png", "distinctColors": 1, "samples": [{"ms": 42, "pngFingerprint": "84c1d623"}, {"ms": 158, "pngFingerprint": "84c1d623"}, {"ms": 277, "pngFingerprint": "84c1d623"}, {"ms": 392, "pngFingerprint": "84c1d623"}, {"ms": 508, "pngFingerprint": "84c1d623"}, {"ms": 625, "pngFingerprint": "84c1d623"}, {"ms": 742, "pngFingerprint": "84c1d623"}, {"ms": 861, "pngFingerprint": "84c1d623"}, {"ms": 977, "pngFingerprint": "84c1d623"}, {"ms": 1093, "pngFingerprint": "84c1d623"}]}}, {"mediaClass": "work_background", "assetId": "b0aedd99-d166-40b8-a501-bec44cbe65e4", "normal": {"alt": "معاينة رفع خلفية جديدة", "width": 900, "height": 500, "type": "image/webp", "distinctColors": 3, "samples": [{"ms": 27, "pngFingerprint": "84c1d623"}, {"ms": 145, "pngFingerprint": "b09fd76d"}, {"ms": 260, "pngFingerprint": "60e1eed"}, {"ms": 379, "pngFingerprint": "60e1eed"}, {"ms": 494, "pngFingerprint": "b09fd76d"}, {"ms": 613, "pngFingerprint": "b09fd76d"}, {"ms": 730, "pngFingerprint": "60e1eed"}, {"ms": 845, "pngFingerprint": "84c1d623"}, {"ms": 963, "pngFingerprint": "b09fd76d"}, {"ms": 1079, "pngFingerprint": "60e1eed"}]}, "reduced": {"alt": "معاينة رفع خلفية جديدة", "width": 900, "height": 500, "type": "image/png", "distinctColors": 1, "samples": [{"ms": 36, "pngFingerprint": "84c1d623"}, {"ms": 153, "pngFingerprint": "84c1d623"}, {"ms": 271, "pngFingerprint": "84c1d623"}, {"ms": 387, "pngFingerprint": "84c1d623"}, {"ms": 503, "pngFingerprint": "84c1d623"}, {"ms": 620, "pngFingerprint": "84c1d623"}, {"ms": 735, "pngFingerprint": "84c1d623"}, {"ms": 852, "pngFingerprint": "84c1d623"}, {"ms": 969, "pngFingerprint": "84c1d623"}, {"ms": 1086, "pngFingerprint": "84c1d623"}]}}], "parentSaveStatus": 200, "publication": "Actual existing published Work and references saved through the existing UI; no production data", "publicImages": 2}
```

## fury-media-picker-result

Original capture: `fury-media-picker-result.txt`. Bytes: 107. SHA-256: `6cc6195e0b98c54fa13894aedfe7db4a9dfed96ecb2e64e99972f827df980aa5`.

```text
### Error
TimeoutError: page.waitForResponse: Timeout 30000ms exceeded while waiting for event "response"

```

## fury-media-processing-benchmark

Original capture: `fury-media-processing-benchmark.txt`. Bytes: 80. SHA-256: `a6232103fbb34c675a2026f267673e63553f6985341c918dc0f23af7f1369b84`.

```text
Actual processing measurements recorded; no private target information emitted.
```

## fury-media-processing-capacity

Original capture: `fury-media-processing-capacity.txt`. Bytes: 306. SHA-256: `ddf25fda9875697ac70723f9f1fdd1746cf0667c6f2981ad0aded1c67e168234`.

```text
$ vitest run --config vitest.config.ts src/infrastructure/media/animated-image-validation.test.ts

 RUN  v4.1.10 <repository>/apps/api


 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  17:17:08
   Duration  2.25s (transform 89ms, setup 22ms, import 204ms, tests 1.89s, environment 0ms)

```

## fury-media-progressive-authority-result

Original capture: `fury-media-progressive-authority-result.txt`. Bytes: 1247. SHA-256: `75065e47587c5eba5a6dbe82a987b92e9ad396d14e71d2cc57e770a82fe05bc2`.

```text
{"passed": true, "reportedConnection": {"saveData": true, "effectiveType": "4g", "source": "Controlled native EventTarget network-preference boundary, not a physical data-saver/device claim"}, "initialRequests": [1, 1, 2, 3, 4, 5], "afterJump": [1, 1, 2, 3, 4, 5, 25, 26], "requests": [1, 1, 2, 3, 4, 5, 25, 26, 24, 27, 23, 28, 29, 5, 6, 4, 7, 3, 8, 9, 11, 11, 12, 10, 13, 9, 14, 1, 2, 3, 4, 5], "failed": [{"url": "54cd25f0-d2f1-4ea6-8620-043476e09ace/content", "failure": {"errorText": "net::ERR_ABORTED"}}, {"url": "00de1e95-18e5-4644-9d60-f989bd6c3dbc/content", "failure": {"errorText": "net::ERR_ABORTED"}}, {"url": "8d21c8f9-b75f-42a1-a041-3f4c342ae897/content", "failure": {"errorText": "net::ERR_ABORTED"}}], "actualExpressPrivateWrongActor": 404, "actualExpressAdminEndpointDenial": 403, "denialInjection": "Real USER content GET returns non-disclosing 404; real administrator Chapter endpoint returns403, replayed at controlled media transport boundary to verify global denial fencing", "individual503": "Controlled network fault then actual authenticated read retry", "ownedUrlsAfterClose": 0, "scope": "Current draft to saved persisted preview; exact Chapter/account/unmount races also covered at real QueryClient/transport boundary"}
```

## fury-media-progressive-browser-result

Original capture: `fury-media-progressive-browser-result.txt`. Bytes: 73. SHA-256: `3f9d133d17b972c732f49f94120c7e33cded533fb65350af8c3601b9ec5c69ae`.

```text
### Error
Error: Actual USER authority did not deny administrator media

```

## fury-media-progressive-browser.js

Original capture: `fury-media-progressive-browser.js.txt`. Bytes: 7106. SHA-256: `df58bef99f9f8faa518a6234407c937af0f3953636daa8ae70a5dcdad5debc5f`.

```text
async (originalPage) => {
 const browser=originalPage.context().browser();const ids=__ASSET_IDS__;
 const login=async(page,email)=>{await page.goto('http://127.0.0.1:4316/auth/login');await page.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill(email);await page.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill(__PASSWORD__);const response=page.waitForResponse(r=>r.request().method()==='POST'&&r.url().endsWith('/auth/login'));await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();const body=await(await response).json();await page.waitForURL(url=>['/dashboard','/admin'].includes(url.pathname));return body.data.tokens.accessToken;};
 const ordinary=await browser.newContext();let readerToken;try{readerToken=await login(await ordinary.newPage(),'media-foundation-reader@example.test');}finally{await ordinary.close();}
 const context=await browser.newContext({viewport:{width:320,height:900}});const page=await context.newPage();let stage='login';const requested=[],failed=[];let fault='503',denialStatus,wrongActorPrivateStatus;
 try {
  await page.addInitScript(()=>{const active=new Set(),create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=blob=>{const url=create(blob);active.add(url);return url;};URL.revokeObjectURL=url=>{active.delete(url);revoke(url);};window.__liveImages=()=>active.size;const connection=new EventTarget();connection.saveData=true;connection.effectiveType='4g';Object.defineProperty(navigator,'connection',{configurable:true,value:connection});});
  await login(page,'media-foundation-admin@example.test');
  await page.route('**/media/assets/*/content',async route=>{if(route.request().method()!=='GET')return route.continue();const index=ids.indexOf(route.request().url().split('/').at(-2));requested.push(index+1);if(fault==='503'&&index===0){fault='none';return route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({success:false,statusCode:503,code:'MEDIA_UNAVAILABLE',message:'Controlled unavailable transport',requestId:'browser-transient-503'})});}if(fault==='deny'&&index===10){fault='none';const headers={...route.request().headers(),authorization:'Bearer '+readerToken};wrongActorPrivateStatus=(await route.fetch({headers})).status();const response=await route.fetch({url:'http://127.0.0.1:4315/api/v1/content/admin/works/'+__WORK__+'/chapters/'+__CHAPTER__,headers});denialStatus=response.status();return route.fulfill({response});}return route.continue();});
  page.on('requestfailed',request=>{if(request.url().includes('/content'))failed.push({url:request.url().split('/').slice(-2).join('/'),failure:request.failure()});});
  await page.goto('http://127.0.0.1:4316/admin/works/'+__WORK__+'/chapters/'+__CHAPTER__+'/edit');await page.getByRole('button',{name:'معاينة خاصة',exact:true}).click();const dialog=page.getByRole('dialog');const list=dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li');
  stage='retry';await dialog.getByRole('button',{name:'إعادة تحميل الصفحة 1',exact:true}).click();await page.waitForFunction(()=>document.querySelector('[role="dialog"] img[alt="صفحة 1"]')?.complete);await page.waitForFunction(()=>document.querySelectorAll('[role="dialog"] img[src^="blob:"]').length===5);const initial=requested.slice();if(initial.some(index=>index>5)||initial.filter(i=>i===1).length!==2)throw Error('Constrained initial/retry policy failed');
  stage='jump';await list.nth(24).scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const i=document.querySelector('[role="dialog"] img[alt="صفحة 25"]');return i?.complete&&i.naturalWidth;});const jump=requested.slice();if(!jump.includes(25))throw Error('Jump did not fetch visible page');
  stage='reversal';await list.nth(4).scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const i=document.querySelector('[role="dialog"] img[alt="صفحة 5"]');return i?.complete&&i.naturalWidth;});
  stage='denial';fault='deny';await list.nth(10).scrollIntoViewIfNeeded();const retry=dialog.getByRole('button',{name:'إعادة تحميل الصفحة 11',exact:true});await retry.waitFor();if(await page.evaluate(()=>window.__liveImages())!==0)throw Error('Private URLs survived confirmed denial');const deniedCount=requested.length;await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));if(requested.length!==deniedCount)throw Error('Denial automatically resumed');const session=await context.newCDPSession(page);await session.send('Network.enable');await session.send('Network.emulateNetworkConditions',{offline:false,latency:250,downloadThroughput:10*1024*1024,uploadThroughput:128*1024});await retry.click();await list.nth(24).scrollIntoViewIfNeeded();const recoveryAtNewPosition=dialog.getByRole('button',{name:'إعادة تحميل الصفحة 25',exact:true});await recoveryAtNewPosition.waitFor();await recoveryAtNewPosition.click();await page.waitForFunction(()=>{const i=document.querySelector('[role="dialog"] img[alt="صفحة 25"]');return i?.complete&&i.naturalWidth;});await session.send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  if(denialStatus!==403||wrongActorPrivateStatus!==404)throw Error('Actual authority outcomes changed');stage='scope';const previous=await dialog.getByRole('img',{name:'صفحة 25',exact:true}).getAttribute('src');await dialog.getByRole('button',{name:'النسخة المحفوظة',exact:true}).click();await page.waitForFunction(old=>![...document.querySelectorAll('[role="dialog"] img')].some(i=>i.src===old),previous);await page.waitForFunction(()=>{const i=document.querySelector('[role="dialog"] img[alt="صفحة 1"]');return i?.complete&&i.naturalWidth;});
  stage='close';await dialog.getByRole('button',{name:'إغلاق',exact:true}).click();await page.waitForFunction(()=>window.__liveImages()===0);
  return {passed:true,reportedConnection:{saveData:true,effectiveType:'4g',source:'Controlled native EventTarget network-preference boundary, not a physical data-saver/device claim'},initialRequests:initial,afterJump:jump,requests:requested,failed,actualExpressPrivateWrongActor:wrongActorPrivateStatus,actualExpressAdminEndpointDenial:denialStatus,denialInjection:'Real USER content GET returns non-disclosing 404; real administrator Chapter endpoint returns403, replayed at controlled media transport boundary to verify global denial fencing',individual503:'Controlled network fault then actual authenticated read retry',deniedRecoveryJump:'Retry11 then immediate jump25 under250ms latency; explicit retry surface at25 recovered',ownedUrlsAfterClose:await page.evaluate(()=>window.__liveImages()),scope:'Current draft to saved persisted preview; exact Chapter/account/unmount races also covered at real QueryClient/transport boundary'};
 }catch(error){throw Error(JSON.stringify({stage,error:String(error),requests:requested,failed,alerts:await page.getByRole('alert').allTextContents()}));}finally{await context.close();}
}
```

## fury-media-progressive-build-first

Original capture: `fury-media-progressive-build-first.txt`. Bytes: 1623. SHA-256: `272aaca0feb2796cc922994bbf7ee3a5bad521f76a45445407b398200c902992`.

```text
$ next build --webpack
▲ Next.js 16.2.12 (webpack)

  Creating an optimized production build ...
✓ Compiled successfully in 15.5s
  Running TypeScript ...
  Finished TypeScript in 6.4s ...
  Collecting page data using 9 workers ...
  Generating static pages using 9 workers (0/28) ...
  Generating static pages using 9 workers (7/28)
  Generating static pages using 9 workers (14/28)
  Generating static pages using 9 workers (21/28)
✓ Generating static pages using 9 workers (28/28) in 272ms
  Finalizing page optimization ...
  Collecting build traces ...

Route (app)
┌ ƒ /
├ ○ /_not-found
├ ○ /admin
├ ○ /admin/ads
├ ○ /admin/categories
├ ○ /admin/comments
├ ○ /admin/contact
├ ƒ /admin/contact/[messageId]
├ ○ /admin/dashboard
├ ○ /admin/gifts
├ ○ /admin/gifts/grants
├ ○ /admin/reports
├ ○ /admin/users
├ ƒ /admin/users/[userId]
├ ○ /admin/works
├ ƒ /admin/works/[workId]/chapters
├ ƒ /admin/works/[workId]/chapters/[chapterId]/edit
├ ƒ /admin/works/[workId]/chapters/new
├ ƒ /admin/works/[workId]/edit
├ ○ /admin/works/new
├ ○ /auth/forgot-password
├ ○ /auth/login
├ ○ /auth/register
├ ○ /auth/reset-password
├ ○ /auth/verify-email
├ ƒ /categories
├ ○ /contact
├ ○ /copyright
├ ○ /dashboard
├ ƒ /discover
├ ○ /library
├ ○ /privacy
├ ƒ /report-issue
├ ƒ /robots.txt
├ ○ /settings
├ ƒ /sitemap.xml
├ ƒ /stories
├ ƒ /story/[id]
├ ƒ /story/[id]/chapter/[chapterId]
└ ○ /terms


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

```

## fury-media-recovery-jump-after

Original capture: `fury-media-recovery-jump-after.txt`. Bytes: 378. SHA-256: `b6ddcea85b34186b6a01d5faa8b9aea9bb408445a9d023cb84e26be141fbdce5`.

```text
$ vitest run --config vitest.config.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx

 RUN  v4.1.10 <repository>/apps/web


 Test Files  2 passed (2)
      Tests  13 passed (13)
   Start at  17:50:04
   Duration  2.44s (transform 181ms, setup 354ms, import 415ms, tests 1.84s, environment 1.37s)

```

## fury-media-recovery-jump-before

Original capture: `fury-media-recovery-jump-before.txt`. Bytes: 1648. SHA-256: `4bbc709ba3bfc9e491a22d345fa27d9bdd97b2d69810144050a50bcb6971cb8d`.

```text
$ vitest run --config vitest.config.ts src/features/content/hooks/progressive-image-resources.test.ts

 RUN  v4.1.10 <repository>/apps/web

 ❯ src/features/content/hooks/progressive-image-resources.test.ts (7 tests | 1 failed) 1188ms
     × holds a confirmed denial across late responses until deliberate fresh retry 114ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/features/content/hooks/progressive-image-resources.test.ts > private viewer resource ownership > holds a confirmed denial across late responses until deliberate fresh retry
AssertionError: expected undefined to be 'FORBIDDEN' // Object.is equality

- Expected:
"FORBIDDEN"

+ Received:
undefined

 ❯ src/features/content/hooks/progressive-image-resources.test.ts:132:54
    130|     owner.setPosition(24, "continuous");
    131|     expect(interruptedRecovery?.signal.aborted).toBe(true);
    132|     expect(owner.getSnapshot().get("page-24")?.code).toBe("FORBIDDEN");
       |                                                      ^
    133|     interruptedRecovery?.resolve(image()); pending.clear();
    134|     await waitFor(() => { expect(owner.getSnapshot().get("page-24")?.p…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 6 passed (7)
   Start at  17:49:13
   Duration  2.30s (transform 86ms, setup 152ms, import 198ms, tests 1.19s, environment 638ms)

<repository>/apps/web:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/web@0.1.0 test: `vitest run --config vitest.config.ts src/features/content/hooks/progressive-image-resources.test.ts`
Exit status 1
```

## fury-media-resource-review-format

Original capture: `fury-media-resource-review-format.txt`. Bytes: 73. SHA-256: `6815a07dde7a6b8a9a6a2b5db510ff8655e9a9718f71abff6372faebf30ae7e9`.

```text
apps/web/src/features/content/hooks/progressive-image-resources.ts 110ms
```

## fury-media-resource-review-tests

Original capture: `fury-media-resource-review-tests.txt`. Bytes: 378. SHA-256: `b2a112008f8660ec9f6a1a1377761245d1609dff9eb9b6cda7a6cab61a2ea73c`.

```text
$ vitest run --config vitest.config.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx

 RUN  v4.1.10 <repository>/apps/web


 Test Files  2 passed (2)
      Tests  13 passed (13)
   Start at  17:52:34
   Duration  2.38s (transform 152ms, setup 347ms, import 373ms, tests 1.80s, environment 1.34s)

```

## fury-media-reviewed-web-build

Original capture: `fury-media-reviewed-web-build.txt`. Bytes: 1622. SHA-256: `886b55b475d56f1d4ca588eabf9d58b7eb1fc7fb78e973abbfaf34ed388b4d54`.

```text
$ next build --webpack
▲ Next.js 16.2.12 (webpack)

  Creating an optimized production build ...
✓ Compiled successfully in 6.7s
  Running TypeScript ...
  Finished TypeScript in 8.3s ...
  Collecting page data using 9 workers ...
  Generating static pages using 9 workers (0/28) ...
  Generating static pages using 9 workers (7/28)
  Generating static pages using 9 workers (14/28)
  Generating static pages using 9 workers (21/28)
✓ Generating static pages using 9 workers (28/28) in 311ms
  Finalizing page optimization ...
  Collecting build traces ...

Route (app)
┌ ƒ /
├ ○ /_not-found
├ ○ /admin
├ ○ /admin/ads
├ ○ /admin/categories
├ ○ /admin/comments
├ ○ /admin/contact
├ ƒ /admin/contact/[messageId]
├ ○ /admin/dashboard
├ ○ /admin/gifts
├ ○ /admin/gifts/grants
├ ○ /admin/reports
├ ○ /admin/users
├ ƒ /admin/users/[userId]
├ ○ /admin/works
├ ƒ /admin/works/[workId]/chapters
├ ƒ /admin/works/[workId]/chapters/[chapterId]/edit
├ ƒ /admin/works/[workId]/chapters/new
├ ƒ /admin/works/[workId]/edit
├ ○ /admin/works/new
├ ○ /auth/forgot-password
├ ○ /auth/login
├ ○ /auth/register
├ ○ /auth/reset-password
├ ○ /auth/verify-email
├ ƒ /categories
├ ○ /contact
├ ○ /copyright
├ ○ /dashboard
├ ƒ /discover
├ ○ /library
├ ○ /privacy
├ ƒ /report-issue
├ ƒ /robots.txt
├ ○ /settings
├ ƒ /sitemap.xml
├ ƒ /stories
├ ƒ /story/[id]
├ ƒ /story/[id]/chapter/[chapterId]
└ ○ /terms


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

```

## fury-media-reviewed-web-runtime

Original capture: `fury-media-reviewed-web-runtime.txt`. Bytes: 117. SHA-256: `d9e8154ac21b8bf9e11648bef3a2610614007fa5b37fcd5d72c16c8ebbb1ca50`.

```text
▲ Next.js 16.2.12
- Local:         http://127.0.0.1:4316
- Network:       http://127.0.0.1:4316
✓ Ready in 248ms
```

## fury-media-shuffle-110101

Original capture: `fury-media-shuffle-110101.txt`. Bytes: 642. SHA-256: `eb5ca79bbdfcad2f8e6e6b04e6b32a9dd333dc287d0bc24362429cde30b9ea96`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110101

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110101"


 Test Files  5 passed (5)
      Tests  27 passed (27)
   Start at  17:34:39
   Duration  2.79s (transform 475ms, setup 1.15s, import 980ms, tests 2.34s, environment 4.65s)

```

## fury-media-shuffle-110103

Original capture: `fury-media-shuffle-110103.txt`. Bytes: 642. SHA-256: `6d9e5576adba9dafb260caa78d27c136e513d4466af153b330539060c8a6781b`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110103

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110103"


 Test Files  5 passed (5)
      Tests  27 passed (27)
   Start at  17:34:43
   Duration  2.48s (transform 511ms, setup 844ms, import 962ms, tests 2.18s, environment 3.74s)

```

## fury-media-shuffle-110107

Original capture: `fury-media-shuffle-110107.txt`. Bytes: 642. SHA-256: `056b734490b9bdbf5f5742a24186283e73c619ad0c40778cf173700a09f0c623`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110107

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110107"


 Test Files  5 passed (5)
      Tests  27 passed (27)
   Start at  17:34:46
   Duration  2.67s (transform 802ms, setup 1.09s, import 1.52s, tests 2.60s, environment 3.49s)

```

## fury-media-shuffle-110109

Original capture: `fury-media-shuffle-110109.txt`. Bytes: 642. SHA-256: `99ae7ec67ed23d55c21c418f5c82945e447f9b29d3cce486012e929ba2368dba`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110109

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110109"


 Test Files  5 passed (5)
      Tests  27 passed (27)
   Start at  17:34:49
   Duration  2.45s (transform 561ms, setup 882ms, import 1.09s, tests 2.27s, environment 3.30s)

```

## fury-media-shuffle-110113

Original capture: `fury-media-shuffle-110113.txt`. Bytes: 642. SHA-256: `5f4b1e916fd30ff57068fae7a1ffbb29d3e45213881d07a6f2a9a3fff9db973a`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110113

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110113"


 Test Files  5 passed (5)
      Tests  27 passed (27)
   Start at  17:34:52
   Duration  2.63s (transform 690ms, setup 1.10s, import 1.37s, tests 2.56s, environment 3.60s)

```

## fury-media-shuffle-110127

Original capture: `fury-media-shuffle-110127.txt`. Bytes: 642. SHA-256: `d809ae707cd92363cf7dbf1afa7f85c66875fe55e25e43c7daf76ec2b1db3165`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110127

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110127"


 Test Files  5 passed (5)
      Tests  28 passed (28)
   Start at  17:43:10
   Duration  2.70s (transform 527ms, setup 1.16s, import 1.06s, tests 2.49s, environment 4.23s)

```

## fury-media-shuffle-110129

Original capture: `fury-media-shuffle-110129.txt`. Bytes: 642. SHA-256: `6ada91d255e64bcfe6e0a0e05bd5eddac0b8feaa1b43c4b0c19b39a53f56b3cf`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110129

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110129"


 Test Files  5 passed (5)
      Tests  28 passed (28)
   Start at  17:43:14
   Duration  2.28s (transform 484ms, setup 822ms, import 958ms, tests 2.39s, environment 2.64s)

```

## fury-media-shuffle-110131

Original capture: `fury-media-shuffle-110131.txt`. Bytes: 642. SHA-256: `fd25611ef12020dfffa69a5738b88efc95a80152412495c1ca155d22b2a92abf`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110131

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110131"


 Test Files  5 passed (5)
      Tests  28 passed (28)
   Start at  17:43:16
   Duration  2.14s (transform 428ms, setup 718ms, import 804ms, tests 2.28s, environment 2.31s)

```

## fury-media-shuffle-110137

Original capture: `fury-media-shuffle-110137.txt`. Bytes: 642. SHA-256: `77b5406d317b1735cdb9fe05ca5bd944693df18d469951e4f557a3d160d8fb31`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110137

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110137"


 Test Files  5 passed (5)
      Tests  28 passed (28)
   Start at  17:43:19
   Duration  2.28s (transform 503ms, setup 848ms, import 937ms, tests 2.39s, environment 2.63s)

```

## fury-media-shuffle-110139

Original capture: `fury-media-shuffle-110139.txt`. Bytes: 642. SHA-256: `32788759194266329ac8cef204aa37dcc57353ce288092def1d66b1192be08d9`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110139

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110139"


 Test Files  5 passed (5)
      Tests  28 passed (28)
   Start at  17:43:22
   Duration  2.26s (transform 472ms, setup 823ms, import 893ms, tests 2.41s, environment 2.65s)

```

## fury-media-shuffle-110149

Original capture: `fury-media-shuffle-110149.txt`. Bytes: 642. SHA-256: `c8b34f1a69256dd8671b5bffd630d94c85764cb342715f023a21ea9886d03214`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110149

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110149"


 Test Files  5 passed (5)
      Tests  28 passed (28)
   Start at  17:50:58
   Duration  2.53s (transform 456ms, setup 1.07s, import 984ms, tests 2.32s, environment 3.72s)

```

## fury-media-shuffle-110153

Original capture: `fury-media-shuffle-110153.txt`. Bytes: 642. SHA-256: `d42be6dc884422a939f43ac746f9424ac7b25ee40daccb40116ba3e88bcc92f1`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110153

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110153"


 Test Files  5 passed (5)
      Tests  28 passed (28)
   Start at  17:51:01
   Duration  2.21s (transform 381ms, setup 698ms, import 784ms, tests 2.25s, environment 2.72s)

```

## fury-media-shuffle-110157

Original capture: `fury-media-shuffle-110157.txt`. Bytes: 642. SHA-256: `a412299f9ec6bef9f170997eaea1d35c5d5e85b07c0f75dfe37f182cb845ac1d`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110157

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110157"


 Test Files  5 passed (5)
      Tests  28 passed (28)
   Start at  17:51:04
   Duration  2.21s (transform 471ms, setup 846ms, import 844ms, tests 2.27s, environment 2.47s)

```

## fury-media-shuffle-110161

Original capture: `fury-media-shuffle-110161.txt`. Bytes: 642. SHA-256: `bf9fedbcafce82d249fd1d2d0ab46515ed05f08f3e79510c2da1c8203e8c4357`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110161

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110161"


 Test Files  5 passed (5)
      Tests  28 passed (28)
   Start at  17:51:07
   Duration  2.19s (transform 457ms, setup 938ms, import 821ms, tests 2.25s, environment 2.36s)

```

## fury-media-shuffle-110167

Original capture: `fury-media-shuffle-110167.txt`. Bytes: 642. SHA-256: `7870796540cdcfce933454bcb2aa0551dc2b6303249666955f3f585c87f48925`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110167

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110167"


 Test Files  5 passed (5)
      Tests  28 passed (28)
   Start at  17:51:09
   Duration  2.29s (transform 556ms, setup 800ms, import 944ms, tests 2.36s, environment 2.63s)

```

## fury-media-shuffle-110173

Original capture: `fury-media-shuffle-110173.txt`. Bytes: 642. SHA-256: `31d5775e6e5b8d0d1c41fb8dce041fd81e4008160ef4acaaf136cdaf6ccf12a0`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110173

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110173"


 Test Files  5 passed (5)
      Tests  28 passed (28)
   Start at  17:53:54
   Duration  3.02s (transform 848ms, setup 1.75s, import 1.54s, tests 2.49s, environment 4.63s)

```

## fury-media-shuffle-110179

Original capture: `fury-media-shuffle-110179.txt`. Bytes: 642. SHA-256: `6cea24479b8019847471abd5ec779f40f0001dd3b801e952af08fb4603c9b0e1`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110179

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110179"


 Test Files  5 passed (5)
      Tests  28 passed (28)
   Start at  17:53:58
   Duration  2.55s (transform 578ms, setup 964ms, import 1.02s, tests 2.41s, environment 3.58s)

```

## fury-media-shuffle-110183-awake

Original capture: `fury-media-shuffle-110183-awake.txt`. Bytes: 642. SHA-256: `49cf3d602a5359e52dbdce82d10792bcf244208f211754698ff4de659be76481`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110183

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110183"


 Test Files  5 passed (5)
      Tests  28 passed (28)
   Start at  18:51:44
   Duration  2.67s (transform 571ms, setup 1.29s, import 955ms, tests 2.26s, environment 4.15s)

```

## fury-media-shuffle-110183

Original capture: `fury-media-shuffle-110183.txt`. Bytes: 6454. SHA-256: `5369cd45392a6bcbb8d4b80c5692b7aa4dba19feffc9d71a1315c99d7cf83308`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110183

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110183"

stderr | src/features/content/components/ChapterContentRenderer.test.tsx > illustrated Chapter renderer with authenticated media transport > renders ordered private images as each arrives, reserves geometry, and retains retry focus after a decode failure
Query data cannot be undefined. Please make sure to return a value other than undefined from your query function. Affected query key: ["auth","session"]

 ❯ src/features/public-catalog/components/PublicWorkImage.test.tsx (5 tests | 1 failed) 563506ms
     × removes old decoded bytes while other-work is pending 563399ms
 ❯ src/features/media/components/AdminMediaCandidatePicker.test.tsx (7 tests | 1 failed) 563603ms
     × announces an accepted RTL candidate without claiming parent persistence 563267ms
 ❯ src/features/content/components/ChapterContentRenderer.test.tsx (6 tests | 1 failed) 563712ms
     × renders ordered private images as each arrives, reserves geometry, and retains retry focus after a decode failure 563310ms
 ❯ src/features/content/hooks/progressive-image-resources.test.ts (7 tests | 1 failed) 564094ms
     × loads visible first, bounds background work, deduplicates observer events and extends before the boundary 563234ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/features/content/components/ChapterContentRenderer.test.tsx > illustrated Chapter renderer with authenticated media transport > renders ordered private images as each arrives, reserves geometry, and retains retry focus after a decode failure
Error: Test timed out in 5000ms.
If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".
 ❯ src/features/content/components/ChapterContentRenderer.test.tsx:85:3
     83|
     84| describe("illustrated Chapter renderer with authenticated media transp…
     85|   it("renders ordered private images as each arrives, reserves geometr…
       |   ^
     86|     const requests: string[] = [];
     87|     vi.stubGlobal(

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯

 FAIL  src/features/media/components/AdminMediaCandidatePicker.test.tsx > administrator media candidate picker > announces an accepted RTL candidate without claiming parent persistence
Error: Test timed out in 5000ms.
If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".
 ❯ src/features/media/components/AdminMediaCandidatePicker.test.tsx:66:3
     64|   });
     65|
     66|   it("announces an accepted RTL candidate without claiming parent pers…
       |   ^
     67|     mediaApiMock.upload.mockResolvedValue({ id: "asset-one" });
     68|     renderPicker();

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯

 FAIL  src/features/content/hooks/progressive-image-resources.test.ts > private viewer resource ownership > loads visible first, bounds background work, deduplicates observer events and extends before the boundary
Error: Test timed out in 5000ms.
If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".
 ❯ src/features/content/hooks/progressive-image-resources.test.ts:73:3
     71|
     72| describe("private viewer resource ownership", () => {
     73|   it("loads visible first, bounds background work, deduplicates observ…
       |   ^
     74|     const { owner, requested, pending, finish } = harness();
     75|     owner.activate();

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯

 FAIL  src/features/public-catalog/components/PublicWorkImage.test.tsx > public image identity and Blob lifetime > removes old decoded bytes while other-work is pending
Error: expect(element).toHaveAttribute("src", "blob:synthetic-public-image") // element.getAttribute("src") === "blob:synthetic-public-image"

Expected the element to have attribute:
  src="blob:synthetic-public-image"
Received:
  null

Ignored nodes: comments, script, style
[36m<html>[39m
  [36m<head />[39m
  [36m<body>[39m
    [36m<div>[39m
      [36m<img[39m
        [33malt[39m=[32m"First Work"[39m
        [33maria-busy[39m=[32m"true"[39m
        [33mdata-public-catalog-focus[39m=[32m""[39m
        [33mloading[39m=[32m"lazy"[39m
        [33mtabindex[39m=[32m"-1"[39m
      [36m/>[39m
    [36m</div>[39m
  [36m</body>[39m
[36m</html>[39m
 ❯ src/features/public-catalog/components/PublicWorkImage.test.tsx:35:41
     33|       );
     34|       await waitFor(() =>
     35|         expect(screen.getByRole("img")).toHaveAttribute(
       |                                         ^
     36|           "src",
     37|           "blob:synthetic-public-image",
 ❯ runWithExpensiveErrorDiagnosticsDisabled ../../node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:47:12
 ❯ checkCallback ../../node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/wait-for.js:124:77
 ❯ Timeout.checkRealTimersCallback ../../node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/wait-for.js:118:16

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯


 Test Files  4 failed | 1 passed (5)
      Tests  4 failed | 24 passed (28)
   Start at  17:54:01
   Duration  565.13s (transform 466ms, setup 797ms, import 938ms, tests 2254.92s, environment 2.49s)

<repository>/apps/web:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/web@0.1.0 test: `vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110183`
Exit status 1
```

## fury-media-shuffle-110197

Original capture: `fury-media-shuffle-110197.txt`. Bytes: 642. SHA-256: `9c884ce6c3a6aa8e272fbe9cf86345f54a6b553c70d9f393bd19774e7b9321ac`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110197

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110197"


 Test Files  5 passed (5)
      Tests  28 passed (28)
   Start at  18:51:47
   Duration  2.39s (transform 511ms, setup 899ms, import 953ms, tests 2.32s, environment 2.84s)

```

## fury-media-shuffle-110201

Original capture: `fury-media-shuffle-110201.txt`. Bytes: 642. SHA-256: `433ed1f40a3d43fe68d4470a4452977e4a979ffb3ea295ab87b83edc2034de83`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110201

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110201"


 Test Files  5 passed (5)
      Tests  28 passed (28)
   Start at  18:51:50
   Duration  2.32s (transform 589ms, setup 777ms, import 1.06s, tests 2.28s, environment 2.79s)

```

## fury-media-shuffle-110203

Original capture: `fury-media-shuffle-110203.txt`. Bytes: 642. SHA-256: `c8b91ee6ad353d604d567acbf0c9057bb1f32dfecfc285cd61eefc9893da8ab0`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110203

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110203"


 Test Files  5 passed (5)
      Tests  28 passed (28)
   Start at  18:51:53
   Duration  2.26s (transform 504ms, setup 825ms, import 936ms, tests 2.36s, environment 2.66s)

```

## fury-media-shuffle-110207

Original capture: `fury-media-shuffle-110207.txt`. Bytes: 642. SHA-256: `a0b2f187f191b7e345a5fb6ceb5e8f98270b950078f9cb9cbc362d7844243e34`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/public-catalog/components/PublicWorkImage.test.tsx src/features/media/components/AdminMediaCandidatePicker.test.tsx --sequence.shuffle --sequence.seed=110207

 RUN  v4.1.10 <repository>/apps/web
      Running tests with seed "110207"


 Test Files  5 passed (5)
      Tests  28 passed (28)
   Start at  18:51:56
   Duration  2.28s (transform 427ms, setup 748ms, import 862ms, tests 2.34s, environment 2.86s)

```

## fury-media-ui-review-format

Original capture: `fury-media-ui-review-format.txt`. Bytes: 125. SHA-256: `e268505c47a6d244bd2f03bd30df2078b8f40851bf36aecfb845361df9291c65`.

```text
apps/web/src/features/media/hooks/use-media-preview-source.ts 90ms
specs/002-persistent-vps-media/tasks.md 100ms (unchanged)
```

## fury-media-verify-first-lint-failure

Original capture: `fury-media-verify-first-lint-failure.txt`. Bytes: 6121. SHA-256: `826423ad1a7188b66c36e069334ac4a95a8fb5cf364dbda24256a10cec48cbf1`.

```text
$ pnpm db:format && pnpm db:validate && pnpm db:generate && pnpm format:check && pnpm lint && pnpm check-types && pnpm test && pnpm test:integration && pnpm build && pnpm verify:build-output && git diff --check
$ pnpm --filter @fury/database db:format
$ prisma format
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
Formatted prisma/schema.prisma in 25ms 🚀
$ pnpm --filter @fury/database db:validate
$ prisma validate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
The schema at prisma/schema.prisma is valid 🚀
$ pnpm --filter @fury/database db:generate
$ prisma generate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.

✔ Generated Prisma Client (7.9.1) to ./src/generated/prisma in 100ms

$ prettier --check "**/*.{ts,tsx,js,jsx,mjs,cjs,json,md,mdx,yml,yaml,css}"
Checking formatting...
All matched files use Prettier code style!
$ turbo run lint
• turbo 2.10.8

   • Packages in scope: @fury/api, @fury/contracts, @fury/database, @fury/eslint-config, @fury/prettier-config, @fury/typescript-config, @fury/web
   • Running lint in 7 packages
   • Remote caching disabled

@fury/contracts:lint: cache miss, executing 21a414aa92aa86c4
@fury/contracts:lint: $ eslint .
@fury/web:lint: cache miss, executing bdb92b760ebfa6c2
@fury/database:lint: cache miss, executing 0a545f6444ff982f
@fury/database:lint: $ eslint .
@fury/web:lint: $ eslint .
@fury/api:lint: cache miss, executing 12e374fb6c90dd4a
@fury/api:lint: $ eslint .
@fury/web:lint:
@fury/web:lint: <repository>/apps/web/src/features/content/components/ChapterContentRenderer.test.tsx
@fury/web:lint:    23:21  error  Invalid type "number" of template literal expression  @typescript-eslint/restrict-template-expressions
@fury/web:lint:    55:33  error  Invalid type "number" of template literal expression  @typescript-eslint/restrict-template-expressions
@fury/web:lint:    82:46  error  Async arrow function has no 'await' expression        @typescript-eslint/require-await
@fury/web:lint:   148:24  error  Async arrow function has no 'await' expression        @typescript-eslint/require-await
@fury/web:lint:   152:24  error  Async arrow function has no 'await' expression        @typescript-eslint/require-await
@fury/web:lint:   158:24  error  Async arrow function has no 'await' expression        @typescript-eslint/require-await
@fury/web:lint:   164:24  error  Async arrow function has no 'await' expression        @typescript-eslint/require-await
@fury/web:lint:   195:24  error  Async arrow function has no 'await' expression        @typescript-eslint/require-await
@fury/web:lint:   201:24  error  Async arrow function has no 'await' expression        @typescript-eslint/require-await
@fury/web:lint:
@fury/web:lint: <repository>/apps/web/src/features/content/components/IllustratedChapterPages.tsx
@fury/web:lint:   147:31  error  Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function  @typescript-eslint/no-confusing-void-expression
@fury/web:lint:   148:32  error  Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function  @typescript-eslint/no-confusing-void-expression
@fury/web:lint:
@fury/web:lint: <repository>/apps/web/src/features/content/hooks/progressive-image-resources.test.ts
@fury/web:lint:     7:20  error  Invalid type "number" of template literal expression  @typescript-eslint/restrict-template-expressions
@fury/web:lint:    26:30  error  Invalid type "number" of template literal expression  @typescript-eslint/restrict-template-expressions
@fury/web:lint:    79:67  error  Invalid type "number" of template literal expression  @typescript-eslint/restrict-template-expressions
@fury/web:lint:   170:18  error  Async arrow function has no 'await' expression        @typescript-eslint/require-await
@fury/web:lint:
@fury/web:lint: <repository>/apps/web/src/features/content/hooks/use-progressive-chapter-images.ts
@fury/web:lint:   40:16  error  Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function  @typescript-eslint/no-confusing-void-expression
@fury/web:lint:
@fury/web:lint: <repository>/apps/web/src/features/media/hooks/media-image-display.ts
@fury/web:lint:   17:7   error  Expected the Promise rejection reason to be an Error  @typescript-eslint/prefer-promise-reject-errors
@fury/web:lint:   41:13  error  Expected the Promise rejection reason to be an Error  @typescript-eslint/prefer-promise-reject-errors
@fury/web:lint:   52:9   error  Expected the Promise rejection reason to be an Error  @typescript-eslint/prefer-promise-reject-errors
@fury/web:lint:
@fury/web:lint: <repository>/apps/web/src/features/public-catalog/components/PublicWorkImage.tsx
@fury/web:lint:   110:5  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
@fury/web:lint:
@fury/web:lint: <repository>/apps/web/src/shared/hooks/use-reduced-motion.ts
@fury/web:lint:   9:16  error  Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function  @typescript-eslint/no-confusing-void-expression
@fury/web:lint:
@fury/web:lint: ✖ 21 problems (20 errors, 1 warning)
@fury/web:lint:   4 errors and 0 warnings potentially fixable with the `--fix` option.
@fury/web:lint:
@fury/web:lint: [ELIFECYCLE] Command failed with exit code 1.
@fury/web#lint:  ERROR  command (<repository>/apps/web) /Users/mohamedabdelkareem/.local/bin/pnpm run lint exited (1)

 Tasks:    3 successful, 4 total
Cached:    0 cached, 4 total
  Time:    25.843s
Failed:    @fury/web#lint

 ERROR  run failed: command  exited (1)
[ELIFECYCLE] Command failed with exit code 1.
[ELIFECYCLE] Command failed with exit code 1.
```

## fury-media-web-all-first

Original capture: `fury-media-web-all-first.txt`. Bytes: 308. SHA-256: `65be7edfc344b60ab46eb1ddf1a3f9dd0129282f02022a83a0490a3c246ce391`.

```text
$ vitest run --config vitest.config.ts

 RUN  v4.1.10 <repository>/apps/web

Not implemented: navigation to another Document

 Test Files  82 passed (82)
      Tests  526 passed (526)
   Start at  17:24:10
   Duration  24.47s (transform 7.27s, setup 24.30s, import 27.12s, tests 51.62s, environment 96.57s)

```

## fury-media-web-lint

Original capture: `fury-media-web-lint.txt`. Bytes: 3408. SHA-256: `0bcb6f7e0a5c89ccf1bc64ee2f133d48355ae009ecc577f58df20d6366058af3`.

```text
$ eslint .

<repository>/apps/web/src/features/content/components/ChapterContentRenderer.test.tsx
   22:21  error  Invalid type "number" of template literal expression  @typescript-eslint/restrict-template-expressions
   54:33  error  Invalid type "number" of template literal expression  @typescript-eslint/restrict-template-expressions
   81:46  error  Async arrow function has no 'await' expression        @typescript-eslint/require-await
  147:24  error  Async arrow function has no 'await' expression        @typescript-eslint/require-await
  151:24  error  Async arrow function has no 'await' expression        @typescript-eslint/require-await
  157:24  error  Async arrow function has no 'await' expression        @typescript-eslint/require-await
  163:24  error  Async arrow function has no 'await' expression        @typescript-eslint/require-await

<repository>/apps/web/src/features/content/components/IllustratedChapterPages.tsx
  147:31  error  Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function  @typescript-eslint/no-confusing-void-expression
  148:32  error  Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function  @typescript-eslint/no-confusing-void-expression

<repository>/apps/web/src/features/content/hooks/progressive-image-resources.test.ts
    7:20  error  Invalid type "number" of template literal expression  @typescript-eslint/restrict-template-expressions
   26:30  error  Invalid type "number" of template literal expression  @typescript-eslint/restrict-template-expressions
   79:67  error  Invalid type "number" of template literal expression  @typescript-eslint/restrict-template-expressions
  159:16  error  Async arrow function has no 'await' expression        @typescript-eslint/require-await

<repository>/apps/web/src/features/content/hooks/use-progressive-chapter-images.ts
  40:16  error  Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function  @typescript-eslint/no-confusing-void-expression

<repository>/apps/web/src/features/media/hooks/media-image-display.ts
  17:7   error  Expected the Promise rejection reason to be an Error  @typescript-eslint/prefer-promise-reject-errors
  41:13  error  Expected the Promise rejection reason to be an Error  @typescript-eslint/prefer-promise-reject-errors
  52:9   error  Expected the Promise rejection reason to be an Error  @typescript-eslint/prefer-promise-reject-errors

<repository>/apps/web/src/features/public-catalog/components/PublicWorkImage.tsx
  110:5  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

<repository>/apps/web/src/shared/hooks/use-reduced-motion.ts
  9:16  error  Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function  @typescript-eslint/no-confusing-void-expression

✖ 19 problems (18 errors, 1 warning)
  4 errors and 0 warnings potentially fixable with the `--fix` option.

<repository>/apps/web:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/web@0.1.0 lint: `eslint .`
Exit status 1
```

## fury-media-web-types

Original capture: `fury-media-web-types.txt`. Bytes: 15. SHA-256: `8366207267355d3e3d5bf3bf6e8c94c5f93f6078c34f08973fa2b38cdda6cc92`.

```text
$ tsc --noEmit
```

## fury-progressive-budgets

Original capture: `fury-progressive-budgets.txt`. Bytes: 311. SHA-256: `8e1921da3988cbf1d529eed5bf56099d72837a6a311409d956a9e876e7fcd851`.

```text
$ vitest run --config vitest.config.ts src/features/content/hooks/progressive-image-resources.test.ts

 RUN  v4.1.10 <repository>/apps/web


 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  17:28:08
   Duration  2.36s (transform 86ms, setup 166ms, import 195ms, tests 1.25s, environment 624ms)

```

## fury-progressive-corrected

Original capture: `fury-progressive-corrected.txt`. Bytes: 432. SHA-256: `0277ab73df7338f6fc8018d31c3b03d7317ad35b37c2ad6260245f6a1bd63d4f`.

```text
$ vitest run --config vitest.config.ts src/features/content/components/ChapterContentRenderer.test.tsx src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts

 RUN  v4.1.10 <repository>/apps/web


 Test Files  3 passed (3)
      Tests  14 passed (14)
   Start at  17:23:25
   Duration  2.38s (transform 178ms, setup 540ms, import 397ms, tests 1.62s, environment 2.02s)

```

## fury-progressive-denial-visible

Original capture: `fury-progressive-denial-visible.txt`. Bytes: 311. SHA-256: `7611d0705522582cc39bac1cba02e5accf050ba1f67ad9ed5ce25f39041a9b5a`.

```text
$ vitest run --config vitest.config.ts src/features/content/hooks/progressive-image-resources.test.ts

 RUN  v4.1.10 <repository>/apps/web


 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  17:30:32
   Duration  2.39s (transform 92ms, setup 171ms, import 206ms, tests 1.25s, environment 641ms)

```

## fury-progressive-first

Original capture: `fury-progressive-first.txt`. Bytes: 366. SHA-256: `5b7f297dbdfef1cd61836c3392f0c7e6e8eef8266bd76369bab5d1bba53ccc27`.

```text
$ vitest run --config vitest.config.ts src/features/content/model/progressive-images.test.ts src/features/content/hooks/progressive-image-resources.test.ts

 RUN  v4.1.10 <repository>/apps/web


 Test Files  2 passed (2)
      Tests  9 passed (9)
   Start at  17:22:20
   Duration  2.34s (transform 122ms, setup 377ms, import 236ms, tests 1.14s, environment 1.29s)

```

## fury-progressive-guard-refactor

Original capture: `fury-progressive-guard-refactor.txt`. Bytes: 378. SHA-256: `28a6f02f4a68b26cc1e36569a664ab1baea1c78c132052d10f373dcfe7b17a19`.

```text
$ vitest run --config vitest.config.ts src/features/content/hooks/progressive-image-resources.test.ts src/features/content/components/ChapterContentRenderer.test.tsx

 RUN  v4.1.10 <repository>/apps/web


 Test Files  2 passed (2)
      Tests  12 passed (12)
   Start at  17:32:59
   Duration  2.38s (transform 165ms, setup 346ms, import 429ms, tests 1.72s, environment 1.29s)

```

## fury-progressive-renderer-first

Original capture: `fury-progressive-renderer-first.txt`. Bytes: 11544. SHA-256: `a01f86c6bdb5991b6cfeef76375158aabfc9f393c6d9c3667eb3ec7cdbb873d5`.

```text
$ vitest run --config vitest.config.ts src/features/content/components/ChapterContentRenderer.test.tsx

 RUN  v4.1.10 <repository>/apps/web

 ❯ src/features/content/components/ChapterContentRenderer.test.tsx (5 tests | 1 failed) 424ms
     × renders ordered private images as each arrives, reserves geometry, and retains retry focus after a decode failure 188ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/features/content/components/ChapterContentRenderer.test.tsx > illustrated Chapter renderer with authenticated media transport > renders ordered private images as each arrives, reserves geometry, and retains retry focus after a decode failure
Error: expect(element).toHaveFocus()

Expected element with focus:
  <li
  data-media-page-focus=""
  style="aspect-ratio: 600 / 800; position: relative;"
  tabindex="-1"
>
  <img
    alt="صفحة 1"
    data-nimg="1"
    decoding="async"
    height="800"
    loading="eager"
    src="blob:private-10"
    style="color: transparent; display: block; width: 100%; height: auto;"
    width="600"
  />
</li>
Received element with focus:
  <body>
  <div>
    <ol
      aria-label="صفحات الفصل المصور"
      style="list-style: none; padding: 0px; margin: 0px;"
    >
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <img
          alt="صفحة 1"
          data-nimg="1"
          decoding="async"
          height="800"
          loading="eager"
          src="blob:private-10"
          style="color: transparent; display: block; width: 100%; height: auto;"
          width="600"
        />
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <img
          alt="صفحة 2"
          data-nimg="1"
          decoding="async"
          height="800"
          loading="lazy"
          src="blob:private-1"
          style="color: transparent; display: block; width: 100%; height: auto;"
          width="600"
        />
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <img
          alt="صفحة 3"
          data-nimg="1"
          decoding="async"
          height="800"
          loading="lazy"
          src="blob:private-2"
          style="color: transparent; display: block; width: 100%; height: auto;"
          width="600"
        />
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <img
          alt="صفحة 4"
          data-nimg="1"
          decoding="async"
          height="800"
          loading="lazy"
          src="blob:private-3"
          style="color: transparent; display: block; width: 100%; height: auto;"
          width="600"
        />
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <img
          alt="صفحة 5"
          data-nimg="1"
          decoding="async"
          height="800"
          loading="lazy"
          src="blob:private-4"
          style="color: transparent; display: block; width: 100%; height: auto;"
          width="600"
        />
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <img
          alt="صفحة 6"
          data-nimg="1"
          decoding="async"
          height="800"
          loading="lazy"
          src="blob:private-5"
          style="color: transparent; display: block; width: 100%; height: auto;"
          width="600"
        />
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <img
          alt="صفحة 7"
          data-nimg="1"
          decoding="async"
          height="800"
          loading="lazy"
          src="blob:private-6"
          style="color: transparent; display: block; width: 100%; height: auto;"
          width="600"
        />
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <img
          alt="صفحة 8"
          data-nimg="1"
          decoding="async"
          height="800"
          loading="lazy"
          src="blob:private-7"
          style="color: transparent; display: block; width: 100%; height: auto;"
          width="600"
        />
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <img
          alt="صفحة 9"
          data-nimg="1"
          decoding="async"
          height="800"
          loading="lazy"
          src="blob:private-8"
          style="color: transparent; display: block; width: 100%; height: auto;"
          width="600"
        />
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <img
          alt="صفحة 10"
          data-nimg="1"
          decoding="async"
          height="800"
          loading="lazy"
          src="blob:private-9"
          style="color: transparent; display: block; width: 100%; height: auto;"
          width="600"
        />
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <div
          style="position: absolute; inset: 0px;"
        >
          <p … />
        </div>
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <div
          style="position: absolute; inset: 0px;"
        >
          <p … />
        </div>
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <div
          style="position: absolute; inset: 0px;"
        >
          <p … />
        </div>
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <div
          style="position: absolute; inset: 0px;"
        >
          <p … />
        </div>
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <div
          style="position: absolute; inset: 0px;"
        >
          <p … />
        </div>
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <div
          style="position: absolute; inset: 0px;"
        >
          <p … />
        </div>
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <div
          style="position: absolute; inset: 0px;"
        >
          <p … />
        </div>
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <div
          style="position: absolute; inset: 0px;"
        >
          <p … />
        </div>
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <div
          style="position: absolute; inset: 0px;"
        >
          <p … />
        </div>
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <div
          style="position: absolute; inset: 0px;"
        >
          <p … />
        </div>
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <div
          style="position: absolute; inset: 0px;"
        >
          <p … />
        </div>
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <div
          style="position: absolute; inset: 0px;"
        >
          <p … />
        </div>
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <div
          style="position: absolute; inset: 0px;"
        >
          <p … />
        </div>
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <div
          style="position: absolute; inset: 0px;"
        >
          <p … />
        </div>
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <div
          style="position: absolute; inset: 0px;"
        >
          <p … />
        </div>
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <div
          style="position: absolute; inset: 0px;"
        >
          <p … />
        </div>
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <div
          style="position: absolute; inset: 0px;"
        >
          <p … />
        </div>
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <div
          style="position: absolute; inset: 0px;"
        >
          <p … />
        </div>
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <div
          style="position: absolute; inset: 0px;"
        >
          <p … />
        </div>
      </li>
      <li
        data-media-page-focus=""
        style="aspect-ratio: 600 / 800; position: relative;"
        tabindex="-1"
      >
        <div
          style="position: absolute; inset: 0px;"
        >
          <p … />
        </div>
      </li>
    </ol>
  </div>
</body>
 ❯ src/features/content/components/ChapterContentRenderer.test.tsx:48:35
     46|     const retried = await screen.findByRole("img", { name: "صفحة 1" });
     47|     fireEvent.load(retried);
     48|     expect(retried.closest("li")).toHaveFocus();
       |                                   ^
     49|     expect(requests.filter((url) => url.includes("asset-0/"))).toHaveL…
     50|     view.unmount();

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 4 passed (5)
   Start at  17:23:06
   Duration  1.67s (transform 126ms, setup 161ms, import 298ms, tests 424ms, environment 625ms)

<repository>/apps/web:
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @fury/web@0.1.0 test: `vitest run --config vitest.config.ts src/features/content/components/ChapterContentRenderer.test.tsx`
Exit status 1
```

## fury-progressive-types-first

Original capture: `fury-progressive-types-first.txt`. Bytes: 15. SHA-256: `8366207267355d3e3d5bf3bf6e8c94c5f93f6078c34f08973fa2b38cdda6cc92`.

```text
$ tsc --noEmit
```

## gif-picker-parent-save-patch

Original capture: `gif-picker-parent-save-patch.txt`. Bytes: 7119. SHA-256: `98e17d20d9024111fe52dcb69ca1d3787077928227335a50c6dce47365a7abd8`.

````text
### Result
{"passed":true,"uploads":[{"mediaClass":"work_cover","assetId":"e892b094-466e-4c1e-a806-33b61a33dcf3","normal":{"alt":"معاينة رفع غلاف جديد","width":600,"height":800,"type":"image/webp","distinctColors":3,"samples":[{"ms":33,"pngFingerprint":"84c1d623"},{"ms":150,"pngFingerprint":"b09fd76d"},{"ms":267,"pngFingerprint":"60e1eed"},{"ms":383,"pngFingerprint":"60e1eed"},{"ms":501,"pngFingerprint":"b09fd76d"},{"ms":619,"pngFingerprint":"60e1eed"},{"ms":734,"pngFingerprint":"60e1eed"},{"ms":852,"pngFingerprint":"84c1d623"},{"ms":968,"pngFingerprint":"b09fd76d"},{"ms":1084,"pngFingerprint":"60e1eed"}]},"reduced":{"alt":"معاينة رفع غلاف جديد","width":600,"height":800,"type":"image/png","distinctColors":1,"samples":[{"ms":42,"pngFingerprint":"84c1d623"},{"ms":158,"pngFingerprint":"84c1d623"},{"ms":277,"pngFingerprint":"84c1d623"},{"ms":392,"pngFingerprint":"84c1d623"},{"ms":508,"pngFingerprint":"84c1d623"},{"ms":625,"pngFingerprint":"84c1d623"},{"ms":742,"pngFingerprint":"84c1d623"},{"ms":861,"pngFingerprint":"84c1d623"},{"ms":977,"pngFingerprint":"84c1d623"},{"ms":1093,"pngFingerprint":"84c1d623"}]}},{"mediaClass":"work_background","assetId":"b0aedd99-d166-40b8-a501-bec44cbe65e4","normal":{"alt":"معاينة رفع خلفية جديدة","width":900,"height":500,"type":"image/webp","distinctColors":3,"samples":[{"ms":27,"pngFingerprint":"84c1d623"},{"ms":145,"pngFingerprint":"b09fd76d"},{"ms":260,"pngFingerprint":"60e1eed"},{"ms":379,"pngFingerprint":"60e1eed"},{"ms":494,"pngFingerprint":"b09fd76d"},{"ms":613,"pngFingerprint":"b09fd76d"},{"ms":730,"pngFingerprint":"60e1eed"},{"ms":845,"pngFingerprint":"84c1d623"},{"ms":963,"pngFingerprint":"b09fd76d"},{"ms":1079,"pngFingerprint":"60e1eed"}]},"reduced":{"alt":"معاينة رفع خلفية جديدة","width":900,"height":500,"type":"image/png","distinctColors":1,"samples":[{"ms":36,"pngFingerprint":"84c1d623"},{"ms":153,"pngFingerprint":"84c1d623"},{"ms":271,"pngFingerprint":"84c1d623"},{"ms":387,"pngFingerprint":"84c1d623"},{"ms":503,"pngFingerprint":"84c1d623"},{"ms":620,"pngFingerprint":"84c1d623"},{"ms":735,"pngFingerprint":"84c1d623"},{"ms":852,"pngFingerprint":"84c1d623"},{"ms":969,"pngFingerprint":"84c1d623"},{"ms":1086,"pngFingerprint":"84c1d623"}]}}],"parentSaveStatus":200,"publication":"Actual existing published Work and references saved through the existing UI; no production data","publicImages":2}
### Ran Playwright code
```js
await (async (originalPage) => {
 let surface=0;
 const sample=async locator=>{const surfaceIndex=surface++;
  await locator.evaluate(async i=>{i.scrollIntoView({block:'center',behavior:'instant'});await i.decode();});const clip=await locator.evaluate(i=>{const r=i.getBoundingClientRect();let root=i.parentElement;while(root&& !['auto','scroll'].includes(getComputedStyle(root).overflowY))root=root.parentElement;const bounds=root?.getBoundingClientRect()??{top:0,bottom:innerHeight};return{x:Math.max(0,r.left+r.width*.1),y:(Math.max(0,r.top,bounds.top)+Math.min(innerHeight,r.bottom,bounds.bottom))/2,width:10,height:10};});
  const hashes=new Set(),samples=[];const started=Date.now();
  for(let index=0;index<10;index++){
   const buffer=await locator.page().screenshot({clip,animations:'allow',path:'/tmp/fury-media-picker-'+surfaceIndex+'-'+index+'.png'});let fingerprint=2166136261;for(const byte of buffer)fingerprint=Math.imul(fingerprint^byte,16777619)>>>0;const hash=fingerprint.toString(16);hashes.add(hash);samples.push({ms:Date.now()-started,pngFingerprint:hash});
   await locator.page().evaluate(()=>new Promise(resolve=>{const target=performance.now()+65;const next=()=>performance.now()>=target?resolve():requestAnimationFrame(next);requestAnimationFrame(next);}));
  }
  const descriptor=await locator.evaluate(async image=>({alt:image.alt,width:image.naturalWidth,height:image.naturalHeight,type:(await(await fetch(image.src)).blob()).type}));
  return {...descriptor,distinctColors:hashes.size,samples};
 };

 const context=await originalPage.context().browser().newContext({viewport:{width:1280,height:900},reducedMotion:'no-preference'});const page=await context.newPage();
 try {
  await page.goto('http://127.0.0.1:4316/auth/login');await page.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill('media-foundation-admin@example.test');await page.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill("<redacted disposable credential>");await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(url=>['/dashboard','/admin'].includes(url.pathname));
  await page.goto('http://127.0.0.1:4316/admin/works/'+"7ea307e9-5953-49c1-bae3-4667de99c989"+'/edit');const uploads=[];
  for(const [label,file] of [['رفع غلاف جديد','animated-cover.gif'],['رفع خلفية جديدة','animated-background.gif']]){
   const input=page.getByLabel(label,{exact:true});await input.waitFor();await input.waitFor({state:'visible'});if(!(await input.getAttribute('accept')).includes('image/gif'))throw Error('GIF hint absent');
   const accepted=page.waitForResponse(r=>r.request().method()==='POST'&&r.url().endsWith('/media/assets'));await input.setInputFiles('/private/tmp/fury-media-foundation-20261101/uploads/'+file);const response=await accepted;const payload=await response.json();if(response.status()!==201||payload.data.contentType!=='image/webp')throw Error('GIF upload not accepted as canonical WebP');
   const image=page.getByRole('img',{name:'معاينة '+label,exact:true});await image.waitFor();const normal=await sample(image);if(normal.distinctColors<3||normal.type!=='image/webp')throw Error('Private candidate flattened');
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(label=>{const i=[...document.images].find(i=>i.alt==='معاينة '+label);return i?.complete&&i.naturalWidth>0;},label);const reduced=await sample(image);if(reduced.distinctColors!==1||reduced.type!=='image/png')throw Error('Private reduced-motion display failed');await page.emulateMedia({reducedMotion:'no-preference'});uploads.push({mediaClass:payload.data.mediaClass,assetId:payload.data.id,normal,reduced});
  }
  const saved=page.waitForResponse(r=>r.request().method()==='PATCH'&&r.url().endsWith('/content/admin/works/'+"7ea307e9-5953-49c1-bae3-4667de99c989"));await page.getByRole('button',{name:'حفظ التعديلات',exact:true}).click();const response=await saved;if(response.status()!==200)throw Error('Parent Work save failed');
  await page.goto('http://127.0.0.1:4316/story/media-foundation');await page.getByRole('heading',{name:'Media Foundation عمل',exact:true}).waitFor();await page.waitForFunction(()=>[...document.images].filter(i=>i.src.startsWith('blob:')&&i.complete&&i.naturalWidth).length>=2);
  return {passed:true,uploads,parentSaveStatus:response.status(),publication:'Actual existing published Work and references saved through the existing UI; no production data',publicImages:await page.locator('img[src^="blob:"]').count()};
 }finally{await context.close();}
}
)(page);
```
````

## gif-picker-parent-save

Original capture: `gif-picker-parent-save.txt`. Bytes: 106. SHA-256: `f075ba6a9d5b8c0110d4c7d227ec6be85b985338992fba4a24ea6ad0a7883249`.

```text
### Error
TimeoutError: page.waitForResponse: Timeout 30000ms exceeded while waiting for event "response"
```

## progressive-real-viewer-authority

Original capture: `progressive-real-viewer-authority.txt`. Bytes: 8963. SHA-256: `7bddc587257ce4717af24074c474fed85d19baa7ca9533e039ed2cca6600db35`.

````text
### Result
{"passed":true,"reportedConnection":{"saveData":true,"effectiveType":"4g","source":"Controlled native EventTarget network-preference boundary, not a physical data-saver/device claim"},"initialRequests":[1,1,2,3,4,5],"afterJump":[1,1,2,3,4,5,25,26],"requests":[1,1,2,3,4,5,25,26,24,27,23,28,29,5,6,4,7,3,8,9,11,11,12,10,13,9,14,1,2,3,4,5],"failed":[{"url":"54cd25f0-d2f1-4ea6-8620-043476e09ace/content","failure":{"errorText":"net::ERR_ABORTED"}},{"url":"00de1e95-18e5-4644-9d60-f989bd6c3dbc/content","failure":{"errorText":"net::ERR_ABORTED"}},{"url":"8d21c8f9-b75f-42a1-a041-3f4c342ae897/content","failure":{"errorText":"net::ERR_ABORTED"}}],"actualExpressPrivateWrongActor":404,"actualExpressAdminEndpointDenial":403,"denialInjection":"Real USER content GET returns non-disclosing 404; real administrator Chapter endpoint returns403, replayed at controlled media transport boundary to verify global denial fencing","individual503":"Controlled network fault then actual authenticated read retry","ownedUrlsAfterClose":0,"scope":"Current draft to saved persisted preview; exact Chapter/account/unmount races also covered at real QueryClient/transport boundary"}
### Ran Playwright code
```js
await (async (originalPage) => {
 const browser=originalPage.context().browser();const ids=["702ca060-113c-49e9-8235-4bd14c292127", "9d7807b2-adf8-4eb5-a4cb-6883e493f054", "70f3d46a-76fd-4c8b-870f-64a8a3990231", "d342bfef-ff2a-4b80-b7db-764fd36c8c95", "1b570b8c-362d-4ac0-abf2-9b3151a0b618", "1fea6885-f78a-4836-b1d2-39c7ba9f0a3f", "172478d5-803c-4fa7-b565-8eba78542785", "8674ca88-fc03-4f3a-a9e0-9efd158f40af", "00de1e95-18e5-4644-9d60-f989bd6c3dbc", "fe73894d-5fab-4722-88b1-bfb1324b8c5b", "cdeb1a27-050f-45c4-bbd7-99f1734da809", "95f03346-ea9b-400c-bf7a-1cce242d6d03", "b24e75aa-3754-4d58-afad-446f3d88977d", "8d21c8f9-b75f-42a1-a041-3f4c342ae897", "a9a67407-1fe7-4521-9c6b-7c9bcd13173a", "bfd49603-7b60-41fe-8742-a989c6e87e87", "709f2447-16e4-4b85-91ca-4cd57b82c7b9", "0910e682-f9ce-4ea3-86ae-b8a039602d52", "c89efa47-a3b0-4d63-ad31-099e3644fa04", "0b1b1096-3557-422e-9679-6b78e410b3fe", "dcc4e02c-6625-4711-b37d-bd6d5a6911d8", "f16dea88-79c9-4620-b2ed-01f8b75e85c5", "acdcd6b4-26fe-46e0-8b1d-e43c68459aeb", "e963eba1-2674-4ed6-838a-313b3d7a4846", "a412c4d5-bf3b-4a12-8058-aac868590975", "c9a21547-1e6a-40a7-8355-1c6934fddc00", "daecdc57-4700-489c-8e09-899da8ca0adb", "8af1ee40-ef2f-41c7-ad42-dcaa6c60932c", "54cd25f0-d2f1-4ea6-8620-043476e09ace", "6926b230-0f36-47da-96a0-bf6ae2ecdebf"];
 const login=async(page,email)=>{await page.goto('http://127.0.0.1:4316/auth/login');await page.getByRole('textbox',{name:'البريد الإلكتروني',exact:true}).fill(email);await page.getByRole('textbox',{name:'كلمة المرور',exact:true}).fill("<redacted disposable credential>");const response=page.waitForResponse(r=>r.request().method()==='POST'&&r.url().endsWith('/auth/login'));await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();const body=await(await response).json();await page.waitForURL(url=>['/dashboard','/admin'].includes(url.pathname));return body.data.tokens.accessToken;};
 const ordinary=await browser.newContext();let readerToken;try{readerToken=await login(await ordinary.newPage(),'media-foundation-reader@example.test');}finally{await ordinary.close();}
 const context=await browser.newContext({viewport:{width:320,height:900}});const page=await context.newPage();let stage='login';const requested=[],failed=[];let fault='503',denialStatus,wrongActorPrivateStatus;
 try {
  await page.addInitScript(()=>{const active=new Set(),create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=blob=>{const url=create(blob);active.add(url);return url;};URL.revokeObjectURL=url=>{active.delete(url);revoke(url);};window.__liveImages=()=>active.size;const connection=new EventTarget();connection.saveData=true;connection.effectiveType='4g';Object.defineProperty(navigator,'connection',{configurable:true,value:connection});});
  await login(page,'media-foundation-admin@example.test');
  await page.route('**/media/assets/*/content',async route=>{if(route.request().method()!=='GET')return route.continue();const index=ids.indexOf(route.request().url().split('/').at(-2));requested.push(index+1);if(fault==='503'&&index===0){fault='none';return route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({success:false,statusCode:503,code:'MEDIA_UNAVAILABLE',message:'Controlled unavailable transport',requestId:'browser-transient-503'})});}if(fault==='deny'&&index===10){fault='none';const headers={...route.request().headers(),authorization:'Bearer '+readerToken};wrongActorPrivateStatus=(await route.fetch({headers})).status();const response=await route.fetch({url:'http://127.0.0.1:4315/api/v1/content/admin/works/'+"7ea307e9-5953-49c1-bae3-4667de99c989"+'/chapters/'+"8639544a-33e8-45d3-a3b9-5ef36d51f43b",headers});denialStatus=response.status();return route.fulfill({response});}return route.continue();});
  page.on('requestfailed',request=>{if(request.url().includes('/content'))failed.push({url:request.url().split('/').slice(-2).join('/'),failure:request.failure()});});
  await page.goto('http://127.0.0.1:4316/admin/works/'+"7ea307e9-5953-49c1-bae3-4667de99c989"+'/chapters/'+"8639544a-33e8-45d3-a3b9-5ef36d51f43b"+'/edit');await page.getByRole('button',{name:'معاينة خاصة',exact:true}).click();const dialog=page.getByRole('dialog');const list=dialog.locator('ol[aria-label="صفحات الفصل المصور"] > li');
  stage='retry';await dialog.getByRole('button',{name:'إعادة تحميل الصفحة 1',exact:true}).click();await page.waitForFunction(()=>document.querySelector('[role="dialog"] img[alt="صفحة 1"]')?.complete);await page.waitForFunction(()=>document.querySelectorAll('[role="dialog"] img[src^="blob:"]').length===5);const initial=requested.slice();if(initial.some(index=>index>5)||initial.filter(i=>i===1).length!==2)throw Error('Constrained initial/retry policy failed');
  stage='jump';await list.nth(24).scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const i=document.querySelector('[role="dialog"] img[alt="صفحة 25"]');return i?.complete&&i.naturalWidth;});const jump=requested.slice();if(!jump.includes(25))throw Error('Jump did not fetch visible page');
  stage='reversal';await list.nth(4).scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const i=document.querySelector('[role="dialog"] img[alt="صفحة 5"]');return i?.complete&&i.naturalWidth;});
  stage='denial';fault='deny';await list.nth(10).scrollIntoViewIfNeeded();const retry=dialog.getByRole('button',{name:'إعادة تحميل الصفحة 11',exact:true});await retry.waitFor();if(await page.evaluate(()=>window.__liveImages())!==0)throw Error('Private URLs survived confirmed denial');const deniedCount=requested.length;await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));if(requested.length!==deniedCount)throw Error('Denial automatically resumed');await retry.click();await page.waitForFunction(()=>{const i=document.querySelector('[role="dialog"] img[alt="صفحة 11"]');return i?.complete&&i.naturalWidth;});
  if(denialStatus!==403||wrongActorPrivateStatus!==404)throw Error('Actual authority outcomes changed');stage='scope';const previous=await dialog.getByRole('img',{name:'صفحة 11',exact:true}).getAttribute('src');await dialog.getByRole('button',{name:'النسخة المحفوظة',exact:true}).click();await page.waitForFunction(old=>![...document.querySelectorAll('[role="dialog"] img')].some(i=>i.src===old),previous);await page.waitForFunction(()=>{const i=document.querySelector('[role="dialog"] img[alt="صفحة 1"]');return i?.complete&&i.naturalWidth;});
  stage='close';await dialog.getByRole('button',{name:'إغلاق',exact:true}).click();await page.waitForFunction(()=>window.__liveImages()===0);
  return {passed:true,reportedConnection:{saveData:true,effectiveType:'4g',source:'Controlled native EventTarget network-preference boundary, not a physical data-saver/device claim'},initialRequests:initial,afterJump:jump,requests:requested,failed,actualExpressPrivateWrongActor:wrongActorPrivateStatus,actualExpressAdminEndpointDenial:denialStatus,denialInjection:'Real USER content GET returns non-disclosing 404; real administrator Chapter endpoint returns403, replayed at controlled media transport boundary to verify global denial fencing',individual503:'Controlled network fault then actual authenticated read retry',ownedUrlsAfterClose:await page.evaluate(()=>window.__liveImages()),scope:'Current draft to saved persisted preview; exact Chapter/account/unmount races also covered at real QueryClient/transport boundary'};
 }catch(error){throw Error(JSON.stringify({stage,error:String(error),requests:requested,failed,alerts:await page.getByRole('alert').allTextContents()}));}finally{await context.close();}
}
)(page);
```
````

## progressive-real-viewer-races

Original capture: `progressive-real-viewer-races.txt`. Bytes: 72. SHA-256: `fe81867b3f965053abfa0351fb64579ffb58e23fae12790c54b52cd6f177cd1d`.

```text
### Error
Error: Actual USER authority did not deny administrator media
```
