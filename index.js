// include express module
const express = require('express'),
  morgan = require('morgan');

const app = express();

// List of Genres

let genres = [
  {
    'genre': 'slasher',
    'movies': []
  },
  {
    'genre': 'scifi',
    'movies': []
  },
  {
    'genre': 'thriller',
    'movies': []
  },
  {
    'genre': 'psychological',
    'movies': []
  }
];

// List of movies
let movies = [
  {
    title: 'THE EXORCIST (1973)',
    author: 'William Peter Blatty'
  },
  {
    title: 'HEREDITARY (2018)',
    author: 'Ari Aster'
  },
  {
    title: 'THE CONJURING (2013)',
    author: 'Chad Hayes / Carey W. Hayes'
  },
  {
    title: 'THE SHINING (1980)',
    author: 'Stephen King'
  },
  {
    title: 'THE TEXAS CHAINSAW MASSACRE (1974)',
    author: 'Tobe Hooper / Kim Henkel'
  },
  {
    title: 'THE RING (2002)',
    author: 'Koji Suzuki'
  },
  {
    title: 'HALLOWEEN (1978)',
    author: 'John Carpenter / Debra Hill'
  },
  {
    title: 'SINISTER (2012)',
    author: 'Scott Derrickson / C. Robert Cargill'
  },
  {
    title: 'INSIDIOUS (2010)',
    author: 'Leigh Whannell'
  },
  {
    title: 'IT (2017)',
    author: 'Stephen King'
  },
];

// record and date as the user changes url endpoints
app.use(morgan('common'));

// route url endpoints within the public folder
app.use(express.static('public'));

// request a json formatted of the top ten movies array of objects
app.get('/movies', (req, res) => {
  res.json(movies);
});

app.post('/movies', (req, res) => {
  res.send('Add a movie to the array');
});

app.get('/movies/title', (req, res) => {
  res.send('Movie information will go here.');
});

app.get('/movies/genres', (req, res) => {
  res.json(genres);
});

app.get('/movies/title/director', (req, res) => {
  res.send('Information about a specific director will go here.');
});

app.post('/register', (req, res) => {
  res.send('Successfull connection to create an account with Skullify');
});

app.post('/login', (req, res) => {
  res.send('Login successfull!');
});

app.put('/user/changeinfo', (req, res) => {
  res.send('You have changed your info.');
});

app.post('/user/movies/title/add', (req, res) => {
  res.send('Movie added to favorites');
});

app.delete('/user/movies/title/remove', (req, res) => {
  res.send('Movie removed from favorites');
});

app.delete('/user/unregister', (req, res) => {
  res.send('This is where you can unregister your Skullify account');
});

// error handle the application if anything were to break
app.use((err, re, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for port 8080
app.listen(8080, ()  => {
  console.log('Web application running port 8080');
});
