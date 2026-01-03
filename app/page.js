import BoringButton from "./_components/ui/BoringButton";
import Button from "./_components/ui/Button";

export default async function Home() {
  async function handleClick() {
    "use server";
    console.log("Button clicked on the server");
  }
  return (
    <div>
      <BoringButton action={handleClick}>Sign In / Sign Up</BoringButton>
      <Button color="green" shape="shape1">
        Expenses
      </Button>
      <Button color="purple" shape="shape3">
        Thumbi
      </Button>
      <Button color="blue" shape="shape4">
        Poopu
      </Button>
    </div>
  );
}
