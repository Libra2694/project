// Fungsi konversi suhu
function convertTemperature() {
    const inputValue = parseFloat(document.getElementById('inputValue').value);
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    
    if (isNaN(inputValue)) {
        alert('Masukkan nilai suhu terlebih dahulu');
        return;
    }
    
    // Konversi ke Celsius dulu
    let celsius;
    switch(fromUnit) {
        case 'c':
            celsius = inputValue;
            break;
        case 'f':
            celsius = (inputValue - 32) * 5/9;
            break;
        case 'k':
            celsius = inputValue - 273.15;
            break;
        case 'r':
            celsius = inputValue * 5/4;
            break;
    }
    
    // Konversi dari Celsius ke satuan tujuan
    let result;
    switch(toUnit) {
        case 'c':
            result = celsius;
            break;
        case 'f':
            result = (celsius * 9/5) + 32;
            break;
        case 'k':
            result = celsius + 273.15;
            break;
        case 'r':
            result = celsius * 4/5;
            break;
    }
    
    // Tampilkan hasil utama
    const fromSymbol = getUnitSymbol(fromUnit);
    const toSymbol = getUnitSymbol(toUnit);
    document.getElementById('resultValue').textContent = 
        `${inputValue} ${fromSymbol} = ${result.toFixed(6)} ${toSymbol}`;
    
    // Tampilkan hasil semua satuan
    displayAllUnits(celsius);
    
    document.getElementById('resultContainer').style.display = 'block';
}

// Fungsi untuk menampilkan hasil dalam semua satuan
function displayAllUnits(celsius) {
    const allUnits = {
        c: celsius,
        f: (celsius * 9/5) + 32,
        k: celsius + 273.15,
        r: celsius * 4/5
    };
    
    let html = '';
    for (const unit in allUnits) {
        html += `
            <div class="unit-result">
                ${allUnits[unit].toFixed(6)} ${getUnitSymbol(unit)} (${getUnitName(unit)})
            </div>
        `;
    }
    document.getElementById('allUnitsResult').innerHTML = html;
}

// Fungsi bantu untuk mendapatkan simbol satuan
function getUnitSymbol(unit) {
    const symbols = {
        c: '°C',
        f: '°F',
        k: 'K',
        r: '°R'
    };
    return symbols[unit] || '';
}

// Fungsi bantu untuk mendapatkan nama satuan
function getUnitName(unit) {
    const names = {
        c: 'Celsius',
        f: 'Fahrenheit',
        k: 'Kelvin',
        r: 'Reamur'
    };
    return names[unit] || '';
}

// Fungsi reset
function resetForm() {
    document.getElementById('inputValue').value = '';
    document.getElementById('resultContainer').style.display = 'none';
}

// Set mode berdasarkan parameter URL
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from');
    const to = urlParams.get('to');
    
    if (from && ['c', 'f', 'k', 'r'].includes(from)) {
        document.getElementById('fromUnit').value = from;
    }
    if (to && ['c', 'f', 'k', 'r'].includes(to)) {
        document.getElementById('toUnit').value = to;
    }
});

function resetForm() {
    document.getElementById('inputValue').value = '';
    document.getElementById('fromUnit').value = 'c';
    document.getElementById('toUnit').value = 'f';
    document.getElementById('resultContainer').style.display = 'none';
}

function switchUnits() {
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const temp = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = temp;
}
