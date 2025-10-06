// NewsList.tsx
import { Link } from "react-router-dom";

export interface Noticia {
  id: number;
  title: string;
  category: string;
  created_at: string;
  images: string[]; // array de URLs
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
        const primeiraImagem =
          noticia.images && noticia.images.length > 0
            ? noticia.images[0].replace(/\\/g, "/")
            : "https://via.placeholder.com/150x100?text=Sem+imagem";

        return (
          <Link key={noticia.id} to={`/news/${noticia.id}`}>
            <div className="flex gap-4 p-4 border-b hover:bg-gray-50 cursor-pointer">
              <div className="w-40 h-28 md:w-48 md:h-32 lg:w-56 lg:h-36 flex-shrink-0">
                <img
                  src={`http://api_jornal.railway.internal:4000/${primeiraImagem}`}
                  alt={noticia.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="flex flex-col justify-between flex-1">
                <span className="text-sm font-semibold text-yellow-600">
                  {noticia.category}
                </span>
                <h2 className="text-lg font-bold text-gray-800">
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
