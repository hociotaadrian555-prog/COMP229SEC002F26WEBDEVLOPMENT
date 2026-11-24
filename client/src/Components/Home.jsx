import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import API_URL from "../api";

function Home() {
    const navigate = useNavigate();

    // Check whether a JWT token exists
    const token = localStorage.getItem("token");

    // Get logged-in user information
    const user = JSON.parse(localStorage.getItem("user") || "null");

    // Handle user logout
    const handleLogout = async () => {
        try {
            await fetch(`${API_URL}/auth/signout`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            // Clear authentication information
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            alert("You have successfully logged out!");

            navigate("/login");
        }
    };

    return (
        <div className="home">

            <section className="hero">

                <div className="hero-content">

                    <p className="small-title">
                        GAME PROGRAMMING STUDENT
                    </p>

                    <h1>
                        Hello, Welcome To <span>My Portfolio!</span>
                    </h1>

                    <p className="intro">
                        Hi, I'm Adrian Hociota, a game programming student
                        and aspiring game developer. Check out more about who I am!
                    </p>

                    {user && (
                        <p className="intro">
                            Welcome back, {user.name}!
                            {user.role === "Admin" && " (Administrator)"}
                        </p>
                    )}

                    <div className="hero-buttons">

                        <Link to="/project" className="red-button">
                            View My Projects
                        </Link>

                        <Link to="/about" className="dark-button">
                            About Me
                        </Link>

                        {token && (
                            <button
                                type="button"
                                className="dark-button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        )}

                    </div>

                </div>

            </section>

            <section className="quick-links">

                <Link to="/about" className="card">
                    <h2>About Me</h2>
                    <p>Learn more about who I am.</p>
                </Link>

                <Link to="/project" className="card">
                    <h2>Projects</h2>
                    <p>Check out the games I've worked on.</p>
                </Link>

                <Link to="/education" className="card">
                    <h2>Education</h2>
                    <p>See my education and skills.</p>
                </Link>

                <Link to="/contact" className="card">
                    <h2>Contact</h2>
                    <p>Get in touch with me.</p>
                </Link>

            </section>

        </div>
    );
}

export default Home;