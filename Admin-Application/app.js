const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));
app.use('/covers', express.static(path.join(__dirname, 'covers')));

// Ensure pdfs and covers directories exist
const pdfDir = path.join(__dirname, 'pdfs');
const coverDir = path.join(__dirname, 'covers');
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir);
}
if (!fs.existsSync(coverDir)) {
    fs.mkdirSync(coverDir);
}

// Storage setup for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'pdf') {
            cb(null, 'pdfs');
        } else if (file.fieldname === 'cover') {
            cb(null, 'covers');
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Database setup
const dbPath = path.join(__dirname, 'data', 'books.db');
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY, title TEXT, author TEXT, pdf TEXT, cover TEXT)");
});

// Routes
app.get('/books', (req, res) => {
    db.all("SELECT * FROM books", (err, rows) => {
        if (err) {
            console.error('Error fetching books:', err.message);
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});

app.post('/books', upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), (req, res) => {
    const { title, author } = req.body;
    const pdf = req.files['pdf'][0].filename;
    const cover = req.files['cover'][0].filename;

    if (!title || !author || !pdf || !cover) {
        res.status(400).send('Title, Author, PDF, and Cover are required');
        return;
    }

    const stmt = db.prepare("INSERT INTO books (title, author, pdf, cover) VALUES (?, ?, ?, ?)");
    stmt.run(title, author, pdf, cover, function(err) {
        if (err) {
            console.error('Error inserting book:', err.message);
            res.status(500).send(err.message);
            return;
        }
        res.status(201).send({ id: this.lastID });
    });
    stmt.finalize();
});

app.listen(PORT, () => {
    console.log(`Admin server is running on http://localhost:${PORT}`);
});
