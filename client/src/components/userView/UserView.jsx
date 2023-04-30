import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { makeRequest } from "../../utils/axios";
import "./userView.scss";
import Post from "./post/Post";
import { AuthContext } from "../../context/AuthContext";

const UserView = () => {
  const [posts, setPosts] = useState([]);
  const [file, setFile] = useState(null);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    try {
      const res = await makeRequest.get("/posts");
      console.log(res);
      setPosts(res.data.data);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message || "Something went wrong!");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    //allowed MIME type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
  
    // Check if file is an image and has a valid extension
    if (
      allowedTypes.includes(file.type) &&
      allowedExtensions.includes(file.name.split(".").pop())
    ) {
      setFile(file);
    } else {
      // selected file is not an image or has an invalid extension
      toast.error("Please select a valid image file (JPG, PNG, or GIF).");
    }
  };
  
  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data.imageUrl;
    } catch (err) {
      toast.error("Could not upload image, something went wrong!");
    }
  };

  const handleUploadFile = async () => {
    try {
      let imgUrl = "";
      if (file) {
        imgUrl = await upload();
      }
      await makeRequest.post("/posts/create", {
        image: imgUrl,
      });
      setFile(null);
      fetchAllPosts();
      toast.success("Post Created Successfully.");
    } catch (err) {
      toast.error("Something went wrong while creating a new Post!");
    }
  };

  return (
    <div className="user-view">
      <div className="upload-button-container">
        <span style={{ fontSize: "1.6em", marginRight: 40 }}>
          Welcome back: {currentUser.firstName + " " + currentUser.lastName}
        </span>
        <input
          type="file"
          id="upload"
          style={{ display: "none" }}
          onClick={(e) => (e.target.value = null)}
          onChange={handleFileChange}
        />
        <label className="upload-button" htmlFor="upload">
          Upload
        </label>
      </div>
      {/* <h1>Uploaded Posts</h1> */}
      <div className="uploaded-posts">
        {posts.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "2em", opacity: 0.3 }}>
            No posts to show.
          </p>
        ) : (
          posts?.map((post) => (
            <Post key={post._id} post={post} fetchAllPosts={fetchAllPosts} />
          ))
        )}
      </div>
      {file && (
        <div className="upload-file-wrapper">
          <div className="upload-file-container">
            {/* <div className="close">✖</div> */}
            <img className="file" alt="" src={URL.createObjectURL(file)} />
            <div className="buttons">
              <button onClick={handleUploadFile}>Upload</button>
              <button onClick={() => setFile(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserView;
