import express from "express";
import cors from "cors";
import user from "./routes/user.route.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(user);

app.listen(5000, () => console.log("Server Running at http://localhost:5000"));
