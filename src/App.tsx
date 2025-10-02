import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

import Header from "./components/Header";
import Home from "./pages/Homes";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";

import Admin from "./pages/Admin";
import NewsDetail from "./components/NewsDetail";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <Home />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/news/:id"
            element={
              <>
                <Header />
                <NewsDetail />
              </>
            }
          />

          {/* Rotas admin */}
          <Route
            path="/admin/*" // permite todas as subrotas do Admin
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
