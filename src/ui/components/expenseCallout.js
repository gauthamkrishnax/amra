import {
  Clapperboard,
  CookingPot,
  Receipt,
  ShoppingBagIcon,
  ShoppingBasket,
  ShoppingCart,
} from "lucide-react";

function Icons(name) {
  switch (name) {
    case "miscellaneous":
      return <ShoppingBasket className="text-black" size={20} />;
    case "food":
      return <CookingPot className="text-black" size={20} />;
    case `groceries`:
      return <ShoppingCart className="text-black" size={20} />;
    case `entertainment`:
      return <Clapperboard className="text-black" size={20} />;
    case `bills`:
      return <Receipt className="text-black" size={20} />;
    default:
      return <ShoppingBagIcon className="text-black" size={20} />;
  }
}

export default function ExpenseCallout(props) {
  return (
    <div className="my-2 flex items-center justify-between gap-5 rounded-full border border-gray-300 px-3 shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white p-1">
          {Icons(props.category.toLowerCase())}
        </div>
        <div className="bg-accent flex flex-col justify-center py-4">
          <h2 className="text-xs font-bold">{props.title}</h2>
          <p className="text-[10px] font-medium text-zinc-400">
            {props.category} | {props.date}
          </p>
        </div>
      </div>
      <div>
        {" "}
        <h2 className="font-bold">{props.amount}</h2>
      </div>
    </div>
  );
}
