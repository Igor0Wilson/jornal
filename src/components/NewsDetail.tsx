import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "./Footer";

interface Noticia {
  id: number;
  title: string;
  category: string;
  created_at: string;
  content: string;
  author?: string;
  images?: string[];
  image_url?: string | null;
}

interface Publicidade {
  id: number;
  title: string;
  link: string;
  image: string;
}

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [ads, setAds] = useState<Publicidade[]>([]);
  const [modalImg, setModalImg] = useState<string | null>(null); // modal de imagem

  // Buscar notícia
  useEffect(() => {
    fetch(`https://apijornal-production.up.railway.app/news/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setNoticia(Array.isArray(data) ? data[0] : data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Buscar publicidades
  useEffect(() => {
    fetch("https://apijornal-production.up.railway.app/publicidade")
      .then((res) => res.json())
      .then((data) => setAds(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar publicidades:", err));
  }, []);

  if (!noticia) return <p>Carregando...</p>;

  const imagens = noticia.images?.length
    ? noticia.images
    : noticia.image_url
    ? [noticia.image_url]
    : ["https://via.placeholder.com/600x400?text=Sem+imagem"];

  const imagemPrincipal = imagens[0];
  const imagensMenores = imagens.slice(1);

  const resolveImageUrl = (url: string) =>
    url.startsWith("http")
      ? url
      : `https://apijornal-production.up.railway.app/${url.replace(
          /\\/g,
          "/"
        )}`;

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-3">{noticia.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {noticia.author || "Redação"} |{" "}
        {new Date(noticia.created_at).toLocaleDateString("pt-BR")} | Tempo de
        leitura: 3 min
      </p>

      {/* Imagem principal */}
      <div className="mb-6">
        <img
          src={resolveImageUrl(imagemPrincipal)}
          alt={noticia.title}
          className="w-full rounded-lg object-contain cursor-pointer"
          onClick={() => setModalImg(resolveImageUrl(imagemPrincipal))}
        />
      </div>

      {/* Conteúdo */}
      <div className="text-lg leading-relaxed text-gray-800 whitespace-pre-line mb-6">
        {noticia.content}
      </div>

      {/* Miniaturas */}
      {imagensMenores.length > 0 && (
        <div className="flex gap-3 overflow-x-auto mb-6">
          {imagensMenores.map((img, i) => (
            <img
              key={i}
              src={resolveImageUrl(img)}
              alt={`Imagem ${i + 1}`}
              className="w-36 h-24 rounded-md object-cover flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setModalImg(resolveImageUrl(img))}
            />
          ))}
        </div>
      )}

      {/* Publicidades */}

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

      {/* Modal */}
      {modalImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setModalImg(null)}
        >
          <img
            src={modalImg}
            alt="Imagem ampliada"
            className="max-w-[90%] max-h-[90%] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()} // impede fechar clicando na imagem
          />
        </div>
      )}

      <Footer />
    </main>
  );
}
