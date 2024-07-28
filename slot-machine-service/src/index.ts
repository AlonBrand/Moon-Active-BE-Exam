/* index.ts */
import express from 'express';
import { spinSlotMachine } from './spinSlotMachine.js';

const app = express();
const port = 3000;

app.get('/spin/:userId', async (req, res) => {
  const rewards = await spinSlotMachine(req, res);
  res.json(rewards)
  console.log("🚀 ~ app.get ~ rewards:", rewards)
});

app.listen(port, () => {
  console.log(`Slot Machine Service listening on port ${port}`);
});
