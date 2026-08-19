import { chromium } from "@playwright/test"
const BASE = process.env.BASE_URL || "http://localhost:5173"
const b=await chromium.launch()
const p=await b.newPage({viewport:{width:1440,height:1000}})
await p.goto(BASE + "/", { waitUntil: "networkidle" })
await p.waitForTimeout(2600)

const run=async()=>p.evaluate(()=>{
  const lum=c=>{const s=c.map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*s[0]+.7152*s[1]+.0722*s[2]}
  const px=document.createElement("canvas");px.width=px.height=1
  const pctx=px.getContext("2d",{willReadFrequently:true})
  const composite=(cssColor,bg)=>{
    pctx.clearRect(0,0,1,1)
    pctx.fillStyle=`rgb(${bg[0]},${bg[1]},${bg[2]})`; pctx.fillRect(0,0,1,1)
    pctx.fillStyle=cssColor; pctx.fillRect(0,0,1,1)
    const d=pctx.getImageData(0,0,1,1).data; return [d[0],d[1],d[2]]
  }
  const CARBON="rgb(24,24,27)"
  const scrim=(a,bg)=>composite(`rgba(24,24,27,${a})`,bg)

  const vid=document.querySelector("#hero video")
  const hero=document.querySelector("#hero > div:first-child")
  const hr=hero.getBoundingClientRect()
  const cv=document.createElement("canvas")
  const vw=vid.videoWidth,vh=vid.videoHeight
  cv.width=vw;cv.height=vh
  const ctx=cv.getContext("2d",{willReadFrequently:true})
  ctx.drawImage(vid,0,0,vw,vh)
  const scale=Math.max(hr.width/vw,hr.height/vh)
  const ox=(hr.width-vw*scale)/2, oy=(hr.height-vh*scale)/2

  const out={}
  for(const [name,sel] of [["headline","#hero h1"],["subhead","#hero p"],["cta-label","#hero a[href='/search']"],["ghost-link","#hero a[href='#how-it-works']"],["trust-badge","#hero ul li"],["eyebrow","#hero span"]]){
    const el=document.querySelector(sel); if(!el){out[name]="missing";continue}
    const r=el.getBoundingClientRect()
    let bright=null,bl=-1
    for(let fx=0.05;fx<=0.95;fx+=0.1)for(let fy=0.15;fy<=0.85;fy+=0.175){
      const vx=Math.round((r.left+r.width*fx-hr.left-ox)/scale)
      const vy=Math.round((r.top+r.height*fy-hr.top-oy)/scale)
      if(vx<0||vy<0||vx>=vw||vy>=vh)continue
      const d=ctx.getImageData(vx,vy,1,1).data,c=[d[0],d[1],d[2]],L=lum(c)
      if(L>bl){bl=L;bright=c}
    }
    if(!bright){out[name]="offscreen";continue}
    let bg=scrim(0.50,bright)
    const t=(r.top+r.height/2-hr.top)/hr.height
    const a=t<=0.5?0.75+(0.30-0.75)*(t/0.5):0.30+(0.85-0.30)*((t-0.5)/0.5)
    bg=scrim(a,bg)
    const cs=getComputedStyle(el)
    const fg=composite(cs.color,bg)
    const L1=lum(fg),L2=lum(bg)
    const cr=(Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05)
    const size=parseFloat(cs.fontSize),bold=+cs.fontWeight>=700
    const large=size>=24||(size>=18.66&&bold)
    out[name]={size,ratio:+cr.toFixed(2),needs:large?3:4.5,pass:cr>=(large?3:4.5)}
  }
  return out
})

const frames=[];for(let i=0;i<6;i++){frames.push(await run());await p.waitForTimeout(700)}
console.log("=== WORST CASE ACROSS 6 REAL VIDEO FRAMES ===")
let fail=0
for(const n of Object.keys(frames[0])){
  const v=frames.map(f=>f[n]).filter(x=>x&&x.ratio)
  if(!v.length){console.log(n.padEnd(13)+frames[0][n]);continue}
  const w=v.reduce((a,x)=>x.ratio<a.ratio?x:a)
  if(!w.pass)fail++
  console.log(`${n.padEnd(13)} ${String(w.size+"px").padStart(5)}  worst=${String(w.ratio).padStart(6)}:1  needs ${w.needs}  ${w.pass?"PASS":"*** FAIL ***"}`)
}
console.log(fail?`\n${fail} FAILING`:"\nall pass WCAG AA")
await b.close()

