const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    // await mongoose.connection.db.dropDatabase(); // Clean up after tests
    await mongoose.disconnect(); // Close connection
});

describe('GET /', () =>{
    it('should return 200 and a correct message', async () =>{
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Blog platform backend is running');
    });
});