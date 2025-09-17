// Eye tracking and parallax using requestAnimationFrame
(() => {
    const root = document.querySelector('.seraph-hero');
    const pupils = [...document.querySelectorAll('.pupil')].filter(p => !p.classList.contains('pupil--base'));
    const cloudL = document.querySelector('.cloud--left');
    const cloudR = document.querySelector('.cloud--right');
    const bg     = document.querySelector('.bg');
  
    // Per-eye movement range (px)
    const eyeConfig = new Map(pupils.map((el) => [el, { max: 8 }]));
  
    // Normalized target and current pointer (-1..1)
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
      // Smooth follow
      curr.x = lerp(curr.x, target.x, 0.08);
      curr.y = lerp(curr.y, target.y, 0.08);
  
      // Eyes: offset from anchors
      for (const [el, cfg] of eyeConfig){
        const dx = cfg.max * curr.x;
        const dy = cfg.max * curr.y;
        el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      }
  
      // Parallax
      const cloudAmp = 18;  // px
      const bgAmp    = 8;   // px
      cloudL.style.transform = `translate(${cloudAmp * -curr.x}px, ${cloudAmp * curr.y}px)`;
      cloudR.style.transform = `translate(${cloudAmp *  curr.x}px, ${cloudAmp * -curr.y}px)`;
      bg.style.transform     = `translate(${bgAmp    *  curr.x}px, ${bgAmp    *  curr.y}px)`;
  
      requestAnimationFrame(frame);
    }
    frame();
  })();
  