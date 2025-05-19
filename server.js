const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;

// Serve static files
app.use(express.static(__dirname));

// Routes for specific pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/questions', (req, res) => {
  res.sendFile(path.join(__dirname, 'questions.html'));
});

app.get('/analyzing', (req, res) => {
  res.sendFile(path.join(__dirname, 'analyzing.html'));
});

app.get('/result', (req, res) => {
  res.sendFile(path.join(__dirname, 'result.html'));
});

// Handle all other routes for 404
app.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 