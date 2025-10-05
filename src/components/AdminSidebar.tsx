import React, { useState } from "react";
import { Newspaper, MapPin, Layers, User, LogOut, Globe } from "lucide-react";

interface AdminSidebarProps {
  setView: (view: string) => void;
  logout: () => void;
  currentView: string;
}

interface MenuItem {
  name: string;
  icon: React.ComponentType<any>;
  view: string;
}

export default function AdminSidebarLucide({
  setView,
  logout,
  currentView,
}: AdminSidebarProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems: MenuItem[] = [
    { name: "Notícias", icon: Newspaper, view: "news" },
    { name: "Cidades", icon: MapPin, view: "cities" },
    { name: "Regiões", icon: Globe, view: "regions" },
    { name: "Usuários", icon: User, view: "users" },
    { name: "Publicidade", icon: Layers, view: "ads" },
  ];

  return (
    <aside className="bg-black text-white w-64 min-h-screen flex flex-col shadow-lg">
      {/* Logo no topo */}
      <div className="p-6 flex flex-col items-center border-b border-gray-800">
        <h1 className="text-2xl font-bold mb-1">Sistema restrito</h1>
        <p className="text-sm text-gray-400">Painel do administrador</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-4 p-6 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;

          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`
                flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 w-full text-left
                ${
                  isActive
                    ? "bg-yellow-500 text-black font-semibold"
                    : "hover:bg-gray-800"
                }
              `}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout no rodapé */}
      <div className="p-6 border-t border-gray-800">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 w-full text-left"
        >
          <LogOut size={18} />
          Sair
        </button>

        {/* Modal de logout */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
              <h2 className="text-lg font-bold mb-4 text-gray-900">
                Deseja realmente sair?
              </h2>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
