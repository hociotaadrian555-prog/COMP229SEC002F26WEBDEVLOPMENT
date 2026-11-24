
import { Link } from "react-router-dom";
import "./About.css";

function About() {
    return (
        <div className="about-page">
            <div className="about-content">

                <p className="about-label">ABOUT ME</p>

                <h1>
                    About <span>Me</span>
                </h1>

                <div className="about-card">

                    <div className="about-image">
                        <img
                            src="About Me.jpg"
                            alt="Adrian at the beach"
                        />
                    </div>

                    <div className="about-info">

                        <p className="about-intro">
                            GAME PROGRAMMING STUDENT
                        </p>

                        <h2>
                            Hi, I'm <span>Adrian.</span>
                        </h2>

                        <p>
                            I'm a game programming student and aspiring game
                            developer with a passion for creating games and
                            learning how they work.
                        </p>

                        <p>
                            I'm interested in programming, game development,
                            and building projects that allow me to turn my
                            ideas into something people can interact with.
                        </p>

                        <p>
                            I'm always looking to improve my skills, learn new
                            technologies, and gain more experience as I work
                            toward becoming a game developer.
                        </p>

                    </div>

                </div>

                <Link to="/home" className="back-home">
                    ← Back to Home
                </Link>

            </div>
        </div>
    );
}

export default About;
