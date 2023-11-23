const express = require("express");
const { auth } = require("express-oauth2-jwt-bearer");
const { join } = require("path");
const authConfig = require("../auth_config.json");

const app = express();

// Serve assets from the /public folder
app.use(express.static(join(__dirname, "public")));

// Create the JWT validation middleware
const checkJwt = auth({
  audience: authConfig.audience,
  issuerBaseURL: `https://${authConfig.domain}`
});

// Create an endpoint that uses the above middleware to
// protect this route from unauthorized requests
app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your access token was successfully validated!"
  });
});

// Serve the auth configuration file
app.get("/auth_config.json", (req, res) => {
  res.sendFile(join(__dirname, "auth_config.json"));
});

// Serve the login page to everything else
app.get("/*", (req, res) => {
  res.sendFile(join(__dirname, "login.html"));
});

// Error handler
app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).send({ msg: "Invalid token" });
  }

  next(err, req, res);
});

module.exports = app;