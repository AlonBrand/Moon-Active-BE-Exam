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
    // if (!hasThreeIdenticalValues(slotMachineValues)) {
    //   res.status(200).json({ error: 'Not your lucky spin :(' });
    //   return;
    // };

    // Calculate granted points:
    const grantedPoints = slotMachineValues?.reduce((acc: number, curr: number) => acc + curr, 0);

    // Update user points
    const incPointsResponse = await axios.post(`http://localhost:3002/inc/points/${userId}`, {
      points: grantedPoints
    });

    const newPoints = incPointsResponse?.data;

    // Calculate rewards:

    const rewards = calculateRewards(grantedPoints, newPoints);


    // const slotMachineValues = await spinSlotMachine(Number(userId), res);
    // console.log("🚀 ~ app.get ~ isSpinAllowed:", isSpinAllowed)
    // console.log("Generated slot machine values:", slotMachineValues)
    // /*

    // */
    // const payload = {
    //   slotMachineValues
    // }
    // const response = await axios.post(`http://localhost:3001/accumulator/${userId}`, payload)
    res.json(decSpinResponse.data)
  }
  catch (error) {
    return res.json({ error: "Error in slot machine service" })
  }
});

app.listen(port, () => {
  console.log(`Slot Machine Service listening on port ${port}`);
});
