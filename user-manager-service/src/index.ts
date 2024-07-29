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
    return res.json({ error: "Error in user manager dec spins route" })
  }
});

app.post('/inc/points/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const grantedPoints = req.body.points;
    if (!grantedPoints) return;
    console.log("Increasing poinsts by", grantedPoints);
    const newPoints = await client.INCRBY(`user:${userId}:points`, grantedPoints);
    res.status(200).json(newPoints); 
  }
  catch (error) {
    return res.json({ error: "Error in user manager inc points route" })
  }
});

app.post('/inc/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const payload = req.body;
    
    // Start setting keys (update values asynchronously)
    const incrementPromises = Object.keys(payload).map((key) => {
      console.log(`Setting user ${key} to ${payload[key]}`);
      return client.set(`user:${userId}:${key}`, payload[key]);
    });
    
    // When all preomises were resolved update the caller
    await Promise.all(incrementPromises);
    res.status(200).json(true);
  } catch (error) {
    res.status(500).json({ error: "Error in user manager inc route" });
  }
});


app.listen(port, () => {
  console.log(`User manager service listening on port ${port}`);
});
