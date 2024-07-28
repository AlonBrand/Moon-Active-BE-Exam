/* index.ts */
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { spinSlotMachine } from './spinSlotMachine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3000;

app.get('/spin/:userId', async (req, res) => {
  try {
    const rewards = await spinSlotMachine(req, res);
    const userId = req.params.userId;
    const response = await axios.post(`http://localhost:3001/rewards/${userId}`, rewards)
    res.json(rewards)
  }
  catch (error) {
    console.log("🚀 ~ app.get ~ error:", error)
  }
});

app.listen(port, () => {
  console.log(`Slot Machine Service listening on port ${port}`);
});
