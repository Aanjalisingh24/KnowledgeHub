import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const KnowledgeLibrary = () => {
  const [knowledge, setKnowledge] = useState([]);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fetchKnowledge = async () => {
    try {
      const token = localStorage.getItem("token");

      const currentType = searchParams.get("type") || "";

      const response = await axios.get(
        `${API_URL}/api/knowledge`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            search: search || undefined,
            type: currentType || undefined,
          },
        }
      );

      setKnowledge(response.data.knowledge);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, [search, searchParams]);

  const getTypeLabel = (type) => {
  const labels = {
    issue: "Issues & Solutions",
    faq: "FAQ",
    learning: "Learning",
    guide: "Guide",
  };

  return labels[type] || type;
};


  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar />
        <div className="page-header">
          <div className="page-heading1" >
            <h1>Knowledge Library</h1>
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
            value={searchParams.get("type") || ""}
            onChange={(e) => {
              const selectedType = e.target.value;

              if (selectedType) {
                navigate(`/knowledge?type=${selectedType}`);
              } else {
                navigate("/knowledge");
              }
            }}
          >
            <option value="">All Types</option>
            <option value="issue">Issues & Solutions</option>
            <option value="faq">FAQs</option>
            <option value="learning">Learning</option>
            <option value="guide">Guides</option>
          </select>
        </div>

        <div className="knowledge-grid">
          {knowledge.length === 0 ? (
            <div className="empty-state">
              <h3>No knowledge found</h3>
              <p>
                Try a different search term or filter.
              </p>
            </div>
          ) : (
            knowledge.map((item) => (
              <div
                className="knowledge-card"
                key={item._id}
                onClick={() =>
                  navigate(`/knowledge/${item._id}`)
                }
              >
                <div className="knowledge-card-top">
                  <span className={`knowledge-type ${item.type}`}>
                    {getTypeLabel(item.type)}
                  </span>

                  <span className="knowledge-views">
                    👁 {item.views}
                  </span>
                </div>

                <h3>{item.title}</h3>

                <p>{item.description}</p>

                <div className="knowledge-tags">
                  {item.tags?.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>

                <div className="knowledge-author">
                  <div className="small-avatar">
                    {item.author?.name?.charAt(0).toUpperCase()}
                  </div>

                  <span>
                    {item.author?.name}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default KnowledgeLibrary;