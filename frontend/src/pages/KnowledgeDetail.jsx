import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DOMPurify from "dompurify";

const KnowledgeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [knowledge, setKnowledge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [creditGiven, setCreditGiven] = useState(false);
  const hasFetchedKnowledge = useRef(false);


  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const checkCreditStatus = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:5000/api/credits/${id}/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCreditGiven(response.data.creditGiven);
      } catch (error) {
        console.error("Failed to check credit status:", error);
      }
    };

    if (id) {
      checkCreditStatus();
    }
  }, [id]);

  const handleGiveCredit = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/credits/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCreditGiven(true);

      alert("Credit given successfully!");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to give credit"
      );
    }
  };

  const fetchKnowledge = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5000/api/knowledge/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setKnowledge(response.data.knowledge);
      setHelpfulCount(response.data.knowledge.helpfulCount || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const fetchBookmarkStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5000/api/bookmarks/${id}/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsBookmarked(response.data.bookmarked);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFeedback = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5000/api/feedback/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFeedback(response.data.feedback);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (hasFetchedKnowledge.current) {
      return;
    }

    hasFetchedKnowledge.current = true;

    fetchKnowledge();
    fetchBookmarkStatus();
    fetchFeedback();
  }, [id]);

  const handleBookmark = async () => {
    try {
      const token = localStorage.getItem("token");

      if (isBookmarked) {
        await axios.delete(
          `${API_URL}/api/bookmarks/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsBookmarked(false);
      } else {
        await axios.post(
          `${API_URL}/api/bookmarks/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsBookmarked(true);
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to update bookmark"
      );
    }
  };

  const handleFeedback = async (helpful) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/api/feedback/${id}`,
        {
          helpful,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFeedback(helpful);
      setHelpfulCount(response.data.helpfulCount);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this knowledge?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/api/knowledge/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/knowledge");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to delete knowledge"
      );
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!knowledge) {
    return <p>Knowledge not found.</p>;
  }

  const isAuthor =
    knowledge.author?._id === user?.id;

  const canEdit =
    isAuthor || user?.role === "admin";

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <main className="main-content">
          <button
            className="back-button"
            onClick={() => navigate("/knowledge")}
          >
            ← Back to Knowledge Library
          </button>

          <article className="knowledge-detail">
            <div className="detail-header">
              <div>
                <span className={`knowledge-type ${knowledge.type}`}>
                  {knowledge.type === "issue"
                    ? "Issues & Solutions"
                    : knowledge.type === "faq"
                      ? "FAQ"
                      : knowledge.type === "learning"
                        ? "Learning"
                        : "Guide"}
                </span>

                <h1>{knowledge.title}</h1>

                <p className="detail-description">
                  {knowledge.description}
                </p>

              </div>

              {canEdit && (
                <div className="detail-actions">
                  <button
                    onClick={() =>
                      navigate(`/knowledge/${id}/edit`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            <button
              className={`bookmark-button ${isBookmarked ? "bookmarked" : ""
                }`}
              onClick={handleBookmark}
            >
              {isBookmarked ? "🔖 Saved" : "🔖 Save"}
            </button>

            <div className="detail-meta">
              <div className="knowledge-author">
                <div className="small-avatar">
                  {knowledge.author?.name
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <span>
                  Written by <strong>{knowledge.author?.name}</strong>
                </span>
              </div>

              <span>👁 {knowledge.views} views</span>

              <span>
                Updated{" "}
                {new Date(
                  knowledge.updatedAt
                ).toLocaleDateString()}
              </span>
            </div>

            <div className="detail-tags">
              {knowledge.tags?.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>


            <div
              className="knowledge-content"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(knowledge.content),
              }}
            />
            <div className="feedback-section">
              <h3>Was this knowledge helpful?</h3>

              <div className="feedback-buttons">
                <button
                  className={feedback === true ? "selected" : ""}
                  onClick={() => handleFeedback(true)}
                >
                  👍 Yes
                </button>

                <button
                  className={feedback === false ? "selected" : ""}
                  onClick={() => handleFeedback(false)}
                >
                  👎 No
                </button>
              </div>
              <p>
                {helpfulCount} people found this helpful
              </p>


              <div className="credit-section">
                <button
                  className="credit-button"
                  onClick={handleGiveCredit}
                  disabled={creditGiven}
                >
                  {creditGiven ? "Credit Given ⭐" : "Give Credit ⭐"}
                </button>
              </div>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
};

export default KnowledgeDetail;