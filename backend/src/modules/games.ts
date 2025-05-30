import { Express, Router } from "express";
import gameLib from "../lib/gameLib";
import { buildWebError, sendError, sendSuccess } from "../lib/errorHandling/webError";

let router = Router();

function init(): Router{
    console.log("Initializing games module");
    router.get("/id/:id", async (req, res) => {
        let id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).send("Invalid ID");
            return;
        }
        let game = await gameLib.getGameById(id);
        if (!game) {
            res.status(404).send("Game not found");
            return;
        }
        res.json(game);
    });

    router.get("/thumbnail/:id", async (req, res) => {
        let id = parseInt(req.params.id);
        if (isNaN(id)) {
            sendError(res, buildWebError(400, "Invalid ID"));
            return;
        }
        let thumbnail = await gameLib.getThumbnailById(id);
        if (!thumbnail) {
            sendError(res, buildWebError(404, "Thumbnail not found"));
            return;
        }
        sendSuccess(res, thumbnail);
    });

    router.get("/random", async (req, res) => {
        let game = await gameLib.getRandomGame();
        if (!game) {
            res.status(404).send("No games found");
            return;
        }
        res.json(game);
    });
    router.get('/duel/:category', async (req, res) => {
        const category = req.params.category;
        try {
            const games = await gameLib.getDuelGamesByCategory(category);
            res.json(games);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // duel avec dictionnaire de plusieurs catégorie et renvoie tous les jeux associé { minplayers: number,maxplayers: number,yearpublished: number,playingtime: number }
    router.get('/duel', async (req, res) => {
        // Extraction et conversion des paramètres
        const category = req.query.categories as string | undefined;
        const minPlayers   = req.query.minplayers ? parseInt(req.query.minplayers as string, 10) : null;
        const maxPlayers   = req.query.maxplayers ? parseInt(req.query.maxplayers as string, 10) : null;
        const yearFirst    = req.query.yearFirst ? parseInt(req.query.yearFirst as string, 10) : null;
        const yearLast     = req.query.yearLast ? parseInt(req.query.yearLast as string, 10) : null;
        const playTimeMin  = req.query.playTimeMin ? parseInt(req.query.playTimeMin as string, 10) : null;
        const playTimeMax  = req.query.playTimeMax ? parseInt(req.query.playTimeMax as string, 10) : null;

        try {
            const games = await gameLib.getDuelGamesByCategories(
                category,
                minPlayers,
                maxPlayers,
                yearFirst,
                yearLast,
                playTimeMin,
                playTimeMax
            );
            res.json(games);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // get game by categorie
    router.get(/gameCategory/, async (req, res) => {
        const category = req.query.categories as string | undefined;
        const minPlayers   = req.query.minplayers ? parseInt(req.query.minplayers as string, 10) : null;
        const maxPlayers   = req.query.maxplayers ? parseInt(req.query.maxplayers as string, 10) : null;
        const yearFirst    = req.query.yearFirst ? parseInt(req.query.yearFirst as string, 10) : null;
        const yearLast     = req.query.yearLast ? parseInt(req.query.yearLast as string, 10) : null;
        const playTimeMin  = req.query.playTimeMin ? parseInt(req.query.playTimeMin as string, 10) : null;
        const playTimeMax  = req.query.playTimeMax ? parseInt(req.query.playTimeMax as string, 10) : null;
        let removeId = req.query.removeId as string | undefined;
        const parsedRemoveId = removeId
            ? removeId.startsWith('[')
                ? JSON.parse(removeId).join(',') // ex: ['779', '668'] → '779,668'
                : removeId
            : null;
        try {
            const game = await gameLib.getGameByCategories(
                category,
                minPlayers,
                maxPlayers,
                yearFirst,
                yearLast,
                playTimeMin,
                playTimeMax,
                parsedRemoveId
            );
            res.json(game);

        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }

    });

    // dans gamesModule (routes)
    router.get('/allcategory', async (req, res) => {
        try {
            const categories = await gameLib.getAllCategories();
            res.json(categories);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
}

export default {
    init,
};