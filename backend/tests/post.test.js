const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Post = require('../src/models/Post');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

let token;
let userId; // Variable to hold user ID
let postId; // Variable to hold the post ID

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await User.deleteMany({});
    await Post.deleteMany({});

    // Create a user and generate a token
    const user = new User({ 
        username: 'Heizal', 
        email: 'heizal@example.com', 
        password: 'password123' 
    });
    await user.save();
    
    userId = user._id; // Store user ID for later use
    token = jwt.sign({ userId }, process.env.JWT_SECRET || 'defaultSecretKey', { expiresIn: '1h' });

    // Create a new blog post and store its ID
    const post = new Post({
        title: 'Sample Post',
        content: 'This is a sample blog post.',
        author: userId // Use the valid user ID
    });
    const savedPost = await post.save();
    postId = savedPost._id; // Store the post ID
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase(); // Cleanup test data
    await mongoose.disconnect();
});

describe('CRUD Operations for Blog Posts', () => {
    it('should create a new blog post', async () => {
        const res = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${token}`) // Set the token in the request header
            .send({
                title: 'New Post',
                content: 'This is a test post',
                author: userId // Use the valid user ID from the previous user creation
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe('New Post');
    });

    it('should get all blog posts', async () => {
        const res = await request(app).get('/api/posts');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should get a blog post by id', async () => {
        const res = await request(app).get(`/api/posts/${postId}`); // Use the postId from beforeAll
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Sample Post');
    });

    it('should update a blog post', async () => {
        const res = await request(app)
            .put(`/api/posts/${postId}`) // Use the postId from beforeAll
            .set('Authorization', `Bearer ${token}`) // Set the token in the request header
            .send({
                title: 'Updated Title',
                content: 'Updated content'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Updated Title');
    });

    it('should delete a blog post', async () => {
        const res = await request(app)
            .delete(`/api/posts/${postId}`) // Use the postId from beforeAll
            .set('Authorization', `Bearer ${token}`); // Set the token in the request header

        expect(res.statusCode).toBe(200);
    });
});
