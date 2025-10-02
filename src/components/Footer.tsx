import React from "react";
import logoOrg from "../assets/logo-org.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white p-6 shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Nos siga nas redes sociais</h2>

      <div className="flex justify-center gap-6 mb-4">
        <a href="#" className="text-blue-600 font-bold hover:underline">
          Facebook
        </a>
        <a href="#" className="text-pink-500 font-bold hover:underline">
          Instagram
        </a>
        <a href="#" className="text-blue-400 font-bold hover:underline">
          Twitter
        </a>
        <a href="#" className="text-red-600 font-bold hover:underline">
          YouTube
        </a>
      </div>

      <div className="flex justify-center items-center gap-2">
        <span className="text-sm">Desenvolvido por</span>
        <img
          src={logoOrg}
          alt="WSS Solution Logo"
          className="h-8 w-8 rounded-full object-cover border border-gray-200 p-1"
        />
      </div>
    </footer>
  );
};

export default Footer;
