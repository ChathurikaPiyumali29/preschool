import express from "express";

import { create, fetch, fetchById, update, deleteChild } from "../controller/childController.js";

const route = express.Router();

route.get("/getallchildren", fetch);
route.get("/getchildren/:id", fetchById);
route.post("/create", create);
route.put("/update/:id", update);
route.delete("/delete/:id", deleteChild);

export default route;
