
import { db } from '../config/firebaseConfig.js'; 
import { collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs, arrayUnion } from 'firebase/firestore';

const VALID_TOPICS = ["Politics", "Health", "Sport", "Tech"];

// Create a new post with limited categories and expiration handling
export const createPost = async (req, res) => {
  const { title, topic, body, expirationTime } = req.body;

  if (!req.userId) return res.status(400).json({ error: "User ID is required" });
  if (!req.userName) return res.status(400).json({ error: "User Name is required" }); // Handle missing userName
  if (!VALID_TOPICS.includes(topic)) return res.status(400).json({ error: "Invalid topic category" });

  const postId = doc(collection(db, 'posts')).id;
  const postData = {
    postId,
    userId: req.userId,
    userName: req.userName,   // Ensure this is set
    title,
    topic,
    body,
    expirationTime: Date.now() + expirationTime * 60000,
    status: "Live",
    likes: 0,
    dislikes: 0,
    comments: [],
    createdAt: Date.now(),
  };

  try {
    await setDoc(doc(db, 'posts', postId), postData);
    res.status(201).json({ message: "Post created", postId });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Get posts by topic
export const getPostsByTopic = async (req, res) => {
  const { topic } = req.params;
  const q = query(collection(db, 'posts'), where('topic', '==', topic));
  const querySnapshot = await getDocs(q);
  const posts = [];

  querySnapshot.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data() });
  });

  res.json(posts);
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const postsCollection = collection(db, 'posts');
    const querySnapshot = await getDocs(postsCollection);
    const posts = [];

    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to retrieve posts" });
  }
};

// Like a post
export const likePost = async (req, res) => {
  const { postId } = req.params;
  const postRef = doc(db, 'posts', postId);
  const postSnapshot = await getDoc(postRef);

  if (!postSnapshot.exists() || postSnapshot.data().status === "Expired") {
    return res.status(400).send("Cannot interact with expired post");
  }

    // Check if the user is trying to like their own post
    const postData = postSnapshot.data();
    if (postData.userId === req.userId) {
      return res.status(400).json({ error: "You cannot like your own post" });
    }

  const update = { likes: postSnapshot.data().likes + 1 };
  await updateDoc(postRef, update);
  res.json({ message: "Post liked by", userName: req.userName });
};

// Dislike a post
export const dislikePost = async (req, res) => {
  const { postId } = req.params;
  const postRef = doc(db, 'posts', postId);
  const postSnapshot = await getDoc(postRef);

  if (!postSnapshot.exists() || postSnapshot.data().status === "Expired") {
    return res.status(400).send("Cannot interact with expired post");
  }

    // Check if the user is trying to dislike their own post
    const postData = postSnapshot.data();
    if (postData.userId === req.userId) {
      return res.status(400).json({ error: "You cannot dislike your own post" });
    }

  await updateDoc(postRef, { dislikes: postSnapshot.data().dislikes + 1 });
  res.json({ message: "Post disliked" });
};

// Comment on a post
export const commentOnPost = async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;
  const postRef = doc(db, 'posts', postId);
  const postSnapshot = await getDoc(postRef);

  if (!postSnapshot.exists() || postSnapshot.data().status === "Expired") {
    return res.status(400).send("Cannot interact with expired post");
  }

   // Check if the user is trying to comment their own post
   const postData = postSnapshot.data();
   if (postData.userId === req.userId) {
     return res.status(400).json({ error: "You cannot comment your own post" });
   }

  const commentData = {
    userId: req.userId,
    userName: req.userName,
    comment,
    createdAt: Date.now(),
  };

  await updateDoc(postRef, { comments: arrayUnion(commentData) });
  res.json({ message: "Comment added by", userName: req.userName });
};
