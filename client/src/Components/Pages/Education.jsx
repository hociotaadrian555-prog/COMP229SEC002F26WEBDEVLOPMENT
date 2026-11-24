
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../../api";
import "./Education.css";

function Education() {
    const token = localStorage.getItem("token");

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isAdmin = user?.role === "Admin";

    const [qualifications, setQualifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        firstname: "",
        lastname: "",
        email: "",
        completion: "",
        description: ""
    });

    // Get qualifications from MongoDB
    const fetchQualifications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/qualifications`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load qualifications");
            }

            setQualifications(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQualifications();
    }, []);

    // Handle form input changes
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Clear the form
    const resetForm = () => {
        setFormData({
            title: "",
            firstname: "",
            lastname: "",
            email: "",
            completion: "",
            description: ""
        });

        setEditingId(null);
        setShowForm(false);
    };

    // Add or update a qualification
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const url = editingId
                ? `${API_URL}/api/qualifications/${editingId}`
                : `${API_URL}/api/qualifications`;

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
                throw new Error(data.message || "Unable to save qualification");
            }

            alert(
                editingId
                    ? "Qualification updated successfully!"
                    : "Qualification added successfully!"
            );

            resetForm();
            fetchQualifications();
        } catch (error) {
            alert(error.message);
        }
    };

    // Load qualification into the form for editing
    const handleEdit = (qualification) => {
        setFormData({
            title: qualification.title,
            firstname: qualification.firstname,
            lastname: qualification.lastname,
            email: qualification.email,
            completion: new Date(qualification.completion)
                .toISOString()
                .split("T")[0],
            description: qualification.description
        });

        setEditingId(qualification._id);
        setShowForm(true);
    };

    // Delete a qualification
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this qualification?")) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/qualifications/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to delete qualification");
            }

            alert("Qualification deleted successfully!");
            fetchQualifications();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="education-page">
            <div className="education-content">

                <p className="education-label">MY EDUCATION</p>

                <h1>
                    My <span>Education</span>
                </h1>

                {/* Existing high school education */}
                <div className="education-card">

                    <div className="education-image">
                        <img
                            src="Graduation.jpeg"
                            alt="Adrian's High School Graduation"
                        />
                    </div>

                    <div className="education-info">

                        <p className="school-label">
                            HIGH SCHOOL GRADUATE
                        </p>

                        <h2>
                            Sir John A. Macdonald
                            <span> Collegiate Institute</span>
                        </h2>

                        <p>
                            I graduated from Sir John A. Macdonald Collegiate
                            Institute, where I completed my high school
                            education. My time at Sir John A. Macdonald helped me develop
                            my skills and discover my interest in programming
                            and game development. I am now continuing my education in game
                            programming and working toward becoming a
                            professional game developer.
                        </p>

                    </div>
                </div>

                {/* Qualifications from MongoDB */}
                <div className="qualifications-section">

                    <h2>My <span>Qualifications</span></h2>

                    {isAdmin && (
                        <button
                            className="red-button"
                            onClick={() => {
                                resetForm();
                                setShowForm(true);
                            }}
                        >
                            + Add Qualification
                        </button>
                    )}

                    {/* Add/Edit Form */}
                    {isAdmin && showForm && (
                        <form
                            className="qualification-form"
                            onSubmit={handleSubmit}
                        >
                            <h3>
                                {editingId
                                    ? "Edit Qualification"
                                    : "Add New Qualification"}
                            </h3>

                            <label>Qualification Title</label>
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
                                rows="4"
                                required
                            />

                            <button type="submit" className="red-button">
                                {editingId ? "Update Qualification" : "Save Qualification"}
                            </button>

                            <button
                                type="button"
                                className="dark-button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        </form>
                    )}

                    {loading && <p>Loading qualifications...</p>}

                    {error && <p className="education-error">{error}</p>}

                    {!loading && !error && qualifications.length === 0 && (
                        <p>No additional qualifications have been added yet.</p>
                    )}

                    {/* Display qualifications */}
                    <div className="qualifications-list">

                        {qualifications.map((qualification) => (
                            <div
                                className="qualification-card"
                                key={qualification._id}
                            >
                                <h3>{qualification.title}</h3>

                                <p>
                                    <strong>Name:</strong>{" "}
                                    {qualification.firstname} {qualification.lastname}
                                </p>

                                <p>
                                    <strong>Email:</strong>{" "}
                                    {qualification.email}
                                </p>

                                <p>
                                    <strong>Completion Date:</strong>{" "}
                                    {new Date(qualification.completion)
                                        .toLocaleDateString()}
                                </p>

                                <p>{qualification.description}</p>

                                {isAdmin && (
                                    <div className="qualification-admin-buttons">
                                        <button
                                            className="edit-button"
                                            onClick={() => handleEdit(qualification)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(qualification._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                    </div>
                </div>

                <Link to="/home" className="back-home">
                    ← Back to Home
                </Link>

            </div>
        </div>
    );
}

export default Education;
