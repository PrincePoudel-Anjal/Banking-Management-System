import React, { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
// import Dashboard from "./components/Dashboard";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router";

function App() {
    const [user, setUser] = useState(null);

    // Called after successful login
    const handleLogin = (data) => {
        setUser(data.user);
    };
    const handleSignup = async (data) =>{
        try{
            const response = await fetch("http://localhost:3000/api/auth/register",
                {
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify(data),
                },
            );    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            console.log("Success:", result);
            return result;         
        } catch(err){
            console.log("Couldn't Signup");
        }
    }
    return (
        <BrowserRouter>
            <Routes>
                <Route path = "/login" element = {<Login></Login>}></Route>
                <Route path = "/signup" element = {<Signup></Signup>}></Route>
                {/* <Route path = "/dashboard" element = {<Dashboard></Dashboard>}></Route> */}
            </Routes>

        </BrowserRouter>
    );
}


export default App;
