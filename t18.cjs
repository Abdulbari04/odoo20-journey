const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [w,h] of [[1280,800],[400,800]]){
const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&!/font|ERR_/i.test(m.text())&&errs.push(m.text()));
await p.goto('http://localhost:4173/');await p.waitForTimeout(500);
await p.click('.auth-tabs button:nth-child(2)');await p.fill('.auth-card label:nth-of-type(1) input','بوري');
const pw=p.locator('input[type=password]');await pw.nth(0).fill('1234');await pw.nth(1).fill('1234');await p.click('.auth-go');await p.waitForTimeout(400);await p.click('.hello .auth-go');
await p.click('.cta.big');await p.waitForTimeout(400);
const skip=await p.locator('.exam.skip').count();
// search
await p.click('.srchb');await p.fill('.srch-h input','Vendor');await p.waitForTimeout(300);
const groups=await p.locator('.srch-g').count();const lockedG=await p.locator('.srch-g.is-lk').count();
await p.screenshot({path:`../s1_${w}.png`});
await p.locator('.srch-g.is-lk').first().click();await p.waitForTimeout(300);
const msg=await p.locator('.srch-lock p').first().innerText();
const hasExam=await p.locator('.srch-lock .exam.skip').count();
await p.click('.srch-lock .cta');await p.waitForTimeout(200);
const nq=await p.locator('.srch-lock .exq li').count();
await p.screenshot({path:`../s2_${w}.png`});
const src=require('fs').readFileSync('src/levels.ts','utf8');
// answer correctly by reading ok strings
const oks=[...src.matchAll(/ok: '([^']+)'/g)].map(m=>m[1]);
for(let i=0;i<nq;i++){const q=p.locator('.srch-lock .exq li').nth(i);const lbls=await q.locator('label.exopt').allInnerTexts();const hit=lbls.findIndex(t=>oks.includes(t.trim()));await q.locator('label.exopt').nth(hit>=0?hit:0).click()}
console.log('dis',await p.locator('.srch-lock .cta').isDisabled(),await p.locator('.srch-lock input:checked').count(),nq);await p.click('.srch-lock .cta',{timeout:3000}).catch(e=>console.log('clickfail'));await p.waitForTimeout(300);
const res=await p.locator('.srch-lock.ok p').innerText();
const openBtn=await p.locator('.srch-lock.ok .cta').count();
if(openBtn){await p.click('.srch-lock.ok .cta');await p.waitForTimeout(600)}
const overlay=await p.locator('.srch-ov').count();
const pos=await p.evaluate(()=>{const s=document.querySelector('.srchb').getBoundingClientRect(),m=[...document.querySelectorAll('.modeb')].filter(e=>!e.classList.contains('srchb')).map(e=>e.getBoundingClientRect());return {s:[s.left|0,s.right|0],m:m.map(r=>[r.left|0,r.right|0])}});
console.log(w,{skip,groups,lockedG,msg,hasExam,nq,res,openBtn,overlay,pos,sw:await p.evaluate(()=>document.documentElement.scrollWidth),errs});
await p.screenshot({path:`../s3_${w}.png`});await p.close()}
await b.close()})()
