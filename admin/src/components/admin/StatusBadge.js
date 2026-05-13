const statusMap = {
  new: "bg-[#ebf6ff] text-[#1f4e79] border-[#cfe6f5]",
  contacted: "bg-[#fff4e8] text-[#a85d18] border-[#f3d5b4]",
  closed: "bg-[#edf8f0] text-[#1f7a45] border-[#cbe7d4]",
  upcoming: "bg-[#ebf6ff] text-[#1f4e79] border-[#cfe6f5]",
  customized: "bg-[#f4eefc] text-[#6b43a6] border-[#dccff0]",
};

export default function StatusBadge({ value, children }) {
  const label = children || value;
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
        statusMap[value] || "border-[#d8e3ec] bg-[#f5f8fb] text-[#526477]"
      }`}
    >
      {label}
    </span>
  );
}
