import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";

const notifyRoutes = express.Router();

//notify

notifyRoutes.get("/", protectRoute, (req, res) => {
    res.status(200).send("notifications page");

});

export default notifyRoutes;