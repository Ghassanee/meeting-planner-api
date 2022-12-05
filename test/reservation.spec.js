const expect = require('chai').expect;
const request = require('request');
const { TESTING_URL } = require('../constants/tests');
const reservationName = Math.random().toString(36).substring(2, 7);
const reservation = {
  name: reservationName,
  MaxNumberOfPeople: 23,
  equipments: ['soundstation'],
  checkIn: '2023-10-16T12:00:00',
  checkOut: '2023-10-16T13:00:00',
  type: 'RC',
  numberOfPeople: 4,
};

describe('Reservation API', () => {
  describe('Create Reservation  ', () => {
    it('should create a new reservation', (done) => {
      request.post(
        `${TESTING_URL}/reservation`,
        { json: reservation },
        (err, res, body) => {
          expect(res.statusCode).to.equal(201);
          expect(body).to.have.property('name');
          expect(body).to.have.property('numberOfPeople');
          expect(body).to.have.property('checkIn');
          expect(body).to.have.property('checkOut');
          expect(body).to.have.property('type');
          expect(body).to.have.property('numberOfPeople');
          done();
        }
      );
    });

    it('should return 409 when creating a reservation with the same name', (done) => {
      request.post(
        `${TESTING_URL}/reservation`,
        { json: reservation },
        (err, res, body) => {
          expect(res.statusCode).to.equal(409);
          expect(body.message).to.equal(
            'Reservation name already exists'
          );
          done();
        }
      );
    });

    it('should return CheckIn date must be before checkOut date', (done) => {
      request.post(
        `${TESTING_URL}/reservation`,
        {
          json: {
            ...reservation,
            checkIn: '2023-10-16T13:00:00',
            checkOut: '2023-10-16T12:00:00',
            name: Math.random().toString(36).substring(2, 7),
          },
        },
        (err, res, body) => {
          expect(res.statusCode).to.equal(409);
          expect(body.message).to.equal(
            'Error: CheckIn date must be before checkOut date'
          );
          done();
        }
      );
    });

    it('CheckIn and checkOut must be on the same day', (done) => {
      request.post(
        `${TESTING_URL}/reservation`,
        {
          json: {
            ...reservation,
            checkIn: '2023-10-16T12:00:00',
            checkOut: '2023-10-17T12:00:00',
            name: Math.random().toString(36).substring(2, 7),
          },
        },
        (err, res, body) => {
          expect(res.statusCode).to.equal(409);
          expect(body.message).to.equal(
            'Error: CheckIn and checkOut must be on the same day'
          );
          done();
        }
      );
    });

    it('CheckIn and checkOut must be on future date', (done) => {
      request.post(
        `${TESTING_URL}/reservation`,
        {
          json: {
            ...reservation,
            checkIn: '2020-10-16T12:00:00',
            checkOut: '2020-10-16T13:00:00',
            name: Math.random().toString(36).substring(2, 7),
          },
        },
        (err, res, body) => {
          expect(res.statusCode).to.equal(409);
          expect(body.message).to.equal(
            'Error: CheckIn and checkOut must be on future date'
          );
          done();
        }
      );
    });

    it('CheckIn and checkOut must be on weekdays', (done) => {
      request.post(
        `${TESTING_URL}/reservation`,
        {
          json: {
            ...reservation,
            checkIn: '2023-10-14T12:00:00',
            checkOut: '2023-10-14T13:00:00',
            name: Math.random().toString(36).substring(2, 7),
          },
        },
        (err, res, body) => {
          expect(res.statusCode).to.equal(409);
          expect(body.message).to.equal(
            'Error: CheckIn and checkOut must be on weekdays'
          );
          done();
        }
      );
    });

    it('CheckIn and checkOut must be between 8:00 and 20:00', (done) => {
      request.post(
        `${TESTING_URL}/reservation`,
        {
          json: {
            ...reservation,
            checkIn: '2023-10-16T07:00:00',
            checkOut: '2023-10-16T07:00:00',
            name: Math.random().toString(36).substring(2, 7),
          },
        },
        (err, res, body) => {
          expect(res.statusCode).to.equal(409);
          expect(body.message).to.equal(
            'Error: CheckIn and checkOut must be between 8:00 and 20:00'
          );
          done();
        }
      );
    });

    it('No room available for RS', (done) => {
      request.post(
        `${TESTING_URL}/reservation`,
        {
          json: {
            ...reservation,
            type: 'RS',
            numberOfPeople: 409,
            name: Math.random().toString(36).substring(2, 7),
          },
        },
        (err, res, body) => {
          expect(body.message).to.equal(
            'Error: No room available for RS'
          );
          done();
        }
      );
    });
  });

  describe('Read Reservation  ', () => {
    it('should return a list of reservations', (done) => {
      request.get(`${TESTING_URL}/reservation`, (err, res, body) => {
        expect(res.statusCode).to.equal(200);
        expect(body).to.be.a('string');
        done();
      });
    });

    it('should return a reservation by name', (done) => {
      request.get(
        `${TESTING_URL}/reservation/${reservationName}`,
        (err, res, body) => {
          expect(body).to.be.a('string');
          done();
        }
      );
    });

    it('should return reservation not found', (done) => {
      request.get(
        `${TESTING_URL}/reservation/123456`,
        (err, res, body) => {
          expect(JSON.parse(res.body).message).to.equal(
            'Reservation not found'
          );
          done();
        }
      );
    });
  });

  describe('Delete Reservation  ', () => {
    it('should delete a reservation', (done) => {
      request.delete(
        `${TESTING_URL}/reservation/${reservationName}`,
        (err, res, body) => {
          expect(body).to.be.a('string');
          done();
        }
      );
    });

    it('should delete all reservations', (done) => {
      request.delete(
        `${TESTING_URL}/reservation`,
        (err, res, body) => {
          expect(res.statusCode).to.equal(200);
          expect(body).to.be.a('string');
          done();
        }
      );

      it('should return reservation not found', (done) => {
        request.delete(
          `${TESTING_URL}/reservation/123456`,
          (err, res, body) => {
            expect(res.statusCode).to.equal(404);
            expect(JSON.parse(response.body).message).to.equal(
              'Reservation not found'
            );
            done();
          }
        );
      });
    });
  });
});
