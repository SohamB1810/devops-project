const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

const PORT = process.env.APP_PORT || 3001;
const MONGO_USER = process.env.MONGO_USERNAME || 'admin';
const MONGO_PASS = process.env.MONGO_PASSWORD || 'password123';
const MONGO_URI = 'mongodb://' + MONGO_USER + ':' + MONGO_PASS + '@mongo-service:27017/devopsdb?authSource=admin';

let dbConnected = false;
mongoose.connect(MONGO_URI)
  .then(() => { dbConnected = true; console.log('[user-service] MongoDB connected'); })
  .catch((err) => { console.error('[user-service] MongoDB failed:', err.message); });

const UserSchema = new mongoose.Schema({ name: String, email: String, createdAt: { type: Date, default: Date.now } });
const User = mongoose.model('User', UserSchema);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'user-service', db: dbConnected ? 'connected' : 'disconnected' }));
app.get('/users', async (req, res) => { try { res.json(await User.find()); } catch (err) { res.status(500).json({ error: err.message }); } });
app.post('/users', async (req, res) => { try { res.status(201).json(await User.create(req.body)); } catch (err) { res.status(500).json({ error: err.message }); } });
app.get('/users/:id', async (req, res) => { try { res.json(await User.findById(req.params.id)); } catch (err) { res.status(500).json({ error: err.message }); } });
app.delete('/users/:id', async (req, res) => { try { await User.findByIdAndDelete(req.params.id); res.json({ message: 'User deleted' }); } catch (err) { res.status(500).json({ error: err.message }); } });

app.listen(PORT, () => console.log('[user-service] Running on port ' + PORT));
