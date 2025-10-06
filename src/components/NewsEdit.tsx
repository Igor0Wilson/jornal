import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  id: number;
  cities: any[];
  regions: any[];
  onCancel: () => void;
  onSaved: () => void;
}

interface NewsData {
  title: string;
  content: string;
  category: string;
  city_id: string;
  images?: string[];
}

export default function NewsEdit({
  id,
  cities,
  regions,
  onCancel,
  onSaved,
}: Props) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    city_id: "",
    images: [] as File[],
  });
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar notícia
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `https://apijornal-production.up.railway.app/news/${id}`
        );
        const data = await res.json();
        const noticia = Array.isArray(data) ? data[0] : data;

        setForm({
          title: noticia.title || "",
          content: noticia.content || "",
          category: noticia.category || "",
          city_id: noticia.city_id?.toString() || "",
          images: [],
        });

        setExistingImages(noticia.images || []);
      } catch (err) {
        toast.error("Erro ao carregar notícia");
        console.error("Erro ao carregar notícia:", err);
      }
    };

    fetchNews();
  }, [id]);

  // Alterações do formulário
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (files) {
      let fileArray = Array.from(files);
      if (fileArray.length > 10) {
        toast.error("Você só pode adicionar até 10 imagens.");
        fileArray = fileArray.slice(0, 10);
      }
      setForm({ ...form, images: fileArray });
      setPreviews(fileArray.map((file) => URL.createObjectURL(file)));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Remover imagem existente
  const removeExistingImage = (index: number) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  // Salvar alterações
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", form.title);
    data.append("content", form.content);
    data.append("category", form.category);
    data.append("city_id", form.city_id);

    form.images.forEach((img) => data.append("images", img));
    existingImages.forEach((img) => data.append("existingImages", img));

    try {
      const res = await fetch(
        `https://apijornal-production.up.railway.app/news/${id}`,
        {
          method: "PUT",
          body: data,
        }
      );

      if (!res.ok) throw new Error("Erro ao salvar notícia");

      toast.success("Notícia atualizada com sucesso!");
      onSaved();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar alterações");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Editar Notícia</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Título */}
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Título da notícia"
          className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />

        {/* Conteúdo */}
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Conteúdo da notícia"
          className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
          rows={6}
          required
        />

        {/* Categoria */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
          required
        >
          <option value="">Selecione a categoria</option>
          {[
            "Tecnologia",
            "Saúde",
            "Crimes",
            "Política",
            "Esportes",
            "Entretenimento",
          ].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Cidade */}
        <select
          name="city_id"
          value={form.city_id}
          onChange={handleChange}
          className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
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

        {/* Imagens existentes */}
        {existingImages.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Imagens atuais</h3>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img}
                    alt={`imagem-${i}`}
                    className="w-32 h-32 object-cover rounded"
                  />

                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Novas imagens */}
        {previews.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Novas imagens</h3>
            <div className="flex flex-wrap gap-3">
              {previews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`preview-${i}`}
                  className="w-32 h-32 object-cover rounded"
                />
              ))}
            </div>
          </div>
        )}

        {/* Upload */}
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="mt-2"
        />

        {/* Botões */}
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            } transition`}
          >
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
