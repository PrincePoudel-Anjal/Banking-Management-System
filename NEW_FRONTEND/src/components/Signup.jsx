import React, { useState } from "react";

function Signup() {
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted!");
    };
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [email ,setEmail] = useState("");
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
                Sign Up
            </button>
        </form>
    );
    if(username && password && email){
        
    }
}

export default Signup;