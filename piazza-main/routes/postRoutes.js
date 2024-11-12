// // /routes/postRoutes.js

import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { createPost, getPostsByTopic, getAllPosts, likePost,dislikePost, commentOnPost } from '../controllers/postController.js';

const router = express.Router();

router.post('/posts', verifyToken, createPost);
router.post('/posts', verifyToken, getAllPosts);
router.get('/posts/:topic', verifyToken, getPostsByTopic);
router.post('/posts/:postId/like', verifyToken, likePost);
router.post('/posts/:postId/dislike', verifyToken, dislikePost);
router.post('/posts/:postId/comment', verifyToken, commentOnPost);

export default router;

