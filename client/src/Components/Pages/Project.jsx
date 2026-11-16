
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Project.css";

function Project() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isAdmin = user?.role === "Admin";

    const emptyForm = {
        title: "",
        firstname: "",
        lastname: "",
        email: "",
        completion: "",
        description: ""
    };

    const [formData, setFormData] = useState(emptyForm);

    // Load projects from MongoDB
    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:3000/api/projects",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    response.status === 401
                        ? "Please log in to view projects."
                        : "Failed to retrieve projects."
                );
            }

            const data = await response.json();
            setProjects(data);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // Handle form input changes
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    // Open form for a new project
    const handleAdd = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setShowForm(true);
    };

    // Open form to edit an existing project
    const handleEdit = (project) => {
        setEditingId(project._id);

        setFormData({
            title: project.title || "",
            firstname: project.firstname || "",
            lastname: project.lastname || "",
            email: project.email || "",
            completion: project.completion
                ? new Date(project.completion).toISOString().split("T")[0]
                : "",
            description: project.description || ""
        });

        setShowForm(true);
    };

    // Create or update a project
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const url = editingId
                ? `http://localhost:3000/api/projects/${editingId}`
                : "http://localhost:3000/api/projects";

            const response = await fetch(url, {
                method: editingId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to save project.");
            }

            alert(editingId
                ? "Project updated successfully!"
                : "Project added successfully!");

            setShowForm(false);
            setFormData(emptyForm);
            setEditingId(null);

            fetchProjects();

        } catch (error) {
            alert(error.message);
        }
    };

    // Delete a project
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `http://localhost:3000/api/projects/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to delete project.");
            }

            alert("Project deleted successfully!");
            fetchProjects();

        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="project-page">
            <div className="project-content">

                <p className="project-label">MY WORK</p>

                <h1>
                    My <span>Projects</span>
                </h1>

                {isAdmin && (
                    <button
                        type="button"
                        className="red-button"
                        onClick={handleAdd}
                    >
                        + Add New Project
                    </button>
                )}

                {showForm && isAdmin && (
                    <form onSubmit={handleSubmit} className="project-form">

                        <h2>
                            {editingId ? "Edit Project" : "Add Project"}
                        </h2>

                        <label>Project Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            required
                        />

                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                        />

                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <label>Completion Date</label>
                        <input
                            type="date"
                            name="completion"
                            value={formData.completion}
                            onChange={handleChange}
                            required
                        />

                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit" className="red-button">
                            {editingId ? "Update Project" : "Save Project"}
                        </button>

                        <button
                            type="button"
                            className="dark-button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingId(null);
                            }}
                        >
                            Cancel
                        </button>

                    </form>
                )}

                <div className="projects-list">

                    <Link
                        to="/game2048"
                        className="project-card game-project-card"
                    >
                        <img
                            src="/2048-preview.jpg"
                            alt="2048 Game Preview"
                            className="project-image"
                        />

                        <div className="project-card-info">
                            <h2>2048 Game</h2>

                            <p>
                                A browser-based version of the classic
                                2048 puzzle game, built using React,
                                JavaScript, and CSS.
                            </p>

                            <span className="play-game">
                                Play Game →
                            </span>
                        </div>
                    </Link>

                    {loading ? (
                        <div className="project-card">
                            <h2>Loading Projects...</h2>
                        </div>

                    ) : error ? (
                        <div className="project-card">
                            <h2>{error}</h2>
                        </div>

                    ) : projects.length === 0 ? (
                        <div className="project-card">
                            <h2>More Projects Coming Soon</h2>
                            <p>
                                I'm currently working on new projects.
                                Stay tuned for more!
                            </p>
                        </div>

                    ) : (
                        projects.map((project) => (
                            <div className="project-card" key={project._id}>
                                <h2>{project.title}</h2>

                                <p>{project.description}</p>

                                <p>
                                    {project.firstname} {project.lastname}
                                </p>

                                <p>
                                    <strong>Email:</strong> {project.email}
                                </p>

                                <p>
                                    <strong>Completion:</strong>{" "}
                                    {new Date(project.completion).toLocaleDateString()}
                                </p>

                                {isAdmin && (
                                    <div className="project-admin-buttons">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(project)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(project._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                </div>

                <Link to="/" className="back-home">
                    ← Back to Home
                </Link>

            </div>
        </div>
    );
}

export default Project;
