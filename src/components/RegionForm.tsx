import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface RegionFormValues {
  name: string;
}

export default function RegionForm() {
  const { register, handleSubmit, reset } = useForm<RegionFormValues>();
  const [regions, setRegions] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [regionToDelete, setRegionToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = () => {
    fetch("http://localhost:4000/regions")
      .then((res) => res.json())
      .then((data) => setRegions(data));
  };

  const onSubmit = async (data: RegionFormValues) => {
    try {
      const res = await fetch("http://localhost:4000/regions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao criar região");
      toast.success("Região criada com sucesso!");
      fetchRegions();
      reset();
    } catch (err: any) {
      toast.error(err.message || "Erro desconhecido");
    }
  };

  const confirmDelete = async () => {
    if (regionToDelete === null) return;
    try {
      // DELETE agora funciona com nossa API
      const res = await fetch(
        `http://localhost:4000/regions/${regionToDelete}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Erro ao deletar região");
      toast.success("Região deletada com sucesso!");
      fetchRegions();
    } catch (err: any) {
      toast.error(err.message || "Erro desconhecido");
    } finally {
      setModalOpen(false);
      setRegionToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-100 min-h-screen">
      {/* Container branco */}
      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col gap-6 w-full">
        {/* Formulário */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <input
            {...register("name", { required: true })}
            placeholder="Nome da região"
            className="border p-2 rounded w-full"
          />
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full"
          >
            Criar Região
          </button>
        </form>

        {/* Lista de regiões */}
        <div className="flex flex-col gap-2 w-full">
          {regions.map((region) => (
            <div
              key={region.id}
              className="bg-gray-50 p-3 rounded shadow flex justify-between items-center w-full"
            >
              <span>{region.name}</span>
              <button
                onClick={() => {
                  setRegionToDelete(region.id);
                  setModalOpen(true);
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Deletar
              </button>
            </div>
          ))}
        </div>
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
            <p>Tem certeza que deseja deletar esta região?</p>
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
