require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const http = require('http'); 
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { graphqlHTTP } = require('express-graphql');
const { schema, root } = require('./graphql/schema');
const authRoutes = require('./routes/authRoutes');

const { requireAuth } = require('./middleware/authMiddleware');

// Create express app
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(cors()); // Enable CORS

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000, // Increase the connection timeout
    socketTimeoutMS: 30000, // Increase the socket timeout
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB:', err));

// Routes
app.use('/api/authMiddleware', authRoutes); // Authentication routes

// GraphQL endpoint
app.use(
    '/graphql',
    // Require authentication for GraphQL endpoint
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true, // Enable GraphiQL for testing
    })
);
app.use("/graphql", requireAuth)

// Clear all documents from all collections
app.get('/clear-database', async (req, res) => {
    try {
      await mongoose.connection.db.dropDatabase();
      console.log('Database cleared successfully.')
      res.status(200).send('Database cleared successfully.');
    } catch (error) {
      console.error('Error clearing database:', error);
      res.status(500).send('Error clearing database.');
    }
  });

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
