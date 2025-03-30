const AI_NAME = "Aisyah";
const API_KEY = "AIzaSyChr3ZTEV6G3O3D3u5cQQ626l6Ia6FZ_D8";
const MODEL_NAME = "gemini-1.5-flash";

// Set initial timestamp
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('initialTimestamp').textContent = getCurrentTime();
});

document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (!message) {
        return; // Jangan kirim pesan kosong
    }
    
    // Tambahkan pesan pengguna ke chat box
    addMessage(message, 'user');
    
    // Kosongkan input dan fokus kembali
    userInput.value = '';
    userInput.focus();
    
    // Tampilkan indikator typing
    showTypingIndicator();
    
    try {
        // Dapatkan respons dari AI
        const aiResponse = await getAIResponse(message);
        
        // Tambahkan respons AI ke chat box
        addMessage(aiResponse, 'ai');
    } catch (error) {
        console.error('Error:', error);
        
        // Tampilkan pesan error yang ramah pengguna
        addMessage(`Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti atau hubungi administrator jika masalah berlanjut.`, 'ai');
    } finally {
        // Sembunyikan indikator typing
        hideTypingIndicator();
    }
}

async function getAIResponse(message) {
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        contents: [{
            parts: [{
                text: `Anda adalah ${AI_NAME}, asisten AI profesional yang membantu pengguna dengan masalah teknologi dan pengembangan.
                
                **Instruksi Jawaban:**
                1. Pahami inti pertanyaan dengan seksama
                2. Berikan jawaban yang jelas, ringkas, dan profesional
                3. Gunakan format berikut hanya jika relevan:
                   - **Judul** untuk poin utama
                   - *Poin penting* untuk penekanan
                   - _Catatan_ untuk informasi tambahan
                4. Sertakan contoh kode HANYA jika diminta atau untuk pertanyaan teknis spesifik
                5. Untuk pertanyaan non-teknis, berikan jawaban dalam bentuk paragraf yang terstruktur
                6. Jaga bahasa tetap sopan dan informatif
                
                **Contoh Format Jawaban:**
                Untuk pertanyaan teknis:
                **Cara membuat fungsi di JavaScript**
                Fungsi di JavaScript dapat dibuat dengan beberapa cara:
                *Deklarasi Fungsi*: 
                function namaFungsi(parameter) {
                    // kode
                }
                
                _Catatan_: Hindari penggunaan var, gunakan let/const_
                
                Untuk pertanyaan umum:
                **Manfaat Version Control**
                Sistem version control seperti Git membantu developer dalam:
                - Melacak perubahan kode
                - Berkolaborasi dalam tim
                - Mengembalikan ke versi sebelumnya jika diperlukan
                
                Sekarang jawab pertanyaan berikut dengan format yang sesuai:
                ${message}`
            }]
        }],
        generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 1000,
            topP: 0.9,
            topK: 40
        }
    })
});
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Debugging: Tampilkan respons di console
    console.log("API Response:", data);
    
    // Penanganan respons yang lebih baik
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error("Format respons tidak valid");
    }
}

function showTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    indicator.style.display = 'block';
    
    // Auto hide setelah 30 detik jika ada masalah
    setTimeout(() => {
        if (indicator.style.display === 'block') {
            indicator.style.display = 'none';
            addMessage("Maaf, respons terlalu lama. Silakan coba lagi.", 'ai');
        }
    }, 30000);
}

function hideTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'none';
}

function addMessage(text, sender) {
    const chatBox = document.getElementById('chatBox');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    // Create message header
    const messageHeader = document.createElement('div');
    messageHeader.className = 'message-header';
    
    if (sender === 'ai') {
        messageHeader.innerHTML = `<i class="fas fa-robot"></i>${AI_NAME}`;
    } else {
        messageHeader.innerHTML = `<i class="fas fa-user"></i>Anda`;
    }
    
    // Create message content
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Format the message text
    let formattedText = formatMessageText(text);
    messageContent.innerHTML = formattedText;
    
    // Create timestamp
    const timestamp = document.createElement('div');
    timestamp.className = 'message-timestamp';
    timestamp.textContent = getCurrentTime();
    
    // Append all elements
    messageDiv.appendChild(messageHeader);
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(timestamp);
    
    chatBox.appendChild(messageDiv);
    
    // Scroll ke bawah
    chatBox.scrollTop = chatBox.scrollHeight;
}

