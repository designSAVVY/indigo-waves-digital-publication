document.addEventListener("DOMContentLoaded", function () {
    let aboutButton = document.getElementById("aboutButton");
    let aboutOverlay = document.getElementById("aboutOverlay");
    let aboutOverlayClose = document.getElementById("aboutOverlayClose");
    let bookIndex = document.getElementById("bookIndex");
    let bookContent = document.getElementById("bookContent");
    let footNotesAndAudiobook = document.getElementById("footNotesAndAudiobook");

    aboutButton.addEventListener("click", function () {
        aboutOverlay.style.display = "block";
        // Add blur class to each element
        bookIndex.classList.add('blur-background'); 
        bookContent.classList.add('blur-background');
        footNotesAndAudiobook.classList.add('blur-background');
    });

    aboutOverlayClose.addEventListener("click", function () {
        aboutOverlay.style.display = "none";
        // Remove blur class from each element
        bookIndex.classList.remove('blur-background'); 
        bookContent.classList.remove('blur-background');
        footNotesAndAudiobook.classList.remove('blur-background');
    });

    document.addEventListener("click", function (event) {
        if (!aboutOverlay.contains(event.target) && event.target !== aboutButton) {
            aboutOverlay.style.display = "none";
            // Remove blur class from each element
            bookIndex.classList.remove('blur-background'); 
            bookContent.classList.remove('blur-background');
            footNotesAndAudiobook.classList.remove('blur-background');
        }
    });
});

//aboutSlider
let currentSlide = 0;
const slides = document.querySelectorAll('.aboutContent');

function updateSlide(slideDelta) {
    // Hide current slide
    slides[currentSlide].style.display = 'none';
    
    // Update currentSlide variable
    currentSlide += slideDelta;
    if (currentSlide < 0) {
        currentSlide = 0;
    } else if (currentSlide >= slides.length) {
        currentSlide = slides.length - 1;
    }
    
    // Show updated slide
    slides[currentSlide].style.display = 'block';
}

document.querySelectorAll('.aboutOverlayNext').forEach(btn => {
    btn.addEventListener('click', () => {
        updateSlide(1);
    });
});

document.querySelectorAll('.aboutOverlayPrev').forEach(btn => {
    btn.addEventListener('click', () => {
        updateSlide(-1);
    });
});

for(let i = 1; i < slides.length; i++) {
    slides[i].style.display = 'none';
}



//secondaryNav functions
const mainNavButtons = document.querySelectorAll('#mainNav button[data-target]');
const secondaryNavMenus = document.querySelectorAll('.secondaryNavMenu');

function activateNav(targetNav) {
    for (let i = 0; i < secondaryNavMenus.length; i++) {
        if (secondaryNavMenus[i].id === targetNav) {
            secondaryNavMenus[i].classList.add('activeSecondaryMenu');
        } else {
            secondaryNavMenus[i].classList.remove('activeSecondaryMenu');
        }
    }
}

for (let i = 0; i < mainNavButtons.length; i++) {
    const button = mainNavButtons[i];
    const targetNav = button.dataset.target;
    const navMenu = document.getElementById(targetNav);

    button.addEventListener('mouseenter', function () {
        activateNav(targetNav);
        for (let j = 0; j < mainNavButtons.length; j++) {
            mainNavButtons[j].classList.remove('activeButton');
        }
        button.classList.add('activeButton');
    });

    button.addEventListener('click', function () {
        if (navMenu.classList.contains('activeSecondaryMenu')) {
            navMenu.classList.remove('activeSecondaryMenu');
            button.classList.remove('activeButton');
        } else {
            activateNav(targetNav);
            for (let j = 0; j < mainNavButtons.length; j++) {
                mainNavButtons[j].classList.remove('activeButton');
            }
            button.classList.add('activeButton');
        }
    });
}

for (let i = 0; i < secondaryNavMenus.length; i++) {
    const menu = secondaryNavMenus[i];
    menu.addEventListener('mouseleave', function () {
        for (let j = 0; j < mainNavButtons.length; j++) {
            mainNavButtons[j].classList.remove('activeButton');
        }
        menu.classList.remove('activeSecondaryMenu');
    });
}

//hide mainNav
const mainNav = document.getElementById('mainNav');
const showToolButton = document.getElementById('showToolButton');

showToolButton.onclick = function () {
    mainNav.classList.toggle('hideMainNav');
    this.classList.toggle('activeButton');
    toggleFullScreen();
}

//on enter, de-activate menu options and hide submenus
showToolButton.onmouseenter = function () {
    for (let b = 0; b < mainNavButtons.length; b++) {
        mainNavButtons[b].classList.remove('activeButton');
    }
    for (let n = 0; n < secondaryNavMenus.length; n++) {
        secondaryNavMenus[n].classList.remove('activeSecondaryMenu');
    }
}

//Fullscreen

function toggleFullScreen() {
    const elementsToToggle = ['mainBookText', 'footNotesAndAudiobook', 'bookIndex'];
    
    bookContent.classList.toggle('fullscreen-margin');

    elementsToToggle.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.toggle('fullscreen-padding');
        }
    });

    if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            /* Firefox */
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            /* Chrome, Safari & Opera */
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            /* IE/Edge */
            document.documentElement.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            /* Chrome, Safari & Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            /* IE/Edge */
            document.msExitFullscreen();
        }
    }
}

  