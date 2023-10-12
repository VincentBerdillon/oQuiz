// variables d'environnement
const dotenv = require("dotenv");
dotenv.config();

// dependances
const express = require("express");
const router = require("./src/router");
const session = require("express-session");
const cors = require("cors");
const bodySanitizer = require("./src/middlewares/sanitizerMiddelware");
const rateLimit = require('express-rate-limit');

// application express
const app = express();

// moteur de rendu
app.set("view engine", "ejs");
app.set("views", "./src/views");

// dossier public
app.use(express.static("public"));

// bodyparser pour les requêtes POST

app.use(express.urlencoded({ extended: true }));

// session utilisateur
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { path: '/', httpOnly: true, secure: false, maxAge: null }
}));

// Sécurité
app.use(cors("*"));
app.use(bodySanitizer);

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
  message: "vous avez atteint le nombre de requêtes authorisées"
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

const userMiddleware = require("./src/middlewares/userMiddleware");
app.use(userMiddleware);

//Router

app.use(router);

app.use((req, res) => {
  res.status(404).render("404");
});

// Écoute du port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
