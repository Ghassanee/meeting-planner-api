const expect = require('chai').expect;
const request = require('request');
const { TESTING_URL } = require('../constants/tests');
const roomName = Math.random().toString(36).substring(2, 7);
const room = {
  name: roomName,
  MaxNumberOfPeople: 23,
  equipments: ['soundstation'],
};

describe('Room API', () => {
  describe('CREATE ROOM', () => {
    describe('Create room validation ERROR', () => {
      describe('Create ROOM missing field Name', () => {
        const payload = {
          MaxNumberOfPeople: 23,
          equipments: 'soundstation',
        };

        it('Status', (done) => {
          request.post(
            `${TESTING_URL}/room`,
            {
              json: payload,
            },
            (_, response) => {
              expect(response.statusCode).to.equal(409);
              expect(response.body.message).to.equal(
                'Error: Room name is required'
              );
              done();
            }
          );
        });
      });

      describe('Create ROOM missing field Number Of People', () => {
        const payload = {
          name: 'E1001',
          equipments: 'soundstation',
        };

        it('should return Max number of people is required', (done) => {
          request.post(
            `${TESTING_URL}/room`,
            {
              json: payload,
            },
            (_, response) => {
              expect(response.statusCode).to.equal(409);
              expect(response.body.message).to.equal(
                'Error: Max number of people is required'
              );
              done();
            }
          );
        });
      });

      describe('Create room duplicate', () => {
        const payload = {
          name: 'E1001',
          MaxNumberOfPeople: 23,
          equipments: 'soundstation',
        };

        it('should return Room already exists', (done) => {
          request.post(
            `${TESTING_URL}/room`,
            {
              json: payload,
            },
            (_, response) => {
              expect(response.statusCode).to.equal(409);
              expect(response.body.message).to.equal(
                'Error: Room already exists'
              );
              done();
            }
          );
        });
      });
    });

    it('Create room SUCCESS', (done) => {
      request.post(
        `${TESTING_URL}/room`,
        {
          json: room,
        },
        (_, response) => {
          expect(response.statusCode).to.equal(201);
          done();
        }
      );
    });
  });

  describe('GET ROOM', () => {
    describe('Get room by name', () => {
      describe('ERROR', () => {
        const name = 'E100';
        it('should return Room not found', (done) => {
          request.get(
            `${TESTING_URL}/room/${name}`,
            (_, response) => {
              expect(response.statusCode).to.equal(404);
              expect(JSON.parse(response.body).message).to.equal(
                'Room not found'
              );
              done();
            }
          );
        });
      });

      describe('SUCCESS', () => {
        const name = roomName;
        it('should return Room', (done) => {
          request.get(
            `${TESTING_URL}/room/${name}`,
            (_, response) => {
              const foundedRoom = {
                name: JSON.parse(response.body).name,
                MaxNumberOfPeople: JSON.parse(response.body)
                  .MaxNumberOfPeople,
                equipments: JSON.parse(response.body).equipments,
              };
              expect(response.statusCode).to.equal(200);
              expect(foundedRoom).to.deep.equal(room);
              done();
            }
          );
        });
      });
    });
    describe('Get all rooms', () => {
      it('Get all rooms SUCCESS', (done) => {
        request.get(`${TESTING_URL}/room`, (_, response) => {
          expect(response.statusCode).to.equal(200);
          done();
        });
      });
    });
  });

  describe('DELELTE ROOM', () => {
    describe('Delete room ERROR', () => {
      const name = 'E100';
      it('should return Room not found', (done) => {
        request.delete(
          `${TESTING_URL}/room/${name}`,
          (_, response) => {
            expect(response.statusCode).to.equal(409);
            expect(JSON.parse(response.body).message).to.equal(
              'Error: Room not found'
            );
            done();
          }
        );
      });
    });

    describe('Delete room SUCCESS', () => {
      const name = roomName;
      it('Status', (done) => {
        request.delete(
          `${TESTING_URL}/room/${name}`,
          (_, response) => {
            expect(response.statusCode).to.equal(200);
            done();
          }
        );
      });
    });
  });
});
