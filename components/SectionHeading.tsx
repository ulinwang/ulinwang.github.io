export default function SectionHeading({
  index,
  title,
}: {
  index: string;
  title: string;
}) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="font-display text-sm text-accent-cyan">{index}</span>
      <h2 className="font-display text-3xl font-bold md:text-4xl">{title}</h2>
      <span className="h-px flex-1 self-center bg-gradient-to-r from-white/20 to-transparent" />
    </div>
  );
}
