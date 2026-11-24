
import { HashRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import About from "./Components/About";

import Project from "./Components/Pages/Project";
import Education from "./Components/Pages/Education";
import Contact from "./Components/Pages/Contact";
import Login from "./Components/Pages/Login";
import Register from "./Components/Pages/Register";
import Game2048 from "./Components/Pages/Game2048";

function App() {
    return (
        <HashRouter>
            <Navbar />

            <Routes>
                {/* Login is now the default landing page */}
                <Route path="/" element={<Login />} />

                {/* Website Pages */}
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/project" element={<Project />} />
                <Route path="/education" element={<Education />} />
                <Route path="/contact" element={<Contact />} />

                {/* Authentication */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* 2048 Game */}
                <Route path="/game2048" element={<Game2048 />} />
            </Routes>
        </HashRouter>
    );
}

export default App;
