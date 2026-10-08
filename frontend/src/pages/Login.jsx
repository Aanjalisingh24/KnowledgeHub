import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        formData
      );

      const { token, user } = response.data;

      // Store authentication information
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if(user.role === 'admin'){
        navigate("/admin");
      } else {
        navigate ("/dashboard");
      }

      setMessage("Login successful");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
  <div className="auth-page">
    <div className="auth-card">
      <div className="auth-brand">
        <div className="auth-logo">K</div>
        <div>
          <h1>KnowledgeHub</h1>
          <p>Testing Team</p>
        </div>
      </div>

      <div className="auth-heading">
        <h2>Welcome back</h2>
        <p>Sign in to access your team’s knowledge.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="auth-field">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="auth-button">
          Login
        </button>
      </form>

      {message && <p className="auth-message">{message}</p>}

      <p className="auth-switch">
        Don't have an account?{" "}
       <Link to="/">Create one</Link>
      </p>
    </div>
  </div>
);
};

export default Login;