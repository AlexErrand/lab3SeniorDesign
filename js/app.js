const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 5501; // Change as needed
const mongoUrl = 'mongodb+srv://rvalle:<password>@cluster0.mk7dyfi.mongodb.net/?retryWrites=true&w=majority'; // Change with your MongoDB connection URL

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB connection
MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;

  const db = client.db('Cluster0'); // Change with your database name

  // Login route
  app.post('/login', (req, res) => {
    const username = req.body.uname;
    const password = req.body.psw;

    // Validate the username and password (replace this with your actual validation logic)
    if (username === 'correct_username' && password === 'correct_password') {
      // Log to MongoDB
      const logEntry = { username, timestamp: new Date() };
      db.collection('login_logs').insertOne(logEntry, (err, result) => {
        if (err) throw err;
        console.log('Logged to MongoDB:', logEntry);

        // Redirect to index.html on successful login
        res.redirect('index.html');
      });
    } else { 
      // Send a failure response to the client
      res.redirect('login.html');
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});