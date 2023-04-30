import "./home.scss";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/header/Header";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import AdminView from "../../components/adminView/AdminView";
import UserView from "../../components/userView/UserView";
import { makeRequest } from "../../utils/axios";

const Home = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    getAllUserDetails();
  }, []);

  const getAllUserDetails = async () => {
    const res = await makeRequest.get("/users/get-all");
    setAllUsers(res.data.data);
  };

  return (
    <div className="home">
      <Header getAllUserDetails={getAllUserDetails} />
      <ContentWrapper>
        <div className="home-content">
          {currentUser.role === "Admin" ? (
            <AdminView
              getAllUserDetails={getAllUserDetails}
              allUsers={allUsers}
            />
          ) : (
            <UserView />
          )}
        </div>
      </ContentWrapper>
    </div>
  );
};

export default Home;
