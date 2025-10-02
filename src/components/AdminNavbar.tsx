import React from "react";

interface AdminNavbarProps {
  username: string;
}

export default function AdminNavbar({ username }: AdminNavbarProps) {
  return (
    <header className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Painel Admin</h1>
      <span className="font-medium">{username}</span>
    </header>
  );
}
