import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminPrivateComponent = () => {
  const data = localStorage.getItem("user");
  let auth = false;

  if (data) {
    const user = JSON.parse(data);
    auth = user.isadmin; // 'isadmin' indicates admin role
  }

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminPrivateComponent;
