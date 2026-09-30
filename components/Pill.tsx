import Link from "next/link";

const base =
  "inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 font-sans text-[13px] font-bold tracking-[0.03em]";

const tones = {
  sage: "bg-sage-soft text-sage",
  burgundy: "bg-burgundy text-white",
} as const;

type PillProps = {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  href?: string;
};

export function Pill({ children, tone = "sage", href }: PillProps) {
  const className = `${base} ${tones[tone]}`;
  if (href) {
    return (
      <Link
        href={href}
        className={`${className} no-underline transition-opacity hover:opacity-80`}
      >
        {children}
      </Link>
    );
  }
  return <span className={className}>{children}</span>;
}
