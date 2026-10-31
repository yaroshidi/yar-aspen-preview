(()=>{
const D=document.documentElement;
const STATIC=D.classList.contains('static');
if(STATIC)document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager');
const CAPTURE=/capture/.test(location.search);
const REDUCE=D.classList.contains('noanim');
const ANIM=!STATIC&&!REDUCE;
const MQ=matchMedia('(max-width:1023px)');
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const GLYPHS='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*+=/<>';
const rg=()=>GLYPHS[(Math.random()*GLYPHS.length)|0];

/* ---------- theme ---------- */
let INK=[35,35,35],PAPER=[255,255,255];
const readTheme=()=>{const cs=getComputedStyle(D);const hex=v=>{v=v.trim().replace('#','');if(v.length===3)v=v.split('').map(c=>c+c).join('');return[parseInt(v.slice(0,2),16),parseInt(v.slice(2,4),16),parseInt(v.slice(4,6),16)]};INK=hex(cs.getPropertyValue('--ink'));PAPER=hex(cs.getPropertyValue('--paper'));};
readTheme();
$('#tgl').addEventListener('click',()=>{
  const flip=()=>{D.classList.toggle('dark');try{localStorage.setItem('yar-theme',D.classList.contains('dark')?'dark':'light')}catch(e){};readTheme();HT.forEach(h=>h.draw(T));DITH.forEach(d=>d.draw())};
  if(document.startViewTransition&&ANIM){const s=document.createElement('style');s.textContent='::view-transition-old(root){animation:none}::view-transition-new(root){animation:sweep 1.1s cubic-bezier(.87,0,.13,1) both}@keyframes sweep{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0)}}';document.head.appendChild(s);document.startViewTransition(flip).finished.then(()=>s.remove())}else flip();
});

/* ---------- clocks ---------- */
const ck=$('#clock'),ck2=$('#clock2'),hH=$('#hH'),hM=$('#hM');
const dxb=()=>{const p=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',hour:'numeric',minute:'2-digit',hour12:true}).formatToParts(new Date());const g=t=>p.find(x=>x.type===t).value;return{h:+g('hour'),m:+g('minute'),s:`${g('hour').padStart(2,'0')}:${g('minute')} ${g('dayPeriod')}`}};
let alt=0;
const scrambleTo=(el,txt,dur=600)=>{if(!ANIM){el.textContent=txt;return}const t0=performance.now();const f=now=>{const k=Math.min(1,(now-t0)/dur);const n=Math.floor(k*txt.length);el.textContent=txt.slice(0,n)+[...txt.slice(n)].map(c=>c===' '?' ':rg()).join('').slice(0,Math.max(0,txt.length-n));if(k<1)requestAnimationFrame(f);else el.textContent=txt};requestAnimationFrame(f)};
const tick=(anim)=>{const t=dxb();const label=alt?`${t.s} Dubai`:`${t.s} DXB`;anim?scrambleTo(ck,label):ck.textContent=label;ck2.textContent=t.s;
  hH.setAttribute('transform',`rotate(${(t.h%12)*30+t.m*.5} 16 16)`);hM.setAttribute('transform',`rotate(${t.m*6} 16 16)`)};
tick(false);
if(!STATIC&&!CAPTURE)setInterval(()=>{alt^=1;tick(true)},7000);

/* ---------- logo coin ---------- */
const logo=$('#logo');const coin=()=>{if(!ANIM)return;logo.classList.remove('spin');void logo.offsetWidth;logo.classList.add('spin')};
logo.addEventListener('mouseenter',coin);
if(ANIM&&!CAPTURE)setInterval(coin,9000);

/* ---------- mobile menu ---------- */
const mb=$('#menuB'),mm=$('#mm');
const setMenu=o=>{mm.classList.toggle('open',o);mb.setAttribute('aria-expanded',o);mb.firstChild.textContent=o?'Close ':'Menu '};
mb.addEventListener('click',()=>setMenu(!mm.classList.contains('open')));
addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

/* ---------- halftone tiles ---------- */
const N=new Float32Array(16384).map((_,i)=>{const x=Math.sin(i*12.9898+((i>>7)*78.233))*43758.5453;return(x-Math.floor(x)-.5)*.16});
const BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>(v+.5)/16);
let T=0;
class Halftone{
  constructor(el){this.el=el;this.scene=el.closest('[data-scene]')||el;
    const m=(this.scene.dataset.mark||'').split(',').map(Number);this.m=m.length>=3?m:null;
    this.cv=document.createElement('canvas');this.cv.setAttribute('aria-hidden','true');el.appendChild(this.cv);this.cx=this.cv.getContext('2d');
    if(this.m){this.mk=document.createElement('div');this.mk.className='mk';this.mk.innerHTML='<svg viewBox="0 0 160 169" preserveAspectRatio="none"><use href="#y"/></svg>';el.appendChild(this.mk)}
    this.seed=Math.random()*100;this.vis=false;this.layout()}
  layout(){const r=this.el.getBoundingClientRect(),s=this.scene.getBoundingClientRect();this.ox=r.left-s.left;this.oy=r.top-s.top;this.w=r.width;this.h=r.height;
    const cell=this.cell=2;this.cv.width=Math.max(1,Math.ceil(r.width/cell));this.cv.height=Math.max(1,Math.ceil(r.height/cell));this.img=this.cx.createImageData(this.cv.width,this.cv.height);this.u32=new Uint32Array(this.img.data.buffer);
    if(this.m){const[cx,cy,hh,rot]=this.m;const mh=hh*s.width*(MQ.matches?1.25:1),mw=mh*160/169;this.mk.style.cssText=`width:${mw}px;height:${mh}px;left:${cx*s.width-this.ox-mw/2}px;top:${cy*s.height-this.oy}px;transform:rotate(${rot||0}deg);transform-origin:50% 0`}
    this.draw(T)}
  draw(t){const W=this.cv.width,H=this.cv.height,u=this.u32,c=this.cell,ox=this.ox,oy=this.oy;
    const ink=(255<<24)|(INK[2]<<16)|(INK[1]<<8)|INK[0],pap=(255<<24)|(PAPER[2]<<16)|(PAPER[1]<<8)|PAPER[0];
    const ts=t*.00025;
    for(let y=0;y<H;y++){const sy=oy+y*c;const row=y*W;const by=(y&3)<<2;
      const a1=Math.cos(sy*.0047-ts*.8),a3=sy*.0021;
      for(let x=0;x<W;x++){const sx=ox+x*c;
        let v=.54+.2*Math.sin(sx*.0039+ts)*a1+.14*Math.sin(sx*.0023+a3+ts*.6)+.08*Math.sin(sx*.011-sy*.008+ts*2.4);
        u[row+x]=v+N[(y&127)*128+(x&127)]<BAYER[by|(x&3)]?ink:pap}}
    this.cx.putImageData(this.img,0,0)}
}
const HT=$$('.ht').map(e=>new Halftone(e));
const io=new IntersectionObserver(es=>es.forEach(e=>{const h=e.target.__ht;if(h)h.vis=e.isIntersecting}),{rootMargin:'100px'});
HT.forEach(h=>{h.el.__ht=h;io.observe(h.el)});

/* dithered portrait */
class Dither{constructor(cv){this.cv=cv;this.im=new Image();this.im.onload=()=>this.draw();this.im.src=cv.dataset.dither;}
  draw(){if(!this.im.complete||!this.im.naturalWidth)return;const r=this.cv.getBoundingClientRect();const cell=2.6;const W=Math.ceil(r.width/cell),H=Math.ceil(r.height/cell);this.cv.width=W;this.cv.height=H;const x=this.cv.getContext('2d');
    const iw=this.im.naturalWidth,ih=this.im.naturalHeight,sc=Math.max(W/iw,H/ih),dw=iw*sc,dh=ih*sc;x.filter='grayscale(1) contrast(1.35) brightness(1.12)';x.drawImage(this.im,(W-dw)/2,(H-dh)/2-H*.02,dw,dh);x.filter='none';
    const d=x.getImageData(0,0,W,H),p=d.data;for(let y=0;y<H;y++)for(let i=0;i<W;i++){const k=(y*W+i)*4;const v=p[k]/255;const on=v<BAYER[((y&3)<<2)|(i&3)];const c=on?INK:PAPER;p[k]=c[0];p[k+1]=c[1];p[k+2]=c[2];p[k+3]=255}
    x.putImageData(d,0,0)}}
const DITH=$$('canvas[data-dither]').map(c=>new Dither(c));

let rT;addEventListener('resize',()=>{clearTimeout(rT);rT=setTimeout(()=>{HT.forEach(h=>h.layout());DITH.forEach(d=>d.draw());fitAll()},150)});

/* ---------- service figures ---------- */
const FIG=[
 (t)=>{let s='<circle cx="100" cy="100" r="88"/>';for(let i=0;i<60;i++){const a=i*Math.PI/30,r1=i%5?93:90,r2=97;s+=`<line x1="${100+Math.cos(a)*r1}" y1="${100+Math.sin(a)*r1}" x2="${100+Math.cos(a)*r2}" y2="${100+Math.sin(a)*r2}"/>`}
   const a=t*.0012;for(let k=0;k<14;k++){const b=a-k*.06;s+=`<line x1="100" y1="100" x2="${100+Math.cos(b)*86}" y2="${100+Math.sin(b)*86}" stroke-opacity="${(1-k/14)*.8}"/>`}
   s+='<line x1="100" y1="20" x2="100" y2="180" stroke-dasharray="2 5"/><line x1="20" y1="100" x2="180" y2="100" stroke-dasharray="2 5"/>';
   [[.7,52],[2.6,30],[4.4,68]].forEach(([ang,r])=>{const d=((a-ang)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);const o=Math.max(0,1-d/2.2);s+=`<rect x="${100+Math.cos(ang)*r-3}" y="${100+Math.sin(ang)*r-3}" width="6" height="6" fill="currentColor" stroke="none" opacity="${o}"/>`});return s},
 (t)=>{const V=[];for(const x of[-1,1])for(const y of[-1,1])for(const z of[-1,1])V.push([x,y,z]);const E=[[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]];
   const pr=(v,a,b,s)=>{let[x,y,z]=v;let X=x*Math.cos(a)-z*Math.sin(a),Z=x*Math.sin(a)+z*Math.cos(a);let Y=y*Math.cos(b)-Z*Math.sin(b);Z=y*Math.sin(b)+Z*Math.cos(b);const f=3.2/(Z+4.6);return[100+X*s*f,100+Y*s*f]};
   let s='';for(const[sc,dir,op]of[[62,1,1],[30,-1.6,.6]]){const a=t*.0005*dir,b=.5+Math.sin(t*.0003)*.25;const P=V.map(v=>pr(v,a,b,sc));E.forEach(([i,j])=>s+=`<line x1="${P[i][0]}" y1="${P[i][1]}" x2="${P[j][0]}" y2="${P[j][1]}" stroke-opacity="${op}"/>`);P.forEach(p=>s+=`<rect x="${p[0]-2}" y="${p[1]-2}" width="4" height="4" fill="currentColor" stroke="none" opacity="${op}"/>`)}
   return s+'<rect x="8" y="8" width="184" height="184" stroke-dasharray="2 6" stroke-opacity=".5"/>'},
 (t)=>{let s='<circle cx="100" cy="100" r="14"/><circle cx="100" cy="100" r="2.5" fill="currentColor"/>';for(let i=0;i<72;i++){const a=i*Math.PI/36;const L=48+42*(.5+.5*Math.sin(a*3+t*.0016))*(.6+.4*Math.sin(a*5-t*.001));s+=`<line x1="${100+Math.cos(a)*22}" y1="${100+Math.sin(a)*22}" x2="${100+Math.cos(a)*L}" y2="${100+Math.sin(a)*L}" stroke-opacity="${i%2?.45:1}"/>`}return s+'<circle cx="100" cy="100" r="94" stroke-dasharray="1 4"/>'},
 (t)=>{let s='';const n=7;for(let i=0;i<n;i++){const y0=18+i*(164/(n-1));const d=`M8 ${y0} C 80 ${y0}, 100 100, 168 100`;s+=`<path d="${d}" stroke-opacity=".55"/><rect x="5" y="${y0-3}" width="6" height="6" fill="currentColor" stroke="none"/>`;
   const k=((t*.00035+i/n)%1);const u=1-k;const px=u*u*u*8+3*u*u*k*80+3*u*k*k*100+k*k*k*168,py=u*u*u*y0+3*u*u*k*y0+3*u*k*k*100+k*k*k*100;s+=`<circle cx="${px}" cy="${py}" r="3" fill="currentColor" stroke="none"/>`}
   return s+'<line x1="168" y1="100" x2="194" y2="100"/><circle cx="182" cy="100" r="12"/><circle cx="182" cy="100" r="3.5" fill="#a1ffcb" stroke="none"/>'},
 (t)=>{let s='<line x1="10" y1="180" x2="190" y2="180"/>';const n=14;for(let i=0;i<n;i++){const h=24+120*(.5+.5*Math.sin(i*.62+t*.0011))*(.35+.65*i/n);const x=16+i*12.4;s+=`<rect x="${x}" y="${180-h}" width="7" height="${h}" ${i===n-1?'fill="#a1ffcb" stroke="none"':''}/>`}
   return s+'<line x1="10" y1="120" x2="190" y2="120" stroke-dasharray="3 5" stroke-opacity=".7"/><text x="10" y="113" font-family="Geist Mono,monospace" font-size="9" fill="currentColor" stroke="none" opacity=".7">BASELINE</text>'},
 (t)=>{let s='';const k=(t*.00008)%1;for(let i=0;i<30;i++){const a=-Math.PI/2+i*Math.PI/15;const on=i/30<=k;s+=`<line x1="${100+Math.cos(a)*78}" y1="${100+Math.sin(a)*78}" x2="${100+Math.cos(a)*(on?94:88)}" y2="${100+Math.sin(a)*(on?94:88)}" stroke-opacity="${on?1:.45}"/>`}
   const b=-Math.PI/2+k*2*Math.PI;s+=`<circle cx="${100+Math.cos(b)*66}" cy="${100+Math.sin(b)*66}" r="4" fill="currentColor" stroke="none"/>`;
   s+=`<circle cx="100" cy="100" r="46" stroke-dasharray="3 6" transform="rotate(${t*.02} 100 100)"/><circle cx="100" cy="100" r="66" stroke-opacity=".35"/>`;
   return s+`<text x="100" y="104" text-anchor="middle" font-family="Geist Mono,monospace" font-size="11" fill="currentColor" stroke="none">${String(Math.floor(k*30)+1).padStart(2,'0')}/30</text>`}];
const FIGS=$$('[data-fig]').map(el=>({el,svg:el.querySelector('svg'),f:FIG[+el.dataset.fig],vis:false}));
FIGS.forEach(o=>{o.svg.setAttribute('fill','none');o.svg.setAttribute('stroke','currentColor');o.svg.setAttribute('stroke-width','1');o.svg.innerHTML=o.f(2600);o.el.__fig=o;io.observe(o.el)});
const io2=new IntersectionObserver(es=>es.forEach(e=>{const o=e.target.__fig;if(o)o.vis=e.isIntersecting}));FIGS.forEach(o=>io2.observe(o.el));

/* ---------- fit text ---------- */
function fitAll(){$$('.fit[data-fit]').forEach(el=>{const cs=getComputedStyle(el.parentElement);const cw=el.parentElement.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);el.style.fontSize='100px';const mw=Math.max(...$$('.ln>span',el).map(s=>s.getBoundingClientRect().width));el.style.fontSize=(100*cw*(+el.dataset.fit||1)/mw).toFixed(2)+'px'})}
fitAll();document.fonts&&document.fonts.ready.then(()=>{fitAll();HT.forEach(h=>h.layout())});

/* ---------- belt marquee ---------- */
const belt=$('#belt');let bx=0;
const beltStep=(dt=16)=>{bx-=dt*.045;const hw=belt.scrollWidth/2;if(-bx>=hw)bx+=hw;belt.style.transform=`translate3d(${bx}px,0,0)`};

/* ---------- typewriter ---------- */
const TY=$$('[data-type]');
TY.forEach(el=>{el.dataset.txt=el.textContent.trim().replace(/\s+/g,' ')});
const typePrep=el=>{el.innerHTML=`<span class="vis"></span><span class="scr"></span><span class="rest"></span>`;el.lastChild.textContent=el.dataset.txt};
const typeIn=(el,delay=0)=>{const txt=el.dataset.txt;if(!ANIM){el.textContent=txt;return}
  typePrep(el);const[v,s,r]=el.children;const dur=Math.min(1500,Math.max(520,txt.length*9));let t0=null;
  const f=now=>{if(t0===null)t0=now+delay;const k=Math.max(0,Math.min(1,(now-t0)/dur));const n=Math.floor(k*txt.length);const sc=Math.min(8,txt.length-n);
    v.textContent=txt.slice(0,n);s.textContent=[...txt.slice(n,n+sc)].map(c=>c===' '?' ':rg()).join('');r.textContent=txt.slice(n+sc);
    if(k<1)requestAnimationFrame(f);else el.textContent=txt};requestAnimationFrame(f)};

/* ---------- number scramble ---------- */
const scrNum=el=>{const txt=el.dataset.v||(el.dataset.v=el.textContent);if(!ANIM){el.textContent=txt;return}const t0=performance.now(),dur=1100;
  const f=now=>{const k=Math.min(1,(now-t0)/dur);el.textContent=[...txt].map((c,i)=>/\d/.test(c)&&i/txt.length>=k?'0123456789'[(Math.random()*10)|0]:(/[A-Z$]/.test(c)&&i/txt.length>=k?'#$%&'[(Math.random()*4)|0]:c)).join('');if(k<1)requestAnimationFrame(f);else el.textContent=txt};requestAnimationFrame(f)};

/* ---------- work rows ---------- */
const rows=$$('#rows a'),figs=$$('#pane figure');let wi=0,hov=false;
const vidOn=f=>{if(!ANIM||!wkVis)return;let v=f.querySelector('video');if(!v){v=document.createElement('video');v.muted=true;v.loop=true;v.playsInline=true;v.setAttribute('aria-hidden','true');v.src=f.dataset.video;f.querySelector('.m').appendChild(v)}v.currentTime=0;v.play().catch(()=>{})};
const setW=i=>{wi=i;rows.forEach((r,k)=>r.classList.toggle('on',k===i));figs.forEach((f,k)=>{f.classList.toggle('on',k===i);const v=f.querySelector('video');if(k===i)vidOn(f);else if(v)v.pause()});scrambleTo($('#wkName'),rows[i].dataset.name,420);$('#wkIdx').textContent=`0${i+1} - 0${rows.length}`};
rows.forEach((r,i)=>{r.addEventListener('mouseenter',()=>{hov=true;setW(i)});r.addEventListener('mouseleave',()=>hov=false);r.addEventListener('focus',()=>setW(i))});
let wkVis=false;new IntersectionObserver(e=>wkVis=e[0].isIntersecting).observe($('#rows'));
if(ANIM&&!CAPTURE)setInterval(()=>{if(wkVis&&!hov&&!MQ.matches)setW((wi+1)%rows.length)},3200);

/* ---------- testimonials ---------- */
const Q=[["I'd recommend him to anyone looking for efficient, thoughtful, and pedigreed work.","Founder","Numi, Y Combinator"],
 ["He's also a great educator, able to break down complex tech topics into easily digestible and engaging explanations.","CEO","Noco Agency"],
 ["Yar is a true professional and a pleasure to work with. Flexible, accessible, solution-oriented, and knows Webflow inside and out.","Head of marketing","Redeploy, Stockholm"]];
let qi=0,qTw=null;const qt=$('#qText');qt.dataset.txt=Q[0][0];
const showQ=(i,anim=true)=>{qi=(i+Q.length)%Q.length;qt.dataset.txt=Q[qi][0];anim?typeIn(qt):qt.textContent=Q[qi][0];scrambleTo($('#qPos'),Q[qi][1],500);scrambleTo($('#qCo'),Q[qi][2],500);$('#qCnt').textContent=`0${qi+1} - 0${Q.length}`;runProg()};
const runProg=()=>{if(!window.gsap||!ANIM)return;qTw&&qTw.kill();qTw=gsap.fromTo('#prog',{scaleX:0},{scaleX:1,duration:9,ease:'none',onComplete:()=>showQ(qi+1)})};
['#tPrev','#tPrev2'].forEach(s=>$(s).addEventListener('click',()=>showQ(qi-1)));['#tNext','#tNext2'].forEach(s=>$(s).addEventListener('click',()=>showQ(qi+1)));

/* ---------- cards ---------- */
const cards=$('#cards'),cw=()=>cards.firstElementChild.getBoundingClientRect().width;
const upd=()=>{$('#cPrev').disabled=cards.scrollLeft<4;$('#cNext').disabled=cards.scrollLeft+cards.clientWidth>=cards.scrollWidth-4};upd();cards.addEventListener('scroll',upd,{passive:true});
$('#cPrev').addEventListener('click',()=>cards.scrollBy({left:-cw(),behavior:'smooth'}));$('#cNext').addEventListener('click',()=>cards.scrollBy({left:cw(),behavior:'smooth'}));
const OFF=[0,12,4,16,8];$$('.card').forEach((c,i)=>{if(!MQ.matches)c.style.transform=`translateY(${OFF[i%5]}px)`});

/* ---------- kinetic CTA letters ---------- */
const KB=$$('[data-k]');KB.forEach(el=>{const t=el.textContent;el.innerHTML=[...t].map(c=>c===' '?'<span class="ch" style="width:.24em"></span>':`<span class="ch"><span class="col">${c}<i style="top:-100%">${rg().toUpperCase()}</i><i style="top:-200%">${rg().toUpperCase()}</i><i style="top:-300%">${rg().toUpperCase()}</i></span></span>`).join('');});
const roll=()=>{if(!window.gsap||!ANIM)return;KB.forEach((el,j)=>gsap.fromTo(el.querySelectorAll('.col'),{yPercent:300},{yPercent:0,duration:.85,ease:'expo.out',stagger:.025,delay:j*.08}))};

/* ---------- main loop for canvases & figures ---------- */
let last=0,lastF=0;
const frame=now=>{T=now;if(now-last>66){last=now;HT.forEach(h=>{if(h.vis)h.draw(now)})}if(now-lastF>33){lastF=now;FIGS.forEach(o=>{if(o.vis)o.svg.innerHTML=o.f(now)})}};
window.__frame=(ms)=>{frame(ms);beltStep(1000/30)};
if(STATIC||REDUCE){HT.forEach(h=>h.draw(5000));setTimeout(()=>HT.forEach(h=>h.draw(5000)),400)}

/* ---------- reveal everything statically ---------- */
if(!ANIM||!window.gsap){TY.forEach(el=>el.textContent=el.dataset.txt);$$('[data-scr]').forEach(e=>e.dataset.v=e.textContent);
  if(!STATIC){(function L(n){beltStep(16);requestAnimationFrame(L)})()}
  return}

gsap.registerPlugin(ScrollTrigger);
let lenis=null;
if(!CAPTURE){lenis=new Lenis({duration:1.15,smoothWheel:true});window.__lenis=lenis;lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0)}
if(!CAPTURE)gsap.ticker.add((t,dt)=>{frame(performance.now());beltStep(dt)});

