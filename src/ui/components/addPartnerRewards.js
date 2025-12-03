"use client";
import { useState } from "react";

import { addPartnerRewards } from "@/actions/actions";
import PartnerRewards from "@/content/partnerRewardsForm";

import Button from "./button";
import Textbox from "./textbox";

export default function AddPartnerRewards() {
  const [rewardOne, setRewardOne] = useState("");
  const [rewardTwo, setRewardTwo] = useState("");
  const [rewardThree, setRewardThree] = useState("");

  const handlePartnerRewards = (e) => {
    e.preventDefault();

    const rewards = { rewardOne, rewardTwo, rewardThree };
    console.log(rewards);

    addPartnerRewards(rewards);
  };
  return (
    <div className="mx-10">
      <div className="mt-10 flex-col">
        <h2 className="font-bold">{PartnerRewards.title}</h2>
        <p className="font-semibold">{PartnerRewards.main_question}</p>
      </div>
      <hr className="my-5 border-t border-gray-400" />

      <div className="font-light italic">
        <h4>{PartnerRewards.sub_question}</h4>
      </div>

      <form onSubmit={handlePartnerRewards}>
        <div>
          <Textbox
            variant="outline"
            setValue={setRewardOne}
            label={PartnerRewards.reward_one}
            placeholder={PartnerRewards.reward_one_placeholder}
          />
          <Textbox
            variant="outline"
            setValue={setRewardTwo}
            label={PartnerRewards.reward_two}
            placeholder={PartnerRewards.reward_two_placeholder}
          />
          <Textbox
            variant="outline"
            setValue={setRewardThree}
            label={PartnerRewards.reward_three}
            placeholder={PartnerRewards.reward_three_placeholder}
          />
        </div>
        <div className="flex items-center justify-center">
          <Button type="submit">Are you sure?</Button>
        </div>
      </form>
    </div>
  );
}
