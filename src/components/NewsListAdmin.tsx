import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function NewsListAdmin() {
  const [news, setNews] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<number | null>(null);
  const API_URL = "https://apijornal-production.up.railway.app/api/news";

  // Buscar notícias
  const fetchNews = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Erro ao carregar notícias");
      const data = await res.json();
      setNews(data);
    } catch (err: any) {
      toast.error(err.message || "Erro ao buscar notícias");
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Confirmar exclusão
  const confirmDelete = async () => {
    if (!newsToDelete) return;

    try {
      const res = await fetch(`${API_URL}/${newsToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao excluir notícia");

      toast.success("Notícia deletada com sucesso!");
      fetchNews();
    } catch (err: any) {
      toast.error(err.message || "Erro ao excluir notícia");
    } finally {
      setModalOpen(false);
      setNewsToDelete(null);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Notícias Cadastradas
        </h2>
        <Link
          to="/admin/news/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          + Nova Notícia
        </Link>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Imagem", "Título", "Categoria", "Cidade", "Ação"].map((th) => (
                <th
                  key={th}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {news.length > 0 ? (
              news.map((n) => (
                <tr key={n.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {n.images?.length ? (
                      <img
                        src={`https://apijornal-production.up.railway.app/${n.images[0]}`}
                        alt={n.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        Sem imagem
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 font-medium">{n.title}</td>
                  <td className="px-4 py-2">{n.category}</td>
                  <td className="px-4 py-2">{n.city_id || "—"}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <Link
                      to={`/admin/news/edit/${n.id}`}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => {
                        setNewsToDelete(n.id);
                        setModalOpen(true);
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  Nenhuma notícia cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmação */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-2">Confirmar exclusão</h2>
            <p className="text-gray-600 mb-4">
              Tem certeza que deseja excluir esta notícia?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded border hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
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
