const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "Hi " + username + ", " + "You are successfully registered."});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
          resolve(books)
        },2000)})
     myPromise.then((data) => {
           console.log(data)
           return res.status(200).send(JSON.stringify(data));
          })
          .catch((err) => {
            return res.status(404).send({message : "Resource not found"})
          });
        //   return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn

  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(books[isbn])
    },2000)})
 myPromise.then((data) => {
       console.log(data)
       return res.status(200).json(data);
      })
      .catch((err) => {
        return res.status(404).send({message : "Resource not found"})
      });
//   return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
 const author = req.params.author
 const booksArray =  Object.values(books)
 const authorBooks = booksArray.filter(book => book.author === author)

 let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(authorBooks)
    },2000)})
 myPromise.then((data) => {
       console.log(data)
       return res.status(200).json(data);
      })
      .catch((err) => {
        return res.status(404).send({message : "Resource not found"})
      });
//   return res.status(200).json(authorBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const bookTitle = req.params.title
  const booksByTitle =  Object.values(books).filter(book => book.title === bookTitle)
  
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(booksByTitle)
    },2000)})
 myPromise.then((data) => {
       console.log(data)
       return res.status(200).json(data);
      })
      .catch((err) => {
        return res.status(404).send({message : "Resource not found"})
      });
//   return res.status(200).json(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const reviews = books[isbn].reviews
//   console.log(reviews)
  return res.status(200).json(reviews);
});

module.exports.general = public_users;
