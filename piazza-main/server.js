// /server.js

import app from './app.js';
import cors from 'cors';

const PORT = process.env.PORT || 3000;

// Configure CORS 
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
