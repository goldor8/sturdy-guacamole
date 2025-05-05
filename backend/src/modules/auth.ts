import { Router } from "express"
import authLib from "../lib/authLib";
import {buildWebError, handleError, sendSuccess} from "../lib/errorHandling/webError";
let router = Router();

function init(){
    console.log("Initializing auth module");
    router.post("/register", async (req, res) => {
        const { username, password } = req.body;
        try {
            await authLib.registerUser(username, password);
            sendSuccess(res, { message: "User registered successfully" });
        } catch (error) {
            handleError(error, res);
        }
    });

    router.post("/login", async (req, res) => {
        const { username, password } = req.body;
        try {
            let token = await authLib.loginUser(username, password);
            sendSuccess(res, { message: "Login successful", token});
        } catch (error) {
            handleError(error, res);
        }
    });

    return router;
}

export default {
    init,
}