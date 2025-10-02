import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function NewsListAdmin() {
  const [news, setNews] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<number | null>(null);

  const fetchNews = () => {
    fetch("http://localhost:4000/api/news")
      .then((res) => res.json())
      .then((data) => setNews(data));
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const confirmDelete = async () => {
    if (newsToDelete === null) return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/news/${newsToDelete}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Erro ao deletar notícia");
      toast.success("Notícia deletada com sucesso!");
      fetchNews();
    } catch (err: any) {
      toast.error(err.message || "Erro desconhecido");
    } finally {
      setModalOpen(false);
      setNewsToDelete(null);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Notícias Cadastradas</h2>
        <Link
          to="/admin/news/create"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Cadastrar nova notícia
        </Link>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Imagem
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Título
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Categoria
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Cidade
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Ação
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {news.map((n) => (
              <tr key={n.id}>
                <td className="px-4 py-2">
                  {n.images && n.images.length > 0 ? (
                    <img
                      src={`http://localhost:4000/${n.images[0]}`}
                      alt={n.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm">
                      Sem imagem
                    </div>
                  )}
                </td>
                <td className="px-4 py-2">{n.title}</td>
                <td className="px-4 py-2">{n.category}</td>
                <td className="px-4 py-2">{n.city_id}</td>
                <td className="px-4 py-2 flex justify-center gap-2">
                  <Link
                    to={`/admin/news/edit/${n.id}`}
                    className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => {
                      setNewsToDelete(n.id);
                      setModalOpen(true);
                    }}
                    className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
            <p>Tem certeza que deseja deletar esta notícia?</p>
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
