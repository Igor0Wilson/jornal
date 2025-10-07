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
  const [ads, setAds] = useState<any[]>([]);

  // Carregar publicidades
  useEffect(() => {
    fetch("https://apijornal-production.up.railway.app/publicidade")
      .then((res) => res.json())
      .then((data) => setAds(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar publicidades:", err));
  }, []);

  // Carregar notícias
  useEffect(() => {
    fetch("https://apijornal-production.up.railway.app/news")
      .then((res) => res.json())
      .then((data) => setNoticias(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar notícias:", err));
  }, []);

  // Carregar regiões
  useEffect(() => {
    fetch("https://apijornal-production.up.railway.app/regions")
      .then((res) => res.json())
      .then((data) => setRegions(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar regiões:", err));
  }, []);

  // Carregar cidades conforme a região selecionada
  useEffect(() => {
    if (selectedRegion) {
      fetch(
        `https://apijornal-production.up.railway.app/cities?region_id=${selectedRegion}`
      )
        .then((res) => res.json())
        .then((data) => setCities(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Erro ao carregar cidades:", err));
      setSelectedCity("");
    } else {
      setCities([]);
      setSelectedCity("");
    }
  }, [selectedRegion]);

  // Filtro de notícias
  const noticiasFiltradas = noticias.filter((n) => {
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
    if (n.created_at) {
      const noticiaData = new Date(n.created_at);
      if (dataInicio) filtroData = noticiaData >= new Date(dataInicio);
      if (dataFim) filtroData = filtroData && noticiaData <= new Date(dataFim);
    }

    return filtroTexto && filtroLocal && filtroData;
  });

  const noticiasOrdenadas = [...noticiasFiltradas].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const principais = noticiasOrdenadas.slice(0, 3);
  const restantes = noticiasOrdenadas.slice(3);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow max-w-6xl mx-auto p-6">
        {/* === FILTROS === */}
        <div className="bg-gray-100 p-4 rounded-xl mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <select
              value={selectedRegion}
              onChange={(e) =>
                setSelectedRegion(e.target.value ? Number(e.target.value) : "")
              }
              className="p-2 rounded-md border border-gray-300"
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
              disabled={!selectedRegion}
              className="p-2 rounded-md border border-gray-300"
            >
              <option value="">Todas as cidades</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="p-2 rounded-md border border-gray-300"
            />
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="p-2 rounded-md border border-gray-300"
            />

            <button
              onClick={() => {
                setSelectedCity("");
                setSelectedRegion("");
                setDataInicio("");
                setDataFim("");
                setBusca("");
              }}
              className="bg-black text-white rounded-md p-2 font-semibold hover:bg-gray-800"
            >
              Limpar filtros
            </button>
          </div>
        </div>

        {/* === DESTAQUES === */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {principais.length > 0 && (
            <>
              <a
                href={`/news/${principais[0].id}`}
                className="lg:col-span-2 relative rounded-xl overflow-hidden shadow-md"
              >
                <img
                  src={
                    principais[0].images?.[0] ||
                    "https://via.placeholder.com/600x400?text=Sem+imagem"
                  }
                  alt={principais[0].title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6">
                  <h2 className="text-3xl font-bold text-white leading-snug">
                    {principais[0].title}
                  </h2>
                  <p className="text-yellow-400 text-sm font-semibold mt-2">
                    {principais[0].category}
                  </p>
                </div>
              </a>

              <div className="flex flex-col gap-6">
                {principais.slice(1, 3).map((n) => (
                  <a
                    key={n.id}
                    href={`/news/${n.id}`}
                    className="relative rounded-xl overflow-hidden shadow-md h-44"
                  >
                    <img
                      src={
                        n.images?.[0] ||
                        "https://via.placeholder.com/400x200?text=Sem+imagem"
                      }
                      alt={n.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4">
                      <h3 className="text-white text-base font-bold leading-tight">
                        {n.title}
                      </h3>
                      <p className="text-yellow-400 text-xs font-semibold">
                        {n.category}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </section>

        {/* === CONTEÚDO PRINCIPAL + SIDEBAR === */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <NewsList noticias={restantes} />
          </div>

          <div className="lg:col-span-1">
            <Sidebar noticias={noticiasOrdenadas} />
          </div>
        </section>

        {/* === PUBLICIDADES === */}
        {ads.length > 0 && (
          <section className="max-w-6xl mx-auto mt-10 px-6">
            <div className="flex items-center space-x-4 border-b border-gray-300 pb-2 mb-4">
              <span className="text-gray-700 font-semibold cursor-pointer">
                Publicidade
              </span>
            </div>

            {/* Grid responsivo com cards maiores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {ads.map((ad) => (
                <a
                  key={ad.id}
                  href={ad.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg overflow-hidden shadow-lg bg-white hover:scale-105 transition-transform duration-200"
                >
                  <div className="w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden">
                    <img
                      src={
                        ad.image
                          ? ad.image
                          : "https://via.placeholder.com/400x300?text=Sem+imagem"
                      }
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-base font-semibold text-gray-800">
                      {ad.title}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
