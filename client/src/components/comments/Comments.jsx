import { makeRequest } from "../../utils/axios";
import "./comments.scss";
import moment from "moment";
import toast from "react-hot-toast";

const Comments = ({ comment, currentUser, postId, fetchPostComments }) => {
  const deleteComment = async () => {
    try {
      const res = await makeRequest.delete(
        `/comments/delete?commentId=${comment._id}`
      );
      if (res.data.success) {
        toast.success(res.data.message || "Comment deleted successfully.");
        fetchPostComments();
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message || "Something went wrong!");
    }
  };

  return (
    <div className="comment">
      <div className="profile-image">
        <div className="image">
          <p>
            {comment.user.firstName.charAt(0) + comment.user.lastName.charAt(0)}
          </p>
        </div>
      </div>
      <div className="comment-content">
        <div className="name">
          {comment.user.firstName + " " + comment.user.lastName}
        </div>
        <div className="details">
          {currentUser._id === comment.user._id && (
            <p className="delete" onClick={deleteComment}>
              delete
            </p>
          )}
          <p className="time">{moment(comment.createdAt).fromNow()}</p>
        </div>
        <div className="comment-content-text">{comment.content}</div>
      </div>
    </div>
  );
};

export default Comments;
