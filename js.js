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

  function updateResistanceValue() {
    const numBands = colorSelects.length;

    let firstBandValue = 0;
    let secondBandValue = 0;
    let thirdBandValue = 0;
    let fourthBandValue = 0;
    let multiplierValue = 1;

    if (numBands >= 3) {
      firstBandValue = Number(colorSelects[0].value);
      secondBandValue = Number(colorSelects[1].value);
      thirdBandValue = Number(colorSelects[2].value);
      multiplierValue = parseMultiplier(colorSelects[2].value);
    }

    if (numBands >= 4) {
      fourthBandValue = Number(colorSelects[3].value);
    }

    if (numBands >= 5 ) {
      multiplierValue = parseMultiplier(colorSelects[numBands - 2].value);
    }
    if (numBands>=6) {
      multiplierValue = parseMultiplier(colorSelects[numBands - 3].value);
    }

    let resistanceValue = 0;
    
    if (numBands === 4 || numBands === 3) {
      resistanceValue = (firstBandValue * 10 + secondBandValue) * multiplierValue;
    } else if (numBands === 5 || numBands === 6) {
      resistanceValue = (firstBandValue * 100 + secondBandValue * 10 + thirdBandValue) * multiplierValue;
    }

    if (!isNaN(resistanceValue)) {
      resistInput.value = resistanceValue;
    } else {
      resistInput.value = 'Inconnue';
    }
  }
  

  // function updateResistanceValue() {
  //   const firstBandValue = Number(resistorBands.children[0].querySelector('.value').textContent);
  //   const secondBandValue = Number(resistorBands.children[1].querySelector('.value').textContent);
  //   const thirdBandValue = resistorBands.children[2].querySelector('.value').textContent;
  //   const thirdBandMultiplier = parseMultiplier(thirdBandValue);

  //   if (!isNaN(firstBandValue) && !isNaN(secondBandValue) && !isNaN(thirdBandMultiplier)) {
  //     const resistanceValue = (firstBandValue * 10 + secondBandValue) * thirdBandMultiplier;
  //     resistInput.value = resistanceValue;
  //   } else {
  //     resistInput.value = 'Inconnue';
  //   }
  // }

  const colorSelects = document.querySelectorAll('.color-select select');
  const resistorBands = document.querySelector('.resistance-container .resistor-bands');
  const resistInput = document.querySelector('.resist-input');
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
    });
  });


  function updateResistanceBasedOnMultiplier() {
    const selectedMultiplier = resistOhmSelect.value;

    if (selectedMultiplier === 'kΩ') {
      resistInput.value /= 1000;
    } else if (selectedMultiplier === 'MΩ') {
      resistInput.value /= 1000000;
    } else if (selectedMultiplier === 'GΩ') {
      resistInput.value /= 1000000000;
    } else {
      
    }
  }

  function formatInputValue() {
    const currentValue = resistInput.value;
    const formattedValue = currentValue.replace(/\s/g, '').replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
    resistInput.value = formattedValue;
  }

  resistInput.addEventListener('input', formatInputValue);

  resistInput.addEventListener('blur', formatInputValue);

  resistInput.addEventListener('keyup', formatInputValue);

  formatInputValue();




  const resistOhmSelect = document.querySelector('.resist-ohm');

  resistOhmSelect.addEventListener('change', () => {
    updateResistanceBasedOnMultiplier();
  });

  function formatValue(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  toleranceSelect.addEventListener('change', () => {
    const selectedOption = toleranceSelect.options[toleranceSelect.selectedIndex];
    resistPurcentSelect.value = selectedOption.value;
  });
});
