async function loadBooks() {
    try {
        const response = await fetch('http://localhost:3001/books');
        const books = await response.json();
        const booksList = document.getElementById('books');
        booksList.innerHTML = '';

        books.forEach(book => {
            const col = document.createElement('div');
            col.className = 'col-md-4';

            const card = document.createElement('div');
            card.className = 'book-card';

            // Display the cover image
            const img = document.createElement('img');
            img.src = `http://localhost:3001/covers/${book.cover}`;
            img.alt = 'Book Cover';
            img.style.maxWidth = '100%';
            card.appendChild(img);

            const title = document.createElement('div');
            title.className = 'book-title';
            title.innerText = book.title;
            card.appendChild(title);

            const author = document.createElement('div');
            author.className = 'book-author';
            author.innerText = book.author;
            card.appendChild(author);

            const link = document.createElement('a');
            link.className = 'btn btn-primary book-link';
            link.href = `http://localhost:3001/pdfs/${book.pdf}`;
            link.target = '_blank';
            link.innerText = 'Read';
            card.appendChild(link);

            col.appendChild(card);
            booksList.appendChild(col);
        });
    } catch (error) {
        console.error('Error loading books:', error.message);
        // Handle error display or logging
    }
}

document.addEventListener('DOMContentLoaded', loadBooks);
