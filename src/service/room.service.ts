import Room from '../model/room.model';

export const getRooms = async () => {
  try {
    const rooms = await Room.find();
    return rooms;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getRoom = async (name: any) => {
  try {
    const room = await Room.findOne({ name: name });
    if (room === null) {
      throw new Error('Room not found');
    }
    return room;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createRoom = async (room: any) => {
  try {
    if (room.name === '' || room.name === undefined) {
      throw new Error('Room name is required');
    }
    if (room.MaxNumberOfPeople === undefined) {
      throw new Error('Max number of people is required');
    }
    if (
      room.requirementList &&
      typeof room.requirementList === 'string'
    ) {
      room.requirementList = room.requirementList.split(',');
    }

    const roomExists = await Room.findOne({ name: room.name });
    if (roomExists) {
      throw new Error('Room already exists');
    }
    const newRoom = await Room.create(room);
    return newRoom;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteRoom = async (name: any) => {
  try {
    const roomExists = await Room.findOne({ name: name });
    if (roomExists === null) {
      throw new Error('Room not found');
    }
    await roomExists.remove();
    return roomExists;
  } catch (error: any) {
    throw new Error(error);
  }
};
