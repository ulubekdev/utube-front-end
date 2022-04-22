import express from 'express';
import path from 'path';

const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views', 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views', 'login.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views', 'admin.html'));
});

app.listen(PORT, () => console.log(`Client is running on port ${PORT}`));