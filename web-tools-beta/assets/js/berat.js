// Faktor konversi ke gram (satuan dasar)
const unitToGram = {
    kg: 1000,
    hg: 100,
    dag: 10,
    g: 1,
    dg: 0.1,
    cg: 0.01,
    mg: 0.001,
    ton: 1000000,
    kw: 100000,  // Kuintal
    lb: 453.592,
    oz: 28.3495,
    stone: 6350.29
};

// Nama lengkap satuan
const unitNames = {
    kg: "Kilogram",
    hg: "Hektogram",
    dag: "Dekagram",
    g: "Gram",
    dg: "Desigram",
    cg: "Centigram",
    mg: "Miligram",
    ton: "Ton",
    kw: "Kuintal",
    lb: "Pound",
    oz: "Ons",
    stone: "Stone"
};

// Simbol satuan
const unitSymbols = {
    kg: "kg",
    hg: "hg",
    dag: "dag",
    g: "g",
    dg: "dg",
    cg: "cg",
    mg: "mg",
    ton: "ton",
    kw: "kw",
    lb: "lb",
    oz: "oz",
    stone: "st"
};

function convertWeight() {
    const inputValue = document.getElementById('inputValue').value;
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    const resultContainer = document.getElementById('resultContainer');
    const resultValue = document.getElementById('resultValue');
    const allUnitsResult = document.getElementById('allUnitsResult');
    
    if (inputValue === '' || isNaN(inputValue)) {
        alert('Masukkan nilai berat yang valid');
        return;
    }
    
    const value = parseFloat(inputValue);
    
    // Konversi ke gram dulu
    const valueInGrams = value * unitToGram[fromUnit];
    
    // Konversi ke satuan tujuan
    const result = valueInGrams / unitToGram[toUnit];
    
    // Tampilkan hasil utama
    resultValue.textContent = `${value} ${unitSymbols[fromUnit]} = ${result.toFixed(6)} ${unitSymbols[toUnit]}`;
    
    // Tampilkan hasil semua satuan
    displayAllUnits(valueInGrams);
    
    resultContainer.style.display = 'block';
}

function displayAllUnits(grams) {
    let html = '';
    for (const unit in unitToGram) {
        const convertedValue = grams / unitToGram[unit];
        html += `
            <div class="unit-result">
                <span class="unit-value">${convertedValue.toFixed(6)} ${unitSymbols[unit]}</span>
                <span class="unit-name">${unitNames[unit]}</span>
            </div>
        `;
    }
    document.getElementById('allUnitsResult').innerHTML = html;
}

function resetForm() {
    document.getElementById('inputValue').value = '';
    document.getElementById('fromUnit').value = 'kg';
    document.getElementById('toUnit').value = 'g';
    document.getElementById('resultContainer').style.display = 'none';
}

function switchUnits() {
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const temp = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = temp;
}

// Set mode berdasarkan parameter URL
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from');
    const to = urlParams.get('to');
    
    if (from && unitToGram[from]) {
        document.getElementById('fromUnit').value = from;
    }
    if (to && unitToGram[to]) {
        document.getElementById('toUnit').value = to;
    }
    
    // Jika datang dari link spesifik
    if (window.location.pathname.includes('weight.html')) {
        const path = window.location.pathname;
        if (path.includes('kg-to-g')) {
            document.getElementById('fromUnit').value = 'kg';
            document.getElementById('toUnit').value = 'g';
        } else if (path.includes('g-to-kg')) {
            document.getElementById('fromUnit').value = 'g';
            document.getElementById('toUnit').value = 'kg';
        }
    }
});