import { Plus } from "lucide-react";

export type Faq = { question: string; answer: string };

/**
 * Native details/summary: zero JavaScript, works before hydration, and search
 * engines can read the answers directly.
 */
export function FaqList({ items }: { items: Faq[] }) {
  if (!items.length) return null;
  return (
    <div className="divide-y divide-line overflow-hidden rounded-[14px] border border-line bg-white shadow-soft">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 text-[15px] font-semibold text-navy-900 marker:hidden hover:bg-navy-50 sm:text-base">
            <span>{item.question}</span>
            <Plus
              className="mt-0.5 h-5 w-5 shrink-0 text-brand-600 transition-transform duration-200 group-open:rotate-45"
              aria-hidden
            />
          </summary>
          <div className="px-5 pb-5 text-[14.5px] leading-relaxed text-muted">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
