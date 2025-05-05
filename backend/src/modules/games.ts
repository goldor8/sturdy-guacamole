import { Express, Router } from "express";
import gameLib from "../lib/gameLib";

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

    router.get("/random", async (req, res) => {
        let game = await gameLib.getRandomGame();
        if (!game) {
            res.status(404).send("No games found");
            return;
        }
        res.json(game);
    });

    return router;
}

export default {
    init,
};