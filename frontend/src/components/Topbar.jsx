import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const Topbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="breadcrumb">
        Workspace /{" "}
        <Link to="/dashboard">Overview</Link>
      </div>

      <div className="topbar-right">
        <button
          className="topbar-avatar profile-button"
          onClick={() => navigate("/profile")}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </button>
      </div>
    </header>
  );
};

export default Topbar;