/* prep typewriter targets (hidden until revealed) */
TY.forEach(el=>{if(el.id!=='qText')typePrep(el),el.firstChild.textContent='',el.children[2].textContent=el.dataset.txt});
const heroTY=$$('.hero [data-type]');
TY.filter(el=>!heroTY.includes(el)&&el.id!=='qText').forEach(el=>ScrollTrigger.create({trigger:el,start:'top 88%',once:true,onEnter:()=>typeIn(el)}));
ScrollTrigger.create({trigger:'#testimonials',start:'top 75%',once:true,onEnter:()=>{showQ(0)}});
$$('[data-scr]').forEach(el=>{el.dataset.v=el.textContent;ScrollTrigger.create({trigger:el,start:'top 90%',once:true,onEnter:()=>scrNum(el)})});

/* line reveals */
$$('.ln>span').forEach(s=>{if(s.closest('.hero')||s.closest('.svc'))return;gsap.from(s,{yPercent:110,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:s.parentElement,start:'top 92%'}})});
gsap.from('.svc .pin .ln>span',{yPercent:110,duration:1.2,ease:'expo.out',stagger:.08,scrollTrigger:{trigger:'.svc',start:'top 70%'}});

/* card parallax stagger */
if(!MQ.matches)$$('.card').forEach((c,i)=>gsap.fromTo(c,{y:OFF[i%5]+40},{y:OFF[i%5]-10,ease:'none',scrollTrigger:{trigger:'#cards',start:'top bottom',end:'bottom top',scrub:true}}));

