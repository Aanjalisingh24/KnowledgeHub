import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/api/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStats(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <main className="dashboard">
          <section className="hero">
            <p className="eyebrow">ADMINISTRATION</p>

            <h1>Manage KnowledgeHub</h1>

            <p>
              Manage your team's knowledge, users and platform activity
              from one place.
            </p>
          </section>

          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📚</div>

              <div>
                <h2>{stats?.totalKnowledge || 0}</h2>
                <p>Total Knowledge</p>
                <small>Knowledge items</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👥</div>

              <div>
                <h2>{stats?.totalUsers || 0}</h2>
                <p>Total Users</p>
                <small>Testing team</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✍️</div>

              <div>
                <h2>{stats?.totalContributors || 0}</h2>
                <p>Contributors</p>
                <small>Active contributors</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👍</div>

              <div>
                <h2>{stats?.totalHelpfulFeedback || 0}</h2>
                <p>Helpful Feedback</p>
                <small>Team engagement</small>
              </div>
            </div>
          </section>

          <section className="dashboard-grid">
            <div className="dashboard-panel">
              <div className="panel-header">
                <div>
                  <h2>Knowledge Management</h2>
                  <p>Manage the team's knowledge base</p>
                </div>
              </div>

              <div className="quick-actions">
                <button onClick={() => navigate("/admin/knowledge")}>
                  <strong>📚 Manage Knowledge</strong>
                  <span>View, edit or remove knowledge</span>
                </button>

                <button  onClick={() => navigate("/knowledge/create")}>
                  <strong>➕ Add Knowledge</strong>
                  <span>Create a new knowledge item</span>
                </button>
              </div>
            </div>

            <div className="dashboard-panel">
              <div className="panel-header">
                <div>
                  <h2>User Management</h2>
                  <p>Manage your team members</p>
                </div>
              </div>

              <div className="quick-actions">
                <button onClick={() => navigate("/admin/users")}>
                  <strong>👥 Manage Users</strong>
                  <span>View and manage team members</span>
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;