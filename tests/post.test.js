const request = require('supertest');
const app = require('../src/app');
const Post = require ('../src/models/Post');


describe('CRUD Operations for Blog Posts', () =>{
    it('should create a new blog post', async () =>{
        const res = await request(app)
            .post('/api/posts')
            .send({
                title: 'New Post',
                content: 'This is test post',
                author: 'Heizal'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe('New Post')
    });

    it('should get all blog posts', async()=>{
        const res = await request(app).get('/api/posts');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should get a blog post by id', async()=>{
        const post = new Post({title: 'Test Post', content: 'Test content', author: 'Heizal'});
        await post.save();

        const res = await request(app).get(`/api/posts/${post._id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Test Post');
    })

    it('should update a blog post', async () => {
        const post = new Post({ title: 'Old Title', content: 'Old content', author: 'Hazel' });
        await post.save();

        const res = await request(app)
            .put(`/api/posts/${post._id}`)
            .send({
                title: 'Updated Title',
                content: 'Updated content'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Updated Title');
    });

    it('should delete a blog post', async () => {
        const post = new Post({ title: 'Delete Me', content: 'This will be deleted', author: 'Hazel' });
        await post.save();

        const res = await request(app).delete(`/api/posts/${post._id}`);
        expect(res.statusCode).toBe(200);
    });
});