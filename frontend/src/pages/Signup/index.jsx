import React, { useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Signup({ email, setEmail }) {
    const [name,setName] = useState('');
    const [password, setPassword] = useState('');
    const [nameError,setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    const validate = (email, password) => {
        let valid = true;
        const emailRegex = /^[^\s@]+@pepul\.com$/;
        if(name === ""){
            setNameError("Name is Required");
            valid = false;
        } else if (name.length < 3){
            setNameError("Name Must Contain At Least 3 Characters")
            valid = false;
        } else{
            setNameError("")
        }
        if (email === "") {
            setEmailError("Email is required");
            valid = false;
        } else if (!emailRegex.test(email)) {
            setEmailError("Email must have @Pepul.com");
            valid = false;
        } else {
            setEmailError("");
        }
        if (password === "") {
            setPasswordError("Password Has Required");
            valid = false;
        } else if (password.length < 6) {
            setPasswordError("Password Must Have At Least 6 Characters");
            valid = false;
        } else {
            setPasswordError("")
        }
        console.log(emailError);
        console.log(passwordError);
        return valid;
    }

    const handleSignUp = async (e) => {
        try {
            e.preventDefault();
            const error = validate(email, password);
            if (error) {
                const response = await axios.post('http://localhost:3000/signup', {name, email, password });
                if (response.data) {
                    const email = response.data.user.email;
                    const userID = response.data.user.userID;
                    const token = response.data.token;
                    localStorage.setItem('email',email);
                    localStorage.setItem('userID',userID);
                    localStorage.setItem('accesstoken', token);
                    toast.success("Signup Successfully Completed", { position: 'top-center', theme: 'light' });
                    navigate(`/dashboard`);
                }
            }
        } catch (error) {
            if (error.response) {
                setEmailError(error.response.data.message);
            }
        }
    }

    return (
        <div className="bg-gradient-to-r from-gray-900 via-zinc-400 to-zinc-700 w-[100%] h-[1224px] after:content-[''] after:min-h-[500px] after:min-w-[600px] after:-top-[100px] after:absolute after:-left-[300px] after:bg-gradient-to-l after:from-yellow-100 after:via-yellow-200 after:to-gray-500  after:rotate-[140deg] before:content-[''] before:min-h-[500px] before:min-w-[600px] before:bottom-[100px] before:absolute before:-right-[400px] before:bg-gradient-to-l before:from-yellow-100 before:via-yellow-200 before:to-gray-500  before:rotate-[120deg]">
            <Helmet>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Shops Near Me</title>
                <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
                <link rel="stylesheet" href="style.css" />
            </Helmet>
            <section className="w-[100%] h-[100%] flex justify-center items-center">
                <div className="block bg-gradient-to-r from-gray-900 via-zinc-400 to-zinc-700 border-[3px] border-[#F7FF9B] w-[683px] h-[683px] absolute top-[180px] rounded-[30px]">
                    <h1 className="text-[#fff] text-[50px] absolute top-[14px] left-[260px]"> LOGIN </h1>
                    <div className="block">
                        <label className="text-[#fff] text-[35px] absolute top-[87px] left-[60px]">Name</label>
                        <input type="text" name="name" placeholder="Enter Your Name" className="name w-[505px] h-[60px] pl-[30px] absolute top-[145px] left-[60px] rounded-[7px] bg-[#D9D9D9] text-[26px] text-[#000] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={(e) => setName(e.target.value)}></input>
                        <span class="priority text-[#E80A0A] absolute top-[215px] left-[60px] text-[20px]">{nameError}</span>
                    </div>
                    <div className="block">
                        <label className="text-[#fff] text-[35px] absolute top-[257px] left-[60px]">Email</label>
                        <input type="email" name="email" placeholder="Enter Your Email" className="email w-[505px] h-[60px] pl-[30px] absolute top-[305px] left-[60px] rounded-[7px] bg-[#D9D9D9] text-[26px] text-[#000] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={(e) => setEmail(e.target.value)}></input>
                        <span class="priority text-[#E80A0A] absolute top-[380px] left-[60px] text-[20px]">{emailError}</span>
                    </div>
                    <div className="block">
                        <label className="text-[#fff] text-[35px] absolute top-[410px] left-[60px]">Password</label>
                        <input type="password" name="password" placeholder="Enter Your Password" class="pwd w-[505px] h-[60px] pl-[30px] absolute top-[461px] left-[60px] rounded-[7px] bg-[#D9D9D9] text-[26px] text-[#000] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={(e) => setPassword(e.target.value)}></input>
                        <span class="priority text-[#E80A0A] absolute top-[540px] left-[60px] text-[20px]">{passwordError}</span>
                    </div>
                    <button type="button" onClick={handleSignUp} className="w-[200px] h-[60px] absolute top-[593px] left-[241px] border-[1.5px] border-[#C5f602] rounded-tr-[25px] rounded-bl-[25px] bg-[#F7FF9B] text-[26px] hover:bg-[#fff] hover:rounded-tr-[0px] hover:rounded-tl-[25px] hover:rounded-bl-[0px] hover:rounded-br-[25px] hover:border-[#EDEDED]">SignUp</button>
                </div>
            </section>
        </div>
    )
}