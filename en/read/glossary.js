
//WITH SPANS
function createTermSpan(term, glossaryItem) {
  const span = document.createElement('span');
  span.textContent = term;

  const tooltip = document.createElement('span');
  tooltip.classList.add('tooltip');

  const definitionElement = document.createElement('span');
  definitionElement.classList.add('definition');
  definitionElement.textContent = glossaryItem.definition; // access the definition from the glossaryItem object

  const tooltipButton = document.createElement('button');
  tooltipButton.classList.add('term');

  tooltip.appendChild(span);
  tooltip.appendChild(tooltipButton);
  tooltip.appendChild(definitionElement);

  tooltip.addEventListener('mouseenter', () => {
    const parentRect = tooltip.parentElement.getBoundingClientRect();
    const buttonRect = tooltipButton.getBoundingClientRect();

    // Check if the term is on the left or right half of the parent element
    if (buttonRect.left + (buttonRect.width / 2) < parentRect.left + (parentRect.width / 2)) {
      // Term is on the left half of the parent, align the definition to the left of the term
      definitionElement.style.left = '0';
      definitionElement.style.right = 'auto';
    } else {
      // Term is on the right half of the parent, align the definition to the right of the term
      definitionElement.style.left = 'auto';
      definitionElement.style.right = '0';
    }
  });

  return tooltip;
}

function replaceTermsWithButtons(element, glossary) {
  if (element.classList.contains('bookGlossaryTermContainer')) {
    // Skip this element if it is a glossary term container
    return;
  }
  if (element.classList.contains('excludeGlossary')) {
    // Skip this element if it is a glossary term container
    return;
  }
  const terms = Object.keys(glossary);
  const regex = new RegExp('\\b(' + terms.join('|') + ')\\b', 'gi');

  Array.from(element.childNodes).forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      let content = node.textContent;
      const fragment = document.createDocumentFragment();
      let match;

      while ((match = regex.exec(content)) !== null) {
        // Add the text before the matched term
        const precedingText = content.slice(0, match.index);
        fragment.appendChild(document.createTextNode(precedingText));
        
        // Add the button for the matched term
        fragment.appendChild(createTermSpan(match[0], glossary[match[0].toLowerCase()]));

        // Remove the processed part of the content
        content = content.slice(regex.lastIndex);
        
        // Reset the regex lastIndex property, because we modified the content
        regex.lastIndex = 0;
      }
      
      // Add any remaining text after the last match
      fragment.appendChild(document.createTextNode(content));
      node.parentNode.replaceChild(fragment, node);
    } else if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('tooltip')) {
      // Only process childNodes that are not part of a tooltip
      replaceTermsWithButtons(node, glossary);
    }
  });
}

let tooltipsGenerated = false;
let tooltipsVisible = false;
let tooltipsFirstPress = true;


const buttonGlossary = document.getElementById("buttonGlossary");

buttonGlossary.addEventListener('click', function() {
  this.classList.toggle('activeButton');
  //on first press, generate tooltips
  if (tooltipsFirstPress){
    if (!tooltipsGenerated) {
        generateTooltips();
        tooltipsGenerated = true;
        tooltipsVisible = true;
    }
    tooltipsFirstPress = false;
    //after first press & tooltip generation, only hide and show
  } else if(!tooltipsFirstPress){
    if (tooltipsVisible){
      let tooltips = document.getElementsByClassName('tooltip');
      let terms = document.getElementsByClassName('term');
      for(let t = 0; t < tooltips.length; t++){
        tooltips[t].style.pointerEvents = 'none';
        terms[t].style.display = 'none';
      }
      tooltipsVisible = false;
    } else if (!tooltipsVisible){
      let tooltips = document.getElementsByClassName('tooltip');
      let terms = document.getElementsByClassName('term');
      for(let t = 0; t < tooltips.length; t++){
        tooltips[t].style.pointerEvents = 'all';
        terms[t].style.display = 'block';
      }
      tooltipsVisible = true;
    }
  }
});

function generateTooltips() {
  // Load the JSON file to make tooltips
  fetch('glossary.json')
      .then(response => response.json())
      .then(data => {
          // Convert the glossary array to an object
          const glossary = data.glossary.reduce((acc, item) => {
              acc[item.term.toLowerCase()] = { definition: item.definition, available: item.available }; // each glossary item is now an object
              return acc;
          }, {});

          const paragraphs = document.querySelectorAll('.unit');

          paragraphs.forEach(paragraph => {
              replaceTermsWithButtons(paragraph, glossary);
          });
      })
      .catch(error => console.error('Error:', error));
}

// Load the JSON file
fetch('glossary.json')
  .then(response => response.json())
  .then(data => {
    // Convert the glossary array to an object
    const glossary = data.glossary;

    // Sort glossary array alphabetically by term
    glossary.sort((a, b) => a.term.localeCompare(b.term));

    // Get the parent element where the terms should be added
    const glossaryContainer = document.getElementById('bookGlossary');

    glossary.forEach(item => {
      const termContainer = document.createElement('details');
      termContainer.classList.add('bookGlossaryTermContainer');
      
      const termElement = document.createElement('summary');
      termElement.textContent = item.term;
      
      const definitionElement = document.createElement('p');
      definitionElement.textContent = ' ' + item.definition; // add space before definition for proper spacing
      
      termContainer.appendChild(termElement);
      termContainer.appendChild(definitionElement);
      
      glossaryContainer.appendChild(termContainer);
    });
  }).catch(error => console.error('Error:', error));

function isIOS() {
  return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
  ].includes(navigator.platform) ||
  // iPad on iOS 13+ detection
  (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}

window.onload = function() {
  if (isIOS()) {
      const btn = document.getElementById("buttonGlossary");
      if (btn) {
          btn.style.display = "none"; // hide the button
          btn.disabled = true; // disable the button
      }
      // Set the --bookFontSize variable for the entire document
      document.documentElement.style.setProperty('--bookFontSize', '16px');
      buttonFootNotes.innerHTML = '[]';
  }
};
