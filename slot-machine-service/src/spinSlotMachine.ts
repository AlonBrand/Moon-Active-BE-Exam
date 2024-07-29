import { Request, Response } from 'express';
import client from './redisClient.js';

export const spinSlotMachine = async (userId: number, res: Response) => {
  console.log("Spin slot machine for user:", userId);
  try {
    const newSpins = await client.decr(`user:${userId}:spins`);
    console.log(`Decreasing spins from ${newSpins+1} to ${newSpins}`);

    /* If not enough spins -> increase one and return */
    if (newSpins < 0) {
      await client.incr(`user:${userId}:spins`);
      res.status(400).json({ error: 'Not enough spins' });
      return;
    }

    /* Generate Slot Machine Rewards */
    const slotMachineValues = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10));
    return slotMachineValues;

  } catch (err) {
    res.status(500).json({ error: 'Error interacting with Redis' });
  }
};
