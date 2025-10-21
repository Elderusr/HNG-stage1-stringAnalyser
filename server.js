// Import Express
const express = require('express');
const cors = require('cors');
const strings = require('./routes/strings');
const app = express();

app.use(express.json());
app.use(cors());

// Import middleware

const { default: errorHandler } = require('./middleware/error');
const { default: notFound } = require('./middleware/notFound');

app.use('/', strings);
// Error handling middleware

app.use(errorHandler)
app.use(notFound)

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
