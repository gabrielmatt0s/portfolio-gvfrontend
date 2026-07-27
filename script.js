gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.normalizeScroll(true);

/* ---- custom cursor ---- */
const dot = document.getElementById("cursorDot");
const ring = document.getElementById("cursorRing");
const dotX = gsap.quickTo(dot,"x",{duration:.08,ease:"power2.out"});
const dotY = gsap.quickTo(dot,"y",{duration:.08,ease:"power2.out"});
const ringX = gsap.quickTo(ring,"x",{duration:.35,ease:"power2.out"});
const ringY = gsap.quickTo(ring,"y",{duration:.35,ease:"power2.out"});
window.addEventListener("mousemove",(e)=>{
  dotX(e.clientX); dotY(e.clientY); ringX(e.clientX); ringY(e.clientY);
});
document.querySelectorAll("a,.skill-card,.project-visual").forEach(el=>{
  el.addEventListener("mouseenter",()=>gsap.to(ring,{scale:2,duration:.3}));
  el.addEventListener("mouseleave",()=>gsap.to(ring,{scale:1,duration:.3}));
});

/* ---- scroll progress bar ---- */
gsap.to("#progress",{
  width:"100%", ease:"none",
  scrollTrigger:{ trigger:document.body, start:"top top", end:"bottom bottom", scrub:true }
});

/* ---- terminal command cycler tied to scroll ---- */
const cmds = ["whoami","cat sobre.md","ls ./projetos","cat skills.json","./contato.sh"];
const termCmd = document.getElementById("termCmd");
["s-hero","s-about","s-work","s-skills","s-contact"].forEach((id,i)=>{
  ScrollTrigger.create({
    trigger:"#"+id, start:"top center", end:"bottom center",
    onEnter:()=>typeCmd(cmds[i]), onEnterBack:()=>typeCmd(cmds[i])
  });
});
function typeCmd(text){
  gsap.to(termCmd,{duration:.15,opacity:0,onComplete:()=>{
    termCmd.textContent = text; gsap.to(termCmd,{duration:.15,opacity:1});
  }});
}

/* ---- hero scramble intro ---- */
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&$@";
function scrambleLine(el){
  const final = el.textContent; const originalLetters = final.split("");
  gsap.to({},{ duration: 1.1,
    onUpdate: function(){
      const revealCount = Math.floor(this.progress() * originalLetters.length);
      let out = "";
      for(let i=0;i<originalLetters.length;i++){
        if(originalLetters[i] === " "){ out += " "; continue; }
        out += (i < revealCount) ? originalLetters[i] : chars[Math.floor(Math.random()*chars.length)];
      }
      el.textContent = out;
    },
    onComplete: ()=>{ el.textContent = final; }
  });
}
gsap.from(".hero-logo img",{ opacity:0, scale:.7, duration:.9, ease:"back.out(1.7)" });
document.querySelectorAll(".hero-name .line").forEach((el,i)=>{
  gsap.delayedCall(0.2 + i*0.35, ()=>scrambleLine(el));
});
gsap.from(".hero-name",{ rotationX:-40, transformOrigin:"50% 100%", opacity:0, duration:1, ease:"power3.out" });
gsap.from(".hero-eyebrow, .hero-sub, .hero-meta, .scroll-cue",{
  opacity:0, y:16, duration:.8, stagger:.12, delay:.9, ease:"power2.out"
});

/* ---- hero number counters ---- */
document.querySelectorAll(".num").forEach(el=>{
  const target = +el.dataset.count;
  gsap.to(el,{
    innerText:target, duration:1.4, delay:1.3, ease:"power1.out", snap:{innerText:1},
    onUpdate:function(){ el.textContent = Math.round(this.targets()[0].innerText); }
  });
});

/* ---- infinite marquee, speeds up on scroll velocity ---- */
const marquee = document.getElementById("marquee");
marquee.innerHTML += marquee.innerHTML;
let marqueeTween = gsap.to(marquee,{ xPercent:-50, duration:22, ease:"none", repeat:-1 });
ScrollTrigger.create({
  onUpdate:(self)=>{
    const v = Math.min(Math.abs(self.getVelocity())/300,4);
    marqueeTween.timeScale(1+v);
  }
});

/* ---- split heading words + reveal ---- */
document.querySelectorAll("h2.split").forEach(h=>{
  const words = h.textContent.split(" ");
  h.innerHTML = words.map(w=>`<span class="word" style="opacity:0;transform:translateY(110%) rotate(4deg);display:inline-block;">${w}&nbsp;</span>`).join("");
  ScrollTrigger.create({
    trigger:h, start:"top 88%",
    onEnter:()=>gsap.to(h.querySelectorAll(".word"),{opacity:1,y:0,rotate:0,duration:.8,stagger:.06,ease:"power3.out"})
  });
});

