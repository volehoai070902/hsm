import express from "express";
import hsmController from "../controller/hsmController.js";
const route = express.Router();

route.post("/createkeypair", hsmController.createkeypair);
route.post("/sendsign", hsmController.sendsigned);

export default route;
