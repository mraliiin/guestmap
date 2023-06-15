const request = require('supertest');
const app = require('../src/app');

// let db;

describe('GET /api/v1', () => {
    it('responds with a json message', function (done) {
        request(app)
            .get('/api/v1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, {
                message: 'API'
            }, done);
    });
});

describe('POST /api/v1/messages', () => {
    /* before((done) => {
        db = monk('localhost:27017/local_test')
        done();
    }); */

    it('inserts new message', function (done) {
        let message = {
            name: 'smith',
            message: 'i love new york!',
            latitude: 20,
            longitude: 30,
        }
    
        let expectedMessage = {
            ...message,
            _id: '100',
            date: '11-11-2011',
        }

        request(app)
            .post('/api/v1/messages')
            .send(message)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(res => {
                res.body._id = expectedMessage._id;
                res.body.date = expectedMessage.date; 
            })
            .expect(200, expectedMessage, done);
    });

    it('failing to insert invalid message latitude', function (done) {
        let invalidLatMessage = {
            name: 'smith',
            message: 'i love new york!',
            latitude: 220,
            longitude: 30,
        }

        request(app)
            .post('/api/v1/messages')
            .send(invalidLatMessage)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(500, done);
    }); 
});