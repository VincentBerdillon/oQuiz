const { Quiz } = require('../models/index');

const userController = {

  renderQuizPage : async (req, res, next) => {
    const { id } = req.params;
    if (isNaN(id)) {
      return next();
    }
    if (!req.session.user){
      return res.status(401).render("401");
    }
    try {
      const quiz = await Quiz.findByPk(id, {
        include: [
          { association : "author"},
          {association : "tags"},
          {association : "questions",
            include: ["propositions", "level"]
          },
        ],
      });
      if (!quiz) {return next();}
      for (let i=0; i<10; i++){
        let unshuffled = quiz.questions[i].propositions;
        let shuffled = unshuffled
          .map(value => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);
        quiz.questions[i].propositions = shuffled;
      }
      res.render("quiz", { quiz});
    } catch (error) {
      console.error(error);
      res.status(500).render('500');
    }
  },

  renderScorePage : (req, res) =>{
    try{
      if(req.session.user?.role === "membre" || req.session.user?.role === "admin") {
        return res.render("score");
      }
      res.redirect("/");
    }
    catch (error) {
      console.error(error);
      res.status(500).render('500');
    }
  },

  getQuizScore : async (req, res) => {
    try{
      const{id}=req.params;
      const quiz = await Quiz.findByPk(id, {
        include: [
          {association : "author"},
          {association : "tags"},
          {association : "questions",
            include: ["propositions", "level", "good_answer"]
          },
        ],
      });
      const answers = req.body;
      const answersLength = Object.keys(answers).length;
      if(answersLength<10){
        return res.status(404).render("quiz",{
          quiz,
          error: "Vous n'avez pas répondu à toutes les questions"
        });
      }
      let score = 0;
      for (const [key, value] of Object.entries(answers)) {
        if(key === value){
          score++;
        }
      }
      res.render("score", {score, quiz});
    }
    catch (error) {
      console.error(error);
      res.status(500).render('500');
    }
  },
};

module.exports = userController;