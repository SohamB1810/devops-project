const express = require('express');
const app = express();

app.use(express.json());

let tasks = [];

app.get('/tasks', (req, res) => res.json(tasks));

app.post('/tasks', (req, res) => {
  tasks.push(req.body);
  res.status(201).json(req.body);
});

app.get('/health', (req, res) => res.send("OK"));

app.listen(3000, () => console.log("Running on port 3000"));