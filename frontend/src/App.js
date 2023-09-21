import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Form from "./pages/Form";
import Action from "./pages/Actions";
import Session from "./pages/section";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/session" element={<Session />} />
        <Route path="/form" element={<Form />} />
        <Route path="/action/:productID" element={<Action />} />
      </Routes>
    </Router>
  );
}

export default App;
