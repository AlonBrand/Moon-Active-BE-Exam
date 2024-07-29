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
  const userId = req.params.userId;
  try {
    /* Decrease user spin by 1 atomically */
    const decSpinResponse = await axios.post(`http://localhost:3001/dec/spins/${userId}`);

    if (!decSpinResponse?.data) {
      res.status(400).json({ error: 'Not enough spins :(' });
      return;
    }

    /* Generate randon values */
    const slotMachineValues = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10));

    /* If no three identical digits: return */
    if (!hasThreeIdenticalValues(slotMachineValues)) {
      res.status(200).json({
        info: 'Not your lucky spin :(', 
        result: slotMachineValues
      });
      return;
    };

    /* Calculate granted points: */
    const grantedPoints = slotMachineValues?.reduce((acc: number, curr: number) => acc + curr, 0);

    /* Update user points atomically */
    const incPointsResponse = await axios.post(`http://localhost:3001/inc/points/${userId}`, {
      points: grantedPoints
    });

    /* Calculate rewards: */ 
    const rewards = calculateRewards(incPointsResponse?.data);
    const incRewards = await axios.post(`http://localhost:3001/inc/${userId}`, rewards);

    /* If failed to update rewards: show error to the client */
    if (!incRewards.data) {
      return res.status(500).json({ error: "Error while setting the rewards!" })
    }

    /* Retrue a JSON with the user info to the client */
    const userInfo = await axios.get(`http://localhost:3001/info/${userId}`);
    res.json({
      info: userInfo?.data
    })
  }
  catch (error) {
    console.log(error);
    return res.json({ error: "Error in slot machine service" })
  }
});

app.listen(port, () => {
  console.log(`Slot Machine Service listening on port ${port}`);
});
