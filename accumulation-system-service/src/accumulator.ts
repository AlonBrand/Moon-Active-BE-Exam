import { Request, Response } from 'express';
import { hasThreeIdenticalValues } from './utils/hasThreeIdenticalValues.js';
import client from './redisClient.js';
import configuration from '../configurations/configuration.json' assert { type: 'json' };

export const accumulator = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const slotMachineValues = req.body;
  if (!hasThreeIdenticalValues(slotMachineValues)) return;

  const pointsGranted = slotMachineValues?.reduce((acc: number, curr: number) => acc + curr, 0);
  console.log("🚀 ~ accumulator ~ pointsGranted:", pointsGranted)
  try {
    // const currentCoins
    const newPoints = await client.INCRBY(`user:${userId}:points`, pointsGranted);
    const prevPoints = newPoints - pointsGranted;
    // call getRewards function
    // Increment rewards
    /**
      1. go to json in the specific index and check if mission complete
        1.1 Yes -> update rewards, increase index (check if the last mission).
        /

        /
        1.2 No -> do nothing
    */
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
