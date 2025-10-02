import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface CityFormValues {
  name: string;
  region_id: number; // adicionamos o campo de região
}

interface Region {
  id: number;
  name: string;
}

export default function CityForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CityFormValues>();
  const [cities, setCities] = useState<any[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchCities();
    fetchRegions();
  }, []);

  const fetchCities = () => {
    fetch("http://localhost:4000/cities")
      .then((res) => res.json())
      .then((data) => setCities(data));
  };

  const fetchRegions = () => {
    fetch("http://localhost:4000/regions")
      .then((res) => res.json())
      .then((data) => setRegions(data));
  };

  const onSubmit = async (data: CityFormValues) => {
    try {
      const res = await fetch("http://localhost:4000/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao criar cidade");
      toast.success("Cidade criada com sucesso!");
      fetchCities();
      reset();
    } catch (err: any) {
      toast.error(err.message || "Erro desconhecido");
    }
  };

  const confirmDelete = async () => {
    if (cityToDelete === null) return;
    try {
      const res = await fetch(`http://localhost:4000/cities/${cityToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao deletar cidade");
      toast.success("Cidade deletada!");
      fetchCities();
    } catch (err: any) {
      toast.error(err.message || "Erro desconhecido");
    } finally {
      setModalOpen(false);
      setCityToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col gap-6 w-full">
        {/* Formulário */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <input
            {...register("name", {
              required: "O nome da cidade é obrigatório",
            })}
            placeholder="Nome da cidade"
            className="border p-2 rounded w-full"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}

          <select
            {...register("region_id", { required: "Selecione uma região" })}
            className="border p-2 rounded w-full"
            defaultValue=""
          >
            <option value="" disabled>
              Selecione uma região
            </option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
          {errors.region_id && (
            <span className="text-red-500 text-sm">
              {errors.region_id.message}
            </span>
          )}

          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full"
          >
            Criar Cidade
          </button>
        </form>

        {/* Lista de cidades */}
        <div className="flex flex-col gap-2 w-full">
          {cities.map((city) => (
            <div
              key={city.id}
              className="bg-gray-50 p-3 rounded shadow flex justify-between items-center w-full"
            >
              <span>{city.name}</span>
              <button
                onClick={() => {
                  setCityToDelete(city.id);
                  setModalOpen(true);
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1"
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
            <p>Tem certeza que deseja deletar esta cidade?</p>
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
