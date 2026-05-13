export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-[30px] border border-dashed border-[#cfe0eb] bg-white/72 px-6 py-14 text-center shadow-[0_22px_44px_-32px_rgba(31,78,121,0.45)]">
      <h3 className="text-xl font-bold text-[#17324d]">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#637486]">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
