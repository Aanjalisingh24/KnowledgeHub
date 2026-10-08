import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentUser = JSON.parse(localStorage.getItem("user"));

    const handleRoleChange = async (userId, newRole) => {
        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `${API_URL}/api/admin/users/${userId}/role`,
                {
                    role: newRole,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === userId
                        ? { ...user, role: newRole }
                        : user
                )
            );
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to update user role"
            );
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${userName}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `${API_URL}/api/admin/users/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUsers((prevUsers) =>
                prevUsers.filter((user) => user._id !== userId)
            );

            alert("User deleted successfully");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to delete user"
            );
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${API_URL}/api/admin/users`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUsers(response.data.users);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="app-layout">
            <Sidebar />

            <div className="main-area">
                <Topbar />

                <main className="dashboard">
                    <section className="hero">
                        <p className="eyebrow">ADMINISTRATION</p>

                        <h1>Manage Users</h1>

                        <p>
                            View and manage members of the Testing team.
                        </p>
                    </section>

                    <section className="dashboard-panel">
                        <div className="panel-header">
                            <div>
                                <h2>Team Members</h2>
                                <p>
                                    {users.length} users in KnowledgeHub
                                </p>
                            </div>
                        </div>

                        {loading ? (
                            <p>Loading users...</p>
                        ) : (
                            <div className="users-table">
                                <div className="users-table-header">
                                    <span>User</span>
                                    <span>Email</span>
                                    <span>Role</span>
                                    <span>Joined</span>
                                    <span>Action</span>
                                </div>

                                {users.map((user) => (
                                    <div
                                        className="users-table-row"
                                        key={user._id}
                                    >
                                        <div className="user-info">
                                            <div className="user-avatar">
                                                {user.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <strong>{user.name}</strong>
                                        </div>

                                        <span>{user.email}</span>

                                        <select
                                            className="role-select"
                                            value={user.role}
                                            disabled={user._id === currentUser?.id}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="contributor">Contributor</option>
                                        </select>

                                        <span>
                                            {new Date(
                                                user.createdAt
                                            ).toLocaleDateString()}
                                        </span>

                                        <div>
                                            {user._id === currentUser?.id ? (
                                                <span className="current-user-label">
                                                    You
                                                </span>
                                            ) : (
                                                <button className="delete-user-button" onClick={() =>
                                                    handleDeleteUser(user._id, user.name)
                                                }>
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default ManageUsers;