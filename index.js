const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

/**
 * this will upload this API to the cloud, specfically a connection to Heroku
 */
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// include express module with other middleware apps
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser');

const cors = require('cors');
const bcrypt = require('bcrypt');

// validation for user inputted information
const { check, validationResult } = require('express-validator');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * This Method will handle the CORS security, allowing certain origins to the API
 * @requires allowedOrigins=['']
 */
let allowedOrigins = ['https://skullify.netlify.app', 'http://localhost:1234', 'https://skullify.herokuapp.com', 'http://localhost:4200', 'https://webcodejunkie.github.io'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      let message = 'The CORS policy for this application does not allow acess from origin' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

let auth = require('./auth')(app);

const passport = require('passport'); // Authenticator Module for Token Logic
require('./passport');

app.use(morgan('common')); // Record and date as the user changes url endpoints

app.use(express.static('public')); // Route URL endpoints within the public folder

app.get('/', (req, res) => {
  res.send('Welcome to me Application!');
});

/**
 * API call to get all of the movies currently in the MongoDB.
 * (/movies) <= API call
 * @method GET-ALL-MOVIES
 * @requires passport token 
 * @returns {object} returns object with a list of movies
 */
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

/**
 * API call to get one SPECIFIC movie currently in the MongoDB.
 * (/movies/:Title) <= API call
 * @method GET-CERTAIN-MOVIES
 * @requires passport token
 * @param {string} Title - The title of the movie that is being searched
 * @returns {object} returns object with a list of movies
 */
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

/**
 * API call to post a new movie to the MongoDB.
 * (/movies) <= API call
 * @method POST-NEW-MOVIE
 * @requires passport token 
 * @param {string} Title - Title of movie
 * @param {string} Description - Description of movie
 * @param {object} Genre - Genre of the movie which is an object that contains {Title, Descrption} of that Genre
 * @param {object} Director - Director of the movie which is an object that contains {Name, Bio} of that Director
 * @param {boolean} Featured - If the movie is featured or not
 * @returns {object} returns object with a newly created movie
 */
app.post('/movies', [
  check('Title', 'Title of movie is required.').not().isEmpty(),
  check('Description', 'A Description must be present.').not().isEmpty(),
  check('Genre', 'Please include a Genre').not().isEmpty(),
  check('Director', 'Please include a Director').not().isEmpty(),
  check('Featured', 'Please include whether the tile is Featured.').isBoolean(),
], passport.authenticate('jwt', { session: false }), (req, res) => {

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  Movies.findOne({ Title: req.body.Title }) // This will check if this movie already exists, if it does, return 'Already exists' otherwise, post.
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
          .then((movies) => { res.status(201).json(movies) })
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

/**
 * API call to edit an existing movie to the MongoDB.
 * (/movies/:Title) <= API call
 * @method PUT-EDIT-MOVIE
 * @requires passport token 
 * @param {string} Title - Title of movie
 * @param {string} Description - Description of movie
 * @param {object} Genre - Genre of the movie which is an object that contains {Title, Descrption} of that Genre
 * @param {object} Director - Director of the movie which is an object that contains {Name, Bio} of that Director
 * @param {boolean} Featured - If the movie is featured or not
 * @returns {object} returns object with an edited movie
 */
app.put('/movies/:Title', [
  check('Title', 'Title of movie is required.').not().isEmpty(),
  check('Description', 'A Description must be present.').not().isEmpty(),
  check('Genre', 'Please include a Genre').not().isEmpty(),
  check('Director', 'Please include a Director').not().isEmpty(),
  check('ImagePath', 'Please inlcude a movie poster ??? Image').not().isEmpty(),
  check('Featured', 'Please include whether the tile is Featured.').isBoolean(),
], passport.authenticate('jwt', { session: false }), (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  Movies.findOneAndUpdate({ Title: req.params.Title }, {
    $set:
    {
      Title: req.body.Title,
      Description: req.body.Description,
      Genre: req.body.Genre,
      Director: req.body.Director,
      Featured: req.body.Featured,
      ImagePath: req.body.ImagePath
    }
  },
    { new: true },
    (err, updatedMovie) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedMovie);
      }
    }
  );
});

