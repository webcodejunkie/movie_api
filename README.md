# Skullify

Welcome to my application __Skullify__ 
This web application will provide users with access to information about different movies, directors, and genres. 
Users will be able to sign up, update their personal information, and create a list of their favorite movies.

## The 5 Ws For Skullify

- *Who*—These will be movie enthusiasts who enjoy reading information about different movies 
and want to engage by giving thier take on critizing movies.

- *What*—The complete server-side of Skullify, including the server, business logic,
and business layers of the application. It will consist of a well-designed REST API and
architected database built using JavaScript, Node.js, Express, and MongoDB. The REST API
will be accessed via commonly used HTTP methods like GET and POST. Similar methods
(CRUD) will be used to retrieve data from the database and store that data in a non-relational
way.

- *When*—Whenever users of Skullify are interacting with the application, the server-side of the
application will be in use, processing their requests and performing operations against the
data in the database. These users will be able to use the Skullify application whenever they like
to read information about different movies or update their user information, for instance, their
list of “Favorite Movies.”

- *Where*—The application will be hosted online. The Skullify application itself is responsive and
can therefore be used anywhere and on any device, giving all users the same experience

- *Why*—Movie enthusiasts want to be able to access information about different movies,
directors, and genres. The server-side of the myFlix application will ensure they have access
to this information, that their requests can be processed, and that all necessary data can be
stored.

## Design Criteria

### Essential Features

- Return a list of ALL movies to the user
- Return data (description, genre, director, image URL, whether it’s featured or not) about a
single movie by title to the user
- Return data about a genre (description) by name/title (e.g., “Thriller”)
- Return data about a director (bio, birth year, death year) by name
- Allow new users to register
- Allow users to update their user info (username, password, email, date of birth)
- Allow users to add a movie to their list of favorites
- Allow users to remove a movie from their list of favorites
- Allow existing users to deregister

#### Optional Features

- Allow users to see which actors star in which movies
- Allow users to view information about different actors
- Allow users to view more information about different movies, such as the release date and
the movie rating
- Allow users to create a “To Watch” list in addition to their “Favorite Movies” list

### User Stories

- As a user, I want to be able to receive information on movies, directors, and genres so that I
can learn more about movies I’ve watched or am interested in.

- As a user, I want to be able to create a profile so I can save data about my favorite movies.
