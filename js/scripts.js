window.onload = () => {
// MISC
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', function(){
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  // re evaluate headerTop
  showHeaderTop(window.scrollY);
  // reset the nav collapse to defaults by removing additional classes
  navMenuCollapseBtn.classList.remove('expanded');
  navMenu.classList.remove('display-none','nav-menu-collapse-animation-reverse','nav-menu-collapse-animation-forwards', 'expanded');
  // recenter hobbies section
  moveCards();
});

// HELPER FUNCTIONS
function getStyle(element, name) {
  return element.currentStyle ? element.currentStyle[name] : window.getComputedStyle ? window.getComputedStyle(element, null).getPropertyValue(name) : null;
}

function toggleClassesInElements(e, c, f){
  e.forEach(function(v,k){
    v.classList.toggle(c, f);
  });
}

// INTRO SECTION js
// clicking nav link behavior
var navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(function(v,k){
  v.onclick = (e) => {
    e.preventDefault();
    navLinks.forEach(function(v,k){
      v.classList.remove('active');
    })
    e.target.classList.add('active');
    window.scroll({
      top: document.querySelector("[name=\""+e.target.getAttribute("href").replace('#','')+"\"]").offsetTop - (window.innerHeight*0.1),
      behavior: 'smooth'
    });
    navMenuCollapse();
  };
});

// collapsing/expanding nav behavior
var navMenuCollapseBtn = document.querySelector('.nav-menu-collapse-btn');
var navMenu = document.querySelector('.nav-menu');
navMenu.style.height = window.innerHeight;
navMenuCollapseBtn.onclick = () => {
  if (getStyle(navMenu, 'display') == 'none' || navMenu.classList.contains('display-none')) {
    navMenu.classList.remove('display-none')
    navMenuCollapseBtn.classList.add('expanded');
    navMenu.classList.remove('nav-menu-collapse-animation-reverse');
    void navMenu.offsetWidth;
    navMenu.classList.add('nav-menu-collapse-animation-forwards', 'expanded');
  } else {

    navMenuCollapseBtn.classList.remove('expanded');
    navMenu.classList.remove('nav-menu-collapse-animation-forwards', 'expanded');
    void navMenu.offsetWidth;
    navMenu.classList.add('nav-menu-collapse-animation-reverse');

    setTimeout(function(){
      navMenu.classList.add('display-none');
    }, 300);
  }

};

let lastScrollPos = 0;
let ticking = false;
window.onscroll = function(){
  lastScrollPos = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(function(){
      navMenuCollapse();
      showHeaderTop(window.scrollY);
      updateNavLinksBasedOnSection(window.scrollY);
      ticking = false;
    });

    ticking = true;
  }
}

function navMenuCollapse(){
  if (getStyle(navMenuCollapseBtn,'display') == 'block') {
    if (navMenu.style.display !== 'none' || navMenu.style.display !== '') {
      navMenuCollapseBtn.classList.remove('expanded');
      navMenu.classList.remove('nav-menu-collapse-animation-forwards');
      void navMenu.offsetWidth;
      navMenu.classList.add('nav-menu-collapse-animation-reverse');
      setTimeout(function(){
          navMenu.classList.add('display-none')
      }, 300);
    }
  }
}

var headerTop = document.querySelector('.header-top');
function showHeaderTop(scrollY) {
  if (scrollY > window.innerHeight*0.6) {
    headerTop.classList.add('fixed');
  } else {
    headerTop.classList.remove('fixed');
  }
}

var sections = document.querySelectorAll('.section');

// responsive navbar behavior
function updateNavLinksBasedOnSection(scrollY){
  let i = 0;
  sections.forEach(function(v,k){
    if (scrollY + (window.innerHeight*0.2) > v.offsetTop ) {
      navLinks.forEach(function(v,k){
        v.classList.remove('active');
      })
    navLinks[i].classList.add('active');
    }
    i++;
  });
}

// HOBBIES section
var cardsContainer = document.querySelector('.cards');
var cards = document.querySelectorAll('.card');

var prevCardBtn = document.querySelector('.section.hobbies > .nav-menu > .prev');
var nextCardBtn = document.querySelector('.section.hobbies > .nav-menu > .next');

cardsContainer.style.setProperty('--cards-container-width-50', cardsContainer.offsetWidth/2+'px');

var cardWidth = cards[0].offsetWidth + 20;

var cardHeightToUse = 0;
cards.forEach(function(v,k){
  cardHeightToUse = v.offsetHeight > cardHeightToUse ? v.offsetHeight : cardHeightToUse;
});
cardsContainer.style.height += cardHeightToUse + 20 + 'px';
document.documentElement.style.setProperty('--card-height-to-use', `${cardHeightToUse}px`);


