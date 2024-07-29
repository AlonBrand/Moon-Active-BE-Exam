import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import client from './redisClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(express.json());

const port = process.env.PORT || 3002;

app.post('/dec/spins/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const newSpins = await client.decr(`user:${userId}:spins`);
    console.log(`Decreasing spins from ${newSpins+1} to ${newSpins}`);

    /* If not enough spins -> increase one and return */
    if (newSpins < 0) {
      await client.incr(`user:${userId}:spins`);
      return;
    }

    res.status(200).json(true);
  } catch (error) {
    console.error("Error in dec spins:", error);
    return;
  }
});

app.post('/inc/points/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const grantedPoints = req.body.points;
    if (!grantedPoints) return;
    const newPoints = await client.INCRBY(`user:${userId}:points`, grantedPoints);
    res.status(200).json(newPoints); 
  }
  catch (error) {
    return res.json({ error: "Error in user manager inc points" })
  }
});


// app.post('/dec/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const payload = req.body;
//     console.log("🚀 ~ app.post ~ payload:", payload);
//     res.status(200).json({ message: 'Request received' });
//   } catch (error) {
//     console.error("Error in user manager dec:", error);
//     return res.status(500).json({ error: "Error in user manager dec" });
//   }
// });


app.listen(port, () => {
  console.log(`User manager service listening on port ${port}`);
});
