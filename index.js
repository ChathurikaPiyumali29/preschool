import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import childRoute from "./routes/childRoute.js";
import parentRoute from "./routes/parentRoute.js";
import classRoute from "./routes/classRoute.js";

const app = express();
app.use(bodyParser.json());
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGOURL = process.env.MONGO_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the modern UI from /FrontEnd
app.use(express.static(path.join(__dirname, "FrontEnd")));
app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "FrontEnd", "index.html"));
});

mongoose
    .connect(MONGOURL)
    .then(() => {
        console.log("Database Connected Successfully.");

        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    })
    .catch((error) => console.log(error));

app.use("/api/children", childRoute);
app.use("/api/parents", parentRoute);
app.use("/api/classes", classRoute);
