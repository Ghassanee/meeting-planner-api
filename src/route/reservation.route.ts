// reservation routes

import { Router } from 'express';
import {
  getReservationsController,
  getReservationController,
  createReservationController,
  deleteReservationController,
  deleteAllReservationsController,
} from '../controller/reservation.controller';

const reservationRoutes = Router();

reservationRoutes.get('/', getReservationsController);
reservationRoutes.get('/:id', getReservationController);
reservationRoutes.post('/', createReservationController);
reservationRoutes.delete('/:id', deleteReservationController);
reservationRoutes.delete('/', deleteAllReservationsController);

export default reservationRoutes;
