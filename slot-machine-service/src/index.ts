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
    const userId = req.params.userId;
    const slotMachineValues = await spinSlotMachine(Number(userId), res);
    console.log("Generated slot machine values:", slotMachineValues)
    const response = await axios.post(`http://localhost:3001/accumulator/${userId}`, slotMachineValues)
    res.json(slotMachineValues)
  }
  catch (error) {
    console.log("🚀 ~ app.get ~ error:", error)
    return res.json({ error: "Reward service is down :(" })
  }
});

app.listen(port, () => {
  console.log(`Slot Machine Service listening on port ${port}`);
});
