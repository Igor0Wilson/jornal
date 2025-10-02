import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import NewsList, { Noticia } from "../components/NewsList";
import Footer from "../components/Footer";

interface Region {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
  region_id: number;
}

export default function Home() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [busca, setBusca] = useState("");
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<number | "">("");
  const [selectedCity, setSelectedCity] = useState<number | "">("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // Carregar notícias
  useEffect(() => {
    fetch("http://localhost:4000/news")
      .then((res) => res.json())
      .then((data) => {
        console.log("Dados da API:", data); // Debug
        setNoticias(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Erro ao carregar notícias:", err));
  }, []);

  // Carregar regiões
  useEffect(() => {
    fetch("http://localhost:4000/regions")
      .then((res) => res.json())
      .then((data) => setRegions(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar regiões:", err));
  }, []);

  // Carregar cidades quando a região muda
  useEffect(() => {
    if (selectedRegion) {
      fetch(`http://localhost:4000/cities?region_id=${selectedRegion}`)
        .then((res) => res.json())
        .then((data) => setCities(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Erro ao carregar cidades:", err));
      setSelectedCity("");
    } else {
      setCities([]);
      setSelectedCity("");
    }
  }, [selectedRegion]);

  // Notícias filtradas localmente
  const noticiasFiltradas = Array.isArray(noticias)
    ? noticias.filter((n) => {
        const filtroTexto =
          n.title.toLowerCase().includes(busca.toLowerCase()) ||
          n.category.toLowerCase().includes(busca.toLowerCase());

        let filtroLocal = true;
        if (selectedCity) {
          const cityName = cities.find((c) => c.id === selectedCity)?.name;
          filtroLocal = cityName
            ? n.city?.toLowerCase() === cityName.toLowerCase()
            : true;
        } else if (selectedRegion) {
          const regionName = regions.find((r) => r.id === selectedRegion)?.name;
          filtroLocal = regionName
            ? n.region?.toLowerCase() === regionName.toLowerCase()
            : true;
        }

        let filtroData = true;
        if (n.date) {
          const noticiaData = new Date(n.date);
          if (dataInicio) filtroData = noticiaData >= new Date(dataInicio);
          if (dataFim)
            filtroData = filtroData && noticiaData <= new Date(dataFim);
        }

        return filtroTexto && filtroLocal && filtroData;
      })
    : [];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow max-w-6xl mx-auto p-8">
        {/* Filtros */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Buscar notícias..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          <select
            value={selectedRegion}
            onChange={(e) =>
              setSelectedRegion(e.target.value ? Number(e.target.value) : "")
            }
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Todas as regiões</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <select
            value={selectedCity}
            onChange={(e) =>
              setSelectedCity(e.target.value ? Number(e.target.value) : "")
            }
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            disabled={!selectedRegion || cities.length === 0}
          >
            <option value="">Todas as cidades</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>

        {/* Filtro rápido por categoria */}
        <div className="mb-6 flex flex-wrap gap-3">
          {[
            "Tecnologia",
            "Saúde",
            "Crimes",
            "Política",
            "Esportes",
            "Entretenimento",
            "Economia",
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setBusca(cat)}
              className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-full hover:bg-yellow-600 transition"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lista de notícias */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="overflow-auto max-h-[calc(100vh-10rem)] lg:col-span-2">
            <NewsList noticias={noticiasFiltradas} />
          </div>

          <Sidebar noticias={noticiasFiltradas} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
