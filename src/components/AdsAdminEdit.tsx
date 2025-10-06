import { useState } from "react";

interface AdsAdminEditProps {
  ad: any; // objeto da publicidade
  onCancel: () => void;
  onSaved: () => void;
}

export default function AdsAdminEdit({
  ad,
  onCancel,
  onSaved,
}: AdsAdminEditProps) {
  const [form, setForm] = useState({
    title: ad.title,
    link: ad.link,
    priority: ad.priority,
    active: ad.active,
    image: null as File | null,
  });

  const [preview, setPreview] = useState<string>(
    ad.image_url
      ? `https://apijornal-production.up.railway.app/${ad.image_url}`
      : ""
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
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
    data.append("active", form.active ? "1" : "0");
    if (form.image) data.append("image", form.image);

    try {
      await fetch(
        `https://apijornal-production.up.railway.app/publicidade/${ad.id}`,
        {
          method: "PUT",
          body: data,
        }
      );
      onSaved();
    } catch (err) {
      console.error("Erro ao atualizar publicidade:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-md p-6 flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold mb-2">Editar publicidade</h2>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="text"
          name="link"
          value={form.link}
          onChange={handleChange}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="number"
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Ativa
        </label>

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        {preview && (
          <div className="flex gap-2 flex-wrap">
            <img
              src={preview}
              alt="preview"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}

        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded border hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Salvar alterações
          </button>
        </div>
      </form>
    </div>
  );
}
