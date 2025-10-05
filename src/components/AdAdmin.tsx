import { useState, useEffect } from "react";
import AdsAdminEdit from "./AdsAdminEdit";

export default function AdsAdmin() {
  const [ads, setAds] = useState<any[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    id: number | null;
    title: string;
  }>({ id: null, title: "" });

  const [form, setForm] = useState({
    title: "",
    link: "",
    priority: 0,
    active: true,
    image: null as File | null,
  });

  // --- Fetch Ads ---
  const fetchAds = async () => {
    try {
      const res = await fetch("http://localhost:4000/publicidade");
      const data = await res.json();
      setAds(Array.isArray(data) ? data : data.rows);
    } catch (err) {
      console.error("Erro ao carregar publicidades:", err);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      setForm({ ...form, image: file });
      setPreviews([URL.createObjectURL(file)]);
    } else {
      setForm({ ...form, [name]: name === "priority" ? Number(value) : value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", form.title);
    data.append("link", form.link);
    data.append("priority", form.priority.toString());
    if (form.image) data.append("image", form.image);

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:4000/publicidade/${editingId}`
      : "http://localhost:4000/publicidade";

    await fetch(url, { method, body: data });
    setForm({ title: "", link: "", priority: 0, active: true, image: null });
    setPreviews([]);
    setEditingId(null);
    fetchAds();
  };

  const confirmDeleteAd = (id: number, title: string) =>
    setConfirmDelete({ id, title });

  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    await fetch(`http://localhost:4000/publicidade/${confirmDelete.id}`, {
      method: "DELETE",
    });
    setConfirmDelete({ id: null, title: "" });
    fetchAds();
  };

  // --- Render Edit Form Inline ---
  if (editingId) {
    const ad = ads.find((a) => a.id === editingId);
    // Remover este bloco que usa AdsAdminEdit
    if (editingId) {
      const ad = ads.find((a) => a.id === editingId);
      if (ad) {
        return (
          <AdsAdminEdit
            ad={ad}
            onCancel={() => setEditingId(null)}
            onSaved={() => {
              setEditingId(null);
              fetchAds();
            }}
          />
        );
      }
    }
  }

  // --- Render Normal View ---
  return (
    <div className="flex flex-col gap-6">
      {/* Cadastro */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-md p-6 flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold mb-2">
          {editingId ? "Editar publicidade" : "Cadastrar nova publicidade"}
        </h2>
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="text"
          name="link"
          placeholder="Link"
          value={form.link}
          onChange={handleChange}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="number"
          name="priority"
          placeholder="Prioridade"
          value={form.priority}
          onChange={handleChange}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
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
          {editingId ? "Salvar alterações" : "Salvar publicidade"}
        </button>
      </form>

      {/* Listagem */}
      <div className="bg-white shadow-md rounded-md p-4 flex flex-col gap-3">
        <h2 className="text-xl font-bold mb-2">Lista de publicidades</h2>
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="flex justify-between items-center bg-gray-50 p-3 rounded shadow-sm"
          >
            <div className="flex items-center gap-3">
              {ad.image_url ? (
                <img
                  src={`http://localhost:4000/${ad.image_url}`}
                  alt={ad.title}
                  className="w-20 h-20 object-cover rounded"
                  onClick={() =>
                    setModalImage(`http://localhost:4000/${ad.image_url}`)
                  }
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm">
                  Sem imagem
                </div>
              )}
              <div>
                <h3 className="font-semibold">{ad.title}</h3>
                <p className="text-sm text-gray-600">
                  Prioridade: {ad.priority} • {ad.active ? "Ativa" : "Inativa"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingId(ad.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Editar
              </button>
              <button
                onClick={() => confirmDeleteAd(ad.id, ad.title)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Deletar
              </button>
            </div>
          </div>
        ))}
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
              Tem certeza que deseja excluir a publicidade{" "}
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
