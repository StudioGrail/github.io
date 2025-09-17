// Eye tracking + parallax with rAF
(() => {
    const root = document.querySelector('.seraph-hero');
    const pupils = [...document.querySelectorAll('.pupil')].filter(p => !p.classList.contains('pupil--base'));
    const cloudL = document.querySelector('.cloud--left');
    const cloudR = document.querySelector('.cloud--right');
    const bg = document.querySelector('.bg');
  
    // Per-eye configuration: max offset in pixels relative to anchor
    const eyeConfig = new Map(pupils.map((el) => [el, { max: 8 }]));
  
    // Target values for smooth interpolation
    let target = { x: 0, y: 0 };
    let curr = { x: 0, y: 0 };
  
    // Convert mouse to normalized coordinates across the hero
    function onPointer(e){
      const r = root.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;   // 0..1
      const py = (e.clientY - r.top) / r.height;   // 0..1
      target.x = (px - 0.5) * 2;                    // -1..1
      target.y = (py - 0.5) * 2;                    // -1..1
    }
    window.addEventListener('mousemove', onPointer, { passive:true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) onPointer(e.touches[0]);
    }, { passive:true });
  
    function lerp(a,b,t){ return a + (b-a)*t; }
  
    function tick(){
      // Ease toward target
      curr.x = lerp(curr.x, target.x, 0.08);
      curr.y = lerp(curr.y, target.y, 0.08);
  
      // Move each eye a small amount toward pointer
      for (const [el, cfg] of eyeConfig){
        const dx = cfg.max * curr.x;
        const dy = cfg.max * curr.y;
        el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      }
  
      // Parallax: foreground clouds move more; background moves subtly
      const cloudAmp = 18;     // px
      const bgAmp = 8;         // px
      cloudL.style.transform = `translate(${cloudAmp * -curr.x}px, ${cloudAmp * curr.y}px)`;
      cloudR.style.transform = `translate(${cloudAmp * curr.x}px, ${cloudAmp * -curr.y}px)`;
      bg.style.transform = `translate(${bgAmp * curr.x}px, ${bgAmp * curr.y}px)`;
  
      requestAnimationFrame(tick);
    }
    tick();
  })();
  