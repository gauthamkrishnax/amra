import Questionare from "@/content/goalQuestionare";

import GoalSubmissionButton from "./goalButton";

export default function GoalQuestionCard({
  partnerGoal,
  partnerNickname,
  index,
  onAnswer,
  selected,
}) {
  return (
    <div className="my-5 mr-20">
      <div className="rounded-r-2xl bg-amber-50 p-3">
        <div className="border-accent rounded-xl border p-2">
          <h3 className="text-accent text-md ml-5 font-medium italic">
            {Questionare.question} {partnerNickname} {partnerGoal} ?
          </h3>

          <GoalSubmissionButton
            index={index}
            selected={selected}
            onAnswer={(value) => onAnswer(index, value)}
          />
        </div>
      </div>
    </div>
  );
}
