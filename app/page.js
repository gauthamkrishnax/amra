import Box from "./_components/ui/box";
import Logo from "./_components/ui/Logo";

export default async function Home() {
  async function handleClick() {
    "use server";
    console.log("Button clicked on the server");
  }
  return (
    <div>
      <Box title="You have:" content="35 Points" className="pr-20 "></Box>
      <Logo />
    </div>
  );
}