/**
 * API call to get a genre from the MongoDB.
 * (/genres/:Title) <= API call
 * @method GET-GENRES
 * @requires passport token 
 * @param {object} Genre.Title - Genre of the movie which is an object that contains {Title, Descrption} of that Genre
 * @returns {object} returns object with 
 */

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

/**
 * API call to GET a certain director from the MongoDB.
 * (/directors/:Name) <= API call
 * @method GET-DIRECTORS
 * @requires passport token 
 * @param {string} Title - Title of movie
 * @param {string} Description - Description of movie
 * @param {object} Genre - Genre of the movie which is an object that contains {Title, Descrption} of that Genre
 * @param {object} Director - Director of the movie which is an object that contains {Name, Bio} of that Director
 * @param {boolean} Featured - If the movie is featured or not
 * @returns {object} returns object of that director
 */

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

/**
 * API call to register a new user
 * (/register) <= API call
 * @method POST-REGISTER
 * @param {string} Username - The username of the User
 * @param {string} Password - The password of the User
 * @param {string} Email - The email of the User
 * @param {string} Birthday - The birthday of the User
 * @returns {object} returns an object of the created user with the given parameters
 */

app.post('/register', [
  check('Username', 'Username is required').not().isEmpty(),
  check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Password', 'Password must be more then 8 characters').isLength({ min: 8 }),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username }) // Check to see if the User entered already exists
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
          .then((user) => { res.status(201).json(user) })
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

/**
 * API call get a list of all the users
 * (/users) <= API call
 * @method GET-ALL-USERS
 * @requires passport token 
 * @returns {object} returns the list of Users residing in the DB
 */

app.get('/users', [
  check('Username', 'Username is required').not().isEmpty()
], passport.authenticate('jwt', { session: false }), (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {

    return res.status(422).json({ errors: errors.array() });
  }

  Users.find()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

/**
 * API call get a specific user
 * (/users/:Username) <= API call
 * @method GET-CERTAIN-USER
 * @requires passport token 
 * @param {string} Username - The username of the User
 * @returns {object} returns the object of a specific User
 */

app.get('/users/:Username', [
  check('Username', 'Username is required').not().isEmpty()
], passport.authenticate('jwt', { session: false }), (req, res) => {

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

/**
 * API call to edit an existing User
 * (/users/:Username) <= API call
 * @method POST-EDIT-USER
 * @requires passport token 
 * @param {string} Username - The username of the User
 * @param {string} Password - The password of the User
 * @param {string} Email - The email of the User
 * @param {string} Birthday - The birthday of the User
 * @returns {object} returns an object of edited User
 */

app.put('/users/:Username', [
  check('Username', 'Username is required').not().isEmpty(),
  check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Password', 'Password must be more then 8 characters').isLength({ min: 8 }),
  check('Email', 'Email does not appear to be valid').isEmail()
], passport.authenticate('jwt', { session: false }), (req, res) => {

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
    {
      Username: req.body.Username,
      Password: hashedPassword,
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

/**
 * API call to delete User
 * (/users/:Username) <= API call
 * @method DELETE-USER
 * @requires passport token 
 * @param {string} Username - The username of the User
 * @returns {response} - User was deleted
 */
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

/**
 * API call to POST a movie into the User's FavoritedMovies array
 * (/users/:Username/movies/:MovieID) <= API call
 * @method POST-USERFAV
 * @requires passport token 
 * @param {string} Username - The username of the User
 * @param {string} MovieID - The id of a movie
 * @returns {object} returns an object of the modified request with a movieID added to the FavoritedMovies array
 */

app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
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

/**
 * API call to DELETE a movie into the User's FavoritedMovies array
 * (/users/:Username/movies/:MovieID) <= API call
 * @method DELETE-USERFAV
 * @requires passport token 
 * @param {string} Username - The username of the User
 * @param {string} MovieID - The id of a movie
 * @returns {object} returns an object of the modified request with a movieID removed to the FavoritedMovies array
 */
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


// listen for the port enviroment
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});

// error handle the application if anything were to break
app.use((err, re, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
