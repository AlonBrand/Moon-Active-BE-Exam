import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { hasThreeIdenticalValues } from './utils/hasThreeIdenticalValues.js';
import { calculateRewards } from './utils/calculateRewards.js';

// Resolve __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;
const user_manager_port = 3001;

// Middlewares
app.use(express.json());

// Route to handle slot machine spin
app.get('/spin/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Decrease user spin by 1 atomically
    const decSpinResponse = await axios.post(`http://localhost:${user_manager_port}/dec/spins/${userId}`);

    // Check if the user has enough spins
    if (decSpinResponse?.data?.remainingSpins < 0) {
      return res.status(400).json({ error: 'Not enough spins :(' });
    }

    // Generate random values for the slot machine
    const slotMachineValues = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10));

    // If no three identical digits, return without rewards
    if (!hasThreeIdenticalValues(slotMachineValues)) {
      return res.status(200).json({
        info: 'Not your lucky spin :(',
        result: slotMachineValues
      });
    }

    // Calculate granted points based on slot machine values
    const grantedPoints = slotMachineValues.reduce((acc, curr) => acc + curr, 0);

    // Update user points atomically
    const incPointsResponse = await axios.post(`http://localhost:${user_manager_port}/inc/points/${userId}`, {
      points: grantedPoints
    });

    // Calculate rewards based on the updated points
    const rewards = calculateRewards(grantedPoints, incPointsResponse?.data);

    // Update user rewards atomically
    const incRewards = await axios.post(`http://localhost:${user_manager_port}/inc/${userId}`, rewards);

    // If failed to update rewards, return an error
    if (!incRewards.data) {
      return res.status(500).json({ error: "Error while setting the rewards!" });
    }

    // Retrieve and return user information
    const userInfo = await axios.get(`http://localhost:${user_manager_port}/info/${userId}`);
    return res.json({
      info: userInfo?.data
    });

  } catch (error) {
    return res.json({ error: "Error in slot machine service" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Slot Machine Service listening on port ${port}`);
});
