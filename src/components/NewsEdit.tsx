import { useEffect, useState } from "react";

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
  images: string[]; // imagens já existentes (URLs)
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
    images: [] as File[], // novas imagens
  });

  const [existingImages, setExistingImages] = useState<string[]>([]); // imagens atuais
  const [previews, setPreviews] = useState<string[]>([]);

  // carregar notícia
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `http://api_jornal.railway.internal:4000/news/${id}`
        );
        const data: NewsData = await res.json();
        setForm({ ...data, images: [] });
        setExistingImages(data.images || []);
      } catch (err) {
        console.error("Erro ao carregar notícia:", err);
      }
    };
    fetchNews();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.files) {
      let fileArray: File[] = Array.from(e.target.files);
      if (fileArray.length > 10) {
        fileArray = fileArray.slice(0, 10);
        alert("Você só pode adicionar até 10 imagens.");
      }
      setForm({ ...form, images: fileArray });
      setPreviews(fileArray.map((file) => URL.createObjectURL(file)));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const removeExistingImage = (index: number) => {
    const newImages = [...existingImages];
    newImages.splice(index, 1);
    setExistingImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", form.title);
    data.append("content", form.content);
    data.append("category", form.category);
    data.append("city_id", form.city_id);

    // enviar novas imagens
    form.images.forEach((img) => data.append("images", img));
    // enviar imagens antigas restantes
    existingImages.forEach((img) => data.append("existingImages", img));

    try {
      await fetch(`http://api_jornal.railway.internal:4000/news/${id}`, {
        method: "PUT",
        body: data,
      });
      onSaved();
    } catch (err) {
      console.error("Erro ao salvar notícia:", err);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">Editar notícia</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Título"
          className="border p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Conteúdo"
          className="border p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={5}
          required
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          className="border p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            <div className="flex gap-2 flex-wrap">
              {existingImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={`http://api_jornal.railway.internal:4000/${img}`}
                    alt={`imagem ${idx}`}
                    className="w-32 h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
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
            <div className="flex gap-2 flex-wrap">
              {previews.map((src, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={src}
                    alt={`preview ${idx}`}
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="mt-2"
        />

        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600"
          >
            Salvar alterações
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
