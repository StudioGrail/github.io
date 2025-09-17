// Eye tracking and parallax using requestAnimationFrame
(() => {
    const root   = document.querySelector('.seraph-hero');
    const eyes   = document.querySelector('.eyes');        // move entire eyes layer
    const cloudL = document.querySelector('.cloud--left');
    const cloudR = document.querySelector('.cloud--right');
  
    let target = { x: 0, y: 0 };
    let curr   = { x: 0, y: 0 };
  
    function toNorm(e){
      const r = root.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;   // 0..1
      const py = (e.clientY - r.top)  / r.height;  // 0..1
      target.x = (px - 0.5) * 2;                   // -1..1
      target.y = (py - 0.5) * 2;                   // -1..1
    }
  
    window.addEventListener('mousemove', toNorm, { passive:true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) toNorm(e.touches[0]);
    }, { passive:true });
  
    const lerp = (a,b,t) => a + (b-a)*t;
  
    function frame(){
      curr.x = lerp(curr.x, target.x, 0.08);
      curr.y = lerp(curr.y, target.y, 0.08);
  
      // Eyes: tiny offset so they appear to follow while staying aligned
      const eyeAmp = 10; // px; increase for stronger effect
      eyes.style.transform = `translate(calc(-50% + ${eyeAmp * curr.x}px), calc(-50% + ${eyeAmp * curr.y}px))`;
  
      // Parallax clouds
      const cloudAmp = 18; // px
      cloudL.style.transform = `translate(${cloudAmp * -curr.x}px, ${cloudAmp * curr.y}px)`;
      cloudR.style.transform = `translate(${cloudAmp *  curr.x}px, ${cloudAmp * -curr.y}px)`;
  
      requestAnimationFrame(frame);
    }
    frame();
  })();
  