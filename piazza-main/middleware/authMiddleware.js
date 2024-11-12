
// // /middleware/authMiddleware.js

import jwt from 'jsonwebtoken';

const JWT_SECRET = "vinland"; // Ensure this matches what you used to sign the token

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // Unauthorized if no token

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // Forbidden if token is invalid

    req.userId = decoded.userId;      // Attach userId to the request
    req.userName = decoded.userName;  // Attach userName to the request
    next();
  });
};



