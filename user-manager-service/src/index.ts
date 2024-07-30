import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import client from './redisClient.js';

// Resolve __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Express app
const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(express.json());

// Route to decrease user spins
app.post('/dec/spins/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const newSpins = await client.decr(`user:${userId}:spins`);
    console.log(`Decreasing spins from ${newSpins + 1} to ${newSpins}`);

    /* If not enough spins -> increase one and return */
    if (newSpins < 0) {
      await client.incr(`user:${userId}:spins`);
    }
    res.status(200).json({ remainingSpins: newSpins });
  } catch (error) {
    return res.status(500).json({ error: 'Error in user manager dec spins route' })
  }
});

// Route to increase user points
app.post('/inc/points/:userId', async (req, res) => {
  const userId = req.params.userId;
  const grantedPoints = req.body.points;
  if (!grantedPoints) return res.status(400).json({ error: 'Points not provided' });

  try {
    console.log("Increasing poinsts by", grantedPoints);
    const newPoints = await client.INCRBY(`user:${userId}:points`, grantedPoints);
    res.status(200).json(newPoints);
  }
  catch (error) {
    return res.status(500).json({ error: "Error in user manager inc points route" })
  }
});

// Route to increment multiple user values with payload
app.post('/inc/:userId', async (req, res) => {
  const userId = req.params.userId;
  const payload = req.body;

  try {
    // Start setting keys (update values asynchronously)
    const incrementPromises = Object.keys(payload).map((key) => {
      console.log(`Setting user ${key} to ${payload[key]}`);
      return client.INCRBY(`user:${userId}:${key}`, payload[key]);
    });

    // When all preomises were resolved update the caller
    await Promise.all(incrementPromises);
    res.status(200).json(true);
  } catch (error) {
    res.status(500).json({ error: "Error in user manager inc route" });
  }
});

// Route to get user information
app.get('/info/:userId', async (req, res) => {
  const userId = req.params.userId;
  const keysPattern = `user:${userId}:`;

  try {
    // Create an array of promises (responses from the redis async get function) and await for them to resolve
    const [userPoints, userCoins, userSpins] = await Promise.all([
      client.get(`${keysPattern}points`),
      client.get(`${keysPattern}coins`),
      client.get(`${keysPattern}spins`)
    ]);

    res.json({
      points: userPoints,
      coins: userCoins,
      spins: userSpins
    });
  } catch (error) {
    console.error("Error retrieving user info:", error);
    res.status(500).json({ error: "Error in user manager get info" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`User manager service listening on port ${port}`);
});
