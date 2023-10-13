const {
    Router
} = require("express");
const mainController = require("./controllers/mainController");
const adminController = require("./controllers/adminController");
const adminMiddleware = require("./middlewares/adminMiddleware");
const userController = require("./controllers/userController");

const router = Router();

//*main

router.get('/', mainController.renderHomePage);

router.get('/tags', mainController.renderTagsPage);

router.get('/signup', mainController.renderSignupPage);
router.post('/signup', mainController.addUser);

router.get('/login', mainController.renderLoginPage);
router.post('/login', mainController.logUser);

//*user

router.get('/quiz/:id', userController.renderQuizPage);
router.post('/quiz/:id', userController.getQuizScore);
router.get('/score', userController.renderScorePage);

//*admin

router.get('/profile', adminController.renderProfilePage);
router.get('/logout', adminController.logout);
router.get('/admin', adminMiddleware, adminController.renderAdminPage);


router.get('/admin/create', adminMiddleware, adminController.renderCreatePage);
router.post('/admin/create', adminMiddleware, adminController.addLevel);

router.get('/admin/update', adminMiddleware, adminController.renderUpdatePage);
router.post('/admin/update', adminMiddleware, adminController.updateLevel);

router.get('/admin/delete', adminMiddleware, adminController.renderDeletePage);
router.post('/admin/delete', adminMiddleware, adminController.deleteLevel);


module.exports = router;