function formatMessageText(text) {
    // Urutan penggantian penting untuk nested formatting
    return text
        // Handle triple formatting (bold+italic+underline)
        .replace(/\*\*\*_\*\*\*(.*?)\*\*\*_\*\*\*/g, '<span style="font-weight:bold;font-style:italic;text-decoration:underline">$1</span>')
        // Handle bold+italic
        .replace(/\*\*\*(.*?)\*\*\*/g, '<span style="font-weight:bold;font-style:italic">$1</span>')
        // Handle bold+underline
        .replace(/\*\*_(.*?)_\*\*/g, '<strong><u>$1</u></strong>')
        // Handle italic+underline
        .replace(/\*_(.*?)_\*/g, '<em><u>$1</u></em>')
        // Handle bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Handle italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Handle underline (format _text_)
        .replace(/\_(.*?)\_/g, '<u>$1</u>')
        // Handle code blocks
        .replace(/^```(.*?)\n([\s\S]*?)\n```/gm, '<pre><code>$2</code></pre>')
        // Handle inline code
        .replace(/`(.*?)`/g, '<code>$1</code>')
        // Handle lists
        .replace(/^•\s(.*$)/gm, '<li>$1</li>')
        .replace(/^-\s(.*$)/gm, '<li>$1</li>')
        // Handle newlines
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

// rekomendasi pertanyaan
 // Daftar rekomendasi pertanyaan universal
const questionRecommendations = [
// Kesehatan & Gaya Hidup
"Bagaimana cara membangun rutinitas olahraga yang konsisten?",
"Apa saja tips untuk menjaga kesehatan mental di tempat kerja?",
"Bagaimana pola makan sehat untuk pekerja kantoran?",

// Keuangan & Investasi
"Bagaimana cara mengatur keuangan pribadi yang efektif?",
"Investasi apa yang cocok untuk pemula?",
"Bagaimana menyiapkan dana pensiun sejak dini?",

// Karir & Pengembangan Diri
"Bagaimana menghadapi interview kerja yang menegangkan?",
"Skill apa yang paling dibutuhkan di era digital ini?",
"Bagaimana membangun personal branding di LinkedIn?",

// Teknologi & Digital
"Aplikasi produktivitas apa yang direkomendasikan tahun ini?",
"Bagaimana melindungi privasi di media sosial?",
"Apa prediksi tren teknologi untuk 5 tahun ke depan?",

// Hubungan & Komunikasi
"Bagaimana cara berkomunikasi efektif dengan atasan yang sulit?",
"Tips untuk membangun networking yang berkualitas?",
"Bagaimana menyampaikan pendapat berbeda dalam meeting?",

// Pendidikan & Belajar
"Bagaimana cara belajar efektif dalam waktu singkat?",
"Platform online apa yang bagus untuk pengembangan skill?",
"Bagaimana memilih kursus/sertifikasi yang tepat untuk karir saya?",

// Bisnis & Kewirausahaan
"Bagaimana memvalidasi ide bisnis sebelum memulai?",
"Apa kesalahan umum yang dilakukan startup pemula?",
"Bagaimana strategi marketing digital untuk UMKM?",

// Kreativitas & Hobi
"Bagaimana mengatasi creative block saat bekerja?",
"Apa cara terbaik untuk mengembangkan hobi menjadi penghasilan?",
"Bagaimana menemukan inspirasi untuk proyek kreatif?",

// Perjalanan & Budaya
"Destinasi kerja remote apa yang direkomendasikan?",
"Bagaimana cara menjadi traveler yang bertanggung jawab?",
"Apa tips untuk beradaptasi dengan budaya kerja baru?",

// Keluarga & Parenting
"Bagaimana menyeimbangkan karir dan kehidupan keluarga?",
"Apa strategi mengajar anak tentang keuangan digital?",
"Bagaimana membangun komunikasi yang baik dengan remaja?",

// Bisnis & Produktivitas
"Bagaimana cara meningkatkan produktivitas kerja sehari-hari?",
"Apa strategi efektif untuk manajemen waktu yang baik?",
"Bagaimana tips untuk presentasi yang menarik dan profesional?",

// Pengembangan Diri
"Skill apa yang paling dibutuhkan di era digital ini?",
"Bagaimana cara membangun personal branding yang kuat?",
"Apa cara terbaik untuk mengembangkan pola pikir berkembang (growth mindset)?",

// Teknologi Umum
"Aplikasi apa yang direkomendasikan untuk kolaborasi tim secara remote?",
"Bagaimana melindungi data pribadi di era digital?",
"Apa tren teknologi yang sedang berkembang tahun ini?",

// Komunikasi
"Bagaimana cara berkomunikasi efektif di tempat kerja?",
"Apa tips untuk melakukan negosiasi yang win-win solution?",
"Bagaimana memberikan feedback yang membangun kepada rekan kerja?",

// Karir
"Bagaimana menyusun CV yang menarik bagi recruiter?",
"Apa yang harus dipersiapkan untuk wawancara kerja?",
"Bagaimana membangun jaringan profesional yang bermanfaat?",

// teknologi
"Apa perbedaan antara REST API dan GraphQL?",
"Bagaimana cara mengoptimalkan performa website?",
"Apa saja best practice untuk keamanan aplikasi web?",
"Bisakah Anda jelaskan konsep microservices?",
"Tools apa yang direkomendasikan untuk developer pemula?",
"Bagaimana cara implementasi JWT authentication?",
"Apa keuntungan menggunakan React dibanding framework lain?",

 // Pertanyaan Umum
"Apa perbedaan antara introvert dan ekstrovert?",
"Bagaimana cara mengembangkan pola pikir positif?",
"Apa yang menyebabkan seseorang sering merasa cemas?",
"Apa manfaat dari meditasi bagi kehidupan sehari-hari?",

// Olahraga & Kesehatan Fisik
"Bagaimana cara memulai olahraga bagi pemula?",
"Apa manfaat yoga bagi kesehatan mental dan fisik?",
"Bagaimana cara meningkatkan daya tahan tubuh dengan olahraga?",
"Apa perbedaan antara latihan kardio dan latihan kekuatan?",

// Sains & Inovasi
"Apa penemuan terbaru dalam dunia sains yang menarik?",
"Bagaimana cara kerja teknologi blockchain?",
"Apa dampak perubahan iklim terhadap kehidupan manusia?",
"Bagaimana perkembangan eksplorasi luar angkasa saat ini?",

// Motivasi & Inspirasi
"Bagaimana cara tetap termotivasi dalam mencapai tujuan?",
"Apa buku motivasi terbaik yang direkomendasikan?",
"Siapa tokoh inspiratif yang bisa dijadikan panutan?",
"Bagaimana cara menghadapi kegagalan dan bangkit kembali?",

// Sosial & Masyarakat
"Bagaimana cara meningkatkan kepedulian sosial di lingkungan sekitar?",
"Apa tantangan terbesar dalam kehidupan sosial saat ini?",
"Bagaimana cara mengatasi perbedaan pendapat dalam masyarakat?",
"Apa solusi untuk mengurangi kesenjangan sosial di perkotaan?",

// Filsafat & Pemikiran Kritis
"Apa perbedaan antara skeptisisme dan pemikiran kritis?",
"Bagaimana cara memahami konsep eksistensialisme?",
"Apa hubungan antara etika dan teknologi dalam kehidupan modern?",
"Bagaimana cara mengembangkan cara berpikir yang lebih logis?",

// Teknologi Masa Depan
"Bagaimana AI akan mengubah industri kreatif?",
"Apa saja inovasi terbaru dalam dunia robotika?",
"Bagaimana teknologi quantum computing akan mengubah dunia?",
"Apa tantangan utama dalam mengembangkan teknologi energi terbarukan?",

];

// Fungsi untuk menampilkan rekomendasi pertanyaan
function showRecommendations() {
const chatBox = document.getElementById('chatBox');

// Hapus rekomendasi sebelumnya jika ada
const oldRecs = document.getElementById('recommendation-container');
if (oldRecs) oldRecs.remove();

// Ambil 4 rekomendasi acak dari berbagai kategori
const shuffled = [...questionRecommendations].sort(() => 0.5 - Math.random());
const selectedQuestions = shuffled.slice(0, 4);

// Buat container rekomendasi
const recContainer = document.createElement('div');
recContainer.id = 'recommendation-container';
recContainer.style.margin = '15px 0';
recContainer.style.padding = '15px';
recContainer.style.background = 'rgba(255, 255, 255, 0.05)';
recContainer.style.borderRadius = '10px';
recContainer.style.border = '1px solid rgba(0, 188, 212, 0.3)';

// Tambahkan judul
const title = document.createElement('div');
title.innerHTML = '<i class="fas fa-lightbulb" style="margin-right:8px"></i> <strong>Pertanyaan Populer</strong>';
title.style.color = '#00bcd4';
title.style.marginBottom = '12px';
title.style.fontSize = '0.95em';
recContainer.appendChild(title);

// Buat daftar rekomendasi
const list = document.createElement('div');
selectedQuestions.forEach((question, index) => {
    const item = document.createElement('div');
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.padding = '8px 0';
    item.style.borderBottom = index === selectedQuestions.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.1)';
    item.style.cursor = 'pointer';
    item.style.transition = 'all 0.2s';
    
    item.innerHTML = `
        <div style="width:100%">
            <div style="font-size:0.85em">${question}</div>
        </div>
        <i class="fas fa-chevron-right" style="margin-left:10px; font-size:0.8em; color:#00bcd4"></i>
    `;
    
    item.addEventListener('mouseenter', () => {
        item.style.background = 'rgba(0, 188, 212, 0.1)';
        item.style.paddingLeft = '5px';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.background = 'transparent';
        item.style.paddingLeft = '0';
    });
    
    item.addEventListener('click', () => {
        document.getElementById('userInput').value = question;
        document.getElementById('userInput').focus();
        // Opsional: auto kirim
        // sendMessage();
    });
    
    list.appendChild(item);
});

recContainer.appendChild(list);

// Tambahkan ke chat box
chatBox.appendChild(recContainer);
chatBox.scrollTop = chatBox.scrollHeight;
}

// Panggil saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
setTimeout(showRecommendations, 1000);
});