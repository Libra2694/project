// Konversi satuan panjang ke meter (faktor konversi)
        const unitToMeter = {
            km: 1000,
            hm: 100,
            dam: 10,
            m: 1,
            dm: 0.1,
            cm: 0.01,
            mm: 0.001,
            mi: 1609.344,
            yd: 0.9144,
            ft: 0.3048,
            in: 0.0254
        };
        
        // Nama lengkap satuan
        const unitNames = {
            km: "Kilometer",
            hm: "Hektometer",
            dam: "Dekameter",
            m: "Meter",
            dm: "Desimeter",
            cm: "Centimeter",
            mm: "Milimeter",
            mi: "Mil",
            yd: "Yard",
            ft: "Kaki",
            in: "Inci"
        };
        
        // Simbol satuan
        const unitSymbols = {
            km: "km",
            hm: "hm",
            dam: "dam",
            m: "m",
            dm: "dm",
            cm: "cm",
            mm: "mm",
            mi: "mi",
            yd: "yd",
            ft: "ft",
            in: "in"
        };
        
        function convertLength() {
            const fromValue = document.getElementById('fromValue').value;
            const fromUnit = document.getElementById('fromUnit').value;
            const toUnit = document.getElementById('toUnit').value;
            const resultContainer = document.getElementById('resultContainer');
            const resultValue = document.getElementById('resultValue');
            const allUnitsResult = document.getElementById('allUnitsResult');
            
            if (fromValue === '') {
                alert('Masukkan nilai terlebih dahulu');
                return;
            }
            
            const value = parseFloat(fromValue);
            
            // Konversi ke meter dulu
            const valueInMeters = value * unitToMeter[fromUnit];
            
            // Konversi ke satuan tujuan
            const result = valueInMeters / unitToMeter[toUnit];
            
            // Tampilkan hasil utama
            resultValue.textContent = `${value} ${unitSymbols[fromUnit]} = ${result.toFixed(6)} ${unitSymbols[toUnit]}`;
            
            // Tampilkan hasil semua satuan
            allUnitsResult.innerHTML = '';
            for (const unit in unitToMeter) {
                const convertedValue = valueInMeters / unitToMeter[unit];
                const unitResult = document.createElement('div');
                unitResult.className = 'unit-result';
                unitResult.textContent = `${convertedValue.toFixed(6)} ${unitSymbols[unit]} (${unitNames[unit]})`;
                allUnitsResult.appendChild(unitResult);
            }
            
            resultContainer.style.display = 'block';
        }
        
        function resetForm() {
            document.getElementById('fromValue').value = '';
            document.getElementById('fromUnit').value = 'm';
            document.getElementById('toUnit').value = 'cm';
            document.getElementById('resultContainer').style.display = 'none';
        }
        
        // Jika ada parameter di URL, set satuan sesuai parameter
        document.addEventListener('DOMContentLoaded', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const from = urlParams.get('from');
            const to = urlParams.get('to');
            
            if (from && unitToMeter[from]) {
                document.getElementById('fromUnit').value = from;
            }
            if (to && unitToMeter[to]) {
                document.getElementById('toUnit').value = to;
            }
        });

        function resetForm() {
            document.getElementById('inputValue').value = '';
            document.getElementById('fromUnit').value = 'cm';
            document.getElementById('toUnit').value = 'm';
            document.getElementById('resultContainer').style.display = 'none';
        }
        
        function switchUnits() {
            const fromUnit = document.getElementById('fromUnit');
            const toUnit = document.getElementById('toUnit');
            const temp = fromUnit.value;
            fromUnit.value = toUnit.value;
            toUnit.value = temp;
        }
        