// Data kurs contoh (sebaiknya diganti dengan API real-time)
let exchangeRates = {
    // Fiat rates (contoh)
    USD: { IDR: 14500, EUR: 0.85, GBP: 0.73, JPY: 110.25, SGD: 1.35 },
    IDR: { USD: 1/14500, EUR: 1/17000, GBP: 1/19800, JPY: 1/130, SGD: 1/10700 },
    
    // Crypto rates (contoh - harga dalam USD)
    BTC: { USD: 30000, IDR: 30000*14500 },
    ETH: { USD: 1800, IDR: 1800*14500 },
    BNB: { USD: 240, IDR: 240*14500 },
    XRP: { USD: 0.5, IDR: 0.5*14500 },
    DOGE: { USD: 0.07, IDR: 0.07*14500 }
};

// Generate rates untuk semua kombinasi
function generateAllRates() {
    const cryptos = ['BTC', 'ETH', 'BNB', 'XRP', 'DOGE'];
    const fiats = ['USD', 'IDR', 'EUR', 'GBP', 'JPY', 'SGD'];
    
    // Generate rates crypto ke semua fiat
    cryptos.forEach(crypto => {
        fiats.forEach(fiat => {
            if (fiat !== 'USD') {
                exchangeRates[crypto][fiat] = exchangeRates[crypto]['USD'] * exchangeRates['USD'][fiat];
            }
        });
    });
    
    // Generate rates fiat ke crypto
    fiats.forEach(fiat => {
        cryptos.forEach(crypto => {
            exchangeRates[fiat] = exchangeRates[fiat] || {};
            exchangeRates[fiat][crypto] = 1 / exchangeRates[crypto][fiat];
        });
    });
    
    // Generate rates crypto ke crypto
    cryptos.forEach(crypto1 => {
        cryptos.forEach(crypto2 => {
            if (crypto1 !== crypto2) {
                exchangeRates[crypto1][crypto2] = exchangeRates[crypto1]['USD'] / exchangeRates[crypto2]['USD'];
            }
        });
    });
}

// Format angka dengan presisi berbeda untuk crypto
function formatNumber(num, isCrypto = false) {
    if (isNaN(num)) return '0';
    
    if (isCrypto) {
        if (num < 0.000001) return num.toExponential(6);
        if (num < 1) return num.toFixed(8);
        if (num < 100) return num.toFixed(6);
        if (num < 10000) return num.toFixed(4);
    }
    
    // Format untuk fiat
    return num.toLocaleString('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function convertCurrency() {
    const amount = parseFloat(document.getElementById('inputAmount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const resultContainer = document.getElementById('resultContainer');
    const resultValue = document.getElementById('resultValue');
    const rateInfo = document.getElementById('rateInfo');
    
    if (isNaN(amount) || amount <= 0) {
        alert('Masukkan jumlah yang valid (lebih dari 0)');
        return;
    }
    
    // Validasi jika kurs tidak tersedia
    if (!exchangeRates[fromCurrency] || !exchangeRates[fromCurrency][toCurrency]) {
        alert('Kurs untuk konversi ini belum tersedia');
        return;
    }
    
    // Dapatkan kurs
    const rate = exchangeRates[fromCurrency][toCurrency];
    const convertedAmount = amount * rate;
    
    // Tentukan format output
    const isFromCrypto = ['BTC','ETH','BNB','XRP','DOGE'].includes(fromCurrency);
    const isToCrypto = ['BTC','ETH','BNB','XRP','DOGE'].includes(toCurrency);
    
    // Format tampilan
    const formattedAmount = formatNumber(amount, isFromCrypto);
    const formattedResult = formatNumber(convertedAmount, isToCrypto);
    const formattedRate = formatNumber(rate, isToCrypto);
    
    // Tampilkan hasil
    resultValue.innerHTML = `
        <span class="from-amount">${fromCurrency} ${formattedAmount}</span>
        <span class="equal-sign"> = </span>
        <span class="to-amount">${toCurrency} ${formattedResult}</span>
    `;
    
    // Tampilkan info kurs
    rateInfo.innerHTML = `
        <span class="rate-label">Kurs:</span>
        <span class="rate-value">1 ${fromCurrency} = ${formattedRate} ${toCurrency}</span>
    `;
    
    resultContainer.style.display = 'block';
    document.getElementById('lastUpdated').textContent = new Date().toLocaleString('id-ID');
}

function resetForm() {
    document.getElementById('inputAmount').value = '';
    document.getElementById('fromCurrency').value = 'USD';
    document.getElementById('toCurrency').value = 'IDR';
    document.getElementById('resultContainer').style.display = 'none';
}

function switchCurrencies() {
    const from = document.getElementById('fromCurrency');
    const to = document.getElementById('toCurrency');
    const temp = from.value;
    from.value = to.value;
    to.value = temp;
}

// Fetch data kurs real-time dari API
async function fetchExchangeRates() {
    try {
        // 1. Ambil data fiat (contoh menggunakan ExchangeRate-API)
        const fiatResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const fiatData = await fiatResponse.json();
        
        // Update rates fiat
        exchangeRates.USD = fiatData.rates;
        
        // 2. Ambil data crypto (CoinGecko API)
        const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,bnb,ripple,dogecoin&vs_currencies=usd');
        const cryptoData = await cryptoResponse.json();
        
        // Update rates crypto
        exchangeRates.BTC = { USD: cryptoData.bitcoin.usd };
        exchangeRates.ETH = { USD: cryptoData.ethereum.usd };
        exchangeRates.BNB = { USD: cryptoData.bnb.usd };
        exchangeRates.XRP = { USD: cryptoData.ripple.usd };
        exchangeRates.DOGE = { USD: cryptoData.dogecoin.usd };
        
        // Generate ulang semua rates
        generateAllRates();
        
        // Update waktu terakhir diperbarui
        document.getElementById('lastUpdated').textContent = new Date().toLocaleString('id-ID');
        
        console.log('Data kurs berhasil diperbarui');
    } catch (error) {
        console.error('Gagal mengambil data kurs:', error);
        // Gunakan rates default jika API gagal
        document.getElementById('lastUpdated').textContent = 'Menggunakan data contoh - ' + new Date().toLocaleString('id-ID');
        
        // Generate rates dari data contoh
        generateAllRates();
    }
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Generate semua rates awal
    generateAllRates();
    
    // Set nilai default dari URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from');
    const to = urlParams.get('to');
    
    if (from && exchangeRates[from]) {
        document.getElementById('fromCurrency').value = from;
    }
    if (to && exchangeRates[to]) {
        document.getElementById('toCurrency').value = to;
    }
    
    // Fetch data real-time
    fetchExchangeRates();
    
    // Update data setiap 5 menit
    setInterval(fetchExchangeRates, 5 * 60 * 1000);
    
    // Event listener untuk input
    document.getElementById('inputAmount').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            convertCurrency();
        }
    });
});