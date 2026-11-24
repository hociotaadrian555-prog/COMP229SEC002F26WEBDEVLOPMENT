
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import API_URL from "../../api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                `${API_URL}/auth/signin`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Save authentication token
            localStorage.setItem("token", data.token);

            // Save logged-in user's information and role
            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Login successful!");

            // Redirect to the homepage after login
            navigate("/home");

        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <main className="login-page">
            <div className="login-container">

                <h1>Welcome Back</h1>
                <p>Login to your portfolio account.</p>

                <form onSubmit={handleLogin}>

                    <label>Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />

                    <button type="submit">Login</button>

                </form>

                <p>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>

                <Link to="/" className="back-home">
                    ← Back to Login
                </Link>

            </div>
        </main>
    );
}

export default Login;
