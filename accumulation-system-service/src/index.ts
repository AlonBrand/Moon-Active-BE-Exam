/* index.ts */
import express from 'express';
// import { spinSlotMachine } from './spinSlotMachine.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// TODO: add rewards logic
app.post('/rewards/:userId', async (req, res) => {
  const rewards = req.body;
  console.log("🚀 ~ app.get ~ rewards:", rewards)
  // const rewards = await spinSlotMachine(req, res);
  res.json({
    
  })
});

app.listen(port, () => {
  console.log(`Accumulation system service listening on port ${port}`);
});
