import express from 'express';
import games from './modules/games';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

function init() {
    app.use("/games", games.init());
    console.log('Application initialized');
}

init();