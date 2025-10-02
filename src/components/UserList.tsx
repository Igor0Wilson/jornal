import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface UserFormValues {
  name: string;
  email: string;
  password: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export default function UserList() {
  const { register, handleSubmit, reset } = useForm<UserFormValues>();
  const [users, setUsers] = useState<User[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch("http://localhost:4000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Erro ao carregar usuários:", err));
  };

  const onSubmit = async (data: UserFormValues) => {
    try {
      const res = await fetch("http://localhost:4000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erro ao criar usuário");

      toast.success("Usuário criado com sucesso!");
      fetchUsers();
      reset();
    } catch (err: any) {
      toast.error(err.message || "Erro desconhecido");
    }
  };

  const confirmDelete = async () => {
    if (userToDelete === null) return;

    try {
      const res = await fetch(`http://localhost:4000/users/${userToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao deletar usuário");

      toast.success("Usuário deletado!");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Erro desconhecido");
    } finally {
      setModalOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Formulário de criação */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-md shadow-md flex flex-col gap-3"
      >
        <input
          {...register("name", { required: true })}
          placeholder="Nome"
          className="border p-2 rounded"
        />
        <input
          {...register("email", { required: true })}
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
        />
        <input
          {...register("password", { required: true })}
          type="password"
          placeholder="Senha"
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Criar Usuário
        </button>
      </form>

      {/* Lista de usuários */}
      <div className="flex flex-col gap-2">
        {users.length === 0 && (
          <p className="text-gray-500 text-center">
            Nenhum usuário cadastrado.
          </p>
        )}
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-white p-3 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{u.name}</p>
              <p className="text-sm text-gray-600">{u.email}</p>
              <p className="text-xs text-gray-400">
                Cadastrado em:{" "}
                {new Date(u.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <button
              onClick={() => {
                setUserToDelete(u.id);
                setModalOpen(true);
              }}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Deletar
            </button>
          </div>
        ))}
      </div>

      {/* Modal de confirmação */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-md shadow-lg flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold">Confirmar exclusão</h2>
            <p>Tem certeza que deseja deletar este usuário?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded border hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
