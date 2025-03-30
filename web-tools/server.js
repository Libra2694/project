const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Menggunakan '0.0.0.0' agar bisa diakses dari perangkat lain
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

// Melayani file statis dari folder utama
app.use(express.static(path.join(__dirname)));

// Route default ke index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
