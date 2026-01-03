import { createUser } from "@/app/_lib/firestore/user";
import SubmitButton from "@/app/_components/SubmitButton";

export default function NicknamePage() {
  async function handleCreateUser(formData) {
    "use server";
    const nickname = formData.get("nickname");
    await createUser(nickname);
  }

  return (
    <div>
      <h1>Nickname</h1>
      <form action={handleCreateUser}>
        <input type="text" placeholder="Enter your nickname" name="nickname" />
        <SubmitButton>Save</SubmitButton>
      </form>
    </div>
  );
}
