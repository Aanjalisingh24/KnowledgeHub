import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/api/bookmarks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookmarks(response.data.bookmarks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const removeBookmark = async (knowledgeId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/api/bookmarks/${knowledgeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove it immediately from UI
      setBookmarks((prev) =>
        prev.filter(
          (bookmark) =>
            bookmark.knowledge?._id !== knowledgeId
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      issue: "Issues & Solutions",
      faq: "FAQ",
      learning: "Learning",
      guide: "Guide",
    };

    return labels[type] || type;
  };

  if (loading) {
    return <p>Loading bookmarks...</p>;
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <main className="main-content">
          <div className="page-header">
            <div className="book-heading">
              <h1>My Bookmarks</h1>
            </div>
          </div>

          {bookmarks.length === 0 ? (
            <div className="empty-state">
              <h3>No bookmarks yet</h3>

              <p>
                Save useful knowledge here so you can find it
                quickly later.
              </p>

              <button
                className="browse-button"
                onClick={() => navigate("/knowledge")}
              >
                Browse Knowledge
              </button>
            </div>
          ) : (
            <div className="knowledge-grid">
              {bookmarks.map((bookmark) => {
                const item = bookmark.knowledge;

                if (!item) return null;

                return (
                  <div
                    className="knowledge-card"
                    key={bookmark._id}
                    onClick={() =>
                      navigate(`/knowledge/${item._id}`)
                    }
                  >
                    <div className="knowledge-card-top">
                      <span
                        className={`knowledge-type ${item.type}`}
                      >
                        {getTypeLabel(item.type)}
                      </span>

                      <button
                        className="bookmark-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(item._id);
                        }}
                        title="Remove bookmark"
                      >
                        🔖
                      </button>
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
                        {item.author?.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <span>
                        {item.author?.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Bookmarks;