import { Link } from "react-router-dom";
import { Clock, Tag } from "lucide-react";

interface Noticia {
  id: number;
  title: string;
  category: string;
  created_at: string;
  image_url?: string;
}

interface SidebarProps {
  noticias: Noticia[];
}

export default function SidebarModern({ noticias }: SidebarProps) {
  // Pega as 5 mais recentes
  const maisRecentes = [...noticias]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  return (
    <aside className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <ol className="flex flex-col gap-5">
        {maisRecentes.map((noticia, i) => (
          <li
            key={noticia.id}
            className="flex gap-3 items-start hover:bg-yellow-50 p-2 rounded-lg transition-all"
          >
            {/* Número com fundo circular */}
            <span className="bg-yellow-500 text-white w-10 h-10 flex items-center justify-center font-bold rounded-full flex-shrink-0 shadow-md">
              {i + 1}
            </span>

            <div className="flex-1 flex flex-col gap-1">
              {/* Título clicável */}
              <Link
                to={`/news/${noticia.id}`}
                className="text-sm font-semibold text-gray-800 hover:text-yellow-600 transition-colors"
              >
                {noticia.title}
              </Link>

              {/* Categoria e data com ícones */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Tag size={14} />
                  <span>{noticia.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>
                    {new Date(noticia.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
