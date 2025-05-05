import express from 'express';
import multer from 'multer';
import games from './modules/games';
import auth from './modules/auth';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(multer().any()); // Middleware to handle multipart/form-data (file uploads)

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

function init() {
    app.use("/games", games.init());
    app.use("/auth", auth.init());
    console.log('Application initialized');
}

init();