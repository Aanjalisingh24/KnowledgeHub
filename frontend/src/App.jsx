import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import KnowledgeLibrary from "./pages/KnowledgeLibrary";
import KnowledgeDetail from "./pages/KnowledgeDetail";
import CreateKnowledge from "./pages/CreateKnowledge";
import EditKnowledge from "./pages/EditKnowledge";
import Bookmarks from "./pages/Bookmarks";
import ManageUsers from "./pages/ManageUsers";
import AdminKnowledge from "./pages/AdminKnowledge";
import Profile from "./pages/Profile"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Knowledge"
          element={
            <ProtectedRoute>
              <KnowledgeLibrary />
            </ProtectedRoute>
          }
        />

        <Route
          path="/knowledge/:id"
          element={
            <ProtectedRoute>
              <KnowledgeDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/knowledge/:id/edit"
          element={
            <ProtectedRoute>
              <EditKnowledge />
            </ProtectedRoute>
          }
        />

        <Route
          path="/knowledge/create"
          element={
            <ProtectedRoute>
              <CreateKnowledge />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <Bookmarks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/knowledge"
          element={
            <ProtectedRoute role="admin">
              <AdminKnowledge />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;