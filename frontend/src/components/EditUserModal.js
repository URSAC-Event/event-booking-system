import React, { useState, useEffect } from 'react';

const EditUserModal = ({ isOpen, closeModal, user, updateUser }) => {
    const [editedUser, setEditedUser] = useState({
        name: '',
        organizationz: '',
        username: '',
        email: '',
    });

    useEffect(() => {
        if (user) {
            setEditedUser({
                name: user.name || '',
                organizationz: user.organizationz || '',
                username: user.username || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUser(editedUser);
        closeModal();
    };

    if (!isOpen || !user) return null; // Only render modal if it's open and a user is provided

    return (
        <div className="modal">
            <div className="modalContent">
                <h2>Edit User</h2>
                <form onSubmit={handleSubmit}>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={editedUser.name}
                        onChange={handleChange}
                    />
                    <label>Organization</label>
                    <input
                        type="text"
                        name="organizationz"
                        value={editedUser.organizationz}
                        onChange={handleChange}
                    />
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={editedUser.username}
                        onChange={handleChange}
                    />
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={editedUser.email}
                        onChange={handleChange}
                    />
                    <button type="submit">Save</button>
                    <button type="button" onClick={closeModal}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
