export default async function Box({ title, content, contentSize, className }) {
  const contentSizeClass = contentSize ? `text-${contentSize}` : "text-2xl";
  return (
    <div className={`${className} p-5 max-w-fit m-8`}>
      <p>{title}</p>
      <p
        className={`${contentSizeClass ? contentSizeClass : "text-2xl"} font-bold`}
      >
        {content}
      </p>
    </div>
  );
}
