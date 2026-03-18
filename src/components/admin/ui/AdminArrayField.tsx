"use client";

interface AdminArrayFieldProps {
  label?: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}

export function AdminArrayField({
  label,
  items,
  onChange,
  placeholder = "新增項目",
  addLabel = "+ 新增",
}: AdminArrayFieldProps) {
  const add = () => onChange([...items, ""]);
  const update = (idx: number, value: string) => {
    const next = [...items];
    next[idx] = value;
    onChange(next);
  };
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700">{label}</label>
      )}
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              刪除
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="text-sm text-primary-600 hover:underline"
        >
          {addLabel}
        </button>
      </div>
    </div>
  );
}
