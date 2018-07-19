# Display Taxi User App
This app will display the users' location when they are logged in.
Refer to [https://secret-mesa-70576.herokuapp.com/](https://secret-mesa-70576.herokuapp.com/) for the live demo.

## Getting Started

### Installing
1. Run `git clone https://github.com/zhaoyanxie/jumpstart-project-2`. 
2. Run `npm install` to install all the required dependencies.

#### Running the App
Run `npm start` to start the app, or 
`npm run start:dev` for automatic reload of server upon changes in the files.

### Running the Tests
Run `npm run test` for running the tests a single time, or
`npm run test:watch` for running the tests every time a change is made.

### Seeding the data
If seeding of the users and their properties are required, make changes to the "seedUsers.js" file in the "utils" folder before running `npm run seed` once. 

## Routes

### The root: `/`
Displays all the users and their locations in longitude and latitude if they are available for pick-up by the taxis. Only users who has logged in will be shown here.

### The documentation: `/api-docs`
An interactive documentation to help API users on the details of the routes.

### The login: `/login`
Login page for the users and administrators. A user will be shown as available for pick-up and its location be displayed in the root route after login.

### The user signup: `/users/signup`
Signup page for the user. Requirements:
* `username` and `password` cannot be blank
* `username` must be unique 

### The user details page: `/users/{username}`
The page to for a username and/or password to be changed. Only available to the specified user and admin after log in.

### The user's location page: `/users/{username}/location`
Display a specific user's location.

### The user's logout page: `/users/{username}/logout`
A user's location will not be shown in the root route after log out.

### Assigning an admin page: `/admin/assign`
Assigning an admin - `username` and `password` required.

### Getting all the users: `/admin/users`
Displays all the users and admins.

### Deleting a specific user: `/admin/{userid}`
Deletes a user by an admin.

## Built With
* [express](https://www.npmjs.com/package/express) - The fast, unopinionated, minimalist web framework for Node.js.

* [mongoose](https://www.npmjs.com/package/mongoose) - The MongoDB object modeling designed to work in an asynchronous environment.
* [mongoose-unique-validator](https://www.npmjs.com/package/mongoose-unique-validator) - The plugin which adds pre-save validation for unique fields within a Mongoose schema

* [passsport](https://www.npmjs.com/package/passport) - The simple, unobtrusive authentication for Node.js.
* [passport-jwt](https://www.npmjs.com/package/passport-jwt) - Passport authentication using JSON Web Tokens.
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - An implementation of JSON Web Tokens.

* [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) - Making hell slightly more bearable.

