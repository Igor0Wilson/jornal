import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

import NewsAdmin from "../components/NewsAdmin";
import CityForm from "../components/CityForm";
import RegionForm from "../components/RegionForm";
import UserList from "../components/UserList";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AdsAdmin from "../components/AdAdmin";

export default function Admin() {
  const [view, setView] = useState("news");
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    toast.success("Logout realizado!");
    navigate("/login");
  };

  return (
    <div className="flex">
      <AdminSidebar
        setView={setView}
        logout={logout}
        currentView={view} // ✅ passa a prop
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          {view === "news" && <NewsAdmin />}
          {view === "cities" && <CityForm />}
          {view === "regions" && <RegionForm />}
          {view === "users" && <UserList />}
          {view === "ads" && <AdsAdmin />}
        </main>
      </div>
    </div>
  );
}