function moveCards() {
  if (currentCardI == 0) {
    prevCardBtn.classList.add('disabled');
    nextCardBtn.classList.remove('disabled');
  } else if (currentCardI == cards.length-1) {
    nextCardBtn.classList.add('disabled');
    prevCardBtn.classList.remove('disabled');
  } else {
    prevCardBtn.classList.remove('disabled');
    nextCardBtn.classList.remove('disabled');
  }

  cardsContainer.style.setProperty('--current-card-i', currentCardI);

  cards.forEach(function(v,k){
    let cardLeft = ((cardsContainer.offsetWidth/2) - (currentCardI*cardWidth) - (cardWidth / 2) + (k * cardWidth));
    v.style.left = `${cardLeft}px`;

    let dfc = Math.abs((cardsContainer.offsetWidth/2) - cardLeft - cardWidth/2);
    let somevar = cards.length * cardWidth;
    v.style.filter = `blur(${
      (dfc/somevar)*(cards.length*4)
    }px)`;
    v.style.transform = `scale(${
      Math.pow(0.9,(dfc/somevar)*(cards.length*2))
    })`

  });
}

var currentCardI = 0;
moveCards();

prevCardBtn.addEventListener('click', function(){
  currentCardI = currentCardI > 0 ? --currentCardI : 0 ;
  moveCards();
});

nextCardBtn.addEventListener('click', function(){
  currentCardI = currentCardI < cards.length-1 ? ++currentCardI : cards.length-1;
  moveCards();
});

const cardsContainerMouseUpEvent = new MouseEvent('mouseup', {
  view: window,
  bubbles: true,
  cancellable: true
});


var x1;
var x2;
var _x1
var cardsPassedWhileDragging = 0;
var nextCardI = currentCardI;
var cardsContainerLock = false;

function getClientX(event) {
  return event.changedTouches ? event.changedTouches[0].clientX : event.clientX;
}

function contactStart(e) {
  cardsContainerLock = true;
  toggleClassesInElements(cards,'transition', false);
  x1 = getClientX(e);
  _x1 = getClientX(e);
  cardsPassedWhileDragging = 0;
}

function contactDrag(e) {
  e.preventDefault();
  if (cardsContainerLock) {
    var _x2 = getClientX(e);
    cards.forEach(function(v,k){
      if (v.style.left.replace('px','') < cardsContainer.offsetWidth/2) {
        nextCardI = k;
        _x1 = _x2;
      }
      let cardLeft = ((cardsContainer.offsetWidth/2) - (currentCardI*cardWidth) - (cardWidth / 2) + (k * cardWidth));
      v.style.left = ( cardLeft + ((getClientX(e) - x1))) + 'px';

      let dfc = Math.abs((cardsContainer.offsetWidth/2) - cardLeft - cardWidth/2 + (x1 - getClientX(e)));
      let somevar = cards.length * cardWidth;
      v.style.filter = `blur(${
        (dfc/somevar)*(cards.length*4)
      }px)`;
      v.style.transform = `scale(${
        Math.pow(0.9,(dfc/somevar)*(cards.length*2))
      })`
    });
  }
}

function contactEnd(e) {
  cardsContainerLock = false;
  toggleClassesInElements(cards,'transition', true);
  if (currentCardI == nextCardI) {
    let ratio = (x1 - getClientX(e))/(cardWidth/2);
    if ( ratio > 0.5 ) {
      currentCardI = currentCardI !== cards.length-1 ? ++currentCardI : currentCardI;
    } 
    if (ratio < -0.5){
      currentCardI = currentCardI !== 0 ? --currentCardI : currentCardI;
    }
  } else {
    currentCardI = nextCardI;
  }
  
  
  moveCards();
}

cardsContainer.addEventListener('mousedown', contactStart);
cardsContainer.addEventListener('mousemove', contactDrag);
cardsContainer.addEventListener('mouseup', contactEnd)
cardsContainer.addEventListener('mouseleave', function(e){
  if (cardsContainerLock) {
    contactEnd(e);
  }
})

cardsContainer.addEventListener('touchstart', contactStart);
cardsContainer.addEventListener('touchmove', contactDrag);
cardsContainer.addEventListener('touchend', contactEnd)



// INITIAL FUNCTIONS TO RUN
showHeaderTop(window.scrollY);

// CLOCK
const timeDiv = document.querySelector('.date-time > .time');
const dateDiv = document.querySelector('.date-time > .date');

updateTime = () => {
  fetch('https://worldtimeapi.org/api/timezone/Asia/Manila',{credentials: 'omit'})
  .then(response => response.json())
  .then(data => {
    let gmt8 = new Date(data.datetime);
    let hours = gmt8.getHours() > 12 ? (gmt8.getHours() - 12) : gmt8.getHours() ;
    hours = hours > 10 ? hours : `0${hours}`
    let minutes = (gmt8.getMinutes() < 10 ? '0' : '') + gmt8.getMinutes();
    let meridiem = gmt8.getHours() >= 12 ? 'PM' : 'AM';
    timeDiv.innerHTML = hours + ' : ' + minutes +' '+ meridiem;
    dateDiv.innerHTML = gmt8.toDateString();

    let waitTime = (60 - gmt8.getSeconds())*1000;
    setTimeout(updateTime, waitTime)
  }) 
  .catch(error => {
    updateTime();
  }) 
}

updateTime();


} //end of document ready
