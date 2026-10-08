import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-box">K</div>

        <div>
          <h2>KnowledgeHub</h2>
          <p>Testing Team</p>
        </div>
      </div>

      <div className="workspace">
        <span className="status-dot"></span>
        Testing Workspace
      </div>

      <div className="sidebar-section">
        <p className="section-title">WORKSPACE</p>

        <NavLink to="/dashboard" className="sidebar-link">
           Overview
        </NavLink>

        <NavLink to="/knowledge" className="sidebar-link">
           Knowledge Library
        </NavLink>

        <NavLink to="/bookmarks" className="sidebar-link">
           My Bookmarks
        </NavLink>
      </div>

        <div className="sidebar-section">
          <p className="section-title">TEAM KNOWLEDGE</p>

          <NavLink to="/knowledge?type=issue" className="sidebar-link">
             Issues & Solutions
          </NavLink>

          <NavLink to="/knowledge?type=faq" className="sidebar-link">
             FAQs
          </NavLink>

          <NavLink to="/knowledge?type=learning" className="sidebar-link">
             Learnings
          </NavLink>

          <NavLink to="/knowledge?type=guide" className="sidebar-link">
             Guides
          </NavLink>
        </div>

      {user?.role === "admin" && (
        <div className="sidebar-section">
          <p className="section-title">MANAGE</p>

          <NavLink to="/admin" className="sidebar-link">
            Administration
          </NavLink>
        </div>
      )}

      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <strong>{user?.name}</strong>
          <p>{user?.role}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;