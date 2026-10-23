/* Content remains available if GSAP or its CDN cannot load. */
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  const motion = gsap.matchMedia();
  motion.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.to("#progress", {width:"100%", ease:"none", scrollTrigger:{trigger:document.body,start:"top top",end:"bottom bottom",scrub:true}});
    const commands = ["whoami", "cat sobre.md", "ls ./projetos", "cat skills.json", "./contato.sh"];
    ["s-hero","s-about","s-work","s-skills","s-contact"].forEach((id,i) => {
      ScrollTrigger.create({trigger:"#"+id,start:"top center",end:"bottom center",onEnter:() => {document.getElementById("termCmd").textContent=commands[i];},onEnterBack:() => {document.getElementById("termCmd").textContent=commands[i];}});
    });
    document.querySelectorAll(".stack-list .fill").forEach(fill => {
      gsap.to(fill,{width:"100%",duration:.6,scrollTrigger:{trigger:fill.parentElement,start:"top 90%",once:true}});
    });
  });
  motion.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
    const dot=document.getElementById("cursorDot");
    const ring=document.getElementById("cursorRing");
    const dotX=gsap.quickTo(dot,"x",{duration:.08}), dotY=gsap.quickTo(dot,"y",{duration:.08});
    const ringX=gsap.quickTo(ring,"x",{duration:.35}), ringY=gsap.quickTo(ring,"y",{duration:.35});
    const move=e => {dotX(e.clientX);dotY(e.clientY);ringX(e.clientX);ringY(e.clientY);};
    window.addEventListener("mousemove",move);
    return () => window.removeEventListener("mousemove",move);
  });
}
