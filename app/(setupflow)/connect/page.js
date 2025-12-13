export default async function ConnectPage({ searchParams }) {
  const code = (await searchParams).code;
  return <div>ConnectPage {code}</div>;
}
