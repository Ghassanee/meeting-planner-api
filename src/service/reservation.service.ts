import mongoose from 'mongoose';
import Reservation from '../model/reservation.model';
import roomModel from '../model/room.model';
import { TypeRequirement } from '../Type';
import { findMatchingValues } from '../utils/array';

export const getReservations = async () => {
  try {
    const reservations = await Reservation.find();
    return reservations;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getReservation = async (name: any) => {
  try {
    const reservation = await Reservation.findOne({ name });
    if (!reservation) {
      throw 'Reservation not found';
    }
    return reservation;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const createReservation = async (reservation: any) => {
  try {
    const existingReservation = await Reservation.findOne({
      name: reservation.name,
    });
    if (existingReservation) {
      throw 'Reservation name already exists';
    }
    const room = await checkForReservation(reservation);

    const newReservation = new Reservation({
      ...reservation,
      roomId: room._id,
      roomName: room.name,
    });

    await newReservation.save();
    await roomModel.findByIdAndUpdate(room._id, {
      $push: { reservationsList: newReservation },
    });
    return newReservation;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteReservation = async (id: any) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  try {
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return null;
    }
    await roomModel.findByIdAndUpdate(reservation.roomId, {
      $pull: { reservationsList: id },
    });
    await Reservation.findByIdAndDelete(id);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteAllReservations = async () => {
  try {
    await roomModel.updateMany(
      {},
      { $set: { reservationsList: [] } }
    );

    await Reservation.deleteMany({});
  } catch (error: any) {
    throw new Error(error);
  }
};

const checkForDate = (checkIn: string, checkOut: string) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const day = checkInDate.getDay();
  const hour = checkInDate.getHours();
  if (checkInDate > checkOutDate) {
    throw 'CheckIn date must be before checkOut date';
  }
  if (checkInDate.getDate() !== checkOutDate.getDate()) {
    throw 'CheckIn and checkOut must be on the same day';
  }
  if (checkInDate < new Date()) {
    throw 'CheckIn and checkOut must be on future date';
  }
  if (day === 0 || day === 6) {
    throw 'CheckIn and checkOut must be on weekdays';
  }
  if (hour < 8 || hour > 20) {
    throw 'CheckIn and checkOut must be between 8:00 and 20:00';
  }
  return true;
};

const isTimeReserved = (
  checkIn: string,
  checkOut: string,
  rooms: any[]
) => {
  const roomsAvailable: any[] = [];

  rooms.forEach((room) => {
    let isAvailable = room.reservationsList.find(
      (reservation: any) =>
        reservation.checkOut === checkOut ||
        reservation.checkOut === checkIn
    );

    if (!isAvailable) {
      roomsAvailable.push(room);
    }
  });

  return roomsAvailable;
};

const findBestRoom = (
  reservation: {
    name: string;
    numberOfPeople: number;
    type: string;
    checkIn: string;
    checkOut: string;
  },
  rooms: any[]
) => {
  let bestRoom = rooms[0];

  if (reservation.type === 'RS') {
    rooms.forEach((room) => {
      if (room.MaxNumberOfPeople >= 3) {
        return room;
      }
    });
    throw 'No room available for RS';
  } else {
    const equipments = TypeRequirement[reservation.type];
    let numberOfSameRequirements = 0;

    rooms.forEach((room) => {
      if (
        room.MaxNumberOfPeople * 0.7 >=
        reservation.numberOfPeople
      ) {
        let sameRequirements = findMatchingValues(
          room.equipments,
          equipments
        );
        console.log('here', sameRequirements);

        if (sameRequirements.length > numberOfSameRequirements) {
          bestRoom = room;
          numberOfSameRequirements = sameRequirements.length;
        }
      }
    });
    return bestRoom;
  }
};

const checkForReservation = async (reservation: {
  name: string;
  numberOfPeople: number;
  type: string;
  checkIn: string;
  checkOut: string;
}) => {
  try {
    checkForDate(reservation.checkIn, reservation.checkOut);

    let allRooms = await roomModel.find();

    const roomsAvailable = isTimeReserved(
      reservation.checkIn,
      reservation.checkOut,
      allRooms
    );

    if (roomsAvailable.length === 0) {
      throw 'No room available at this time';
    }

    const bestRoom = findBestRoom(reservation, roomsAvailable);
    return bestRoom;
  } catch (error: any) {
    throw new Error(error);
  }
};
