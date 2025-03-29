import {Routes, Route, Navigate} from "react-router-dom";
import {Home, Login, SignUp} from "../pages"
import React from 'react'


const AllRoutes = () => {
  return (
    <div>
      <Routes>
      <Route path = "/" exact element={<Root/>}/>
        <Route path = "/dashboard" exact element={<Home/>}/>
        <Route path = "/login" exact element={<Login/>}/>
        <Route path = "/signup" exact element={<SignUp/>}/>
      </Routes>
    </div>
  )
}

// initial redirect(root component)
const Root = () => {
  const isAuthenticated = !localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to="/dashboard"/>

  ): (
    <Navigate to="/login"/>
  )
};


export default AllRoutes
