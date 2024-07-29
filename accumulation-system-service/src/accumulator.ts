import { Request, Response } from 'express';
import { hasThreeIdenticalValues } from './utils/hasThreeIdenticalValues.js';
import client from './redisClient.js';
import configuration from '../configurations/configuration.json' assert { type: 'json' };

export const accumulator = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const slotMachineValues = req.body;
  if (!hasThreeIdenticalValues(slotMachineValues)) return;
  const digitSum = slotMachineValues?.reduce((acc: number, curr: number) => acc + curr, 0);
  try {
    const currentCoins = await client.get(`user:${userId}:coins`);
    console.log("🚀 ~ accumulator ~ currentCoins:", currentCoins)
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
