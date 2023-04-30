import { useState } from "react";
import "./createEmployeeForm.scss";
import toast from "react-hot-toast";
import { makeRequest } from "../../utils/axios";

const CreateEmployeeForm = ({ setShowForm, getAllUserDetails }) => {
  const [inputs, setInputs] = useState({
    username: "",
    firstName: "",
    lastName: "",
  });

  const handleInputChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await makeRequest.post("/users/create-user", { ...inputs });
      console.log(res);
      if (res.data.success) {
        toast.success("User created successfully.");
        setInputs({
          username: "",
          firstName: "",
          lastName: "",
        });
        setShowForm(false);
        getAllUserDetails();
      } else {
        toast.error(res.data.message || "Something went wrong!");
      }
      //   getAllEmployees()
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message || "Something went wrong!");
    }
  };

  return (
    <div className="create-employee-container">
      <div className="create-employee">
        <h1>Create User</h1>
        <span id="close" onClick={() => setShowForm(false)}>
          ✖
        </span>
        <form onSubmit={handleFormSubmit}>
          <p className="input-detail">Username:</p>
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            required
            onChange={handleInputChange}
            value={inputs.username}
          />
          <p className="input-detail">First Name:</p>
          <input
            type="text"
            name="firstName"
            placeholder="User First Name"
            required
            onChange={handleInputChange}
            value={inputs.firstName}
          />
          <p className="input-detail">Last Name:</p>
          <input
            type="text"
            name="lastName"
            placeholder="User Last Name"
            required
            onChange={handleInputChange}
            value={inputs.lastName}
          />

          <button className="button">Create</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployeeForm;
