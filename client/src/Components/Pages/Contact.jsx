
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Contact.css";

function Contact() {
    const navigateToHome = useNavigate();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isAdmin = user?.role === "Admin";
    const isLoggedIn = Boolean(token);

    const [contactForm, setContactForm] = useState({
        firstname: "",
        lastname: "",
        phoneNumber: "",
        email: "",
        message: ""
    });

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        firstname: "",
        lastname: "",
        phoneNumber: "",
        email: "",
        message: ""
    });

    // Load contact submissions for logged-in users
    const fetchContacts = async () => {
        if (!token) return;

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:3000/api/contacts",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load contacts");
            }

            setContacts(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    // Contact form input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setContactForm({
            ...contactForm,
            [name]: value
        });
    };

    // Submit a new contact message
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:3000/api/contacts",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(contactForm)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to send contact information");
            }

            alert("Thank you for contacting me!");

            setContactForm({
                firstname: "",
                lastname: "",
                phoneNumber: "",
                email: "",
                message: ""
            });

            if (isLoggedIn) {
                fetchContacts();
            }
        } catch (error) {
            console.error("Contact submission error:", error);
            alert(error.message);
        }
    };

    // Begin editing a contact
    const handleEdit = (contact) => {
        setEditingId(contact._id);

        setEditForm({
            firstname: contact.firstname,
            lastname: contact.lastname,
            phoneNumber: contact.phoneNumber || "",
            email: contact.email,
            message: contact.message || ""
        });
    };

    // Update edit form
    const handleEditChange = (event) => {
        const { name, value } = event.target;

        setEditForm({
            ...editForm,
            [name]: value
        });
    };

    // Save edited contact
    const handleUpdate = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                `http://localhost:3000/api/contacts/${editingId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(editForm)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update contact");
            }

            alert("Contact updated successfully!");
            setEditingId(null);
            fetchContacts();
        } catch (error) {
            alert(error.message);
        }
    };

    // Delete contact
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this contact?")) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/api/contacts/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete contact");
            }

            alert("Contact deleted successfully!");
            fetchContacts();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <main className="contact-page">

            <section className="page-header">
                <h1>Contact Me</h1>

                <p>
                    Have a question or want to discuss a project?
                    Feel free to get in touch.
                </p>
            </section>

            <section className="contact-container">

                <div className="contact-information">

                    <h2>Get In Touch</h2>

                    <p>
                        I am always interested in discussing new
                        projects, opportunities, and ideas.
                    </p>

                    <div className="contact-detail">
                        <strong>Email</strong>
                        <p>ahociota@my.centennialcollege.ca</p>
                    </div>

                    <div className="contact-detail">
                        <strong>Phone</strong>
                        <p>416-389-2177</p>
                    </div>

                    <div className="contact-detail">
                        <strong>Location</strong>
                        <p>Toronto, Ontario, Canada</p>
                    </div>

                </div>

                {/* Public contact form */}
                <form
                    className="contact-form"
                    onSubmit={handleFormSubmit}
                >

                    <h2>Send Me a Message</h2>

                    <div className="form-row">

                        <div className="form-group">
                            <label htmlFor="firstname">First Name</label>

                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                value={contactForm.firstname}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastname">Last Name</label>

                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={contactForm.lastname}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                    </div>

                    <div className="form-group">
                        <label htmlFor="phoneNumber">Contact Number</label>

                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={contactForm.phoneNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={contactForm.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message</label>

                        <textarea
                            id="message"
                            name="message"
                            rows="6"
                            value={contactForm.message}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="submit-button">
                        Send Message
                    </button>

                </form>

            </section>

            {/* Contact submissions for logged-in users */}
            {isLoggedIn && (
                <section className="admin-contacts">

                    <h2>
                        {isAdmin ? "Manage Contact Messages" : "Contact Messages"}
                    </h2>

                    {loading && <p>Loading contact messages...</p>}

                    {error && <p className="contact-error">{error}</p>}

                    {!loading && !error && contacts.length === 0 && (
                        <p>No contact messages have been submitted yet.</p>
                    )}

                    <div className="contacts-list">

                        {contacts.map((contact) => (
                            <div className="contact-record" key={contact._id}>

                                {editingId === contact._id ? (

                                    <form onSubmit={handleUpdate} className="contact-edit-form">

                                        <label>First Name</label>
                                        <input
                                            name="firstname"
                                            value={editForm.firstname}
                                            onChange={handleEditChange}
                                            required
                                        />

                                        <label>Last Name</label>
                                        <input
                                            name="lastname"
                                            value={editForm.lastname}
                                            onChange={handleEditChange}
                                            required
                                        />

                                        <label>Phone Number</label>
                                        <input
                                            name="phoneNumber"
                                            value={editForm.phoneNumber}
                                            onChange={handleEditChange}
                                            required
                                        />

                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={editForm.email}
                                            onChange={handleEditChange}
                                            required
                                        />

                                        <label>Message</label>
                                        <textarea
                                            name="message"
                                            value={editForm.message}
                                            onChange={handleEditChange}
                                            required
                                        />

                                        <button type="submit">Save Changes</button>

                                        <button
                                            type="button"
                                            onClick={() => setEditingId(null)}
                                        >
                                            Cancel
                                        </button>

                                    </form>

                                ) : (

                                    <>
                                        <h3>
                                            {contact.firstname} {contact.lastname}
                                        </h3>

                                        <p>
                                            <strong>Email:</strong> {contact.email}
                                        </p>

                                        <p>
                                            <strong>Phone:</strong> {contact.phoneNumber}
                                        </p>

                                        <p>
                                            <strong>Message:</strong> {contact.message}
                                        </p>

                                        {isAdmin && (
                                            <div className="contact-admin-buttons">

                                                <button
                                                    onClick={() => handleEdit(contact)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(contact._id)}
                                                >
                                                    Delete
                                                </button>

                                            </div>
                                        )}
                                    </>

                                )}

                            </div>
                        ))}

                    </div>
                </section>
            )}

            <Link to="/" className="back-home">
                ← Back to Home
            </Link>

        </main>
    );
}

export default Contact;
