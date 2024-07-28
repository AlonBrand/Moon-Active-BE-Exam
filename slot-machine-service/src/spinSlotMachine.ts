import { Request, Response } from 'express';
import client from './redisClient.js';

export const spinSlotMachine = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {

    console.log("Spining machine for user:", userId);
    const newEnergy = await client.decr(`user:${userId}:energy`);
    console.log("🚀 ~ spinSlotMachine ~ newEnergy:", newEnergy);

    if (newEnergy < 0) {
      // Revert the decrement if energy goes below zero
      await client.incr(`user:${userId}:energy`);
      res.status(400).json({ error: 'Not enough energy' });
      return;
    }

    /* Generate Slot Machine Rewards */
    const slotMachineValues = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10));
    console.log("🚀 ~ spinSlotMachine ~ slotMachineValues:", slotMachineValues)

    return {
      energy: newEnergy,
      slotMachineValues
    }

  } catch (err) {
    res.status(500).json({ error: 'Error interacting with Redis' });
  }
};
