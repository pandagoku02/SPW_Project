import { Link } from "react-router-dom";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import "./header.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import CreateEmployeeForm from "../createEmployeeForm/CreateEmployeeForm";

const Header = ({ getAllUserDetails }) => {
  const { currentUser, logout } = useContext(AuthContext);

  const [showForm, setShowForm] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="header">
      <ContentWrapper>
        <div className="header-content">
          <h1>
            <Link className="brand" to="/home">
              Daily Posts
            </Link>
          </h1>
          <div className="options">
            {currentUser.role === "Admin" && (
              <button
                className="add-employee"
                onClick={() => setShowForm(true)}
              >
                Create User
              </button>
            )}
            <button className="logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </ContentWrapper>
      {showForm && (
        <CreateEmployeeForm
          setShowForm={setShowForm}
          getAllUserDetails={getAllUserDetails}
        />
      )}
    </div>
  );
};

export default Header;
