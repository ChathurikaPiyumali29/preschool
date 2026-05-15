import express from "express";

import { create, fetch, fetchById, update, deleteClass } from "../controller/classController.js";

const route = express.Router();

route.get("/getallclasses", fetch);
route.get("/getclass/:id", fetchById);
route.post("/create", create);
route.put("/update/:id", update);
route.delete("/delete/:id", deleteClass);

export default route;
