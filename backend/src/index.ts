import express from 'express';
import cors from 'cors';
import { deviceRoutes } from './routes/deviceRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', deviceRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
  console.log(`Calm Home Hub backend listening on http://localhost:${PORT}`);
});
