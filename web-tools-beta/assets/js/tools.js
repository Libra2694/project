// Data Tools
const tools = [
    { name: "AI Chat (Aisyah)", category: "other", link: "../not-available.html", favorite: false },
    { name: "Konversi Suhu", category: "converter", link: "../convert/", favorite: false },
    { name: "Konversi Mata Uang", category: "converter", link: "../convert/", favorite: false },
    { name: "Kalkulator Ilmiah", category: "calculator", link: "./kalkulator-ilmiah/", favorite: true },
    { name: "Generator Password", category: "generator", link: "../not-available.html", favorite: false },
    { name: "Konversi Satuan Panjang", category: "converter", link: "../convert/", favorite: false },
    { name: "Kalkulator BMI", category: "calculator", link: "./kalkulator-bmi/", favorite: true },
    { name: "Generator QR Code", category: "generator", link: "../not-available.html", favorite: false },
    { name: "Generator Code", category: "generator", link: "../not-available.html", favorite: false },
    { name: "Konversi Berat", category: "converter", link: "../convert/", favorite: false },
    { name: "Konversi Waktu", category: "converter", link: "../convert/", favorite: false },
    { name: "Text to Speech", category: "utility", link: "../not-available.html", favorite: false },
    { name: "Compress Image", category: "file", link: "../not-available.html", favorite: false },
    { name: "Color Picker", category: "utility", link: "../not-available.html", favorite: false },
];

// Fungsi untuk menampilkan tools
function displayTools(filter = "all") {
    const toolsGrid = document.getElementById("toolsGrid");
    toolsGrid.innerHTML = ""; // Kosongkan grid sebelum menambahkan tools baru

    tools.forEach(tool => {
        if (filter === "all" || tool.category === filter) {
            const toolCard = document.createElement("div");
            toolCard.className = "tool-card";
            toolCard.innerHTML = `
                <h3>${tool.name}</h3>
                <a href="${tool.link}" class="btn">Buka Tool</a>
            `;
            toolsGrid.appendChild(toolCard);
        }
    });
}

// Fungsi untuk menampilkan favorit / recently used
function displayFavorites() {
    const favoriteGrid = document.getElementById("favoriteGrid");
    favoriteGrid.innerHTML = ""; // Kosongkan grid sebelum menambahkan tools baru

    tools.forEach(tool => {
        if (tool.favorite) {
            const favoriteCard = document.createElement("div");
            favoriteCard.className = "favorite-card";
            favoriteCard.innerHTML = `
                <h3>${tool.name}</h3>
                <a href="${tool.link}" class="btn">Buka Tool</a>
            `;
            favoriteGrid.appendChild(favoriteCard);
        }
    });
}

// Event listener untuk dropdown kategori
document.getElementById("categoryDropdown").addEventListener("change", (e) => {
    displayTools(e.target.value);
});

// Event listener untuk search bar
document.getElementById("searchBar").addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredTools = tools.filter(tool => tool.name.toLowerCase().includes(searchTerm));
    const toolsGrid = document.getElementById("toolsGrid");
    toolsGrid.innerHTML = "";

    filteredTools.forEach(tool => {
        const toolCard = document.createElement("div");
        toolCard.className = "tool-card";
        toolCard.innerHTML = `
            <h3>${tool.name}</h3>
            <a href="${tool.link}" class="btn">Buka Tool</a>
        `;
        toolsGrid.appendChild(toolCard);
    });
});

// Tampilkan tools dan favorit saat halaman dimuat
displayTools();
displayFavorites();