/* ---- generic reveal on scroll ---- */
gsap.utils.toArray(".reveal").forEach((el)=>{
  gsap.to(el,{ opacity:1, y:0, duration:.9, ease:"power3.out",
    scrollTrigger:{ trigger:el, start:"top 88%" } });
});

/* ---- stack list fill bars ---- */
document.querySelectorAll(".stack-list .row").forEach((row,i)=>{
  gsap.to(row.querySelector(".fill"),{
    width:"100%", duration:1, ease:"power2.out",
    scrollTrigger:{ trigger:row, start:"top 90%" }
  });
});

/* ---- pinned horizontal project scroll ---- */
const track = document.getElementById("pinTrack");
function buildPin(){
  const scrollLength = track.scrollWidth - window.innerWidth;
  const pinTween = gsap.to(track,{
    x: -scrollLength, ease:"none",
    scrollTrigger:{
      trigger:"#pinWrap", start:"top top", end:()=>"+="+scrollLength,
      scrub:1, pin:true, invalidateOnRefresh:true,
      onUpdate:(self)=>{ document.getElementById("pinBar").style.width = (self.progress*100)+"%"; }
    }
  });
}
buildPin();

/* parallax de profundidade: textos dos projetos se movem em sentido oposto ao visual */
document.querySelectorAll(".project-name, .project-desc").forEach(el=>{
  gsap.fromTo(el,{x:-18},{
    x:18, ease:"none",
    scrollTrigger:{ trigger:"#pinWrap", start:"top top", end:()=>"+="+(track.scrollWidth-window.innerWidth), scrub:1 }
  });
});

/* project visual 3D tilt on mousemove */
document.querySelectorAll(".project-visual").forEach(card=>{
  card.addEventListener("mousemove",(e)=>{
    const r = card.getBoundingClientRect();
    const px = (e.clientX-r.left)/r.width - .5;
    const py = (e.clientY-r.top)/r.height - .5;
    gsap.to(card,{ rotationY:px*10, rotationX:-py*10, duration:.4, ease:"power2.out" });
  });
  card.addEventListener("mouseleave",()=>gsap.to(card,{rotationY:0,rotationX:0,duration:.6,ease:"elastic.out(1,0.5)"}));
});

/* stagger dos itens de cada skill card */
document.querySelectorAll(".skill-card ul li").forEach(li=>{
  gsap.set(li,{opacity:0,x:-14});
});
document.querySelectorAll(".skill-card").forEach(card=>{
  ScrollTrigger.create({
    trigger:card, start:"top 85%",
    onEnter:()=>gsap.to(card.querySelectorAll("ul li"),{opacity:1,x:0,duration:.5,stagger:.08,ease:"power2.out"})
  });
});

/* skill card tilt */
document.querySelectorAll(".skill-card").forEach(card=>{
  card.addEventListener("mousemove",(e)=>{
    const r = card.getBoundingClientRect();
    const px = (e.clientX-r.left)/r.width - .5;
    const py = (e.clientY-r.top)/r.height - .5;
    gsap.to(card,{ rotationY:px*8, rotationX:-py*8, y:-4, duration:.4, ease:"power2.out" });
  });
  card.addEventListener("mouseleave",()=>gsap.to(card,{rotationY:0,rotationX:0,y:0,duration:.6,ease:"elastic.out(1,0.5)"}));
});

/* ---- SVG underline draw on contact link ---- */
const underline = document.getElementById("underlinePath");
const len = underline.getTotalLength();
underline.style.strokeDasharray = len;
underline.style.strokeDashoffset = len;
ScrollTrigger.create({
  trigger:"#s-contact", start:"top 70%",
  onEnter:()=>gsap.to(underline,{ strokeDashoffset:0, duration:1, ease:"power2.inOut" })
});

/* hover magnetico nos links de contato */
document.querySelectorAll(".contact-row a").forEach(link=>{
  link.addEventListener("mousemove",(e)=>{
    const r = link.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width/2) * .15;
    const y = (e.clientY - r.top - r.height/2) * .4;
    gsap.to(link,{x,y,duration:.25,ease:"power2.out"});
  });
  link.addEventListener("mouseleave",()=>gsap.to(link,{x:0,y:0,duration:.5,ease:"elastic.out(1,0.4)"}));
});

/* magnetic hover on contact CTA */
const magneticLink = document.getElementById("magneticLink");
magneticLink.addEventListener("mousemove",(e)=>{
  const r = magneticLink.getBoundingClientRect();
  const x = (e.clientX - r.left - r.width/2) * .12;
  const y = (e.clientY - r.top - r.height/2) * .4;
  gsap.to(magneticLink,{x,y,duration:.3,ease:"power2.out"});
});
magneticLink.addEventListener("mouseleave",()=>gsap.to(magneticLink,{x:0,y:0,duration:.5,ease:"elastic.out(1,0.4)"}));

window.addEventListener("resize",()=>ScrollTrigger.refresh());