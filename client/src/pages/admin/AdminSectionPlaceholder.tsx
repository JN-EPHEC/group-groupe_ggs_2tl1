type AdminSectionPlaceholderProps = {
  title: string;
};

export default function AdminSectionPlaceholder({ title }: AdminSectionPlaceholderProps) {
  return (
    <>
      <h2 className="text-xl font-serif font-normal mb-4">{title}</h2>
      <p className="text-sm text-gray-700">Section en cours de développement.</p>
    </>
  );
}
