
const { db } = require('../config/firebaseConfig');

// Create a new post
const createPost = async (post) => {
  const postRef = await db.collection('posts').add(post);
  return { id: postRef.id, ...post };
};

// Get posts by topic
const getPostsByTopic = async (topic) => {
  const snapshot = await db.collection('posts').where('topic', '==', topic).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get post by ID
const getPostById = async (postId) => {
  const doc = await db.collection('posts').doc(postId).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

// Update post interaction with expiry check
const updatePostInteraction = async (postId, update) => {
  const postRef = db.collection('posts').doc(postId);
  const postDoc = await postRef.get();

  if (!postDoc.exists) return null;

  const post = postDoc.data();
  if (post.status === "Expired") return { error: "Cannot interact with expired post" };

  await postRef.update(update);
  return { id: postId, ...update };
};

// Get the most active post
const getMostActivePost = async (topic) => {
  const snapshot = await db.collection('posts')
    .where('topic', '==', topic)
    .orderBy('likes', 'desc')
    .limit(1)
    .get();
  return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

module.exports = { createPost, getPostsByTopic, getPostById, updatePostInteraction, getMostActivePost };
