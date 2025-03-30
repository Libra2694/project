document.getElementById('uploadButton').addEventListener('click', function () {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('image', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.url) {
                document.getElementById('result').innerHTML = `<a href="${data.url}" target="_blank">${data.url}</a>`;
            } else {
                document.getElementById('result').innerText = 'Error uploading image';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('result').innerText = 'Error uploading image';
        });
    } else {
        alert('Please select an image file.');
    }
});