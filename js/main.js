// color theme switching
function loadTheme(){
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    document.body.classList.remove('light');				
    document.getElementById('color-sw').classList.add('bi-sun');
    document.getElementById('color-sw').classList.remove('bi-moon');
  } else {
    document.body.classList.add('light');
    document.body.classList.remove('dark');				
    document.getElementById('color-sw').classList.add('bi-moon');
    document.getElementById('color-sw').classList.remove('bi-sun');
  }
}
// function to toggle between light and dark theme
function toggleTheme() {
  if (localStorage.getItem('theme') === 'dark') {
    localStorage.setItem('theme', 'light');
    loadTheme();
  } else {
    localStorage.setItem('theme', 'dark');
    loadTheme();
  }
}
// Immediately invoked function to set the theme on initial load
loadTheme();

// toggle tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

// publications tabs activation
document.addEventListener("DOMContentLoaded", function(){
  var tabList = [].slice.call(document.querySelectorAll("#myTab a"));
  tabList.forEach(function(tab){
    var tabTrigger = new bootstrap.Tab(tab);

    tab.addEventListener("click", function(event){
      event.preventDefault();
      tabTrigger.show();
    });
  });
});

// set scroll variable for animation
window.addEventListener('scroll', () => {
  const isScrolled = window.pageYOffset > 0; // Check if scrolled
  document.body.style.setProperty('--scroll', window.pageYOffset);
  
  const navbar = document.querySelector('.nav-menu'); 
  const downLink = document.querySelector('.down-link.scrollto'); 
  const scrollPosition = window.scrollY;
  
  if (scrollPosition > 200) { // Adjust the '70' if you want a different trigger point
    // downLink.style.opacity = '0'; // Hide when scrolling down
    navbar.classList.add('collapsed-navbar'); // Add a class to collapse
  } else {
    downLink.style.opacity = '1'; // Show when scrolling up
    navbar.classList.remove('collapsed-navbar'); // Remove the class
  }

}, false);

// Easy selector helper function
const select = (el, all = false) => {
  el = el.trim()
  if (all) {
    return [...document.querySelectorAll(el)]
  } else {
    return document.querySelector(el)
  }
}

// Easy event listener function
const on = (type, el, listener, all = false) => {
  let selectEl = select(el, all)
  if (selectEl) {
    if (all) {
      selectEl.forEach(e => e.addEventListener(type, listener))
    } else {
      selectEl.addEventListener(type, listener)
    }
  }
}

// Easy on scroll event listener 
const onscroll = (el, listener) => {
  el.addEventListener('scroll', listener)
}

// Navbar links active state on scroll
let navbarlinks = select('#navbar .scrollto', true)
const navbarlinksActive = () => {
  let position = window.scrollY + 300
  navbarlinks.forEach(navbarlink => {
    if (!navbarlink.hash) return
    let section = select(navbarlink.hash)
    if (!section) return
    if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
      navbarlink.classList.add('active')
    } else {
      navbarlink.classList.remove('active')
    }
  })
}
window.addEventListener('load', navbarlinksActive)
onscroll(document, navbarlinksActive)

// Animation on scroll
window.addEventListener('load', () => {
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    // once: true,
    mirror: true
  })
});

// Scroll with offset on page load with hash links in the url
window.addEventListener('load', () => {
  if (window.location.hash) {
    if (select(window.location.hash)) {
      scrollto(window.location.hash)
    }
  }
});

// Scroll with offset on links with a class name .scrollto
on('click', '.scrollto', function(e) {
  if (select(this.hash)) {
    e.preventDefault()

    let body = select('body')
    if (body.classList.contains('mobile-nav-active')) {
      body.classList.remove('mobile-nav-active')
      let navbarToggle = select('.mobile-nav-toggle')
      navbarToggle.classList.toggle('bi-list')
      navbarToggle.classList.toggle('bi-x')
    }
    scrollto(this.hash)
  }
}, true)

// Scrolls to an element with header offset
const scrollto = (el) => {
  let elementPos = select(el).offsetTop
  window.scrollTo({
    top: elementPos - 20,
    behavior: 'smooth'
  })
}

// Mobile nav toggle
on('click', '.mobile-nav-toggle', function(e) {
  select('body').classList.toggle('mobile-nav-active')
  this.classList.toggle('bi-list')
  this.classList.toggle('bi-x')
})

// Back to top button
let backtotop = select('.back-to-top')
if (backtotop) {
  const toggleBacktotop = () => {
    if (window.scrollY > 400) {
      backtotop.classList.add('active')
    } else {
      backtotop.classList.remove('active')
    }
  }
  window.addEventListener('load', toggleBacktotop)
  onscroll(document, toggleBacktotop)
}

// Hero type effect
const typed = select('.typed')
if (typed) {
  let typed_strings = typed.getAttribute('data-typed-items')
  typed_strings = typed_strings.split(',')
  new Typed('.typed', {
    strings: typed_strings,
    loop: true,
    typeSpeed: 100,
    backSpeed: 50,
    backDelay: 2000
  });
}

// particle js pattern
particlesJS('particles-js',
  {
    "particles": {
      "number": {
        "value": 140,
        "density": {
          "enable": true,
          "value_area": 400
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 1.0,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 10,
          "size_min": 0.5,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 80,
        "color": "#ffffff",
        "opacity": 0.2,
        "width": 0.4
      },
      "move": {
        "enable": true,
        "speed": 2,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 100,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  }

);

// project lightbox initializations
const portfolioDetailsLightbox = GLightbox({
  selector: '.project-lightbox',
  width: '90%',
  height: '90vh',
  autoplayVideos: true
});

// certificates slider
document.addEventListener( 'DOMContentLoaded', function () {
  var main = new Splide( '#main-carousel', {
    type      : 'fade',
    rewind    : true,
    pagination: true,
    arrows    : false,
    autoplay    : true,
    interval    : 2000,
    pauseOnHover: true,
    lazyLoad : true,
    // updateOnMove: true,
  } );

  var thumbnails = new Splide( '#thumbnail-carousel', {
    fixedWidth  : 120,
    fixedHeight : 80,
    gap         : 10,
    rewind      : true,
    pagination  : false,
    isNavigation: true,
    focus      : 'center',
  } );

  main.sync( thumbnails );
  main.mount();
  thumbnails.mount();

  // open images in new tab on click
  const mainCarousel = document.getElementById("main-carousel"); 
  const splideSlides = mainCarousel.querySelectorAll(".splide__slide");

  splideSlides.forEach(slide => {
      slide.addEventListener('click', function() {
          const image = slide.querySelector('img'); // Find the image within the slide
          window.open(image.src, '_blank');
      });
  });
} );