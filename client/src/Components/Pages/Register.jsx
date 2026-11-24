import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import API_URL from "../../api";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                `${API_URL}/api/users`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            alert("Account created successfully! Your role is User.");

            navigate("/login");

        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <main className="register-page">
            <div className="register-container">

                <h1>Create Account</h1>
                <p>Register for your portfolio account.</p>

                <form onSubmit={handleRegister}>

                    <label>Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />

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

                    <button type="submit">Register</button>

                </form>

                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>

                <Link to="/" className="back-home">
                    ← Back to Home
                </Link>

            </div>
        </main>
    );
}

export default Register;