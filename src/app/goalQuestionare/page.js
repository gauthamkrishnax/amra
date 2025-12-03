import { getPartnerInfo } from "@/actions/actions";
import GoalQuestionares from "@/ui/components/goalQuestionaires";

export default async function GoalQuestionare() {
  const partnerDetails = await getPartnerInfo();
  return (
    <div>
      <GoalQuestionares
        partnerId={partnerDetails.partnerUid}
        partnerNickname={partnerDetails.nickname}
        partnerGoals={partnerDetails.goals}
      ></GoalQuestionares>
    </div>
  );
}
