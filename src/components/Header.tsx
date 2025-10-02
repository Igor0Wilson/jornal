import logo from "../assets/logo.jpg";

export default function Header() {
  return (
    <header className="bg-black shadow-md border-b border-gray-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            className="h-14 w-auto bg-black p-1 rounded-md"
          />
          <h1 className="text-2xl font-bold text-white">Conecta Bauru</h1>
        </div>
      </div>
    </header>
  );
}
