/* index.ts */
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { accumulator } from './accumulator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.post('/accumulator/:userId', async (req, res) => {
  const response = await accumulator(req, res);
  res.json({})
});

app.listen(port, () => {
  console.log(`Accumulation system service listening on port ${port}`);
});
