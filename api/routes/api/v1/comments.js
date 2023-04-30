const express = require("express");
const router = express.Router();
const commentsController = require("../../../controllers/commentsController");

router.get("/", commentsController.getPostComments);
router.post("/create", commentsController.createComment);
router.delete("/delete", commentsController.deleteComment);

module.exports = router;
