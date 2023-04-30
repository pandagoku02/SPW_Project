import { useState } from "react";
import "./user.scss";
import { makeRequest } from "../../../utils/axios";
import toast from "react-hot-toast";

const User = ({ data, getAllUserDetails }) => {
  const [edit, setEdit] = useState(false);
  const [inputs, setInputs] = useState({
    firstName: data.firstName,
    lastName: data.lastName,
  });

  const handleInputsChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const cancelEdit = () => {
    setInputs({
      firstName: data.firstName,
      lastName: data.lastName,
    });
    setEdit(false);
  };

  const handleUpdateUser = async (e) => {
    try {
      e.preventDefault();
      const res = await makeRequest.patch("/users/update", {
        userId: data._id,
        ...inputs,
      });
      if (res.data.success) {
        toast.success(res.data.message || "User updated successfully");
        getAllUserDetails();
        setEdit(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.resposne.data.message || "Something went wrong!");
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await makeRequest.delete(`/users/delete?userId=${data._id}`);
      if (res.data.success) {
        toast.success(res.data.message || "User updated successfully");
        getAllUserDetails();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.resposne.data.message || "Something went wrong!");
    }
  };

  return (
    <div className="contact">
      {edit ? (
        <>
          <form className="contact-details" onSubmit={handleUpdateUser}>
            <div className="inputs">
              <input
                type="text"
                name="firstName"
                onChange={handleInputsChange}
                value={inputs.firstName}
                required
                autoFocus
              />
              <input
                type="text"
                name="lastName"
                onChange={handleInputsChange}
                value={inputs.lastName}
                required
              />
            </div>

            <div>
              <button>Update</button>
              <button onClick={cancelEdit}>Cancel</button>
            </div>
          </form>
        </>
      ) : (
        <div className="contact-details">
          <span>{inputs.firstName}</span>
          <span>{inputs.lastName}</span>
        </div>
      )}
      <div className="other-buttons">
        {!edit && (
          <>
            <button onClick={() => setEdit(true)}>Edit</button>
            <button onClick={handleDeleteUser}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
};

export default User;
