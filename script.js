(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // flexible image loader: tries a few extensions so it doesn't matter
  // whether the real photo was saved as .jpg, .jpeg, .png or .webp
  var EXTS = ['jpg', 'jpeg', 'png', 'webp'];
  document.querySelectorAll('img[data-img]').forEach(function(img){
    var base = img.getAttribute('data-img');
    var i = 0;
    function tryNext(){
      if(i >= EXTS.length){
        img.style.display = 'none'; // none found, placeholder behind shows through
        return;
      }
      img.src = base + '.' + EXTS[i];
      i++;
    }
    img.addEventListener('error', tryNext);
    tryNext();
  });

  // loader
  window.addEventListener('load', function(){
    setTimeout(function(){
      document.getElementById('loader').classList.add('hide');
    }, reduced ? 100 : 1500);
  });

  // scroll reveal
  var els = document.querySelectorAll('.reveal, .reveal-clip');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:.15, rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){ io.observe(el); });
  } else {
    els.forEach(function(el){ el.classList.add('in'); });
  }

  // process step highlight
  var steps = document.querySelectorAll('.p-step');
  if('IntersectionObserver' in window){
    var io2 = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); }
      });
    }, {threshold:.4});
    steps.forEach(function(s){ io2.observe(s); });
  }

  // process line fill + hero parallax, batched on scroll
  var procLine = document.getElementById('procFill');
  var procWrap = document.querySelector('.process-inner');
  var heroBg = document.getElementById('heroBg');
  var ticking = false;

  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      if(!reduced && heroBg){
        var y = window.scrollY;
        heroBg.style.transform = 'translateY(' + (y * 0.18) + 'px)';
      }
      if(procWrap && procLine){
        var rect = procWrap.getBoundingClientRect();
        var vh = window.innerHeight;
        var total = rect.height;
        var progressed = Math.min(Math.max(vh * 0.75 - rect.top, 0), total);
        var pct = total > 0 ? (progressed / total) * 100 : 0;
        procLine.style.height = pct + '%';
      }
      ticking = false;
    });
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // cursor dot
  // mobile menu
  var burger = document.getElementById('navBurger');
  var mobileNav = document.getElementById('mobileNav');
  if(burger && mobileNav){
    function closeMenu(){
      mobileNav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
    function toggleMenu(){
      var open = mobileNav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    burger.addEventListener('click', toggleMenu);
    mobileNav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeMenu();
    });
  }

  var dot = document.getElementById('cursor-dot');
  if(dot && window.matchMedia('(hover:hover)').matches){
    window.addEventListener('mousemove', function(e){
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('.pf-card, .btn-primary, .style-row').forEach(function(el){
      el.addEventListener('mouseenter', function(){ dot.classList.add('big'); });
      el.addEventListener('mouseleave', function(){ dot.classList.remove('big'); });
    });
  }

  // horizontal strip: allow vertical wheel to scroll it horizontally when hovered
  var strip = document.getElementById('pfStrip');
  var stripWrap = strip ? strip.parentElement : null;
  if(stripWrap){
    stripWrap.addEventListener('wheel', function(e){
      if(Math.abs(e.deltaY) > Math.abs(e.deltaX)){
        stripWrap.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, {passive:false});
    stripWrap.style.overflowX = 'auto';
    stripWrap.style.scrollbarWidth = 'none';
  }
})();
