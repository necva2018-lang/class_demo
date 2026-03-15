import type { TestimonialCardProps } from "@/components/types";

export function TestimonialCard({
  quote,
  author,
  role,
  courseName,
  avatar,
  className = "",
}: TestimonialCardProps) {
  return (
    <blockquote
      className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
    >
      <p className="text-slate-700">&ldquo;{quote}&rdquo;</p>
      <footer className="mt-4 flex items-center gap-3">
        {avatar ? (
          <img
            src={avatar}
            alt={author}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
            {author.charAt(0)}
          </div>
        )}
        <div>
          <cite className="not-italic font-semibold text-slate-900">
            {author}
          </cite>
          {role && (
            <p className="text-sm text-slate-600">{role}</p>
          )}
          {courseName && (
            <p className="text-xs text-indigo-600">{courseName}</p>
          )}
        </div>
      </footer>
    </blockquote>
  );
}
