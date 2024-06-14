/*!
* Start Bootstrap - Creative v7.0.7 (https://startbootstrap.com/theme/creative)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

  // Navbar shrink function
  var navbarShrink = function () {
      const navbarCollapsible = document.body.querySelector('#mainNav');
      if (!navbarCollapsible) {
          return;
      }
      if (window.scrollY === 0) {
          navbarCollapsible.classList.remove('navbar-shrink')
      } else {
          navbarCollapsible.classList.add('navbar-shrink')
      }

  };

  // Shrink the navbar 
  navbarShrink();

  // Shrink the navbar when page is scrolled
  document.addEventListener('scroll', navbarShrink);

  // Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector('#mainNav');
  if (mainNav) {
      new bootstrap.ScrollSpy(document.body, {
          target: '#mainNav',
          rootMargin: '0px 0px -40%',
      });
  };

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector('.navbar-toggler');
  const responsiveNavItems = [].slice.call(
      document.querySelectorAll('#navbarResponsive .nav-link')
  );
  responsiveNavItems.map(function (responsiveNavItem) {
      responsiveNavItem.addEventListener('click', () => {
          if (window.getComputedStyle(navbarToggler).display !== 'none') {
              navbarToggler.click();
          }
      });
  });



  // Get the button elements
  const frameworksButton = document.getElementById('frameworks');
  const languagesButton = document.getElementById('languages');

  // Get the card sections
  const frameworksCardSection = document.getElementById('frameworks-card');
  const languagesCardSection = document.getElementById('languages-card');

  // Function to show frameworks and hide languages
  function showFrameworks() {
      frameworksCardSection.style.display = 'grid';
      languagesCardSection.style.display = 'none';

      frameworksButton.classList.add('active');
      languagesButton.classList.remove('active');

     // Update Bootstrap active state
     //select ancestor button group element
     //remove active from all buttons in group
    frameworksButton.closest('.btn-group').querySelectorAll('.btn').forEach(btn => {
        btn.classList.remove('active');
    });
    //append active to appropriate button
    frameworksButton.parentElement.classList.add('active');
  }

  // Function to show languages and hide frameworks
  function showLanguages() {
      frameworksCardSection.style.display = 'none';
      languagesCardSection.style.display = 'grid';

    languagesButton.closest('.btn-group').querySelectorAll('.btn').forEach(btn => {
        btn.classList.remove('active');
    });
    languagesButton.parentElement.classList.add('active');
  }

  // Add event listeners to radio buttons
  frameworksButton.addEventListener('change', function () {
      if (frameworksButton.checked) {
          showFrameworks();
      }
  });

  languagesButton.addEventListener('change', function () {
      if (languagesButton.checked) {
          showLanguages();
      }
  });

  // Initialize the display based on the default selected button
  if (frameworksButton.checked) {
      showFrameworks();
  } else {
      showLanguages();
  }
});
