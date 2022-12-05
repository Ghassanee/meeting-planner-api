import { Router } from 'express';
import {
  getRoomsController,
  getRoomController,
  createRoomController,
  deleteRoomController,
} from '../controller/room.controller';

const router = Router();

router.get('/', getRoomsController);
router.get('/:name', getRoomController);
router.post('/', createRoomController);
router.delete('/:name', deleteRoomController);

export default router;
