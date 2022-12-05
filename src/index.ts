import express, { Express } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import roomRoutes from './route/room.route';
import reservationRoutes from './route/reservation.route';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || '';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(mongoUri, {});

app.use('/room', roomRoutes);
app.use('/reservation', reservationRoutes);

app.listen(port, () => {
  console.log(
    `⚡️[server]: Server is running at https://localhost:${port}`
  );
});
