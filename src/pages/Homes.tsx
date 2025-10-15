import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import NewsList, { Noticia } from "../components/NewsList";
import Footer from "../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

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
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://apijornal-production.up.railway.app/partners")
      .then((res) => res.json())
      .then((data) => setPartners(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar parceiros:", err));
  }, []);

  useEffect(() => {
    fetch("https://apijornal-production.up.railway.app/publicidade")
      .then((res) => res.json())
      .then((data) => setAds(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar publicidades:", err));
  }, []);

  useEffect(() => {
    fetch("https://apijornal-production.up.railway.app/news")
      .then((res) => res.json())
      .then((data) => setNoticias(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar notícias:", err));
  }, []);

  useEffect(() => {
    fetch("https://apijornal-production.up.railway.app/regions")
      .then((res) => res.json())
      .then((data) => setRegions(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar regiões:", err));
  }, []);

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
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
        {/* === PUBLICIDADE (CARROSSEL) === */}
        {ads.length > 0 && (
          <section className="mb-10 w-full">
            <div className="flex items-center space-x-4 border-b border-gray-300 pb-2 mb-4">
              <span className="text-gray-700 font-semibold cursor-pointer">
                Publicidade
              </span>
            </div>

            <div className="w-full">
              <Swiper
                modules={[Navigation, Autoplay]}
                navigation
                autoplay={{ delay: 4000 }}
                loop
                spaceBetween={16}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="rounded-xl shadow-md overflow-hidden w-full"
              >
                {ads.map((ad) => (
                  <SwiperSlide key={ad.id} className="flex justify-center">
                    <a
                      href={ad.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-white rounded-lg overflow-hidden shadow-md w-full"
                    >
                      <div className="w-full aspect-video">
                        <img
                          src={
                            ad.image ||
                            "https://via.placeholder.com/1200x400?text=Publicidade"
                          }
                          alt={ad.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
        )}

        {/* === FILTROS === */}
        <div className="bg-gray-100 p-4 rounded-xl mb-8 shadow-sm w-full overflow-x-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 min-w-[300px]">
            <select
              value={selectedRegion}
              onChange={(e) =>
                setSelectedRegion(e.target.value ? Number(e.target.value) : "")
              }
              className="p-2 rounded-md border border-gray-300 w-full"
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
              className="p-2 rounded-md border border-gray-300 w-full disabled:opacity-60"
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
              className="p-2 rounded-md border border-gray-300 w-full"
            />
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="p-2 rounded-md border border-gray-300 w-full"
            />

            <button
              onClick={() => {
                setSelectedCity("");
                setSelectedRegion("");
                setDataInicio("");
                setDataFim("");
                setBusca("");
              }}
              className="bg-black text-white rounded-md p-2 font-semibold hover:bg-gray-800 w-full"
            >
              Limpar filtros
            </button>
          </div>
        </div>

        {/* === DESTAQUES === */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {principais.length > 0 && (
            <>
              <a
                href={`/news/${principais[0].id}`}
                className="lg:col-span-2 relative rounded-xl overflow-hidden shadow-md"
              >
                <div className="w-full aspect-video lg:aspect-[4/3]">
                  <img
                    src={
                      principais[0].images?.[0] ||
                      "https://via.placeholder.com/600x400?text=Sem+imagem"
                    }
                    alt={principais[0].title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
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
                    className="relative rounded-xl overflow-hidden shadow-md"
                  >
                    <div className="w-full aspect-video">
                      <img
                        src={
                          n.images?.[0] ||
                          "https://via.placeholder.com/400x200?text=Sem+imagem"
                        }
                        alt={n.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
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

        {/* === PARCEIROS === */}
        {partners.length > 0 && (
          <section className="max-w-7xl mx-auto mt-10 px-4 sm:px-6">
            <div className="flex items-center space-x-4 border-b border-gray-300 pb-2 mb-4">
              <span className="text-gray-700 font-semibold cursor-pointer">
                Parceiros
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {partners.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg overflow-hidden shadow-lg bg-white hover:scale-105 transition-transform duration-200"
                >
                  <div className="w-full aspect-[4/3] md:aspect-video overflow-hidden">
                    <img
                      src={
                        partner.image_url ||
                        "https://via.placeholder.com/400x300?text=Sem+imagem"
                      }
                      alt={partner.company_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-base font-semibold text-gray-800 text-center">
                      {partner.company_name}
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
