"use client";

import { useState } from "react";

import { addPartnerPoints } from "@/actions/actions";
import Questionare from "@/content/goalQuestionare";

import Button from "./button";
import GoalQuestionCard from "./goalQuestionCard";

export default function GoalQuestionares({
  partnerId,
  partnerNickname,
  partnerGoals,
}) {
  const goals = Object.values(partnerGoals || {});

  const [answers, setAnswers] = useState({});

  const handleAnswer = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = () => {
    const completed = Object.values(answers).filter((a) => a === "yes").length;
    const incomplete = Object.values(answers).filter((a) => a === "no").length;
    let points = completed * 1 - incomplete * 1;
    if (points <= 0) {
      points = 0;
    }
    console.log(points);
    addPartnerPoints(points, partnerId);
  };

  return (
    <div className="mt-10 flex-col gap-2">
      <h2 className="mx-10 text-2xl font-bold">
        {Questionare.title_prefix} {partnerNickname} {Questionare.title_postfix}
      </h2>

      {goals.map((goal, index) => (
        <GoalQuestionCard
          key={index}
          index={index}
          partnerGoal={goal}
          partnerNickname={partnerNickname}
          onAnswer={handleAnswer}
          selected={answers[index]}
        />
      ))}

      <Button onClick={handleSubmit} className="mx-10">
        Submit
      </Button>
    </div>
  );
}
