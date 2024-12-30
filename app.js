const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

// Set view engine to EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files from the "public" directory (for CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Home route to display search form
app.get('/', (req, res) => {
  res.render('index');
});

// Search route to handle form submission and display authors
app.get('/search', async (req, res) => {
  const authorName = req.query.author;

  try {
    // Call Open Library API to search for authors based on the query
    const response = await axios.get(`https://openlibrary.org/search/authors.json?q=${authorName}`);

    // Check if authors are found
    const authors = response.data.numFound > 0 ? response.data.docs : [];

    // Pass authors to the template
    res.render('authors', { authors });
  } catch (error) {
    console.error(error);
    res.send('Error occurred while fetching authors');
  }
});

// Route to fetch works by the author
app.get('/works/:authorKey', async (req, res) => {
  const authorKey = req.params.authorKey;

  try {
    // Fetch works by the author using their Open Library key
    const response = await axios.get(`https://openlibrary.org/authors/${authorKey}/works.json`);
    const works = response.data.entries || [];

    // Render the works for the selected author
    res.render('works', { works });
  } catch (error) {
    console.error(error);
    res.send('Error occurred while fetching works');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
