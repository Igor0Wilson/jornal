import { Link } from "react-router-dom";

interface Noticia {
  id: number;
  title: string;
  category: string;
  created_at: string;
  image_url?: string;
  images?: string[];
}

interface NewsCardProps {
  titulo: string;
  categoria: string;
  data: string;
  imagem: string;
}

function NewsCard({ titulo, categoria, data, imagem }: NewsCardProps) {
  return (
    <article className="flex gap-4 border-b border-gray-200 pb-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
      <img
        src={imagem}
        alt={titulo}
        className="w-40 h-28 md:w-48 md:h-32 lg:w-56 lg:h-36 object-cover rounded-md flex-shrink-0"
      />
      <div className="flex flex-col justify-between">
        <span className="text-sm font-semibold text-yellow-600">
          {categoria}
        </span>
        <h3 className="text-lg font-bold text-gray-800">{titulo}</h3>
        <p className="text-xs text-gray-500">{data}</p>
      </div>
    </article>
  );
}

interface NewsListProps {
  noticias: Noticia[];
}

export default function NewsList({ noticias }: NewsListProps) {
  return (
    <div className="flex flex-col gap-4">
      {noticias.map((noticia) => {
        const imagem =
          Array.isArray(noticia.images) && noticia.images.length > 0
            ? noticia.images[0]
            : noticia.image_url ||
              "https://via.placeholder.com/150x100?text=Sem+imagem";

        return (
          <Link key={noticia.id} to={`/news/${noticia.id}`}>
            <NewsCard
              titulo={noticia.title}
              categoria={noticia.category}
              data={new Date(noticia.created_at).toLocaleDateString("pt-BR")}
              imagem={imagem}
            />
          </Link>
        );
      })}
    </div>
  );
}
