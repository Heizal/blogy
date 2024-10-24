const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Post = require('../src/models/Post');
const User= require('../src/models/User');
const Comment = require('../src/models/Comment');
const jwt = require('jsonwebtoken');

let token, post, user;

beforeEach(async () => {
    user = new User({ username: 'Heizal', email: 'heizal@example.com', password: 'password123'});
    await user.save();

    token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'defaultSecretKey', { expiresIn: '1h' })

    post = new Post({ title: 'New Post', content: 'Test post content', author: user._id });
    await post.save();
});

afterEach(async () => {
    await Comment.deleteMany({});
    await Post.deleteMany({});
    await User.deleteMany({});
});

describe('Comments Feature', () => {

    it('should add a comment to a specific post', async () => {
        const res = await request(app)
            .post(`/api/posts/${post._id}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'This is a test comment' });

        expect(res.statusCode).toBe(201);
        expect(res.body.content).toBe('This is a test comment');
        expect(res.body.author).toBe(user._id.toString());
    });

    it('should get all comments for a specific post', async () => {
        const comment = new Comment({ content: 'First comment', author: user._id, post: post._id });
        await comment.save();

        const res = await request(app).get(`/api/posts/${post._id}/comments`);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].content).toBe('First comment');
    });
});