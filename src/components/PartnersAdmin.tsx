import { useState, useEffect } from "react";

export default function PartnersAdmin() {
  const [partners, setPartners] = useState<any[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    id: number | null;
    company_name: string;
  }>({ id: null, company_name: "" });

  const [form, setForm] = useState({
    company_name: "",
    description: "",
    link: "",
    image: null as File | null,
  });

  // --- Fetch Partners ---
  const fetchPartners = async () => {
    try {
      const res = await fetch(
        "https://apijornal-production.up.railway.app/partners"
      );
      const data = await res.json();
      setPartners(Array.isArray(data) ? data : data.rows);
    } catch (err) {
      console.error("Erro ao carregar parceiros:", err);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // --- Handlers ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement; // cast para HTMLInputElement
    const { name, value } = target;

    if (target.files && target.files[0]) {
      const file = target.files[0];
      setForm({ ...form, image: file });
      setPreviews([URL.createObjectURL(file)]);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("company_name", form.company_name);
    data.append("description", form.description);
    data.append("link", form.link);
    if (form.image) data.append("image", form.image);

    try {
      await fetch("https://apijornal-production.up.railway.app/partners", {
        method: "POST",
        body: data,
      });

      // Limpar form após cadastro
      setForm({ company_name: "", description: "", link: "", image: null });
      setPreviews([]);

      // Atualizar lista de parceiros
      fetchPartners();
    } catch (err) {
      console.error("Erro ao cadastrar parceiro:", err);
    }
  };

  const confirmDeletePartner = (id: number, company_name: string) =>
    setConfirmDelete({ id, company_name });

  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    await fetch(
      `https://apijornal-production.up.railway.app/partners/${confirmDelete.id}`,
      { method: "DELETE" }
    );
    setConfirmDelete({ id: null, company_name: "" });
    fetchPartners();
  };

  // --- Render Normal View ---
  return (
    <div className="flex flex-col gap-6">
      {/* Cadastro */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-md p-6 flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold mb-2">Cadastrar novo parceiro</h2>
        <input
          type="text"
          name="company_name"
          placeholder="Nome da empresa"
          value={form.company_name}
          onChange={handleChange}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <textarea
          name="description"
          placeholder="Descrição"
          value={form.description}
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
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
        >
          Salvar parceiro
        </button>
      </form>

      {/* Listagem */}
      <div className="bg-white shadow-md rounded-md p-4 flex flex-col gap-3">
        <h2 className="text-xl font-bold mb-2">Lista de parceiros</h2>
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="flex justify-between items-center bg-gray-50 p-3 rounded shadow-sm"
          >
            <div className="flex items-center gap-3">
              {partner.image_url ? (
                <img
                  src={partner.image_url}
                  alt={partner.company_name}
                  className="w-20 h-20 object-cover rounded"
                  onClick={() => setModalImage(partner.image_url)}
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm">
                  Sem imagem
                </div>
              )}

              <div>
                <h3 className="font-semibold">{partner.company_name}</h3>
                <p className="text-sm text-gray-600">{partner.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  confirmDeletePartner(partner.id, partner.company_name)
                }
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
              Tem certeza que deseja excluir o parceiro{" "}
              <b>{confirmDelete.company_name}</b>?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setConfirmDelete({ id: null, company_name: "" })}
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
