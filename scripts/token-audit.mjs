import { chromium } from "@playwright/test"
const BASE = process.env.BASE_URL || "http://localhost:5173"

const SCALE = {
  11:[1.5,-0.005], 13:[1.5,-0.005], 15:[1.5,-0.005], 17:[1.4,-0.009],
  19:[1.4,-0.009], 22:[1.25,-0.012], 26:[1.25,-0.012], 30:[1.2,-0.013],
  37:[1.2,-0.015], 45:[1.13,-0.015], 56:[1.06,-0.02], 60:[1.1,-0.022], 66:[1,-0.025],
}
const RADII = [0,5,7.5,15,9999,3.40282e38]
const near=(a,b,t=0.6)=>Math.abs(a-b)<=t

const b = await chromium.launch()
const p = await b.newPage({ viewport:{width:1440,height:1000} })
const bad=[]
for (const route of ["/","/search","/wallet","/login"]) {
  await p.goto(BASE + route, { waitUntil: "networkidle" })
  await p.waitForTimeout(1500)
  const rows = await p.evaluate(() => {
    const out=[]
    document.querySelectorAll("h1,h2,h3,p,a,button,span,td,th,li,input,label").forEach(el=>{
      const t=(el.textContent||"").trim()
      if(!t || el.offsetParent===null) return
      const c=getComputedStyle(el)
      out.push({
        tag:el.tagName, txt:t.slice(0,26),
        fs:parseFloat(c.fontSize),
        lh:c.lineHeight==="normal"?null:parseFloat(c.lineHeight),
        ls:c.letterSpacing==="normal"?0:parseFloat(c.letterSpacing),
        br:parseFloat(c.borderTopLeftRadius),
        fw:c.fontWeight,
      })
    })
    return out
  })
  const seen=new Set()
  for(const r of rows){
    const k=`${r.fs}|${r.lh}|${r.ls}`
    const step=SCALE[Math.round(r.fs)]
    if(!step){ if(!seen.has("fs"+r.fs)){seen.add("fs"+r.fs);bad.push(`${route} FONT-SIZE ${r.fs}px off-scale  <${r.tag}> "${r.txt}"`)} ; continue }
    if(seen.has(k)) continue; seen.add(k)
    const [lh,ls]=step
    if(r.lh!==null && !near(r.lh, r.fs*lh, 1.2))
      bad.push(`${route} LINE-HEIGHT ${r.fs}px got ${r.lh.toFixed(1)} want ${(r.fs*lh).toFixed(1)}  <${r.tag}> "${r.txt}"`)
    const okLs = near(r.ls, r.fs*ls, 0.25) || r.ls>0 || near(r.ls, r.fs*-0.009,0.25) || near(r.ls, r.fs*-0.02,0.25)
    if(!okLs) bad.push(`${route} TRACKING ${r.fs}px got ${r.ls.toFixed(3)} want ${(r.fs*ls).toFixed(3)}  <${r.tag}> "${r.txt}"`)
    if(!["400","700"].includes(r.fw)) bad.push(`${route} WEIGHT ${r.fw}  <${r.tag}> "${r.txt}"`)
    if(r.br>0 && !RADII.some(v=>near(r.br,v,0.6))) bad.push(`${route} RADIUS ${r.br}px off-set  <${r.tag}> "${r.txt}"`)
  }
}
console.log(bad.length? bad.slice(0,40).join("\n") : "ALL VALUES ON-TOKEN")
console.log(`\n${bad.length} violation(s)`)
await b.close()

