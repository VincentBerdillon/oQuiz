const {Level} = require('../models/index');

const adminController = {

  renderAdminPage : (req, res) =>{
    try{
      res.render("admin");
    }
    catch (error) {
      console.error(error);
      res.status(500).render('500');
    }
  },

  renderProfilePage: (req, res) =>{
    if(!req.session.user){
      return res.redirect('/login');
    }
    res.render('profile');
  },

  logout: (req, res) => {
    req.session.user = null;
    res.redirect('/');
  },

  renderCreatePage : async (_, res) =>{
    try{
      const levels = await Level.findAll();
      res.render("create", {levels});
    }
    catch (error) {
      console.error(error);
      res.status(500).render('500');
    }
  },

  addLevel : async (req, res) =>{
    try{
      const levelName = req.body.level;
      if(!levelName){
        return res.status(404).render("create",{
          error : "le champ ne peut être vide"
        });
      }
      const levelFound = await Level.findOne({
        where : {name : levelName}
      });
      if(levelFound){
        return res.status(404).render("create",{
          error : "ce nom de level existe dejà"
        });
      }
      await Level.create({
        name: levelName
      });
      const levels = await Level.findAll();
      res.render("create", {levels, validate : `level ${levelName} ajouté avec succès`});
    }
    catch (error) {
      console.error(error);
      res.status(500).render('500');
    }
  },

  renderUpdatePage : async (req, res, next) =>{
    try{
      const allLevels = await Level.findAll();
      if(!allLevels){return next();}
      res.render("update", {allLevels});
    }
    catch (error) {
      console.error(error);
      res.status(500).render('500');
    }
  },

  updateLevel : async (req, res) =>{
    try{
      const levelId = Number(req.body.levelId);
      const levelName = req.body.levelName;
      const allLevels = await Level.findAll();
      const levelFound = await Level.findOne({
        where : {name : levelName}
      });
      if(levelFound){
        res.render("update", {allLevels, error : `level ${levelName} existe déjà`});
      }
      await Level.update(
        {name : levelName},
        {where : {id : levelId}}
      );
      res.render("update", {allLevels, validate : `level ${levelName} mis à jour avec succès`});
    }
    catch (error) {
      console.error(error);
      res.status(500).render('500');
    }
  },

  renderDeletePage : async (req, res) =>{
    try{
      const levels = await Level.findAll();
      res.render("delete", {levels});
    }
    catch (error) {
      console.error(error);
      res.status(500).render('500');
    }
  },

  deleteLevel : async (req, res, next) =>{
    try {
      const levelId = req.body.level_id;
      const levels = await Level.findAll();
      if(confirm("êtes vous sur de vouloir supprimer ce level")){
        const levelToDelete = await Level.findByPk(levelId);
        if(!levelToDelete){return next();}
        await levelToDelete.destroy();
        res.render("delete", {levels, validate : `level ${levelToDelete.name} supprimé avec succès`});
      } else {
        res.render("delete", {levels});
      }
    }
    catch (error) {
      console.error(error);
      res.status(500).render('500');
    }
  },
};

module.exports = adminController;