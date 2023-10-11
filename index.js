// variables d'environnement
const dotenv = require("dotenv");
dotenv.config();

// dependances
const express = require("express");
const router = require("./src/router");

const session = require("express-session");

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
