import { useLocation } from "preact-iso";
import { useEffect, useState } from "preact/hooks";
import { promotionArticles, PromotionArticle } from "./articleData";
import { FolderOpen } from "lucide-preact";
import NotFound404 from "../not-found";

interface ArticlePageProps {
  articleId: string; // Route parameter comes as a prop
}

export default function ArticlePage({ articleId }: ArticlePageProps) {
  const [article, setArticle] = useState<PromotionArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundArticle = promotionArticles[parseInt(articleId, 10)];
    if (foundArticle) {
      setArticle(foundArticle);
    }
    setLoading(false);
  }, [articleId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!article) {
    return <NotFound404 />;
  }

  return (
    <div className="flex flex-col p-3 md:py-6 md:px-40 gap-6 bg-[var(--bar-background-color)] md:mx-40">
      {/* Promotion Image */}
      <div className="w-full">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-auto rounded-xl object-cover"
        />
      </div>

      {/* Title */}
      <div className="w-full">
        <h1 className="text-2xl md:text-4xl font-bold text-[var(--primary-color)]">
          {article.title}
        </h1>
      </div>

      {/* Content */}
      <div className="w-full">
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
          style={{
            color: 'var(--text-primary-color)',
          }}
        />
      </div>

      {/* Category */}
      <div className="w-full flex items-center gap-2 text-[#E2FF65]">
          <FolderOpen className="w-4 h-4" /> <span> {article.category ? article.category : "Uncategorised"}</span>
      </div>
    </div>
  );
}