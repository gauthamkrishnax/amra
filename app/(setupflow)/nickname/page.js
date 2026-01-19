import { createUser } from "@/app/_lib/firestore/user";
import Logo from "@/app/_components/ui/Logo";
import TextInput from "@/app/_components/ui/TextInput";
import SubmitButton from "@/app/_components/SubmitButton";

export default function NicknamePage() {
  async function handleCreateUser(formData) {
    "use server";
    const nickname = formData.get("nickname");
    await createUser(nickname);
  }

  return (
    <div className=" p-10 pb-30 flex flex-col justify-between min-h-dvh">
      <div>
        <Logo className="" />

        <p className="mt-8 text-3xl max-w-3/4">
          What does your Partner call you?
        </p>
      </div>

      <div className="mt-8">
        <form action={handleCreateUser}>
          <TextInput
            id="nickname"
            label="Nickname"
            name="nickname"
            placeholder="Enter your nickname"
          />
          <SubmitButton>Submit</SubmitButton>
        </form>
      </div>
    </div>
  );
}
