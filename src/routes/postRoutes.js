const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

//Create new blog post
router.post('/posts', async (req, res) =>{
    try{
        const post = new Post(req.body);
        await post.save();
        res.status(201).send(post);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Get all blog posts
router.get('/posts', async (req, res) =>{
    try{
        const posts = await Post.find();
        res.send(posts);
    } catch (error){
        res.status(500).send(error);
    }
});

// Get a single blog post by id
router.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send();
        }
        res.send(post);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a blog post
router.put('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!post) {
            return res.status(404).send();
        }
        res.send(post);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a blog post
router.delete('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).send();
        }
        res.send(post);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;