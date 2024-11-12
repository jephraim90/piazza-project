// // /controllers/authController.js

import { auth, db } from '../config/firebaseConfig.js'; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import jwt from 'jsonwebtoken';

const JWT_SECRET = "vinland"; // Make sure to replace this with your actual secret key

// User Registration
export const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Save user info in Firestore
    await setDoc(doc(db, 'users', userId), {
      name,
      email,
      createdAt: new Date(), 
    });

    // Generate JWT token including userId and userName (name)
    const token = jwt.sign({ userId, userName: name }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(400).json({ error: error.message });
  }
};

// User Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Retrieve the user's name from Firestore (optional)
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userName = userDoc.exists() ? userDoc.data().name : null;

    // Generate JWT token including userId and userName
    const token = jwt.sign({ userId, userName }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(400).json({ error: error.message });
  }
};
