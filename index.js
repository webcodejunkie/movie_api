const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true});

// include express module with other middleware apps
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser');

const cors = require('cors');
const bcrypt = require('bcrypt');

// validation for user inputted information
const { check, validationResult } = require('express-validator');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

// record and date as the user changes url endpoints
app.use(morgan('common'));

// route url endpoints within the public folder
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to me Application!');
});

// Get a list of movies from the database
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error:' + err);
  });
});

// Get a certin movie by Title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// If movie doesn't already exist, create a movie with the following
app.post('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.body.Title })
  .then((movies) => {
    if (movies) {
      return res.status(400).send(req.body.Title + 'already exists');
    } else {
      Movies
      .create({
        Title: req.body.Title,
        Description: req.body.Description,
        Genre: req.body.Genre,
        Director: req.body.Director,
        ImagePath: req.body.ImagePath,
        Featured: req.body.Featured
      })
      .then((movies) => {res.status(201).json(movies) })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error:' + err);
      });
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error:' + err);
  });
});

// Get a certin movie with Genre
app.get('/genres/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ 'Genre.Title': req.params.Title })
  .then((genre) => {
    res.json(genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Get a certin movie with certain Director
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ 'Director.Name': req.params.Name })
  .then((director) => {
    res.json(director)
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Create a user but only if it doesn't exist

<<<<<<< HEAD
app.post('/register', [
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {

  let errors = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

=======
app.post('/register', (req, res) => {
>>>>>>> d34461d54749184b3dd1f87a529e398da53ee401
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + ' already exists');
    } else {
      Users
      .create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user) => {res.status(201).json(user) })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error:' + err);
      });
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error:' + err);
  });
});

// Get all Users

app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

// Get a user by username

app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

// Update a specific user

app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: hashPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  }
 );
});

// Delete A User
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.Username + ' was not found');
    } else {
      res.status(200).send(req.params.Username + ' was deleted.')
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Add a move to a user's list of horror movie favorites

app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({  Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  }
 );
});

// Remove a move to a user's list of horror movie favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieID },
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  }
 );
});

// error handle the application if anything were to break
app.use((err, re, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
  res.send(err.stack);
});


// listen for the port enviroment
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', ()  => {
  console.log('Listening on Port ' + port);
});
