const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

//Add a comment to a specfic post
router.post('/posts/:id/comments', auth, async(req, res) =>{
    try{
        const { content } = req.body;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post){
            return res.status(404).json({ message: 'Post not found'})
        }

        const comment = new Comment({
            content,
            author: req.user._id,
            post: postId
        });

        await comment.save();
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong'});
    }
});

//Get all comments for a specific post
router.get('/posts/:id/comments', async (req, res) =>{
    try{
        const postId = req.params.id;
        const comments = await Comment.find({ posts: postId}).populate('author', 'username')

        if(!comments.length){
            return res.status(404).json({message: 'No comments found'})
        }

        res.status(200).json(comments);
    } catch(err){
        res.status(500).json({ error: 'Something went wrong'})
    }
});

module.exports = router;