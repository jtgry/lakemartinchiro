var feed = new Instafeed({
  get: 'user',
  userId: '2923101612',
  clientId: '86cf11df1958430484c96f4b0e823b73',
  accessToken: '2923101612.1677ed0.7948f055fe3e4e0cb89dc19982633976',
  template: '<a class="block-instagram" style="background-image: url({{image}});" href="{{link}}"></a>',
  sortBy: 'most-recent',
  limit: '8',
  resolution: 'standard_resolution'
});
feed.run();

$(document).ready(function () {

  window.onload = function () { 
    $("#cover").fadeOut(300);
    window.sr = ScrollReveal();
    sr.reveal('.block-content', {origin: 'bottom', scale: 1, duration: 1000});
    sr.reveal('.block-title', {origin: 'bottom', scale: 1, duration: 1000}, 200);
    sr.reveal('.block-image', {origin: 'bottom', scale: 1, duration: 1500 }, 200);
    sr.reveal('.block-instagram', {origin: 'bottom', scale: 1, duration: 1000 }, 200);
    sr.reveal('.fancy-button', {origin: 'bottom', scale: 1, duration: 1000 }, 200);

    var menuButton = document.getElementById('navButton');
    menuButton.addEventListener('click', function (e) {
      menuButton.classList.toggle('is-active');
      e.preventDefault();
    });
    $('.nav-button').click(function() {
      $(".mobile-nav").fadeToggle(500);
    });
  }
  

});
// grab an element
var myElement = document.querySelector("#main-nav");
// construct an instance of Headroom, passing the element
var headroom  = new Headroom(myElement);
// initialise
headroom.init(); 

