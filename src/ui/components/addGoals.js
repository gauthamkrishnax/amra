"use client";
import { useState } from "react";

import { addGoals } from "@/actions/actions";
import GoalContent from "@/content/goal";

import Button from "./button";
import Textbox from "./textbox";

export default function SetGoals({ nickname }) {
  const [goalOne, setGoalOne] = useState("");
  const [goalTwo, setGoalTwo] = useState("");
  const [goalThree, setGoalThree] = useState("");

  const handleGoals = (e) => {
    e.preventDefault();

    const goals = { goalOne, goalTwo, goalThree };
    console.log(goals);

    addGoals(goals);
  };

  return (
    <div className="mx-10">
      <div className="mt-10 flex-col">
        <h2 className="font-bold">
          {GoalContent.title} {nickname}!
        </h2>
        <p className="font-semibold">{GoalContent.main_question}</p>
      </div>
      <hr className="my-5 border-t border-gray-400" />

      <div className="font-light italic">
        <h4>{GoalContent.sub_question}</h4>
      </div>

      <form onSubmit={handleGoals}>
        <div>
          <Textbox
            variant="outline"
            setValue={setGoalOne}
            label={GoalContent.goal_one}
            placeholder={GoalContent.goal_one_placeholder}
          />
          <Textbox
            variant="outline"
            setValue={setGoalTwo}
            label={GoalContent.goal_two}
            placeholder={GoalContent.goal_two_placeholder}
          />
          <Textbox
            variant="outline"
            setValue={setGoalThree}
            label={GoalContent.goal_three}
            placeholder={GoalContent.goal_three_placeholder}
          />
        </div>
        <div className="flex items-center justify-center">
          <Button type="submit">Are you sure?</Button>
        </div>
      </form>
    </div>
  );
}
