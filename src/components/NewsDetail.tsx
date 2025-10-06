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

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const [noticia, setNoticia] = useState<Noticia | null>(null);

  useEffect(() => {
    fetch(`https://apijornal-production.up.railway.app/news/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setNoticia(Array.isArray(data) ? data[0] : data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!noticia) return <p>Carregando...</p>;

  // Monta lista de imagens
  const imagens = noticia.images?.length
    ? noticia.images
    : noticia.image_url
    ? [noticia.image_url]
    : ["https://via.placeholder.com/600x400?text=Sem+imagem"];

  // Separa principal e miniaturas
  const imagemPrincipal = imagens[0];
  const imagensMenores = imagens.slice(1);

  // Função para tratar URL
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
          className="w-full rounded-lg object-contain"
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
            />
          ))}
        </div>
      )}

      <Footer />
    </main>
  );
}
