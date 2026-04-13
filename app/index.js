const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const PORT      = process.env.APP_PORT   || 3000;
const APP_ENV   = process.env.APP_ENV    || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL  || 'info';
const APP_NAME  = process.env.APP_NAME   || 'devops-app';

const MONGO_USER = process.env.MONGO_USERNAME || 'admin';
const MONGO_PASS = process.env.MONGO_PASSWORD || 'password123';
const MONGO_URI  = 'mongodb://' + MONGO_USER + ':' + MONGO_PASS + '@mongo-service:27017/devopsdb?authSource=admin';

let dbConnected = false;

mongoose.connect(MONGO_URI)
  .then(() => { dbConnected = true; console.log('[' + APP_NAME + '] MongoDB connected'); })
  .catch((err) => { console.error('[' + APP_NAME + '] MongoDB failed:', err.message); });

const ItemSchema = new mongoose.Schema({ name: String, createdAt: { type: Date, default: Date.now } });
const Item = mongoose.model('Item', ItemSchema);

app.get('/', (req, res) => {
  res.json({ message: 'Hello from ' + APP_NAME, env: APP_ENV });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', db: dbConnected ? 'connected' : 'disconnected', env: APP_ENV });
});

app.post('/items', async (req, res) => {
  try {
    const item = await Item.create({ name: req.body.name });
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, () => { console.log('[' + APP_NAME + '] Running on port ' + PORT); });
