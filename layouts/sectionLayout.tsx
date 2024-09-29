// lib
import { cn } from "@/lib/utils";

export default function SectionLayout({
  bg,
  className,
  children,
}: {
  bg?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn(bg ? bg : "bg-white")}>
      <div className={cn("mx-auto w-full", className)}>{children}</div>
    </section>
  );
}
