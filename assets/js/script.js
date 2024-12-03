function toggleBio() {
  const bioElement = document.querySelector('.bio');
  bioElement.classList.toggle('active');
}

document.addEventListener("DOMContentLoaded", () => {
  const menuDiv = document.querySelector('.menu');
  const contentDiv = document.querySelector('.content');
  const swiperWrapper = document.querySelector('.swiper-wrapper');
  const number = document.querySelector('.number');
  const container = document.querySelector('.container');
  const back = document.querySelector('.back');
  var media = window.matchMedia("(max-width: 779px)")

  function setupImageHover() {
    const Images = document.querySelectorAll('.swiper-slide img');
    const content = document.querySelector(".content-item");
  
    Images.forEach(img => {
      let isFocused = false; // State to track toggle status
  
      img.style.transition = "filter 0.4s ease-in-out";
      img.style.filter = "opacity(50%) blur(10px)";
  
      // Desktop hover
      img.addEventListener("mouseenter", () => {
        applyFocusStyles(img, content);
      });
  
      img.addEventListener("mouseleave", () => {
        removeFocusStyles(img, content);
      });
    });

    swiperWrapper.addEventListener("touchstart", () => {
      if (!isFocused) {
        applyFocusStyles(img, content);
        isFocused = true; // Toggle state on
      } else {
        removeFocusStyles(img, content);
        isFocused = false; // Toggle state off
      }
    }, { passive: true });
  
    function applyFocusStyles(img, content) {
      img.style.zIndex = "999";
      img.style.filter = "opacity(1) blur(0)";
      content.style.zIndex = "1";
    }
  
    function removeFocusStyles(img, content) {
      img.style.zIndex = "1";
      img.style.filter = "opacity(50%) blur(10px)";
      content.style.zIndex = "999";
    }
  }
  

  // Function to initialize the swiper and number indexing
  function setupSwiperAndNumber() {
    const swiperDivs = document.querySelectorAll('.swiper-slide');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(swiperDivs).indexOf(entry.target);
            number.textContent = `(${index + 1}.)`;
          }
        });
      },
      {
        root: document.querySelector('.swiper'),
        threshold: 0.5,
      }
    );

    swiperDivs.forEach((div) => observer.observe(div));

    // Initialize Swiper
    new Swiper('.swiper', {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
      },
      loop: true,
    });
  }

  // Function to populate content and images
  function updateContent(item) {
    contentDiv.querySelector('.title p').textContent = item.title;
    contentDiv.querySelector('.date p').textContent = item.date;
    contentDiv.querySelector('.info p').textContent = item.info;

    swiperWrapper.innerHTML = ''; // Clear existing slides
    item.images.forEach(imageSrc => {
      const slideDiv = document.createElement('div');
      slideDiv.classList.add('swiper-slide');
      const img = document.createElement('img');
      img.src = imageSrc;
      slideDiv.appendChild(img);
      swiperWrapper.appendChild(slideDiv);
    });

    // Reinitialize hover effects and Swiper
    setupImageHover();
    setupSwiperAndNumber();
  }

  // Fetch data from JSON
  fetch('data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Populate the menu
      data.forEach((item, index) => {
        const menuItemDiv = document.createElement('div');
        menuItemDiv.classList.add('menu-item');
        menuItemDiv.textContent = item.menuItem;
        menuItemDiv.dataset.index = index;
        menuDiv.appendChild(menuItemDiv);
      });
      
      // Add event listeners to menu items
      menuDiv.addEventListener('click', (event) => {
        if (media.matches) {
          container.style.transform = "translateX(-100%)"
        }
        if (event.target.classList.contains('menu-item')) {
          const index = event.target.dataset.index;
          updateContent(data[index]);
        }
      });

      // Load the first item by default
      updateContent(data[0]);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

  back.style.zIndex = "999"
  back.addEventListener('click', () => {
    if (container.style.transform = "translateX(-100%)") {
      container.style.transform = "translateX(0)"
    }
  })
});
