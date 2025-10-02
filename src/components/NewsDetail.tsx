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
    fetch(`http://localhost:4000/news/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setNoticia(Array.isArray(data) ? data[0] : data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!noticia) return <p>Carregando...</p>;

  // Preparar imagens
  const imagens = noticia.images?.length
    ? noticia.images.map((img) => img.replace(/\\/g, "/"))
    : noticia.image_url
    ? [noticia.image_url.replace(/\\/g, "/")]
    : ["https://via.placeholder.com/600x400?text=Sem+imagem"];

  const imagemPrincipal = imagens[0];
  const imagensMenores = imagens.slice(1);

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-3">{noticia.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {noticia.author || "Redação"} |{" "}
        {new Date(noticia.created_at).toLocaleDateString("pt-BR")} | Tempo de
        leitura: 3 min
      </p>

      {/* Imagem principal completa */}
      <div className="mb-6">
        <img
          src={`http://localhost:4000/${imagemPrincipal}`}
          alt={noticia.title}
          className="w-full rounded-lg object-contain"
        />
      </div>

      {/* Conteúdo da notícia */}
      <div className="text-lg leading-relaxed text-gray-800 whitespace-pre-line mb-6">
        {noticia.content}
      </div>

      {/* Miniaturas das demais imagens */}

      {imagensMenores.length > 0 && (
        <div className="flex gap-3 overflow-x-auto mb-6">
          {imagensMenores.map((img, i) => (
            <img
              key={i}
              src={`http://localhost:4000/${img}`}
              alt={`Imagem ${i + 1}`}
              className="w-36 h-24 rounded-md object-cover flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
            />
          ))}
          <div className="max-w-3xl mx-auto my-12 p-6 bg-white-100 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4"></div>
        </div>
      )}

      <Footer />
    </main>
  );
}
