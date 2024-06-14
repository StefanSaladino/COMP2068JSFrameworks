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

    // Activate SimpleLightbox plugin for portfolio items
    new SimpleLightbox({
        elements: '#portfolio a.portfolio-box'
    });

    document.addEventListener('DOMContentLoaded', function () {
        // Get the button elements
        const frameworksButton = document.getElementById('frameworks');
        const languagesButton = document.getElementById('languages');
      
        // Get the card sections
        const frameworksCardSection = document.getElementById('frameworks-card');
        const languagesCardSection = document.getElementById('languages-card');
      
        // Function to show frameworks and hide languages
        function showFrameworks() {
          frameworksCardSection.style.display = 'block';
          languagesCardSection.style.display = 'none';
        }
      
        // Function to show languages and hide frameworks
        function showLanguages() {
          frameworksCardSection.style.display = 'none';
          languagesCardSection.style.display = 'block';
        }
      
        // Add event listeners to buttons
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
      

});
