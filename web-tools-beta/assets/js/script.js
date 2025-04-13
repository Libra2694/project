const warnings = [
    // catatan
    "🚧 Website sedang dalam pengembangan aktif - beberapa fitur mungkin belum stabil",
    "✨ Versi terbaru akan segera rilis! Pantau terus perkembangannya",
    "🔧 Laporan bug? Hubungi kami via media sosial",
    "💡 Punya saran fitur? Kami ingin mendengar masukan Anda!",
    "👋 Halo! Kami terus memperbaiki kualitas layanan",
    "🌐 Versi terbaik sedang dalam penyempurnaan",
    "🚧 Website sedang dalam tahap pengembangan aktif - beberapa fitur mungkin belum sempurna",
    "💡 Punya ide fitur? Kami terbuka untuk masukan Anda!",
    "👋 Halo! Kami akan terus meningkatkan pengalaman pengguna",
    "📅 Versi stabil akan dirilis secepatnya",
    "🛠️ Sedang melakukan pemeliharaan server rutin",
    "📊 Sedang mengumpulkan feedback pengguna",
    "🌙 Mode gelap akan segera tersedia",
    "🔐 Peningkatan sistem keamanan sedang dilakukan",
    "📝 Dokumentasi fitur sedang disempurnakan",
    "🤖 Integrasi dengan lebih banyak platform AI",
    "🌍 Dukungan multi-bahasa akan datang",
    "🎨 Tema kustomisasi akan segera hadir",
    "⚠️ Diharapkan kepada user agar tidak berharap lebih, karena kami pun masih belajar untuk menjadi sesuatu yang layak untuk ditunggu. Kami takut mengecewakan, seperti janji yang tak sempat ditepati...",
    "⚠️ Diharapkan kepada user agar tidak berharap lebih, karena terkadang apa yang kami bangun belum mampu membalas harapanmu. Seperti rasa yang tumbuh diam-diam, tapi tak pernah sampai pada tujuan.",

    // sad
    "😔 Website kami masih dalam proses pengembangan, beberapa fitur mungkin tidak berfungsi dengan sempurna.",
    "💔 Kami tahu, update yang ditunggu-tunggu belum rilis. Tapi kami sedang berusaha keras!",
    "⚠️ Jika ada bug yang mengganggu, maafkan kami. Kami akan segera memperbaikinya.",
    "🌧️ Kami mendengar saran Anda, meskipun perbaikan membutuhkan waktu yang lama.",
    "💬 Terima kasih sudah berkunjung, kami tahu kami belum sempurna, tapi kami terus berusaha.",
    "⏳ Pembaruan besar sudah dekat, tapi kami harap sabar sedikit lagi ya...",
    "🌙 Mungkin website ini belum terbaik, tapi kami akan terus berjuang untuk yang lebih baik.",
    "💔 Website ini seperti hubungan yang belum sempurna, kami masih berusaha memperbaiki kekurangan.",
    "😢 Kami tahu, update yang kamu tunggu-tunggu belum hadir. Tapi percayalah, kami masih mencintainya.",
    "💌 Jika ada bug yang menyakitkan, maafkan kami. Kami akan memperbaikinya dengan hati yang penuh penyesalan.",
    "🌧️ Fitur yang kamu harapkan masih jauh, namun kami berjanji akan selalu berusaha untuk hadirkan yang terbaik.",
    "💭 Setiap klik adalah harapan, kami tahu kami belum sempurna, tapi kami akan terus berjuang untukmu.",
    "⏳ Pembaruan besar yang kamu nanti-nanti akan datang, walau terkadang cinta itu membutuhkan waktu yang lama.",
    "💫 Mungkin website ini belum sepenuhnya indah, tapi kami berusaha agar setiap detiknya berarti bagi kamu.",
    "💔 Kadang kita merasa seperti website ini, masih berusaha menjadi sempurna, meskipun belum sepenuhnya.",
    "😢 Aku tahu, kamu pasti sudah menunggu lama. Pembaruan itu seperti janji yang belum bisa aku tepati.",
    "🖤 Maaf kalau ada yang membuatmu kecewa. Aku sedang berusaha memperbaiki semuanya, walau terkadang terasa sulit.",
    "🌧️ Seperti hujan yang datang tanpa diundang, beberapa fitur masih perlu waktu untuk bersinar.",
    "💭 Di setiap pembaruan, aku berharap bisa memberikan yang terbaik untukmu, walaupun aku tahu itu butuh kesabaran.",
    "⏳ Terkadang cinta itu datang perlahan, begitu juga pembaruan besar yang sudah kita tunggu-tunggu bersama.",
    "✨ Walau sekarang mungkin tak sempurna, aku akan terus berusaha, karena kamu layak mendapatkan yang terbaik."
];

document.addEventListener('DOMContentLoaded', function () {
    const noticeElement = document.getElementById('dev-notice');
    const contentElement = document.getElementById('notice-content');
    const closeButton = document.getElementById('close-notice');

    // Pastikan elemen ada sebelum memanipulasi
    if (noticeElement && contentElement && closeButton) {
        // Tampilkan pesan acak
        const randomIndex = Math.floor(Math.random() * warnings.length);
        contentElement.textContent = warnings[randomIndex];

        // Handle close button
        closeButton.addEventListener('click', function () {
            noticeElement.classList.remove('slide-in');
            noticeElement.classList.add('slide-out');

            // Setelah animasi selesai, sembunyikan elemen
            setTimeout(() => {
                noticeElement.style.display = 'none';

                // Simpan status di localStorage agar tidak muncul lagi
                localStorage.setItem('devNoticeClosed', 'true');
            }, 300);
        });

        // Cek localStorage, jika sudah pernah ditutup jangan tampilkan
        if (localStorage.getItem('devNoticeClosed') === 'true') {
            noticeElement.style.display = 'none';
        } else {
            noticeElement.style.display = 'block';
        }
    }
});