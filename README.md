# TechDegreeProject-11

This project utilizes Node.js, Express, MongoDB and Mongoose to create a REST API that enables users to create, edit and review courses in a database. This project introduces authentication through Basic Auth headers when accessing the REST API routes, server-side validation, and includes unit testing on routes using Mocha and Chai.

### What does it do?

This REST API allows users to access a course review database through API requests that can either be accessed through another app or through http request tools like Postman. This database allows the user to create users, and with those users' credentials create courses and reviews.

### Additional Project Info for Grading

#### Prerequisites

This REST API project does not include a user interface in which to populate forms for sending POST and PUT requests, so it will be necessary to use a tool like Postman to manipulate http requests when consuming this project. You can find Postman [here.](https://www.getpostman.com/)

You will also need mongoDB installed on your computer. The treehouse installation guides for [Windows](http://treehouse.github.io/installation-guides/windows/mongo-windows.html) and for [Mac](http://treehouse.github.io/installation-guides/mac/mongo-mac.html) can be found at these links.

#### Installing

Once you have downloaded this project, navigate to the folder in which the project is stored in your command-line or terminal and run:

```
npm install
```

This will install all the dependencies for the project.

You will need to make sure that the mongoDB daemon is running in order to connect to your database with this project. Navigate to the folder in which the MongoDB executables are and run

```
mongod.exe
```

This will start up the MongoDB daemon.

At this point, you can seed data into your database using the provided seed-data files, however the users included will not have hashed passwords like any newly added users would have, so sending any request that requires authentication will not succeed using the seeded user's data. In order to seed your database, move the seed-data files into the folder containing your MongoDB executables and run

```
mongoimport --db course-api --collection courses --type=json --jsonArray --file courses.json
mongoimport --db course-api --collection users --type=json --jsonArray --file users.json
mongoimport --db course-api --collection reviews --type=json --jsonArray --file reviews.json
```

This will seed your database.

You can also preload Postman to show predefined routes by importing the CourseAPI.postman_collection.json file into Postman using the Postman dashboard.

Once everything is setup, you can run the following from the project folder

```
npm start
```

#### Routes

This REST API only has seven routes. They are listed here for convenience.

- GET /api/v1/courses
- POST /api/v1/courses
- GET /api/v1/courses/\<id\>
- GET /api/v1/users
- POST /api/v1/users
- PUT /api/v1/courses/\<id\>
- POST /api/v1/courses/\<id\>/reviews

#### Testing

Running

```
npm test
```

will run two unit tests for this project. The first will test a GET request to the /api/v1/users route with valid credentials and ensure that the returned data is valid with a status code of 200. The second test will run the same GET request with no credentials and ensure that the returned status code is 401.
