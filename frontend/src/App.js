import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from "./pages/Form";
import Action from "./pages/Actions";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import Main from "./pages/Main";
import { Navigate } from "react-router-dom";

function App() {
  const [email, setEmail] = useState('');
  return (
    <Router>
      <Routes>
      <Route path="dashboard" element={<Main/>}/>
      <Route path="products" element={<Main />}/>
      <Route path="*" element={<Navigate to={"dashboard"} />} />
        <Route path="/signup" element={<Signup email={email} setEmail={setEmail} />} />
        <Route path="/" element={<Verify email={email} setEmail={setEmail} />} />
        <Route path="/form" element={<Form/>} />
        <Route path="/action" element={<Action/>} />
      </Routes>
      <ToastContainer position="top-center" type="info" theme="colored"/>
    </Router>
  );
}

export default App;
