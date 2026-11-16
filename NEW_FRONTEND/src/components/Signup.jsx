 import React, { useState } from "react";
import {useNavigate} from "react-router-dom"

function Signup() {
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [email ,setEmail] = useState("");
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted!");
        try {
            const responseOne = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email:email,
                    password:password,
                    name:username
                }),
            });
            if (responseOne.ok) {
                navigate("/login"); // 3. Call navigate() to redirect
            }
        }catch(error){
        console.error("Error submitting form",error);
    }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter your name"
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">
                Submit
            </button>
        </form>
    );
}

export default Signup;