import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewsEdit from "./NewsEdit";

export default function NewsAdmin() {
  const [news, setNews] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<{
    id: number | null;
    title: string;
  }>({ id: null, title: "" });

  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    city_id: "",
    images: [] as File[],
  });

  // --- Fetchers ---
  const fetchNews = async () => {
    try {
      const res = await fetch(
        "https://apijornal-production.up.railway.app/news"
      );
      const data = await res.json();
      const rows = Array.isArray(data) ? data : data.rows;

      const normalized = rows.map((n: any) => ({
        ...n,
        images: Array.isArray(n.images) ? n.images : n.images ? [n.images] : [],
      }));

      setNews(normalized);
    } catch (err) {
      console.error("Erro ao carregar notícias:", err);
    }
  };

  const fetchCities = async () => {
    const res = await fetch(
      "https://apijornal-production.up.railway.app/cities"
    );
    const data = await res.json();
    setCities(Array.isArray(data) ? data : data.rows);
  };

  const fetchRegions = async () => {
    const res = await fetch(
      "https://apijornal-production.up.railway.app/regions"
    );
    const data = await res.json();
    setRegions(Array.isArray(data) ? data : data.rows);
  };

  useEffect(() => {
    fetchNews();
    fetchCities();
    fetchRegions();
  }, []);

  // --- Handlers ---
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.files) {
      let fileArray: File[] = Array.from(e.target.files);
      if (fileArray.length > 10) fileArray = fileArray.slice(0, 10);
      setForm({ ...form, images: fileArray });
      setPreviews(fileArray.map((file) => URL.createObjectURL(file)));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", form.title);
    data.append("content", form.content);
    data.append("category", form.category);
    data.append("city_id", form.city_id);
    form.images.forEach((img) => data.append("images", img));

    await fetch("https://apijornal-production.up.railway.app/news", {
      method: "POST",
      body: data,
    });
    fetchNews();
    setForm({ title: "", content: "", category: "", city_id: "", images: [] });
    setPreviews([]);
  };

  const confirmDeleteNews = (id: number, title: string) =>
    setConfirmDelete({ id, title });
  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    await fetch(
      `https://apijornal-production.up.railway.app/news/${confirmDelete.id}`,
      {
        method: "DELETE",
      }
    );
    setConfirmDelete({ id: null, title: "" });
    fetchNews();
  };

  // --- Render Edit Form Inline ---
  if (editingId) {
    return (
      <NewsEdit
        id={editingId}
        cities={cities}
        regions={regions}
        onCancel={() => setEditingId(null)}
        onSaved={() => {
          setEditingId(null);
          fetchNews();
        }}
      />
    );
  }

  // --- Render Normal View ---
  return (
    <div className="flex flex-col gap-6">
      {/* Cadastro */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-md p-6 flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold mb-2">Cadastrar nova notícia</h2>
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <textarea
          name="content"
          placeholder="Conteúdo"
          value={form.content}
          onChange={handleChange}
          rows={4}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">Selecione a categoria</option>
          <option value="Tecnologia">Tecnologia</option>
          <option value="Saúde">Saúde</option>
          <option value="Crimes">Crimes</option>
          <option value="Política">Política</option>
          <option value="Esportes">Esportes</option>
          <option value="Entretenimento">Entretenimento</option>
        </select>
        <select
          name="city_id"
          value={form.city_id}
          onChange={handleChange}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">Selecione a cidade</option>
          {cities.map((c) => {
            const region = regions.find((r) => r.id === c.region_id);
            return (
              <option key={c.id} value={c.id}>
                {c.name} {region ? `(${region.name})` : ""}
              </option>
            );
          })}
        </select>
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="mt-2"
        />
        {previews.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {previews.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`preview ${index}`}
                className="w-32 h-32 object-cover rounded"
              />
            ))}
          </div>
        )}
        <button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mt-2"
        >
          Salvar notícia
        </button>
      </form>

      {/* Listagem */}
      <div className="bg-white shadow-md rounded-md p-4 flex flex-col gap-3">
        <h2 className="text-xl font-bold mb-2">Lista de notícias</h2>
        {news.map((n) => {
          const city = cities.find((c) => c.id === n.city_id);
          const region = city
            ? regions.find((r) => r.id === city.region_id)
            : null;
          const firstImage =
            Array.isArray(n.images) && n.images.length > 0 ? n.images[0] : null;

          return (
            <div
              key={n.id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded shadow-sm"
            >
              <div className="flex items-center gap-3">
                {firstImage ? (
                  <img
                    src={`https://apijornal-production.up.railway.app/${firstImage}`}
                    alt={n.title}
                    className="w-20 h-20 object-cover rounded"
                    onClick={() =>
                      setModalImage(
                        `https://apijornal-production.up.railway.app/${firstImage}`
                      )
                    }
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm">
                    Sem imagem
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{n.title}</h3>
                  <p className="text-sm text-gray-600">
                    {n.category} • {city ? city.name : "Cidade desconhecida"}{" "}
                    {region ? `(${region.name})` : ""}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingId(n.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => confirmDeleteNews(n.id, n.title)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Deletar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal imagem */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Imagem"
            className="max-w-[90%] max-h-[90%] rounded shadow-lg"
          />
        </div>
      )}

      {/* Modal delete */}
      {confirmDelete.id && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Confirmar exclusão</h2>
            <p>
              Tem certeza que deseja excluir a notícia{" "}
              <b>{confirmDelete.title}</b>?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setConfirmDelete({ id: null, title: "" })}
                className="px-4 py-2 rounded border"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