/* CTA */
ScrollTrigger.create({trigger:'#call',start:'top 88%',onEnter:roll,onEnterBack:roll});
gsap.fromTo('#k1',{xPercent:6},{xPercent:-4,ease:'none',scrollTrigger:{trigger:'#call',start:'top bottom',end:'bottom top',scrub:true}});
gsap.fromTo('#k2',{xPercent:-5},{xPercent:3,ease:'none',scrollTrigger:{trigger:'#call',start:'top bottom',end:'bottom top',scrub:true}});
gsap.from('#call .ghost',{yPercent:-38,ease:'none',scrollTrigger:{trigger:'#call',start:'top bottom',end:'bottom top',scrub:true}});

/* stat tiles drift */
if(!MQ.matches){gsap.fromTo('.st.s1',{y:60},{y:-40,ease:'none',scrollTrigger:{trigger:'.stats',start:'top bottom',end:'bottom top',scrub:true}});
 gsap.fromTo('.st.s3',{y:120},{y:-20,ease:'none',scrollTrigger:{trigger:'.stats',start:'top bottom',end:'bottom top',scrub:true}})}

/* anchors */
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=$(a.getAttribute('href'));if(!t)return;e.preventDefault();setMenu(false);lenis?lenis.scrollTo(t,{offset:-parseFloat(getComputedStyle(D).getPropertyValue('--hh'))}):t.scrollIntoView()}));

/* ---------- intro ---------- */
const pre=$('#pre'),wrap=[$('.hdr'),$('main'),$('footer')];
const tl=gsap.timeline({delay:.15});
if(CAPTURE){pre.remove()}else{
tl.to('#pre svg',{opacity:1,duration:.5,ease:'power2.out'})
  .to('#pre svg',{scale:1.7,duration:.7,ease:'expo.inOut'},'+=.15')
  .addLabel('in')
  .fromTo(wrap,{x:()=>innerWidth*.55},{x:0,duration:1.15,ease:'expo.inOut',clearProps:'transform'},'in-=.15')
  .to(pre,{clipPath:'inset(0 100% 0 0)',duration:1.15,ease:'expo.inOut',onComplete:()=>pre.remove()},'in-=.15')}
tl.from('.hero .ln>span',{yPercent:110,duration:1.3,ease:'expo.out',stagger:.07},CAPTURE?0:'in+=.45')
  .add(()=>{heroTY.forEach((el,i)=>typeIn(el,i*180));coin()},CAPTURE?0:'in+=.55');
})();
