// Data Konversi
const conversions = [
    { name: "Image to URL", category: "file", link: "../not-available.html", favorite: false }, // Tambahkan konversi baru di sini", favorite: true },
    { name: "Celsius ke Fahrenheit", category: "temperature", link: "./suhu/?from=c&to=f", favorite: false },
    { name: "Fahrenheit ke Celsius", category: "temperature", link: "./suhu/?from=f&to=c", favorite: false },
    { name: "Celsius ke Kelvin", category: "temperature", link: "./suhu/?from=c&to=k", favorite: false },
    { name: "Kelvin ke Celsius", category: "temperature", link: "./suhu/?from=k&to=c", favorite: false },
    { name: "Reamur ke Fahrenheit", category: "temperature", link: "./suhu/?from=r&to=f", favorite: false },
    { name: "Kilometer ke Meter", category: "length", link: "./jarak?from=km&to=m", favorite: false },
    { name: "Meter ke Kilometer", category: "length", link: "./jarak?from=m&to=km", favorite: false },
    { name: "Centimeter ke Meter", category: "length", link: "./jarak?from=cm&to=m", favorite: false },
    { name: "Mil ke Kilometer", category: "length", link: "./jarak?from=mi&to=km", favorite: false },
    { name: "Kilogram ke Gram", category: "weight", link: "./berat/?from=kg&to=g", favorite: true },
    { name: "Gram ke Kilogram", category: "weight", link: "./berat/?from=g&to=kg", favorite: false },
    { name: "Ton ke Kilogram", category: "weight", link: "./berat/?from=ton&to=kg", favorite: false },
    { name: "Pound ke Kilogram", category: "weight", link: "./berat/?from=lb&to=kg", favorite: false },
    { name: "Ons ke Gram", category: "weight", link: "./berat/?from=oz&to=g", favorite: false },
    { name: "Kuintal ke Kilogram", category: "weight", link: "./berat/?from=kw&to=kg", favorite: false },
    { name: "USD ke IDR", category: "currency", link: "./uang/?from=USD&to=IDR", favorite: true },
    { name: "IDR ke USD", category: "currency", link: "./uang/?from=IDR&to=USD", favorite: false },
    { name: "BTC ke IDR", category: "currency", link: "./uang/?from=BTC&to=IDR", favorite: true },
    { name: "IDR ke ETH", category: "currency", link: "./uang/?from=IDR&to=ETH", favorite: false },
];

// Fungsi untuk menampilkan konversi
function displayConversions(filter = "all") {
    const convertGrid = document.getElementById("convertGrid");
    convertGrid.innerHTML = ""; // Kosongkan grid sebelum menambahkan konversi baru

    conversions.forEach(conversion => {
        if (filter === "all" || conversion.category === filter) {
            const convertCard = document.createElement("div");
            convertCard.className = "convert-card";
            convertCard.innerHTML = `
                <h3>${conversion.name}</h3>
                <a href="${conversion.link}" class="btn">Buka Konversi</a>
            `;
            convertGrid.appendChild(convertCard);
        }
    });
}

// Fungsi untuk menampilkan favorit / recently used
function displayFavorites() {
    const favoriteGrid = document.getElementById("favoriteGrid");
    favoriteGrid.innerHTML = ""; // Kosongkan grid sebelum menambahkan konversi baru

    conversions.forEach(conversion => {
        if (conversion.favorite) {
            const favoriteCard = document.createElement("div");
            favoriteCard.className = "favorite-card";
            favoriteCard.innerHTML = `
                <h3>${conversion.name}</h3>
                <a href="${conversion.link}" class="btn">Buka Konversi</a>
            `;
            favoriteGrid.appendChild(favoriteCard);
        }
    });
}

// Event listener untuk dropdown kategori
document.getElementById("categoryDropdown").addEventListener("change", (e) => {
    displayConversions(e.target.value);
});

// Event listener untuk search bar
document.getElementById("searchBar").addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredConversions = conversions.filter(conversion => conversion.name.toLowerCase().includes(searchTerm));
    const convertGrid = document.getElementById("convertGrid");
    convertGrid.innerHTML = "";

    filteredConversions.forEach(conversion => {
        const convertCard = document.createElement("div");
        convertCard.className = "convert-card";
        convertCard.innerHTML = `
            <h3>${conversion.name}</h3>
            <a href="${conversion.link}" class="btn">Buka Konversi</a>
        `;
        convertGrid.appendChild(convertCard);
    });
});

// Tampilkan konversi dan favorit saat halaman dimuat
displayConversions();
displayFavorites();