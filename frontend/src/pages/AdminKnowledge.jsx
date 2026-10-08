import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const AdminKnowledge = () => {
    const [knowledge, setKnowledge] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    const navigate = useNavigate();

    const filteredKnowledge = knowledge.filter((item) => {
        const matchesSearch =
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase());

        const matchesType =
            typeFilter === "all" || item.type === typeFilter;

        return matchesSearch && matchesType;
    });

    const handleDeleteKnowledge = async (knowledgeId, title) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `${API_URL}/api/admin/knowledge/${knowledgeId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setKnowledge((prevKnowledge) =>
                prevKnowledge.filter(
                    (item) => item._id !== knowledgeId
                )
            );

            alert("Knowledge deleted successfully");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to delete knowledge"
            );
        }
    };

    const fetchKnowledge = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${API_URL}/api/knowledge`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setKnowledge(response.data.knowledge);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKnowledge();
    }, []);

    return (
        <div className="app-layout">
            <Sidebar />

            <div className="main-area">
                <Topbar />

                <main className="dashboard">
                    <section className="hero">
                        <p className="eyebrow">ADMINISTRATION</p>

                        <h1>Manage Knowledge</h1>

                        <p>
                            View and manage all knowledge shared by the Testing team.
                        </p>
                    </section>

                    <section className="dashboard-panel">
                        <div className="panel-header">
                            <div>
                                <h2>Knowledge Base</h2>

                                <p>
                                    {filteredKnowledge.length} of {knowledge.length} knowledge items
                                </p>
                            </div>
                        </div>

                        <div className="knowledge-filters">
                            <input
                                type="text"
                                placeholder="Search knowledge..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                <option value="issue">Issues & Solutions</option>
                                <option value="faq">FAQs</option>
                                <option value="learning">Learnings</option>
                                <option value="guide">Guides</option>
                            </select>
                        </div>

                        {loading ? (
                            <p>Loading knowledge...</p>
                        ) : knowledge.length === 0 ? (
                            <p>No knowledge found.</p>
                        ) : (
                            <div className="admin-knowledge-list">
                                {filteredKnowledge.map((item) => (
                                    <div
                                        className="admin-knowledge-item"
                                        key={item._id}
                                    >
                                        <div className="admin-knowledge-content">
                                            <span className="knowledge-type">
                                                {item.type}
                                            </span>

                                            <h3>{item.title}</h3>

                                            <p>{item.description}</p>

                                            <div className="admin-knowledge-meta">
                                                <span>
                                                    By {item.author?.name || "Unknown"}
                                                </span>

                                                <span>
                                                    {item.views} views
                                                </span>

                                                <span>
                                                    {item.helpfulCount} helpful
                                                </span>
                                            </div>
                                        </div>

                                        <div className="admin-knowledge-actions">
                                            <button
                                                onClick={() =>
                                                    navigate(`/knowledge/${item._id}`)
                                                }
                                            >
                                                View
                                            </button>

                                            <button
                                                onClick={() =>
                                                    navigate(`/knowledge/${item._id}/edit`)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button className="delete-knowledge-button"
                                                onClick={() =>
                                                    handleDeleteKnowledge(item._id, item.title)
                                                }

                                            >
                                                Delete
                                            </button>
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

export default AdminKnowledge;