const express = require("express");
const router = express.Router();
const usersController = require("../../../controllers/usersController");

router.post("/create-user", usersController.createUser);
router.post("/create-session", usersController.createSession,);
router.get("/user-details", usersController.getUserDetails);
router.get("/get-all", usersController.getAllUsers);
router.patch("/update", usersController.updateUser);
router.delete("/delete", usersController.deleteUser);

module.exports = router;
