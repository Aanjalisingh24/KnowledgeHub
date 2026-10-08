import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import KnowledgeEditor from "../components/KnowledgeEditor";
const API_URL = import.meta.env.VITE_API_URL;

const CreateKnowledge = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    type: "issue",
    tags: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/api/knowledge`,
        {
          title: formData.title,
          description: formData.description,
          content: formData.content,
          type: formData.type,

          // Convert comma-separated string into array
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/knowledge/${response.data.knowledge._id}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to create knowledge"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <main className="main-content">
          <div className="page-header">
            <div>
              <h1 className="create-h">Create Knowledge</h1>
              <p className="create-p">
                Share something you learned, solved, or discovered
                with your team.
              </p>
            </div>
          </div>

          <form
            className="knowledge-form"
            onSubmit={handleSubmit}
          >
            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Title</label>

              <input
                type="text"
                name="title"
                placeholder="e.g. API returning 401 Unauthorized"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Short Description</label>

              <textarea
                name="description"
                placeholder="Briefly explain what this knowledge is about..."
                value={formData.description}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>Type</label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="issue">
                  Issues & Solutions
                </option>

                <option value="faq">
                  FAQ
                </option>

                <option value="learning">
                  Learning
                </option>

                <option value="guide">
                  Guide
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Tags</label>

              <input
                type="text"
                name="tags"
                placeholder="JWT, API, Authentication"
                value={formData.tags}
                onChange={handleChange}
              />

              <small>
                Separate tags using commas.
              </small>
            </div>

            <div className="form-group">
              <label>Knowledge</label>

              <KnowledgeEditor
                value={formData.content}
                onChange={(content) =>
                  setFormData((prev) => ({
                    ...prev,
                    content,
                  }))
                }
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/knowledge")}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Publishing..."
                  : "Publish Knowledge"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateKnowledge;