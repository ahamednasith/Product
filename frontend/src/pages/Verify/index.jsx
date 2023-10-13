import React, { useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Verify({ email, setEmail }) {
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    const validate = (email, password) => {
        let valid = true;
        const emailRegex = /^[^\s@]+@pepul\.com$/;
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
        return valid;
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const error = validate(email, password);
            if (error) {
                const token = localStorage.getItem('accesstoken')
                const response = await axios.post('http://localhost:3000/verify', { email, password }, {
                    headers: {
                        authorization: `bearer ${token}`,
                    },
                });
                console.log(response.data.data)
                if (response.data) {
                    const email = response.data.data.email;
                    const userID = response.data.data.userID;
                    localStorage.setItem('email',email);
                    localStorage.setItem('userID',userID)
                    navigate(`/dashboard`);
                }
            }
        } catch (error) {
            if (error.response) {
                setPasswordError(error.response.data.message);
            }
        }
    }
    const handleSignup = async () => {
        navigate("/signup");
        window.location.reload();
    }


    return (
        <div className="bg-gradient-to-r from-gray-900 via-zinc-400 to-zinc-700 w-[100%] h-[1224px] after:content-[''] after:min-h-[500px] after:min-w-[600px] after:-top-[100px] after:absolute after:-left-[300px] after:bg-gradient-to-l after:from-yellow-100 after:via-yellow-200 after:to-gray-500  after:rotate-[140deg] before:content-[''] before:min-h-[500px] before:min-w-[600px] before:bottom-[100px] before:absolute before:-right-[400px] before:bg-gradient-to-l before:from-yellow-100 before:via-yellow-200 before:to-gray-500  before:rotate-[120deg]">
            <Helmet>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Shops Near Me</title>
                <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
            </Helmet>
            <section className="w-[100%] h-[100%]  flex justify-center items-center">
                <div className="block bg-gradient-to-r from-gray-900 via-zinc-400 to-zinc-700 border-[3px] border-[#F7FF9B] w-[683px] h-[683px] absolute top-[180px] rounded-[30px]">
                    <h1 className="text-[#fff] text-[50px] absolute top-[34px] left-[260px]"> LOGIN </h1>
                    <div className="block">
                        <label className="text-[#fff] text-[35px] absolute top-[157px] left-[60px]">Email</label>
                        <input type="email" name="email" placeholder="Enter Your Email" className="email w-[505px] h-[60px] pl-[30px] absolute top-[205px] left-[60px] rounded-[7px] bg-[#D9D9D9] text-[26px] text-[#000] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={(e) => setEmail(e.target.value)}></input>
                        <span class="priority text-[#E80A0A] absolute top-[280px] left-[60px] text-[20px]">{emailError}</span>
                    </div>
                    <div className="block">
                        <label className="text-[#fff] text-[35px] absolute top-[310px] left-[60px]">Password</label>
                        <input type="password" name="password" placeholder="Enter Your Password" class="pwd w-[505px] h-[60px] pl-[30px] absolute top-[361px] left-[60px] rounded-[7px] bg-[#D9D9D9] text-[26px] text-[#000] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={(e) => setPassword(e.target.value)}></input>
                        <span class="priority text-[#E80A0A] absolute top-[440px] left-[60px] text-[20px]">{passwordError}</span>
                    </div>
                    <button type="button" onClick={handleSubmit} className="w-[200px] h-[60px] bg-[#F7FF9B] absolute top-[483px] left-[241px] border-[1.5px] border-[#EDEDED] rounded-tr-[25px] rounded-bl-[25px] bg-[#C5f602] text-[26px] hover:bg-[#fff] hover:rounded-tr-[0px] hover:rounded-tl-[25px] hover:rounded-bl-[0px] hover:rounded-br-[25px] hover:border-[#F7FF9B]">Submit</button>
                    <h6 className="text-[20px] text-[#fff] absolute top-[550px] left-[329px]">or</h6>
                    <button type="button" onClick={handleSignup} className="w-[200px] h-[60px] absolute top-[593px] left-[241px] border-[1.5px] border-[#F7FF9B] rounded-tr-[25px] rounded-bl-[25px]  bg-[#fff] text-[26px] hover:bg-[#F7FF9B] hover:rounded-tr-[0px] hover:rounded-tl-[25px] hover:rounded-bl-[0px] hover:rounded-br-[25px] hover:border-[#EDEDED]">SignUp</button>
                </div>
            </section>
        </div>
    )
}