export default async function Box({ title, content, className }) {
  return (
    <div
      className={`bg-mypurple p-5 bg-secondary rotate-5 max-w-fit m-8 ${className}`}
    >
      <p>{title}</p>
      <p className="text-2xl font-bold">{content}</p>
    </div>
  );
}
