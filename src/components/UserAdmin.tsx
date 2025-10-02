import { useState, useEffect } from "react";

export default function UserAdmin() {
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const fetchUsers = () => {
    fetch("http://localhost:4000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:4000/users/addUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    fetchUsers();
    setForm({ name: "", email: "", password: "" });
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:4000/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow-md flex flex-col gap-2"
      >
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={form.password}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Criar Usuário
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-white p-3 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{u.name}</p>
              <p className="text-sm text-gray-600">{u.email}</p>
            </div>
            <button
              onClick={() => handleDelete(u.id)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Deletar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
