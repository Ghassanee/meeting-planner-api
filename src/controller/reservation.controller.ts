import { Request, Response } from 'express';

import {
  getReservations,
  getReservation,
  createReservation,
  deleteReservation,
  deleteAllReservations,
} from '../service/reservation.service';

export const getReservationsController = async (
  req: Request,
  res: Response
) => {
  try {
    const reservations = await getReservations();
    res.status(200).json(reservations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getReservationController = async (
  req: Request,
  res: Response
) => {
  try {
    const reservation = await getReservation(req.params.name);
    if (!reservation) {
      throw 'Reservation not found';
    }
    res.status(200).json(reservation);
  } catch (error: any) {
    res.status(409).json({ message: error.message });
  }
};

export const createReservationController = async (
  req: Request,
  res: Response
) => {
  try {
    const reservation = await createReservation(req.body);
    res.status(201).json(reservation);
  } catch (error: any) {
    res.status(409).json({ message: error.message });
  }
};

export const deleteReservationController = async (
  req: Request,
  res: Response
) => {
  try {
    const reservation = await deleteReservation(req.params.id);
    if (!reservation) {
      throw 'Reservation not found';
    }
    res.status(200).json({ message: 'Reservation deleted' });
  } catch (error: any) {
    res.status(409).json({ message: error.message });
  }
};

export const deleteAllReservationsController = async (
  req: Request,
  res: Response
) => {
  try {
    await deleteAllReservations();
    res.status(200).json({ message: 'All reservations deleted' });
  } catch (error: any) {
    res.status(409).json({ message: error.message });
  }
};
