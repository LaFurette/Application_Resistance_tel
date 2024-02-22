document.addEventListener('DOMContentLoaded', function () {
  function hideTitleOption(selectElement) {
    const titleOption = selectElement.querySelector('option[disabled][selected]');
    if (titleOption) {
      titleOption.style.display = 'none';
    }
  }

  function parseMultiplier(multiplierStr) {
    const multiplierMap = {
      '': 1,
      'Ω': 1,
      'kΩ': 1000,
      'MΩ': 1000000,
      'GΩ': 1000000000
    };

    const match = multiplierStr.match(/x?(\d+(\.\d+)?)(Ω|kΩ|MΩ|GΩ)/);
    if (match) {
      const numericValue = parseFloat(match[1]);
      const unitSymbol = match[3];
      const multiplier = multiplierMap[unitSymbol];
      return numericValue * multiplier;
    }

    return 1;
  }

  function simulateClick(element) {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    element.dispatchEvent(event);
  }

  function updateResistanceValue() {
    const numBands = colorSelects.length;

    let firstBandValue = 0;
    let secondBandValue = 0;
    let thirdBandValue = 0;
    let fourthBandValue = 0;
    let multiplierValue = 1;
    const kiloCell = document.querySelector('.kilo');
    const megaCell = document.querySelector('.mega');
    const gigaCell = document.querySelector('.giga');
    const resistTable = document.querySelector('.resist-table');


    if (numBands >= 3) {
      firstBandValue = Number(colorSelects[0].value);
      secondBandValue = Number(colorSelects[1].value);
      thirdBandValue = Number(colorSelects[2].value);
      multiplierValue = parseMultiplier(colorSelects[2].value);
    }

    if (numBands >= 4) {
      fourthBandValue = Number(colorSelects[3].value);
    }

    if (numBands >= 5) {
      multiplierValue = parseMultiplier(colorSelects[numBands - 2].value);
    }
    if (numBands >= 6) {
      multiplierValue = parseMultiplier(colorSelects[numBands - 3].value);
    }

    let resistanceValue = 0;

    if (numBands === 4 || numBands === 3) {
      resistanceValue = (firstBandValue * 10 + secondBandValue) * multiplierValue;
    } else if (numBands === 5 || numBands === 6) {
      resistanceValue = (firstBandValue * 100 + secondBandValue * 10 + thirdBandValue) * multiplierValue;
    }

    if (!isNaN(resistanceValue)) {
      resistInputScientific.value = parseFloat(resistanceValue).toExponential();
      resistInputOriginal.value = `${resistanceValue}`;
      resistTable.style.display = 'table';
      kiloCell.textContent = (resistanceValue / 1000).toFixed(2);
      megaCell.textContent = (resistanceValue / 1000000).toFixed(2);
      gigaCell.textContent = (resistanceValue / 1000000000).toFixed(2);
    } else {
      resistInputScientific.value = '';
      resistInputOriginal.value = '';
    }

  }

  const colorSelects = document.querySelectorAll('.color-select select');
  const resistorBands = document.querySelector('.resistance-container .resistor-bands');
  const resistInputScientific = document.querySelector('.resist-input-scientific');
  const resistInputOriginal = document.querySelector('.resist-input-original');
  const toleranceSelect = document.querySelector('.tolerance');
  const resistPurcentSelect = document.querySelector('.resist-purcent');

  colorSelects.forEach((select, index) => {
    hideTitleOption(select);
  
    const valueElement = resistorBands.children[index].querySelector('.value');
    const connectorElement = resistorBands.children[index].querySelector('.band-connector');
  
    select.addEventListener('change', () => {
      const selectedOption = select.options[select.selectedIndex];
      const selectedValue = selectedOption.value;
  
      if (selectedOption.style.backgroundColor) {
        select.style.backgroundColor = selectedOption.style.backgroundColor;
        select.style.color = selectedOption.style.color;
        resistorBands.children[index].style.backgroundColor = selectedOption.style.backgroundColor;
        valueElement.textContent = selectedValue;
        valueElement.style.color = selectedOption.style.color;
        valueElement.style.backgroundColor = selectedOption.style.backgroundColor;
        connectorElement.style.backgroundColor = selectedOption.style.backgroundColor;
        connectorElement.style.display = 'block';
      } else {
        select.style.backgroundColor = '';
        select.style.color = '';
        resistorBands.children[index].style.backgroundColor = '#ececec';
        valueElement.textContent = '-';
        valueElement.style.color = '';
        valueElement.style.backgroundColor = '';
        connectorElement.style.display = 'none';
      }
  
      updateResistanceValue();
      formatAndSimulateClick();
    });
  });


  function formatAndSimulateClick() {
    formatInputValue();
    resistInputOriginal.blur();
  }

  function formatInputValue() {
    const currentValue = resistInputOriginal.value;
    const formattedValue = currentValue.replace(/\s/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
    resistInputOriginal.value = formattedValue;
  }

  resistInputOriginal.addEventListener('input', formatInputValue);

  resistInputOriginal.addEventListener('blur', formatInputValue);

  resistInputOriginal.addEventListener('keyup', formatInputValue);

  formatInputValue();





  const resistOhmSelect = document.querySelector('.resist-ohm');

  resistOhmSelect.addEventListener('change', () => {
    updateResistanceBasedOnMultiplier();
  });

  toleranceSelect.addEventListener('change', () => {
    const selectedOption = toleranceSelect.options[toleranceSelect.selectedIndex];
    resistPurcentSelect.value = selectedOption.value;
  });
});


// OPERATION INVERSE 

// function calculateColorCode(resistanceValue, unit, tolerance, coefficient) {

//   let coef;
//   if (unit === 'Ω') coef = 1;
//   else if (unit === 'KΩ') coef = 1e3;
//   else if (unit === 'MΩ') coef = 1e6;
//   else if (unit === 'GΩ') coef = 1e9;
//   else {
//     return 'Invalid unit';
//   }

//   let multiplier;
//   if (resistanceValue < 1) {
//     multiplier = 0.01;
//   } else {
//     const numDigits = resistanceValue.toString().replace('.', '').length;
//     multiplier = parseFloat('1e' + (numDigits - 1));
//   }

//   const thirdBandColor = getColorForMultiplier(multiplier);
//   const fourthBandColor = getColorForTolerance(tolerance);

//   let fifthBandColor = '';
//   if (coefficient !== undefined) {
//     fifthBandColor = getColorForCoefficient(coefficient);
//   }

//   displayColorCodes(thirdBandColor, fourthBandColor, fifthBandColor);

//   const resistanceWithInfo = `${resistanceValue} Ω ±${tolerance} ${coefficient ? `(${coefficient})` : ''}`;
//   displayResistanceInfo(resistanceWithInfo);
// }

// function getColorForMultiplier(multiplier) {
//   if (multiplier === 1) return 'black';
//   else if (multiplier === 10) return 'brown';
//   else if (multiplier === 100) return 'red';
//   else return 'unknown';
// }

// function getColorForTolerance(tolerance) {
//   if (tolerance === '±1%') return 'brown';
//   else if (tolerance === '±2%') return 'red';
//   else return 'unknown';
// }

// function getColorForCoefficient(coefficient) {
//   if (coefficient === '100 ppm/°C') return 'red';
//   else if (coefficient === '50 ppm/°C') return 'blue';
//   else return 'unknown';
// }

// function displayColorCodes(thirdBandColor, fourthBandColor, fifthBandColor) {
//   document.getElementById('thirdBand').style.backgroundColor = thirdBandColor;
//   document.getElementById('fourthBand').style.backgroundColor = fourthBandColor;
//   document.getElementById('fifthBand').style.backgroundColor = fifthBandColor;
// }

// function displayResistanceInfo(resistanceWithInfo) {
//   document.getElementById('resistanceInfo').textContent = resistanceWithInfo;
// }

// Loop through each resistPurcentSelect
// for (let i = 0; i < resistPurcentSelects.length; i++) {
//   const resistPurcentSelect = resistPurcentSelects[i];
//   const colorTolerance = colorTolerances[i];

//   resistPurcentSelect.addEventListener('change', function () {
//     const selectedTolerance = resistPurcentSelect.value;
    

//     for (let j = 0; j < colorTolerance.options.length; j++) {
//       const option = colorTolerance.options[j];
//       if (option.value === selectedTolerance) {
//         colorTolerance.selectedIndex = j;

//         const backgroundColor = option.style.backgroundColor;
//         const textColor = option.style.color;

//         colorTolerance.style.backgroundColor = backgroundColor;
//         colorTolerance.style.color = textColor;
//         break;
//       }
//     }
//   });
// }

const resistPurcentSelects = document.getElementsByClassName('resist-purcent');
const colorTolerances = document.getElementsByClassName('tolerance');
const resistorBands = document.querySelector('.resistance-container .resistor-bands');

for (let i = 0; i < resistPurcentSelects.length; i++) {
  const resistPurcentSelect = resistPurcentSelects[i];
  const colorTolerance = colorTolerances[i];

  resistPurcentSelect.addEventListener('change', function () {
    const selectedTolerance = resistPurcentSelect.value;

    for (let j = 0; j < colorTolerance.options.length; j++) {
      const option = colorTolerance.options[j];
      if (option.value === selectedTolerance) {
        colorTolerance.selectedIndex = j;

        const backgroundColor = option.style.backgroundColor;
        const textColor = option.style.color;

        colorTolerance.style.backgroundColor = backgroundColor;
        colorTolerance.style.color = textColor;

        const bandElement = resistorBands.querySelector(`.band4`);
        console.log(bandElement);
        const connectorElement = bandElement.querySelector('.band-connector');

        bandElement.style.backgroundColor = backgroundColor;
        connectorElement.style.backgroundColor = backgroundColor;

        const valueElement = bandElement.querySelector('.value');
        valueElement.style.color = textColor;
        valueElement.style.backgroundColor = backgroundColor;
        valueElement.textContent = resistPurcentSelect.value;


        break;
      }
    }
  });
}


// CALCUL INVERSE DES RESISTANCES 

const resistInputOriginal = document.querySelector('.resist-input-original');

resistInputOriginal.addEventListener('input', function (e) {
  let inputValue = e.target.value;

  // Règle 1: N'autoriser que la saisie des caractères de nombre entier (pas de caractères spéciaux, pas de lettre) : uniquement la virgule décimale
  const regex = /^[0-9\s]*\.?[0-9]{0,2}$/;
  // Règle 2: Interdire de saisir plus de 11 caractères
  if (inputValue.length > 11) {
    e.target.value = inputValue.slice(0, 11);
    return;
  }

  if (!regex.test(inputValue)) {
    e.target.value = inputValue.slice(0, -1);
    return;
  }

  // Règle 3: Remplacer tous les chiffres après le 3ème caractère en 4 Anneaux y compris la virgule par des '0'
  // Remplacer tous les chiffres après le 4ème caractère en 5 et 6 Anneaux y compris la virgule par des '0'
  const numBands = document.querySelectorAll('.band').length;

  if (numBands === 4) {
    if (inputValue.length > 3) {
      inputValue = inputValue.slice(0, 4) + inputValue.slice(4).replace(/[0-9]/g, '0');
    }
  } else if (numBands >= 5) {
    if (inputValue.length > 4) {
      inputValue = inputValue.slice(0, 5) + inputValue.slice(5).replace(/[0-9]/g, '0');
    }
  }

  // Règle 4: Interdire la saisie de plus de 2 chiffres après la virgule
  const decimalCount = (inputValue.match(/\./g) || []).length;
  if (decimalCount > 1) {
    e.target.value = inputValue.replace(/\.+/, '.');
  }

  e.target.value = inputValue;
});
