import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health.js";
import { projectsRouter } from "./routes/projects.js";
import { charactersRouter } from "./routes/characters.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(healthRouter);
app.use(projectsRouter);
app.use(charactersRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
