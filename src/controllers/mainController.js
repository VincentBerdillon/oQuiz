const bcrypt = require('bcrypt');
const validator = require("email-validator");
const {
  Quiz,
  Tag,
  User
} = require('../models/index');

const mainController = {

  renderHomePage: async (_, res, next) => {
    try {
      const allQuizzes = await Quiz.findAll({
        order: [
          ['title', 'ASC']
        ],
        include: ['author', 'tags'],
      });
      if (!allQuizzes) {
        return next();
      }
      res.render("home", {
        allQuizzes
      });
    } catch (error) {
      console.error(error);
      res.status(500).render('500');
    }
  },

  renderTagsPage: async (_, res) => {
    try {
      const tagsQuiz = await Tag.findAll({
        include: ['quizzes'],
      });
      res.render("tags", {
        tagsQuiz
      });
    } catch (error) {
      console.error(error);
      res.status(500).render('500');
    }
  },

  renderSignupPage: async (_, res) => {
    try {
      res.render("signup");
    } catch (error) {
      console.error(error);
      res.status(500).render('500');
    }
  },

  addUser: async (req, res) => {

    const {
      firstname,
      lastname,
      email,
      password,
      confirmation
    } = req.body;

    try {
      if (!firstname || !lastname || !email || !password || !confirmation) {
        return res.status(404).render("signup", {
          error: "Toutes les informations ne sont pas remplies"
        });
      }
      if (!validator.validate(email)) {
        return res.status(404).render("signup", {
          error: "Cet e-mail n'est pas valide"
        });
      }
      const userFound = await User.findOne({
        where: {
          email: email
        }
      });
      if (userFound) {
        return res.status(404).render("signup", {
          error: "cet email est déjà utilisé"
        });
      }

      if (password != confirmation) {
        return res.status(404).render("signup", {
          error: "mot de passe et confirmation ne correspondent pas"
        });
      }

      const passwordPattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/;
      const passwordCheck = password.match(passwordPattern);
      if (!passwordCheck) {
        return res.status(404).render("signup", {
          error: "le mot de passe ne correspond pas au format demandé"
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      await User.create({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashedPassword,
        role: 'membre'
      });
      return res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).render('500');
    }
  },

  renderLoginPage: async (req, res) => {
    try {
      res.render("login");
    } catch (error) {
      console.error(error);
      res.status(500).render('500');
    }
  },

  logUser: async (req, res) => {
    const {
      email,
      password
    } = req.body;
    try {
      const userConnect = await User.findOne({
        where: {
          email: email,
        }
      });
      const match = bcrypt.compareSync(password, userConnect.password);
      if (!userConnect || !match) {
        return res.status(404).render("login", {
          error: "email ou mot de passe incorrect"
        });
      }
      userConnect.password = null;
      req.session.user = userConnect;
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).render('500');
    }
  },
};

module.exports = mainController;