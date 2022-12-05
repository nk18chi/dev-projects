const express = require("express");
import { Request, Response } from "express";
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

const getRandom = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};
