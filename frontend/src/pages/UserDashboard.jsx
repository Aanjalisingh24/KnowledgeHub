import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/api/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDashboardData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <main className="dashboard">
          <section className="hero">
            <p className="eyebrow">
              GOOD MORNING, {user?.name?.toUpperCase()}
            </p>

            <h1>Knowledge That Empowers</h1>

            <p>
              One searchable place for your team's testing processes,
              solutions, applications and learnings.
            </p>

            <button className="primary-button" onClick={() => navigate("/knowledge")}>
              Explore Knowledge →
            </button>
          </section>

          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div>
                <h2>{dashboardData?.knowledgeCount || 0}</h2>
                <p>Knowledge Items</p>
                <small>Start documenting</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔄</div>
              <div>
                <h2>{dashboardData?.recentlyUpdated || 0}</h2>
                <p>Recently Updated</p>
                <small>This week</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div>
                <h2>{dashboardData?.teamMembers || 0}</h2>
                <p>Team Members</p>
                <small>Testing team</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💡</div>
              <div>
                <h2>{dashboardData?.helpfulKnowledge || 0}</h2>
                <p>Helpful Knowledge</p>
                <small>Team feedback</small>
              </div>
            </div>
          </section>

          <section className="dashboard-grid">
            <div className="dashboard-panel">
              <div className="panel-header">
                <div>
                  <h2>Recently Added</h2>
                  <p>Latest knowledge from your team</p>
                </div>

                <button onClick={() => navigate("/knowledge")}>View all →</button>
              </div>

              <div className="recent-knowledge-list">
                {dashboardData?.recentKnowledge?.length > 0 ? (
                  dashboardData.recentKnowledge.map((item) => (
                    <div
                      key={item._id}
                      className="recent-knowledge-item"
                      onClick={() => navigate(`/knowledge/${item._id}`)}
                    >
                      <div className="recent-knowledge-icon">
                        {item.type === "issue"
                          ? "⚠️"
                          : item.type === "faq"
                            ? "❓"
                            : item.type === "learning"
                              ? "💡"
                              : "📘"}
                      </div>

                      <div className="recent-knowledge-content">
                        <h3>{item.title}</h3>

                        <p>{item.description}</p>

                        <div className="recent-knowledge-meta">
                          <span>{item.type}</span>
                          <span>•</span>
                          <span>
                            By {item.author?.name || "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <div>📚</div>
                    <h3>No knowledge yet</h3>
                    <p>
                      Start documenting problems, solutions and learnings.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="dashboard-panel">
              <div className="panel-header">
                <div>
                  <h2>Quick Actions</h2>
                  <p>Frequently used actions</p>
                </div>
              </div>

              <div className="quick-actions">
                <button onClick={() => navigate("/knowledge")}>
                  <strong>Browse Knowledge</strong>
                  <span>Find existing solutions</span>
                </button>

                <button onClick={() => navigate("/knowledge/create?type=learning")}>
                  <strong>Share Knowledge</strong>
                  <span>Document something you learned</span>
                </button>
              </div>
            </div>
          </section>
          <div className="internal-use-notice">
            <h4>🔒 Internal Use Only</h4>

            <p>
              KnowledgeHub contains confidential company information and is
              intended only for authorized employees. Please do not share,
              copy, or disclose its contents outside the organization without
              proper authorization.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;