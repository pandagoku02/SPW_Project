import { useContext, useEffect, useState } from "react";
import "./post.scss";
import toast from "react-hot-toast";
import { makeRequest } from "../../../utils/axios";
import Comments from "../../comments/Comments";
import { AuthContext } from "../../../context/AuthContext";
import { FaTrashAlt } from "react-icons/fa";

const Post = ({ post, fetchAllPosts }) => {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    fetchPostComments();
  }, []);

  const fetchPostComments = async () => {
    try {
      const res = await makeRequest.get(`/comments?postId=${post._id}`);
      if (res.data.success) {
        setComments(res.data.data);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message || "Something went wrong.");
    }
  };

  const handleAddComment = async () => {
    try {
      const res = await makeRequest.post("/comments/create", {
        content: commentInput,
        postId: post._id,
      });
      if (res.data.success) {
        toast.success(res.data.message || "Comment added successfully.");
        fetchPostComments();
        setCommentInput("");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message || "Something went wrong!");
    }
  };

  const handleDeletePost = async () => {
    try {
      console.log("DELETEPOST");
      const res = await makeRequest.delete(`/posts/delete?postId=${post._id}`);
      console.log(res);
      if (res.data.success) {
        toast.success(res.data.message || "Post deleted successfully.");
        fetchAllPosts();
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message || "Something went wrong!");
    }
  };

  return (
    <div className="post-container">
      <img src={`./uploads/${post.image}`} alt="" />
      {post.user._id === currentUser._id && (
        <FaTrashAlt className="delete-button" onClick={handleDeletePost} />
      )}
      <div className="comments-container">
        <div className="add-comment">
          <input
            type="text"
            placeholder="Type here..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <button
            onClick={handleAddComment}
            disabled={commentInput.length === 0}
          >
            Add
          </button>
        </div>
        <div className="comments">
          {comments.length === 0 ? (
            <p style={{ textAlign: "center" }}>No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <Comments
                key={comment._id}
                comment={comment}
                currentUser={currentUser}
                postId={post._id}
                fetchPostComments={fetchPostComments}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
