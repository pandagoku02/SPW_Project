import "./adminView.scss";
//import { useEffect, useState } from "react";
import User from "./user/User";

const AdminView = ({ getAllUserDetails, allUsers }) => {
  

  return (
    <div className="admin-view">
      {allUsers.length === 0 && <h3>No registered users!</h3>}
      {allUsers?.map((user) => (
        <User
          key={user.username}
          data={user}
          getAllUserDetails={getAllUserDetails}
        />
      ))}
    </div>
  );
};

export default AdminView;
