/* index.ts */
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { hasThreeIdenticalValues } from './utils/hasThreeIdenticalValues.js';
import { calculateRewards } from './utils/calculateRewards.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/spin/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const decSpinResponse = await axios.post(`http://localhost:3002/dec/spins/${userId}`);

    if (!decSpinResponse?.data) {
      res.status(400).json({ error: 'Not enough spins :(' });
      return;
    }

    /* Slot Machine logic */

    // Generate randon values:
    const slotMachineValues = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10));
    // const slotMachineValues = [5, 5, 5]; // For testing
    if (!hasThreeIdenticalValues(slotMachineValues)) {
      res.status(200).json({ error: 'Not your lucky spin :(' });
      return;
    };

    // Calculate granted points:
    const grantedPoints = slotMachineValues?.reduce((acc: number, curr: number) => acc + curr, 0);

    // Update user points
    const incPointsResponse = await axios.post(`http://localhost:3002/inc/points/${userId}`, {
      points: grantedPoints
    });

    // Calculate rewards:
    const rewards = calculateRewards(incPointsResponse?.data);
    const incRewards = await axios.post(`http://localhost:3002/inc/${userId}`, rewards);

    if (!incRewards.data) {
      return res.status(500).json({ error: "Error while setting the rewards!" })
    }

    const userInfo = await axios.get(`http://localhost:3002/info/${userId}`);
    res.json({
      info: userInfo?.data
    })
  }
  catch (error) {
    return res.json({ error: "Error in slot machine service" })
  }
});

app.listen(port, () => {
  console.log(`Slot Machine Service listening on port ${port}`);
});
