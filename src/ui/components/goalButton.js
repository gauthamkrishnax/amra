export default function GoalSubmissionButton({ index, selected, onAnswer }) {
  return (
    <div className="mx-5 my-3 flex items-center justify-center gap-4">
      <label
        className={`border-accent min-w-20 cursor-pointer rounded-xl border p-2 text-center ${selected === "yes" ? "bg-accent text-white" : "text-accent"}`}
      >
        <input
          type="radio"
          name={`goal-${index}`}
          value="yes"
          className="appearance-none"
          checked={selected === "yes"}
          onChange={() => onAnswer("yes")}
        />
        <span className="ml-1">Yes</span>
      </label>

      <label
        className={`border-accent min-w-20 cursor-pointer rounded-xl border p-2 text-center ${selected === "no" ? "bg-accent text-white" : "text-accent"}`}
      >
        <input
          type="radio"
          name={`goal-${index}`}
          value="no"
          className="appearance-none"
          checked={selected === "no"}
          onChange={() => onAnswer("no")}
        />
        <span className="ml-1">No</span>
      </label>
    </div>
  );
}
