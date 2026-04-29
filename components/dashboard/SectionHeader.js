import Link from "next/link";

export default function SectionHeader({ title, action, icon }) {
  return (
    <div className="flex min-h-[63px] items-start justify-between border-b border-black/10 bg-[#111111] px-5 py-5 text-white md:min-h-[65px]">
      <h2 className="text-lg font-medium leading-none md:text-[1.25rem]">{title}</h2>
      {action ? (
        <Link href={action.href} className="text-sm underline underline-offset-2 md:text-base">
          {action.label}
        </Link>
      ) : (
        icon
      )}
    </div>
  );
}
