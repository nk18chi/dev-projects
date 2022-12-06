const express = require("express");
import { Request, Response } from "express";
import { getRandom } from "./utils";
const cors = require("cors");
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

app.post("/roll-dice", (req: Request, res: Response) => {
  if (!req.body.count) throw new Error("count is missing");
  const n: number = Number(req.body.count);
  const result: number[] = [];
  for (let i = 0; i < n; i++) {
    result.push(getRandom(1, 6));
  }
  return res.json(result);
});

app.use((error, req, res, next) => {
  const status = error.status || 400;
  res.status(status).send(error.message);
});

export default app;
