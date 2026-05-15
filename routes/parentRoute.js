import express from "express";

import { create, fetch, fetchById, update, deleteParent } from "../controller/parentController.js";

const route = express.Router();

route.get("/getallparents", fetch);
route.get("/getparent/:id", fetchById);
route.post("/create", create);
route.put("/update/:id", update);
route.delete("/delete/:id", deleteParent);

export default route;
