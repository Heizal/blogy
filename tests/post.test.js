const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Post = require('../src/models/Post');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

let token;

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
    token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'defaultSecretKey', { expiresIn: '1h' });

     // Create a new blog post
    const post = new Post({
        title: 'Sample Post',
        content: 'This is a sample blog post.',
        author: new mongoose.Types.ObjectId() // Use the valid user ID
    });
    await post.save();
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase(); // Cleanup test data
    await mongoose.disconnect();
});

describe('CRUD Operations for Blog Posts', () => {
    it('should create a new blog post', async () => {
        //Autheticate first
        const user = new User({ 
            username: `Heizal_${Date.now()}`, 
            email: 'heizal@example.com', 
            password: 'password123' 
        });
        await user.save();

        token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'defaultSecretKey', { expiresIn: '1h' });

        const res = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${token}`) // Set the token in the request header
            .send({
                title: 'New Post',
                content: 'This is a test post',
                author: user._id, // Use a valid object ID
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
        const post = new Post({ title: 'Test Post', content: 'Test content', author: new mongoose.Types.ObjectId() });
        await post.save();

        const res = await request(app).get(`/api/posts/${post._id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Test Post');
    });

    it('should update a blog post', async () => {
        const post = new Post({ title: 'Old Title', content: 'Old content', author: new mongoose.Types.ObjectId() });
        await post.save();

        const res = await request(app)
            .put(`/api/posts/${post._id}`)
            .set('Authorization', `Bearer ${token}`) // Set the token in the request header
            .send({
                title: 'Updated Title',
                content: 'Updated content'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Updated Title');
    });

    it('should delete a blog post', async () => {
        const post = new Post({ title: 'Delete Me', content: 'This will be deleted', author: new mongoose.Types.ObjectId() });
        await post.save();

        const res = await request(app)
            .delete(`/api/posts/${post._id}`)
            .set('Authorization', `Bearer ${token}`); // Set the token in the request header

        expect(res.statusCode).toBe(200);
    });
});

