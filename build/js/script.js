var mainNav = document.querySelector(".main-nav");
var toggler = document.querySelector(".main-nav__toggler");

mainNav.classList.remove("main-nav--nojs");

toggler.addEventListener("click", function(event) {
  event.preventDefault();
  if (mainNav.classList.contains("main-nav--closed")) {
    mainNav.classList.remove("main-nav--closed");
    mainNav.classList.add("main-nav--opened");
  } else {
    mainNav.classList.add("main-nav--closed");
    mainNav.classList.remove("main-nav--opened");
  }
});
