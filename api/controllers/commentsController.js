const Comment = require("../models/Comment");

module.exports.getPostComments = async (req, res) => {
  try {
    const { userId } = req.cookies;
    if (!userId) {
      return res.status(200).json({
        success: true,
        message: "You have been logged out, please login to continue!",
      });
    }
    const { postId } = req.query;
    const postComments = await Comment.find({ post: postId })
      .sort("-createdAt")
      .populate("user", "_id username firstName lastName");
    return res.status(200).json({
      success: true,
      data: postComments,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports.createComment = async (req, res) => {
  try {
    const userId = req.cookies.userId;
    if (!userId || userId === "undefined") {
      return res.status(200).json({
        success: true,
        message: "You have been logged out, please login to continue!",
      });
    }
    await Comment.create({
      content: req.body.content,
      user: userId,
      post: req.body.postId,
    });
    return res.status(200).json({
      success: true,
      message: "Comment added successfully.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports.deleteComment = async (req, res) => {
  try {
    const { userId } = req.cookies;
    if (!userId) {
      return res.status(200).json({
        success: true,
        message: "You have been logged out, please login to continue!",
      });
    }
    const { commentId } = req.query;
    const comment = await Comment.findById(commentId);
    if (comment.user != userId) {
      return res.status(200).json({
        success: true,
        message: "You are not authorized to delete this comment!",
      });
    }
    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};
