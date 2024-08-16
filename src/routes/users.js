const router = require('express').Router();
const verifiedAdmin = require('../middleware/verifiedAdmin');
const userController = require('../controllers/userController');

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);
router.put("/update/:id", userController.updateUser);
router.put("/update-role/:id", userController.updateUserRole);
router.delete("/delete/:id", userController.deleteUser);

module.exports = router;