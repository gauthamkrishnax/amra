import { getUserNickName } from "@/actions/actions";
import AddGoals from "@/ui/components/addGoals";

export default async function GoalTracker() {
  const nickname = await getUserNickName();
  return (
    <div>
      <AddGoals nickname={nickname}></AddGoals>
    </div>
  );
}
