import { Request, Response } from 'express';
import {
  getRooms,
  getRoom,
  createRoom,
  deleteRoom,
} from '../service/room.service';

export const getRoomsController = async (
  req: Request,
  res: Response
) => {
  try {
    const rooms = await getRooms();
    res.status(200).json(rooms);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const getRoomController = async (
  req: Request,
  res: Response
) => {
  try {
    const room = await getRoom(req.params.name);
    res.status(200).json(room);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const createRoomController = async (
  req: Request,
  res: Response
) => {
  try {
    const room = await createRoom(req.body);
    res.status(201).json(room);
  } catch (error: any) {
    res.status(409).json({ message: error.message });
  }
};

export const deleteRoomController = async (
  req: Request,
  res: Response
) => {
  try {
    const room = await deleteRoom(req.params.name);
    res.status(200).json(room);
  } catch (error: any) {
    res.status(409).json({ message: error.message });
  }
};
