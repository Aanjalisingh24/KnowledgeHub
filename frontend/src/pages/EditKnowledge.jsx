import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import KnowledgeEditor from "../components/KnowledgeEditor";
const API_URL = import.meta.env.VITE_API_URL;

const EditKnowledge = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    type: "issue",
    tags: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/api/knowledge/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const knowledge = response.data.knowledge;

        setFormData({
          title: knowledge.title,
          description: knowledge.description,
          content: knowledge.content,
          type: knowledge.type,
          tags: knowledge.tags?.join(", ") || "",
        });
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Failed to load knowledge"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledge();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/knowledge/${id}`,
        {
          title: formData.title,
          description: formData.description,
          content: formData.content,
          type: formData.type,
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

      navigate(`/knowledge/${id}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to update knowledge"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <main className="main-content">
          <div className="page-header">
            <div>
              <h1>Edit Knowledge</h1>
              <p>
                Update the information so your team has the
                most accurate solution.
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
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Short Description</label>

              <textarea
                name="description"
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
                <option value="faq">FAQ</option>
                <option value="learning">Learning</option>
                <option value="guide">Guide</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tags</label>

              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="JWT, API, Authentication"
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
                  setFormData({
                    ...formData,
                    content,
                  })
                }
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() =>
                  navigate(`/knowledge/${id}`)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditKnowledge;