async function addBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pdf = document.getElementById('pdf').files[0];
    const cover = document.getElementById('cover').files[0];

    if (!title || !author || !pdf || !cover) {
        alert('Please enter title, author, select a PDF, and upload a cover image');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('pdf', pdf);
    formData.append('cover', cover);

    try {
        const response = await fetch('http://localhost:3001/books', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Book added successfully');
            loadBooks();
        } else {
            const errorText = await response.text();
            alert('Error adding book: ' + errorText);
        }
    } catch (error) {
        alert('Error adding book: ' + error.message);
    }
}

async function loadBooks() {
    const response = await fetch('http://localhost:3001/books');
    const books = await response.json();
    const booksList = document.getElementById('books');
    booksList.innerHTML = '';
    books.forEach(book => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${book.title} by ${book.author} 
            <a href="http://localhost:3001/pdfs/${book.pdf}" target="_blank">Read</a>
            <img src="http://localhost:3001/covers/${book.cover}" alt="Book Cover" style="max-width: 100px;">
        `;
        booksList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', loadBooks);
