interface PageHeroProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHero({ title, description, className }: PageHeroProps) {
  return (
    <header className={`mb-6 sm:mb-8 ${className ?? ""}`}>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
      {description && (
        <p className="mt-2 max-w-2xl text-slate-600">{description}</p>
      )}
    </header>
  );
}
