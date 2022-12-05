// room model for the database
import { Schema, model } from 'mongoose';
import reservationModel from './reservation.model';

const roomSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  MaxNumberOfPeople: {
    type: Number,
    required: true,
  },
  equipments: {
    type: [String],
    default: [],
  },
  reservationsList: {
    type: [reservationModel.schema],

    default: [],
  },
});

export default model('Room', roomSchema);
