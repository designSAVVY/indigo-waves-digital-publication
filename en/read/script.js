//Get the root style to access css variables
let root  = document.documentElement;

//Change color scheme
const colorSchemes = [
    /* --bg, --bgA, --bgB, --c1,  --c2, --c3, --c4 */
    ['#3F4B9A','#F18402','#3F4B9A','#F4F4F4','#FBF00A','#FBF00A','#FBF00A','dark'], //Indigo Deep Blue
    ['#933786','#019754','#933786','#F4F4F4','#FBF00A','#FBF00A','#FBF00A','dark'], //Indigo Light Blue
    ['#3F4B9A','#019B95','#3F4B9A','#F4F4F4','#FBF00A','#FBF00A','#FBF00A','dark'], //Indigo dark Blue
];

const bookColorButton = document.getElementById('bookColorButton');
let bookColorIndicator = document.getElementById('bookColorIndicator');
bookColorIndicator.innerHTML = colorSchemes.length - 1;

const invertOnDarkArray = document.getElementsByClassName('invertOnDark');

let colorCounter = 0;
bookColorButton.onclick = function(){
  // Set color scheme
  root.style.setProperty('--bg', colorSchemes[colorCounter][0]);
  root.style.setProperty('--bgA', colorSchemes[colorCounter][1]);
  root.style.setProperty('--bgB', colorSchemes[colorCounter][2]);
  root.style.setProperty('--c1', colorSchemes[colorCounter][3]);
  root.style.setProperty('--c2', colorSchemes[colorCounter][4]);
  root.style.setProperty('--c3', colorSchemes[colorCounter][5]);
  root.style.setProperty('--c4', colorSchemes[colorCounter][6]);

  // Check if the color scheme type is dark
  if (colorSchemes[colorCounter][7] === 'dark') {
      // If dark theme, apply the CSS filter to invert the colors of the images
      for (let i = 0; i < invertOnDarkArray.length; i++) {
          invertOnDarkArray[i].style.filter = 'invert(1)';
      }
  } else {
      // If not dark theme, remove the CSS filter to return to the original image
      for (let i = 0; i < invertOnDarkArray.length; i++) {
          invertOnDarkArray[i].style.filter = 'invert(0)';
      }
  }
  // Update color counter and loop back to the first color scheme if necessary
  bookColorIndicator.innerHTML = colorCounter;
  colorCounter ++;
  if (colorCounter == colorSchemes.length) {
      colorCounter = 0;
  }
};

//END Change color scheme

//Change fonts
const fontPairs = [
    /* book, display, interface */
    ['Gambetta-Light', 'Zimula','Zimula'],
    ['Zimula', 'Zimula','Zimula'],
];

const bookFontButton = document.getElementById('bookFontButton');
let bookFontIndicator = document.getElementById('bookFontIndicator');

let fontCounter = 0;
bookFontButton.onclick = function(){
    root.style.setProperty('--mainFontFamily', fontPairs[fontCounter][0]);
    root.style.setProperty('--displayFontFamily', fontPairs[fontCounter][1]);
    root.style.setProperty('--interfaceFontFamily', fontPairs[fontCounter][2]);
    bookFontIndicator.innerHTML = fontCounter;
    fontCounter ++;
    if(fontCounter == fontPairs.length){fontCounter = 0}
};

//Appear footnotes on view
let footNotes = document.getElementsByClassName('footNote');
let footNotesEx = document.getElementsByClassName('footNoteEx');
let thresholdLimit = 1;

let observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        let index = Array.from(footNotes).indexOf(entry.target);
        if(entry.isIntersecting === true){
            appear(footNotesEx[index], 250);
        } else {
            disappear(footNotesEx[index], 250);
        }
    });
}, { threshold: [thresholdLimit] });

//Activate observer for all footNotes
for(let c = 0; c < footNotes.length; c++){
    observer.observe(footNotes[c]);
}

//Appear functions
const appear = function(element, time){
  element.style.display = 'block';
  setTimeout(() => { element.style.opacity = 1; }, time);
};

const disappear = function(element, time){
  element.style.opacity = 0;
  setTimeout(() => { element.style.display = 'none'; }, time);
};

//Change audiobook file according to chapter in view
let sectionToAudioMap = {
};

let options = {
  root: null,
  rootMargin: '0px',
  threshold: 0
};

 // Ensure all units are the same size and occupy the full viewport.
 let singleUnits = document.querySelectorAll('.unit');

 let observerUnits = new IntersectionObserver(function(entries) {
     entries.forEach(function(entry) {
         if (entry.isIntersecting) {
             // Update URL to reflect current unit.
             let id = entry.target.id;
             history.pushState({}, '', '#' + id);
         }
     });
 }, {threshold: 0.5});  // Adjust threshold as needed.

 // Watch all units.
 singleUnits.forEach(function(unit) {
     observerUnits.observe(unit);
 });

