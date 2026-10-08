import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);
    const [creditCount, setCreditCount] = useState(0);
    const [creditHistory, setCreditHistory] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `${API_URL}/api/auth/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setProfile(response.data.user);
                setName(response.data.user.name);

                const creditResponse = await axios.get(
                    `${API_URL}/api/credits/profile/${response.data.user._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setCreditCount(creditResponse.data.creditCount);

                const creditHistoryResponse = await axios.get(
                    `${API_URL}/api/credits/profile/${response.data.user._id}/knowledge`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setCreditHistory(creditHistoryResponse.data.credits);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleUpdateProfile = async () => {
        if (!name.trim()) {
            alert("Name is required");
            return;
        }

        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            const response = await axios.put(
                `${API_URL}/api/auth/profile`,
                {
                    name: name.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setProfile(response.data.user);

            // Keep localStorage user information updated
            const currentUser = JSON.parse(
                localStorage.getItem("user")
            );

            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...currentUser,
                    name: response.data.user.name,
                })
            );

            setEditing(false);

            alert("Profile updated successfully");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to update profile"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Please fill all password fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            alert("New password must be at least 6 characters");
            return;
        }

        try {
            setChangingPassword(true);

            const token = localStorage.getItem("token");

            await axios.put(
                `${API_URL}/api/auth/change-passwor`,
                {
                    currentPassword,
                    newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Password changed successfully");

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setShowPasswordForm(false);
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to change password"
            );
        } finally {
            setChangingPassword(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <div className="app-layout">
            <Sidebar />

            <div className="main-area">
                <Topbar />

                <main className="dashboard">
                    <section className="hero">
                        <p className="eyebrow">ACCOUNT</p>

                        <h1>My Profile</h1>

                        <p>
                            View your account information and role in KnowledgeHub.
                        </p>
                    </section>

                    <section className="dashboard-panel profile-panel">
                        <div className="profile-header">
                            <div className="profile-avatar">
                                {profile?.name?.charAt(0).toUpperCase()}
                            </div>

                            <div>
                                <h2>{profile?.name}</h2>

                                <span className={`role-badge ${profile?.role}`}>
                                    {profile?.role}
                                </span>
                            </div>

                            <button
                                className="edit-profile-button"
                                onClick={() => setEditing(true)}
                            >
                                Edit Profile
                            </button>
                        </div>

                        <div className="profile-details">
                            <div className="profile-field">
                                <label>Full Name</label>

                                {editing ? (
                                    <input
                                        className="profile-input"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                ) : (
                                    <p>{profile?.name}</p>
                                )}
                            </div>
                            {editing && (
                                <div className="profile-actions">
                                    <button
                                        className="cancel-profile-button"
                                        onClick={() => {
                                            setName(profile.name);
                                            setEditing(false);
                                        }}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="save-profile-button"
                                        onClick={handleUpdateProfile}
                                        disabled={saving}
                                    >
                                        {saving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            )}

                            <div className="profile-field">
                                <label>Email</label>
                                <p>{profile?.email}</p>
                            </div>

                            <div className="profile-field">
                                <label>Role</label>
                                <p className="capitalize">
                                    {profile?.role}
                                </p>
                            </div>

                            <div className="profile-field">
                                <label>Member Since</label>
                                <p>
                                    {profile?.createdAt
                                        ? new Date(
                                            profile.createdAt
                                        ).toLocaleDateString()
                                        : "-"}
                                </p>
                            </div>
                        </div>
                    </section>
                    <section className="dashboard-panel security-panel">
                        <div className="security-header">
                            <div>
                                <h2>Security</h2>
                                <p>Manage your account password.</p>
                            </div>

                            <button
                                className="change-password-button"
                                onClick={() =>
                                    setShowPasswordForm(!showPasswordForm)
                                }
                            >
                                {showPasswordForm
                                    ? "Cancel"
                                    : "Change Password"}
                            </button>
                        </div>

                        {showPasswordForm && (
                            <div className="password-form">
                                <div className="password-field">
                                    <label>Current Password</label>

                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) =>
                                            setCurrentPassword(e.target.value)
                                        }
                                        placeholder="Enter current password"
                                    />
                                </div>

                                <div className="password-field">
                                    <label>New Password</label>

                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                        placeholder="Enter new password"
                                    />
                                </div>

                                <div className="password-field">
                                    <label>Confirm New Password</label>

                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        placeholder="Confirm new password"
                                    />
                                </div>

                                <button
                                    className="save-password-button"
                                    onClick={handleChangePassword}
                                    disabled={changingPassword}
                                >
                                    {changingPassword
                                        ? "Changing Password..."
                                        : "Update Password"}
                                </button>
                            </div>
                        )}
                    </section>

                    <div className="profile-recognition">
                        <div className="profile-section-header">
                            <h2> Recognition</h2>
                            <span>{creditCount} Credits Received</span>
                        </div>

                        {creditHistory.length > 0 ? (
                            <div className="recognition-list">
                                {creditHistory.map((credit) => (
                                    <div
                                        key={credit._id}
                                        className="recognition-item"
                                    >
                                        <div className="recognition-icon">
                                            ⭐
                                        </div>

                                        <div className="recognition-content">
                                            <h3>
                                                {credit.knowledge?.title || "Knowledge"}
                                            </h3>

                                            <p>
                                                Credit given by{" "}
                                                {credit.user?.name || "Team member"}
                                            </p>

                                            <span>
                                                {new Date(credit.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-recognition">
                                No credits received yet.
                            </p>
                        )}
                    </div>

                    <div className="profile-logout">
                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Profile;