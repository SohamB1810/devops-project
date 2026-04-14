const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

const PORT = process.env.APP_PORT || 3002;
const MONGO_USER = process.env.MONGO_USERNAME || 'admin';
const MONGO_PASS = process.env.MONGO_PASSWORD || 'password123';
const MONGO_URI = 'mongodb://' + MONGO_USER + ':' + MONGO_PASS + '@mongo-service:27017/devopsdb?authSource=admin';

let dbConnected = false;
mongoose.connect(MONGO_URI)
  .then(() => { dbConnected = true; console.log('[order-service] MongoDB connected'); })
  .catch((err) => { console.error('[order-service] MongoDB failed:', err.message); });

const OrderSchema = new mongoose.Schema({ userId: String, product: String, quantity: Number, createdAt: { type: Date, default: Date.now } });
const Order = mongoose.model('Order', OrderSchema);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'order-service', db: dbConnected ? 'connected' : 'disconnected' }));
app.get('/orders', async (req, res) => { try { res.json(await Order.find()); } catch (err) { res.status(500).json({ error: err.message }); } });
app.post('/orders', async (req, res) => { try { res.status(201).json(await Order.create(req.body)); } catch (err) { res.status(500).json({ error: err.message }); } });
app.get('/orders/:id', async (req, res) => { try { res.json(await Order.findById(req.params.id)); } catch (err) { res.status(500).json({ error: err.message }); } });
app.delete('/orders/:id', async (req, res) => { try { await Order.findByIdAndDelete(req.params.id); res.json({ message: 'Order deleted' }); } catch (err) { res.status(500).json({ error: err.message }); } });

app.listen(PORT, () => console.log('[order-service] Running on port ' + PORT));
