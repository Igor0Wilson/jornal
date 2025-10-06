// NewsList.tsx
import { Link } from "react-router-dom";

export interface Noticia {
  id: number;
  title: string;
  category: string;
  created_at: string;
  images: string[]; // array de URLs ou caminhos do backend
  city?: string;
  region?: string;
  date?: string;
}

interface NewsListProps {
  noticias: Noticia[];
}

export default function NewsList({ noticias }: NewsListProps) {
  return (
    <div className="flex flex-col gap-4">
      {noticias.map((noticia) => {
        // Pegar a primeira imagem disponível
        const primeiraImagem =
          noticia.images && noticia.images.length > 0
            ? noticia.images[0].startsWith("http")
              ? noticia.images[0] // URL completa (Cloudinary ou externa)
              : `https://apijornal-production.up.railway.app/${noticia.images[0].replace(
                  /\\/g,
                  "/"
                )}` // caminho relativo do backend
            : "https://via.placeholder.com/400x250?text=Sem+imagem"; // placeholder

        return (
          <Link key={noticia.id} to={`/news/${noticia.id}`}>
            <div className="flex gap-4 p-4 border-b hover:bg-gray-50 cursor-pointer">
              <div className="w-40 h-28 md:w-48 md:h-32 lg:w-56 lg:h-36 flex-shrink-0 rounded-md overflow-hidden">
                <img
                  src={primeiraImagem}
                  alt={noticia.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between flex-1">
                <span className="text-sm font-semibold text-yellow-600">
                  {noticia.category}
                </span>
                <h2 className="text-lg font-bold text-gray-800 line-clamp-2">
                  {noticia.title}
                </h2>
                <p className="text-xs text-gray-500">
                  {new Date(noticia.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
