import {Routes, Route} from "react-router-dom";
import {Home, Login, SignUp} from "../pages"
import React from 'react'


const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path = "/dashboard" exact element={<Home/>}/>
        <Route path = "/login" exact element={<Login/>}/>
        <Route path = "/signup" exact element={<SignUp/>}/>
      </Routes>
    </div>
  )
}

export default AllRoutes
