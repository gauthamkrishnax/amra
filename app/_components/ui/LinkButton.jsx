import Link from "next/link";

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
    svgPosition: "translate-y-0 scale-x-130 translate-x-3",
  },
};

export default function LinkButton({
  children,
  href,
  color = "pink",
  shape = "default",
}) {
  const fillColor = COLOR_MAP[color] || COLOR_MAP.pink;
  const shapeObj = SHAPE_MAP[shape] || SHAPE_MAP.default;
  const viewBox = shapeObj.viewBox || "0 0 162 29";
  const svgFill = shapeObj.fill || fillColor;
  return (
    <div className="relative max-w-48 w-fit">
      <svg
        className={`absolute inset-0 ${shapeObj.svgPosition || ""} -z-10 w-full h-full`}
        viewBox={viewBox}
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={shapeObj.path} fill={svgFill} />
      </svg>
      <Link href={href}>{children}</Link>
    </div>
  );
}
