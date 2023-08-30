function hideTitleOption(selectElement) {
  const titleOption = selectElement.querySelector('option[disabled][selected]');
  if (titleOption) {
    titleOption.style.display = 'none';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const colorSelects = document.querySelectorAll('.color-select select');
  colorSelects.forEach((select) => {
    hideTitleOption(select);
    select.addEventListener('change', () => {
      hideTitleOption(select);
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const colorSelects = document.querySelectorAll('.color-select select');
  const resistorBands = document.querySelector('.resistor-bands');

  colorSelects.forEach((select, index) => {
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
      valueElement.style.backgroundColor = selectedOption.style.backgroundColor; // Set background color
      connectorElement.style.backgroundColor = selectedOption.style.backgroundColor;
      connectorElement.style.display = 'block';
    } else {
      // Reset to default styles if no background color is set
      select.style.backgroundColor = '';
      select.style.color = '';
      resistorBands.children[index].style.backgroundColor = '#ececec'; // Default color
      valueElement.textContent = '-';
      valueElement.style.color = '';
      valueElement.style.backgroundColor = ''; // Reset background color
      connectorElement.style.display = 'none';
    }
  });
});

  
});


