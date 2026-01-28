import BoringButton from "./BoringButton";
const COLOR_MAP = {
  pink: "var(--color-mypink)",
  green: "var(--color-mygreen)",
  purple: "var(--color-mypurple)",
  yellow: "var(--color-myyellow)",
  blue: "var(--color-myblue)",
};

const SHAPE_MAP = {
  default: {
    path: "M0 7.25V29L162 17.9118V0L0 7.25Z",
    svgPosition: "translate-x-5",
  },

  shape1: {
    path: "M0 10V29L250 21V0L0 20Z",
    svgPosition: "translate-x-1 -translate-y-3",
  },

  shape2: {
    path: "M0 0V29L162 21V7L0 0Z",
    svgPosition: "translate-y-2",
  },

  shape3: {
    path: "M0 43L0 0L200 10L200 33Z",
    svgPosition: "translate-y-0",
  },
  shape4: {
    path: "M200 43L200 0L0 10L0 33Z",
    svgPosition: "translate-y-0",
  },
};

export default function Button({
  children,
  action,
  noForm = false,
  color = "pink",
  shape = "default",
  disabled = false,
}) {
  const fillColor = COLOR_MAP[color] || COLOR_MAP.pink;
  const shapeObj = SHAPE_MAP[shape] || SHAPE_MAP.default;
  const viewBox = shapeObj.viewBox || "0 0 162 29";
  const svgFill = shapeObj.fill || fillColor;
  return (
    <div
      className={`relative inline-block max-w-55 min-w-min group ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <svg
        className={`absolute inset-0 ${shapeObj.svgPosition || ""} z-0 w-full h-full transition-transform duration-200 ${disabled ? "" : "group-active:rotate-5"}`}
        viewBox={viewBox}
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={shapeObj.path} fill={svgFill} />
      </svg>
      {noForm ? (
        <button
          onClick={action}
          disabled={disabled}
          className="relative text-primary font-bold text-2xl px-3 py-1 break-word whitespace-normal disabled:cursor-not-allowed"
        >
          {children}
        </button>
      ) : (
        <BoringButton
          action={action}
          disabled={disabled}
          className="relative text-primary font-bold text-2xl px-3 py-1 break-word whitespace-normal disabled:cursor-not-allowed"
        >
          {children}
        </BoringButton>
      )}
    </div>
  );
}
