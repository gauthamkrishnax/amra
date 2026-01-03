import localFont from "next/font/local";

export const ramona = localFont({
  src: [
    {
      path: "./Ramona-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./Ramona-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-ramona",
  display: "swap",
});