let observerChapter = new IntersectionObserver(onIntersection, options);

// Watch all sections
let sections = document.querySelectorAll('[audiobookSection]');
sections.forEach(section => {
  observerChapter.observe(section);
});

// When a section intersects with the viewport
function onIntersection(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // This section is in view
      let sectionId = entry.target.id;
      let audioFile = sectionToAudioMap[sectionId];

      // Load and play the audio file
      loadAndPlayAudio(audioFile, sectionId);
    }
  });
}

function loadAndPlayAudio(file, sectionId) {
  // Stop current audio if any
  let audioElement = document.getElementById("audioBookFile");
  if (!audioElement.paused) {
    audioElement.pause();
  }

  // Replace hyphens with spaces and capitalize first letter for display
  let formattedSectionName = sectionId.replace(/-/g, ' ');
  formattedSectionName = formattedSectionName.charAt(0).toUpperCase() + formattedSectionName.slice(1);

  // Update displayed section name
  document.getElementById("bookSection").innerHTML = formattedSectionName;

  // Load new audio file
  let audioFilePath = `audiobook/${file}`;
  audioElement.src = audioFilePath;
}

//Toggle Index and Footnotes in mobile
const bookIndex = document.getElementById("bookIndex");
const buttonIndex = document.getElementById("buttonIndex");
const tocAltButton = document.getElementById("ToC-altButton");
const bookIndexToggleButtons = [buttonIndex, tocAltButton].filter(Boolean);

const closeBookIndex = function() {
    if (!bookIndex.classList.contains('showBookIndex')) return;
    bookIndex.classList.remove('showBookIndex');
    bookIndexToggleButtons.forEach(btn => btn.classList.remove('activeButton'));
};

const toggleBookIndex = function() {
    const isOpen = bookIndex.classList.toggle('showBookIndex');
    bookIndexToggleButtons.forEach(btn => btn.classList.toggle('activeButton', isOpen));
};

bookIndexToggleButtons.forEach(btn => btn.addEventListener('click', toggleBookIndex));

document.addEventListener('click', function(event) {
    const clickedInsideIndex = bookIndex.contains(event.target);
    const clickedToggleButton = bookIndexToggleButtons.some(btn => btn.contains(event.target));
    if (!clickedInsideIndex && !clickedToggleButton) {
        closeBookIndex();
    }
});

const footNotesAndAudiobook = document.getElementById("footNotesAndAudiobook");
const buttonFootNotes = document.getElementById("buttonFootNotes");
const footNotesToggleButtons = [buttonFootNotes].filter(Boolean);

const closeFootNotes = function() {
    if (!footNotesAndAudiobook.classList.contains('showBookFootNotes')) return;
    footNotesAndAudiobook.classList.remove('showBookFootNotes');
    footNotesToggleButtons.forEach(btn => btn.classList.remove('activeButton'));
};

const toggleFootNotes = function() {
    const isOpen = footNotesAndAudiobook.classList.toggle('showBookFootNotes');
    footNotesToggleButtons.forEach(btn => btn.classList.toggle('activeButton', isOpen));
};

const openFootNotes = function() {
    if (footNotesAndAudiobook.classList.contains('showBookFootNotes')) return;
    footNotesAndAudiobook.classList.add('showBookFootNotes');
    footNotesToggleButtons.forEach(btn => btn.classList.add('activeButton'));
};

Array.from(footNotes).forEach(fn => {
    fn.addEventListener('click', openFootNotes);
});

buttonFootNotes && (buttonFootNotes.onclick = toggleFootNotes);

document.addEventListener('click', function(event) {
    const clickedInsideIndex = bookIndex.contains(event.target);
    const clickedIndexToggleButton = bookIndexToggleButtons.some(btn => btn.contains(event.target));
    if (!clickedInsideIndex && !clickedIndexToggleButton) {
        closeBookIndex();
    }

    const clickedInsideFootnotes = footNotesAndAudiobook.contains(event.target);
    const clickedFootnotesToggle = footNotesToggleButtons.some(btn => btn.contains(event.target));
    const clickedFootNote = Array.from(footNotes).some(fn => fn.contains(event.target));
    if (!clickedInsideFootnotes && !clickedFootnotesToggle && !clickedFootNote) {
        closeFootNotes();
    }
});
