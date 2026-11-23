(function(){
'use strict';
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var cv=document.getElementById('orb'),ctx=cv.getContext('2d'),cv2=document.getElementById('orb2'),ctx2=cv2.getContext('2d'),ctx1=ctx;
var W=0,H=0,DPR=1,cx=0,cy=0,R=0,mobile=false;
function resize(){
  DPR=Math.min(window.devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;
  cv.width=W*DPR;cv.height=H*DPR;ctx1.setTransform(DPR,0,0,DPR,0,0);cv2.width=W*DPR;cv2.height=H*DPR;ctx2.setTransform(DPR,0,0,DPR,0,0);
  mobile=W<=820;
  R=mobile?Math.min(W*.72,H*.5):Math.min(H*.74,W*.4);
  cx=mobile?W*.5:W-R*.42; cy=H*.5;
  measure();
}
/* ---- sphere points ---- */
var N=mobile?9000:17000, P=[];
function rnd(){return Math.random()}
(function(){
  var ga=Math.PI*(3-Math.sqrt(5));
  for(var i=0;i<N;i++){
    var y=Math.max(-1,Math.min(1,1-2*(i+.5)/N+(rnd()-.5)*(2/N)*1.6)), r=Math.sqrt(1-y*y), th=ga*i+(rnd()-.5)*.35;
    var rad=1+(rnd()-.5)*.018; if(rnd()<.05) rad+=rnd()*.06;
    P.push({x:Math.cos(th)*r*rad,y:y*rad,z:Math.sin(th)*r*rad,s:.5+rnd()*.6});
  }
})();
var PX=new Float32Array(N),PY=new Float32Array(N),PZ=new Float32Array(N),PS=new Float32Array(N),PL=new Float32Array(N);
for(var q=0;q<N;q++){var pq=P[q];PX[q]=pq.x;PY[q]=pq.y;PZ[q]=pq.z;PS[q]=pq.s;PL[q]=1/Math.sqrt(pq.x*pq.x+pq.y*pq.y+pq.z*pq.z)}
var lastDraw=0,lastMove=0;
var rfill=document.querySelector('.rfill'),rmark=document.querySelector('.rmark');
function rulerUpd(){var m=document.documentElement.scrollHeight-innerHeight,p=m>0?Math.min(1,Math.max(0,scrollY/m)):0,h=Math.round(p*innerHeight);rfill.style.height=h+'px';rmark.style.top=h+'px'}
addEventListener('scroll',rulerUpd,{passive:true});addEventListener('resize',rulerUpd);
/* ---- nodes: lon/lat in degrees; order = section order ---- */
var NODES=[
 {id:'home',g:'',lon:0,lat:0,t:'HOME',s:'start'},
 {id:'about',g:'γ',lon:55,lat:20,t:'ABOUT',s:'story & background'},
 {id:'works',g:'ε',lon:110,lat:-18,t:'WORKS',s:'projects & case studies'},
 {id:'stack',g:'τ',lon:165,lat:22,t:'STACK',s:'tools & skills'},
 {id:'experience',g:'β',lon:220,lat:-20,t:'RÉSUMÉ',s:'experience & timeline'},
 {id:'contact',g:'λ',lon:275,lat:14,t:'CONTACT',s:'say hello'}
];
var D=Math.PI/180;
NODES.forEach(function(n){var la=n.lat*D,lo=n.lon*D;n.v=[Math.cos(la)*Math.sin(lo),Math.sin(la),Math.cos(la)*Math.cos(lo)]});
/* ---- sections / scroll mapping ---- */
var secs=[].slice.call(document.querySelectorAll('section[data-node]')),tops=[],tlEl=document.getElementById('tl'),prog=document.getElementById('prog'),entries=[].slice.call(document.querySelectorAll('.te'));
function measure(){tops=secs.map(function(s){return s.getBoundingClientRect().top+scrollY})}
var target=0,f=0;
function sm(t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)}
function computeTarget(){
  var y=scrollY+H*.5,t=0,band=H*.32;
  for(var i=1;i<tops.length;i++) t+=sm((y-(tops[i]-band))/(band*2));
  target=t;
}
function nodeAt(fv){
  var i=Math.max(0,Math.min(NODES.length-2,Math.floor(fv))),u=fv-i;
  if(fv>=NODES.length-1){i=NODES.length-2;u=1}
  var a=NODES[i],b=NODES[i+1];
  return {lon:(a.lon+(b.lon-a.lon)*u)*D,lat:(a.lat+(b.lat-a.lat)*u)*D};
}
/* ---- interaction ---- */
var mx=0,my=0,hover=-1,hits=[];
addEventListener('pointermove',function(e){lastMove=performance.now();mx=(e.clientX/W-.5);my=(e.clientY/H-.5);
  hover=-1;for(var i=0;i<hits.length;i++){var h=hits[i],dx=e.clientX-h.x,dy=e.clientY-h.y;if(dx*dx+dy*dy<h.r*h.r){hover=h.i;break}}
  cv.style.pointerEvents='none';document.body.style.cursor=hover>=0?'pointer':'';});
addEventListener('click',function(e){
  for(var i=0;i<hits.length;i++){var h=hits[i],dx=e.clientX-h.x,dy=e.clientY-h.y;if(dx*dx+dy*dy<h.r*h.r){
    tIdx=h.i;goTo(secTarget(h.i,h.i>curSec()?1:-1),0,false);return}}
});
/* ---- smooth section snapping ---- */
var snapping=false,lockUntil=0,glideDir=0,glideId=0,tIdx=0,accD=0,fineP=matchMedia('(pointer:fine)').matches&&!RM;
function goTo(y,dir,chain){
  y=Math.max(0,Math.round(y));var y0=scrollY,d=y-y0;if(Math.abs(d)<2)return;
  if(RM){scrollTo(0,y);return}
  var id=++glideId;snapping=true;glideDir=dir||(d>0?1:-1);
  var t0=performance.now(),dur=chain?Math.min(1500,1100+Math.abs(d)*.1):Math.min(1900,1300+Math.abs(d)*.2);
  (function step(now){if(id!==glideId)return;var t=Math.min(1,(now-t0)/dur),e=chain?1-Math.pow(1-t,3):-(Math.cos(Math.PI*t)-1)/2;
    scrollTo(0,y0+d*e);
    if(t<1)requestAnimationFrame(step);else{lockUntil=(secs[tIdx]&&secs[tIdx].id==='experience')?0:performance.now()+140;snapping=false;glideDir=0;accD=0}})(t0);
}
function tlP(){var r=tlEl.getBoundingClientRect();return Math.max(0,Math.min(1,(H*.62-r.top)/r.height))}
var expVP=0,expForce=false,expEdge=0;
var expCol=document.querySelector('#experience .col');
function expPin(){var r=expCol.getBoundingClientRect();return Math.max(0,Math.round(r.top+scrollY-Math.max(0,(H-r.height)*.42)))}
function expPinned(){return fineP&&tlEl&&Math.abs(scrollY-expPin())<8}
function secTarget(j,dir){var el=secs[j];
  if(fineP&&el&&el.id==='experience'&&tlEl){expForce=true;expVP=dir>0?0:1;expEdge=performance.now();updateTL();return expPin()}
  return tops[j]}
function curSec(){var y=scrollY+H*.5,k=0;for(var i=0;i<tops.length;i++)if(tops[i]<=y)k=i;return k}
function stepSec(dir,ev){
  var dy=Math.abs(ev.deltaY||140);
  if(snapping){ev.preventDefault();
    if(dir!==glideDir){var j0=Math.max(0,Math.min(secs.length-1,tIdx+dir));tIdx=j0;accD=0;goTo(secTarget(j0,dir),dir,true)}
    else if(secs[tIdx]&&secs[tIdx].id==='experience'&&expForce&&(dir>0?expVP<1:expVP>0)){expVP=Math.max(0,Math.min(1,expVP+dir*dy/600));updateTL()}
    else{accD+=dy;if(accD>=140){accD=0;var j1=tIdx+dir;if(j1>=0&&j1<secs.length){tIdx=j1;goTo(secTarget(j1,dir),dir,true)}}}
    return}
  if(performance.now()<lockUntil){ev.preventDefault();return}
  var i=curSec(),top=tops[i],bot=top+secs[i].offsetHeight;
  if(secs[i].id==='experience'&&expPinned()){ev.preventDefault();
    var nv=Math.max(0,Math.min(1,expVP+dir*(ev.deltaY?dy:240)/600)),nowT=performance.now();
    if(nv!==expVP){expVP=nv;if(nv===0||nv===1)expEdge=nowT;updateTL();return}
    var jj=i+dir;if(jj<0||jj>=secs.length)return;tIdx=jj;accD=0;goTo(secTarget(jj,dir),dir,false);return}
  if(dir>0&&bot>scrollY+H+10)return;
  if(dir<0&&top<scrollY-10)return;
  var j=i+dir;if(j<0||j>=secs.length)return;
  ev.preventDefault();tIdx=j;accD=0;goTo(secTarget(j,dir),dir,false);
}
if(fineP){
  addEventListener('wheel',function(e){if(e.ctrlKey||Math.abs(e.deltaY)<3)return;stepSec(e.deltaY>0?1:-1,e)},{passive:false});
  addEventListener('keydown',function(e){
    var k=e.key,dir=0;if(k==='ArrowDown'||k==='PageDown'||(k===' '&&!e.shiftKey))dir=1;else if(k==='ArrowUp'||k==='PageUp'||(k===' '&&e.shiftKey))dir=-1;
    if(!dir||/INPUT|TEXTAREA|SELECT/.test((e.target||{}).tagName||''))return;stepSec(dir,e)});
}
addEventListener('scroll',function(){computeTarget();updateTL()},{passive:true});
addEventListener('resize',function(){resize();computeTarget();layoutWeave();layoutAcc()});
/* ---- timeline progress ---- */
function updateTL(){
  if(!tlEl)return;var r=tlEl.getBoundingClientRect(),p;
  if(expForce&&Math.abs(scrollY-expPin())>H*1.2)expForce=false;
  if(expForce){p=expVP}else{p=(H*.62-r.top)/r.height;p=Math.max(0,Math.min(1,p))}
  prog.style.height=(p*100)+'%';
  entries.forEach(function(en){var er=en.getBoundingClientRect();en.classList.toggle('on',expForce?(er.top-r.top)/r.height<=p+.02:er.top<H*.62)});
}


/* ---- accent collision avoidance: nudge each .ac until it clears text, cards and other accents ---- */
function layoutAcc(){
  var secsA=[].slice.call(document.querySelectorAll('section'));
  if(innerWidth<=820){secsA.forEach(function(sc){[].forEach.call(sc.querySelectorAll('.ac'),function(a){a.style.translate=''})});return}
  var sx=scrollX,sy=scrollY,twS=[];
  [].forEach.call(document.querySelectorAll('.gw .tw[data-t]'),function(t){twS.push([t,t.textContent]);t.textContent=t.dataset.t});
  function R(e){var r=e.getBoundingClientRect();return {l:r.left+sx,t:r.top+sy,r:r.right+sx,b:r.bottom+sy}}
  function U(e){var u=R(e);[].forEach.call(e.querySelectorAll('i'),function(c){var q=R(c);u.l=Math.min(u.l,q.l);u.t=Math.min(u.t,q.t);u.r=Math.max(u.r,q.r);u.b=Math.max(u.b,q.b)});return u}
  function X(a,b,p){return a.l<b.r+p&&b.l<a.r+p&&a.t<b.b+p&&b.t<a.b+p}
  secsA.forEach(function(sc){
    var acs=[].slice.call(sc.querySelectorAll('.ac')).filter(function(a){return getComputedStyle(a).display!=='none'});
    acs.forEach(function(a){a.style.translate=''});
    var sr=R(sc),fixed=[];
    var els=[].slice.call(sc.querySelectorAll('h1,h2,h3,p,li,.kick,.gk,.card,.tags span,.eq,.eqc,.name,.stack-g h4,footer,button,.btn,.roles,.scrollcue,.te'));
    els.forEach(function(e){if(e.closest('.ac')||!e.getBoundingClientRect().width)return;
      if(e.matches('.card,.btn,button,.tags span,.name')){fixed.push(R(e));return}
      var rg=document.createRange();rg.selectNodeContents(e);[].forEach.call(rg.getClientRects(),function(q){if(q.width>1)fixed.push({l:q.left+sx,t:q.top+sy,r:q.right+sx,b:q.bottom+sy})})});
    var orbX=sr.l+innerWidth*.45,placed=[];
    acs.slice().sort(function(a,b){return (b.matches('.gw')?1e6:0)+b.offsetWidth*b.offsetHeight-((a.matches('.gw')?1e6:0)+a.offsetWidth*a.offsetHeight)}).forEach(function(a){
      var base=U(a),w=base.r-base.l,h=base.b-base.t;
      function ok(dx,dy){var c={l:base.l+dx,t:base.t+dy,r:base.r+dx,b:base.b+dy};
        if(c.l<sr.l+2||c.t<sr.t+2||c.b>sr.b-2||c.r>orbX)return false;
        for(var i=0;i<fixed.length;i++)if(X(c,fixed[i],9))return false;
        for(var j=0;j<placed.length;j++)if(X(c,placed[j],7))return false;return true}
      var dx=0,dy=0;
      if(!ok(0,0)){var best=null,bd=1e9;
        for(var yy=-900;yy<=900;yy+=10)for(var xx=-500;xx<=500;xx+=10){var d=xx*xx+yy*yy*1.3;if(d<bd&&ok(xx,yy)){bd=d;best=[xx,yy]}}
        if(best){dx=best[0];dy=best[1];a.style.translate=dx+'px '+dy+'px'}else{a.style.visibility='hidden';return}}
      a.style.visibility='';
      placed.push({l:base.l+dx,t:base.t+dy,r:base.r+dx,b:base.b+dy})})});
  twS.forEach(function(x){x[0].textContent=x[1]})}
/* ---- name weave ---- */
var weave=document.querySelector('.weave'),wsvg=document.querySelector('.wsvg'),nameEl=document.querySelector('.name'),homeEl=document.getElementById('home'),wimgs=[];
var FRONT=[1,2,4];
function layoutWeave(){
  if(!weave||document.body.dataset.v!=='weave'||mobile)return;
  var hr=homeEl.getBoundingClientRect(),letters=[].slice.call(nameEl.children).map(function(e){var r=e.getBoundingClientRect();return {l:r.left-hr.left,r:r.right-hr.left}});
  var nr=nameEl.getBoundingClientRect(),F=parseFloat(getComputedStyle(nameEl).fontSize),nt=nr.top-hr.top,nh=nr.height;
  var gx=(letters[0].l+letters[5].r)/2,gy=nt+nh*.56,iw=F*5.5,ih=iw*402/1600,left=gx-.4928*iw,top=gy-.49*ih;
  [].slice.call(weave.querySelectorAll('img')).forEach(function(i){i.remove()});wimgs=[];
  var R=left+iw;
  function mk(cls,side,a,b,padA,padB){var im=new Image();im.src='assets/images/hands_fresco.png';im.className=cls;im.alt='';im.dataset.side=side;
    im.style.cssText='left:'+left+'px;top:'+top+'px;width:'+iw+'px;clip-path:inset(0px '+(R-b-padB)+'px 0px '+(a-left-padA)+'px);';
    weave.appendChild(im);wimgs.push(im)}
  [-1,1].forEach(function(sd){
    var lo=sd<0?left:gx,hi=sd<0?gx:R;
    mk('wb',sd,lo,hi,0,0);
    FRONT.forEach(function(k){var L=letters[k],a=Math.max(L.l,lo),b=Math.min(L.r,hi);if(b-a<2)return;
      mk('wf',sd,a,b,a===L.l?3:0,b===L.r?3:0)})});
  wsvg.dataset.hw=homeEl.clientWidth;
  var hw=homeEl.clientWidth,hh=homeEl.clientHeight;
  wsvg.setAttribute('viewBox','0 0 '+hw+' '+hh);
  var x0=letters[0].l,x1=letters[5].r,ry=nt+nh+16,tk='';
  for(var xx=x0;xx<=x1;xx+=14){var big=Math.round((xx-x0)/14)%5===0;tk+='M'+xx.toFixed(1)+' '+ry+'v'+(big?10:5)}
  wsvg.innerHTML='<g fill="none" stroke="#0B0B0B" stroke-width="1"><path d="M'+x0+' '+ry+'H'+x1+'" opacity=".8"/><path d="'+tk+'" opacity=".55"/></g>'
   +'<circle cx="'+x0+'" cy="'+ry+'" r="2.5" fill="#0B0B0B"/><circle cx="'+x1+'" cy="'+ry+'" r="2.5" fill="#0B0B0B"/>'
   +'<path d="M'+gx+' '+(ry-6)+'v22" stroke="#C4161C" stroke-width="1.2" fill="none"/><circle cx="'+gx+'" cy="'+(ry+2)+'" r="4" fill="#C4161C"/>'
   +'<text x="'+(gx+12)+'" y="'+(ry+26)+'" font-family="IBM Plex Mono,monospace" font-size="11" letter-spacing="2" fill="#C4161C">ε → 0</text>';
}
/* ---- ripple + neural flashes ---- */
var rip={on:false,t:0,v:null},lastActive=0;
/* neural layer: existing dots wired into an irregular web; signals flow top (input) to bottom (output) */
var NM=mobile?90:180,NBD=6,NP=[],NB=[],NE=[],NW=[],EL=[],OUT=[],NL=[],PU=[],MAXP=mobile?16:34;
(function(){var i,j,k,step=N/NM,seen={};
for(i=0;i<NM;i++){var d=P[Math.min(N-1,Math.floor((i+rnd())*step))],l=1/Math.sqrt(d.x*d.x+d.y*d.y+d.z*d.z),x=d.x*l,y=d.y*l,z=d.z*l;
 NP.push([x,y,z]);NB.push(Math.min(NBD-1,Math.floor((1-y)/2*NBD)));OUT.push([]);NL.push(0)}
function link(a,b){var key=a<b?a+'_'+b:b+'_'+a;if(seen[key])return;seen[key]=1;
 var f=a,t=b;if(NP[b][1]>NP[a][1]+.02||(Math.abs(NP[b][1]-NP[a][1])<=.02&&rnd()<.5)){f=b;t=a}
 NE.push([f,t]);NW.push(.1+Math.pow(rnd(),1.7)*.9);EL.push(0);OUT[f].push(NE.length-1)}
for(i=0;i<NM;i++){var ds=[];
 for(j=0;j<NM;j++)if(j!==i)ds.push([NP[i][0]*NP[j][0]+NP[i][1]*NP[j][1]+NP[i][2]*NP[j][2],j]);
 ds.sort(function(a,b){return b[0]-a[0]});
 var pool=ds.slice(0,7),want=2+((rnd()*2)|0);
 for(k=0;k<want;k++){var pick=pool.splice((rnd()*pool.length)|0,1)[0];if(pick)link(i,pick[1])}
 if(rnd()<.07){var far=ds[8+((rnd()*10)|0)];if(far)link(i,far[1])}}
})();
function spawnP(e){if(PU.length<MAXP)PU.push({e:e,t:0,v:.016+Math.random()*.012})}
function nnPt(a,b,t,o){var x=NP[a][0]*(1-t)+NP[b][0]*t,y=NP[a][1]*(1-t)+NP[b][1]*t,z=NP[a][2]*(1-t)+NP[b][2]*t,l=1/Math.sqrt(x*x+y*y+z*z);o[0]=x*l;o[1]=y*l;o[2]=z*l}
var flashes=[];function newFlash(){return {i:(rnd()*N)|0,t:0,l:50+rnd()*80}}
for(var k=0;k<(mobile?5:10);k++){var fl=newFlash();fl.t=rnd()*fl.l;flashes.push(fl)}
var adam=document.getElementById('adam');
var lab=document.getElementById('lab'),labB=lab.querySelector('b'),labS=lab.querySelector('span');
/* ---- render ---- */
var BUF=[new Float32Array(N*3),new Float32Array(N*3),new Float32Array(N*3),new Float32Array(N*3)];
var hv=0;
function frame(now){
  if(!RM&&Math.abs(target-f)<.002&&!rip.on&&!snapping&&now-lastMove>600&&now-lastDraw<31){requestAnimationFrame(frame);return}
  lastDraw=now;
  f+= (target-f)*(RM?1:.11); if(Math.abs(target-f)<.0005) f=target;
  var nd=nodeAt(f),lon=nd.lon+(RM?0:mx*.12+Math.sin(now/5200)*.03),lat=nd.lat+(RM?0:my*.1+Math.cos(now/6100)*.02);
  var cl=Math.cos(lon),sl=Math.sin(lon),cp=Math.cos(lat),sp=Math.sin(lat);
  var active=Math.round(f); 
  if(active!==lastActive){lastActive=active;if(!RM){rip.on=true;rip.t=0;rip.v=NODES[active].v}}
  if(rip.on){rip.t+=.018;if(rip.t>1.6)rip.on=false}
  hv=Math.min(1,Math.max(0,f));
  if(wimgs.length){var hd=hv,he=1-Math.pow(1-hd,1.4),hw2=homeEl.clientWidth;
    for(var wi=0;wi<wimgs.length;wi++){var im=wimgs[wi],sd=+im.dataset.side,L=sd<0;
      /* left hand droops down-left; right hand lifts up-right, fingers rising */
      var dx=(L?.22:.27)*he*hw2,dy=(L?.06:-.10)*he*hw2,rt=L?he*13:he*20,sc=1-he*(L?.05:.03);
      im.style.transformOrigin=L?'8% 58%':'92% 58%';
      im.style.transform='translate3d('+(sd*dx).toFixed(1)+'px,'+dy.toFixed(1)+'px,0) rotate('+rt.toFixed(2)+'deg) scale('+sc.toFixed(4)+')'}}
  if(adam){var so=RM?0:Math.sin(now/5200),co=RM?0:Math.cos(now/6100),
    ax=so*14-mx*22+f*-10,ay=co*10-my*14,ar=so*.45+mx*.5,sc=1+Math.min(f,1)*.05+co*.006;
    adam.style.transform='translate3d('+ax.toFixed(2)+'px,'+ay.toFixed(2)+'px,0) rotate('+ar.toFixed(3)+'deg) scale('+sc.toFixed(4)+')';
    adam.style.opacity=(1-.35*Math.min(1,f)).toFixed(3)}
  ctx.clearRect(0,0,W,H);
  /* compass ring */
  ctx.save();ctx.translate(cx,cy);
  ctx.strokeStyle='#0B0B0B';ctx.lineWidth=1.2;ctx.globalAlpha=.9;ctx.beginPath();ctx.arc(0,0,R*1.07,0,7);ctx.stroke();
  ctx.lineWidth=.9;ctx.setLineDash([2,5]);ctx.globalAlpha=.55;ctx.beginPath();ctx.arc(0,0,R*1.035,0,7);ctx.stroke();ctx.setLineDash([]);
  ctx.globalAlpha=.9;ctx.lineWidth=.8;
  var rot=-lon;
  ctx.beginPath();
  for(var a=0;a<360;a+=5){var an=(a*D)+rot,len=(a%30===0)?14:(a%10===0)?8:4,r0=R*1.07;
    ctx.moveTo(Math.sin(an)*r0,-Math.cos(an)*r0);ctx.lineTo(Math.sin(an)*(r0+len),-Math.cos(an)*(r0+len))}
  ctx.stroke();
  ctx.font='10px "IBM Plex Mono",monospace';ctx.fillStyle='#0B0B0B';ctx.textAlign='center';ctx.textBaseline='middle';ctx.globalAlpha=.8;
  for(a=0;a<360;a+=30){an=(a*D)+rot;var tr=R*1.07+28;
    if(Math.abs(cx+Math.sin(an)*tr)>-40){ctx.save();ctx.translate(Math.sin(an)*tr,-Math.cos(an)*tr);ctx.rotate(an);ctx.fillText(String(a).padStart(3,'0')+'°',0,0);ctx.restore()}}
  ctx.restore();
  /* graticule */
  ctx.save();ctx.lineWidth=.7;ctx.strokeStyle='#0B0B0B';
  function proj(x,y,z){var x1=x*cl-z*sl,z1=x*sl+z*cl,y2=y*cp-z1*sp,z2=y*sp+z1*cp;return [cx+R*x1,cy-R*y2,z2]}
  for(var m=0;m<12;m++){ // meridians
    var lo=m*30*D,prev=null;ctx.beginPath();
    for(var t=-90;t<=90;t+=6){var la=t*D,q=proj(Math.cos(la)*Math.sin(lo),Math.sin(la),Math.cos(la)*Math.cos(lo));
      if(q[2]>0){if(prev)ctx.lineTo(q[0],q[1]);else ctx.moveTo(q[0],q[1]);prev=q}else prev=null}
    ctx.globalAlpha=.16;ctx.stroke();}
  for(var l=-60;l<=60;l+=30){ // parallels
    var lat0=l*D;prev=null;ctx.beginPath();
    for(t=0;t<=360;t+=6){var ln=t*D,q=proj(Math.cos(lat0)*Math.sin(ln),Math.sin(lat0),Math.cos(lat0)*Math.cos(ln));
      if(q[2]>0){if(prev)ctx.lineTo(q[0],q[1]);else ctx.moveTo(q[0],q[1]);prev=q}else prev=null}
    ctx.globalAlpha=.16;ctx.stroke();}
  ctx.restore();
  /* dots */
  var cnt=[0,0,0,0],rv=rip.on?rip.v:null,RS=(R/620+.45),b,i;
  for(i=0;i<N;i++){
    var px=PX[i],py=PY[i],pz=PZ[i],x1=px*cl-pz*sl,z1=px*sl+pz*cl,z2=py*sp+z1*cp;
    b=z2>.5?0:z2>.18?1:z2>0?2:3;
    if(b===3&&(i%5)>1)continue;
    var y2=py*cp-z1*sp,k=1,sz=PS[i];
    if(rv){var dd=Math.acos(Math.max(-1,Math.min(1,(px*rv[0]+py*rv[1]+pz*rv[2])*PL[i]))),w=(dd-rip.t*1.5)/.16,e=Math.exp(-w*w)*(1-rip.t/1.6);k=1+e*.05;sz+=e*2.2}
    var X=cx+R*x1*k,Y=cy-R*y2*k;
    if(X<-10||X>W+10||Y<-10||Y>H+10)continue;
    var A=BUF[b],c=cnt[b];A[c]=X;A[c+1]=Y;A[c+2]=b===3?sz*.7:sz;cnt[b]=c+3;
  }
  var al=[.85,.62,.42,.14],mul=[1.15,1,.85,.85];
  ctx.fillStyle='#0B0B0B';
  for(b=3;b>=0;b--){var A2=BUF[b],n=cnt[b];ctx.globalAlpha=al[b];ctx.beginPath();
    if(b===0){for(i=0;i<n;i+=3){var rr=A2[i+2]*mul[b]*RS;ctx.moveTo(A2[i]+rr,A2[i+1]);ctx.arc(A2[i],A2[i+1],rr,0,7)}}
    else{for(i=0;i<n;i+=3){var r2=A2[i+2]*mul[b]*RS;ctx.rect(A2[i]-r2,A2[i+1]-r2,r2*2,r2*2)}}
    ctx.fill();}
  /* neural layer */
  (function(){var o=[0,0,0],i,t,e,a,b,w,P1,Z;
  function tr(v){var x1=v[0]*cl-v[2]*sl,z1=v[0]*sl+v[2]*cl;return [cx+R*x1,cy-(v[1]*cp-z1*sp)*R,v[1]*sp+z1*cp]}
  function seg(a,b,t0,t1){nnPt(a,b,t0,o);P1=tr(o);ctx.moveTo(P1[0],P1[1]);var n=Math.max(2,Math.ceil((t1-t0)*8));
   for(var q=1;q<=n;q++){nnPt(a,b,t0+(t1-t0)*q/n,o);P1=tr(o);ctx.lineTo(P1[0],P1[1])}}
  var T=[];for(i=0;i<NM;i++)T.push(tr(NP[i]));
  var cls=[[0,.33,.6,.5],[.33,.66,.95,.7],[.66,1.01,1.5,.9]];ctx.strokeStyle='#0B0B0B';
  for(var c=0;c<3;c++){ctx.lineWidth=cls[c][2];ctx.globalAlpha=cls[c][3]*.5;ctx.beginPath();
   for(e=0;e<NE.length;e++){w=NW[e];if(w<cls[c][0]||w>=cls[c][1])continue;a=NE[e][0];b=NE[e][1];if(T[a][2]<.04||T[b][2]<.04)continue;seg(a,b,0,1)}
   ctx.stroke()}
  /* energised links: the connection itself lights up and fades */
  ctx.strokeStyle='#C4161C';
  for(e=0;e<NE.length;e++){if(EL[e]<=.02)continue;a=NE[e][0];b=NE[e][1];if(T[a][2]>=.04&&T[b][2]>=.04){
    ctx.globalAlpha=EL[e]*.85;ctx.lineWidth=.7+NW[e]*1.6;ctx.beginPath();seg(a,b,0,1);ctx.stroke()}EL[e]*=.965}
  /* weight readouts on the strongest visible links */
  ctx.font='9px "IBM Plex Mono",monospace';ctx.fillStyle='#0B0B0B';ctx.textAlign='center';ctx.textBaseline='middle';
  for(e=0;e<NE.length;e++){if(NW[e]<.93)continue;a=NE[e][0];b=NE[e][1];if(T[a][2]<.4||T[b][2]<.4)continue;
   nnPt(a,b,.5,o);P1=tr(o);ctx.globalAlpha=Math.min(.7,(P1[2]-.3)*1.4);ctx.fillText('w='+NW[e].toFixed(2),P1[0],P1[1]-7)}
  /* forward pass: charge fills each link, then fans out into the next layer */
  if(!RM){
   if(PU.length<MAXP&&rnd()<.07){var s0=(rnd()*NM)|0,g=0;while((NB[s0]!==0||!OUT[s0].length)&&g++<300)s0=(rnd()*NM)|0;if(OUT[s0].length)spawnP(OUT[s0][(rnd()*OUT[s0].length)|0])}
   for(i=PU.length-1;i>=0;i--){var p=PU[i];p.t+=p.v;a=NE[p.e][0];b=NE[p.e][1];w=NW[p.e];EL[p.e]=Math.max(EL[p.e],.9);
    var vis=T[a][2]>=.04&&T[b][2]>=.04,tt=Math.min(1,p.t);
    if(vis){ctx.strokeStyle='#C4161C';ctx.lineCap='round';ctx.globalAlpha=1;ctx.lineWidth=1.1+w*2;ctx.beginPath();seg(a,b,0,tt);ctx.stroke();
     nnPt(a,b,tt,o);var H1=tr(o);ctx.fillStyle='#C4161C';ctx.globalAlpha=.25;ctx.beginPath();ctx.arc(H1[0],H1[1],4+w*4,0,7);ctx.fill();
     ctx.globalAlpha=1;ctx.beginPath();ctx.arc(H1[0],H1[1],1.8+w*1.6,0,7);ctx.fill();ctx.lineCap='butt'}
    if(p.t>=1){NL[b]=1;PU.splice(i,1);var ou=OUT[b];if(ou.length){spawnP(ou[(rnd()*ou.length)|0]);if(rnd()<.6)spawnP(ou[(rnd()*ou.length)|0])}}}}
  /* nodes: emphasise the existing dots that carry the web */
  for(i=0;i<NM;i++){Z=T[i][2];if(Z<.05)continue;var lit=NL[i];NL[i]=lit>0?lit-.025:0;
    var rr=(1.8+1.5*Z+lit*2.6)*(R/620+.5);ctx.globalAlpha=Math.min(1,Z*3)*.95;ctx.fillStyle=lit>.05?'#C4161C':'#0B0B0B';
    ctx.beginPath();ctx.arc(T[i][0],T[i][1],rr,0,7);ctx.fill()}
  })();
  /* flashes */
  ctx.fillStyle='#C4161C';
  if(!RM)for(k=0;k<flashes.length;k++){var fh=flashes[k];fh.t++;if(fh.t>fh.l){flashes[k]=newFlash();continue}
    var pp=P[fh.i],fx=pp.x*cl-pp.z*sl,fz=pp.x*sl+pp.z*cl,fy=pp.y*cp-fz*sp,fz2=pp.y*sp+fz*cp;
    if(fz2>.1){var ph=Math.sin(fh.t/fh.l*Math.PI);ctx.globalAlpha=ph*.9;ctx.beginPath();ctx.arc(cx+R*fx,cy-R*fy,1.5+ph*2.2,0,7);ctx.fill();
      ctx.globalAlpha=ph*.25;ctx.beginPath();ctx.arc(cx+R*fx,cy-R*fy,5+ph*6,0,7);ctx.fill()}}
  /* nodes */
  ctx2.clearRect(0,0,W,H);ctx=ctx2;hits.length=0;
  /* links between section nodes: great-circle arcs, active leg in red */
  (function(){var n=NODES.length,e,m,q,t,seg;
  function arc(A,B,col,lw,al,dash){var pen=false,x,y,z,l,X,Y,x1,z1,y2,z2,prev=null;
    ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.globalAlpha=al;ctx.setLineDash(dash||[]);ctx.beginPath();
    for(t=0;t<=1.001;t+=1/28){x=A[0]*(1-t)+B[0]*t;y=A[1]*(1-t)+B[1]*t;z=A[2]*(1-t)+B[2]*t;l=1/Math.sqrt(x*x+y*y+z*z);x*=l;y*=l;z*=l;
      x1=x*cl-z*sl;z1=x*sl+z*cl;y2=y*cp-z1*sp;z2=y*sp+z1*cp;
      if(z2>.03){X=cx+R*x1;Y=cy-R*y2;if(pen)ctx.lineTo(X,Y);else{ctx.moveTo(X,Y);pen=true}}else pen=false}
    ctx.stroke();ctx.setLineDash([])}
  for(e=0;e<n;e++)arc(NODES[e].v,NODES[(e+2)%n].v,'#0B0B0B',.8,.22,[2,5]);
  for(e=0;e<n;e++){var on=(f>=e&&f<=e+1)||(e===n-1&&f>n-1);
    arc(NODES[e].v,NODES[(e+1)%n].v,on?'#C4161C':'#0B0B0B',on?1.9:1.1,on?.95:.5)}
  })();
  for(i=0;i<NODES.length;i++){
    var nv=NODES[i].v,nx=nv[0]*cl-nv[2]*sl,nz=nv[0]*sl+nv[2]*cl,ny=nv[1]*cp-nz*sp,nz2=nv[1]*sp+nz*cp;
    if(nz2<.05)continue;
    var X=cx+R*nx,Y=cy-R*ny;if(X<-30||X>W+30)continue;
    var act=Math.max(0,1-Math.abs(f-i)*1.6),rad=i===0?20:14+act*6,fade=Math.min(1,nz2*2.2);
    ctx.globalAlpha=fade;
    if(i===0){ctx.fillStyle='#E8E5DE';ctx.strokeStyle='#0B0B0B';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(X,Y,rad+8,0,7);ctx.fill();ctx.stroke();
      ctx.fillStyle='#C4161C';ctx.beginPath();ctx.arc(X,Y,rad*.55,0,7);ctx.fill();}
    else{ctx.fillStyle=act>.5?'#C4161C':'#E8E5DE';ctx.strokeStyle=act>.5?'#C4161C':'#0B0B0B';ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(X,Y,rad,0,7);ctx.fill();ctx.stroke();
      ctx.fillStyle=act>.5?'#E8E5DE':'#0B0B0B';ctx.font='italic '+(15+act*3)+'px "Noto Serif",serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(NODES[i].g,X,Y+1);}
    if(act>.2){ctx.globalAlpha=act*.8;ctx.strokeStyle='#C4161C';ctx.lineWidth=1;ctx.beginPath();ctx.arc(X,Y,rad+8+act*3,0,7);ctx.stroke()}
    hits.push({i:i,x:X,y:Y,r:rad+8});
    if(Math.abs(f-i)<.5){var o=1-Math.abs(f-i)*2;lab.style.opacity=hover<0?Math.min(1,o*1.4):1;labB.textContent=NODES[i].t;labS.textContent=NODES[i].s;
      lab.style.left=Math.min(W-180,X+rad+16)+'px';lab.style.top=(Y+rad*.2)+'px'}
  }
  ctx=ctx1;
  if(Math.abs(f-Math.round(f))>.45)lab.style.opacity=0;
  requestAnimationFrame(frame);
}
resize();computeTarget();f=target;updateTL();rulerUpd();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){measure();computeTarget();layoutWeave();layoutAcc()});
addEventListener('load',function(){measure();computeTarget();layoutWeave();layoutAcc();setTimeout(layoutAcc,600)});
requestAnimationFrame(frame);
})();

(function(){var b=document.querySelector('.col-blk');if(!b)return;var sp=b.querySelector('span'),M=['SEMPER · FIDELIS','AD ASTRA · PER ASPERA','HIC SUNT · LEONES'],i=0;
function fit(){}
if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
setInterval(function(){sp.classList.add('o');setTimeout(function(){i=(i+1)%M.length;sp.textContent=M[i];fit();sp.classList.remove('o')},480)},5200);
})();



(function(){var W=document.querySelectorAll('.gw .tw');
function type(el){if(el.dataset.done)return;el.dataset.done=1;var t=el.dataset.t,i=0;
if(matchMedia('(prefers-reduced-motion:reduce)').matches){el.textContent=t;return}
el.classList.add('ty');(function n(){el.textContent=t.slice(0,++i);if(i<t.length)setTimeout(n,26+Math.random()*30);else setTimeout(function(){el.classList.remove('ty')},1800)})()}
if(!('IntersectionObserver' in window)){W.forEach(function(e){e.textContent=e.dataset.t});return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);setTimeout(function(){type(e.target)},350)}})},{threshold:.9});W.forEach(function(w){io.observe(w)});})();
