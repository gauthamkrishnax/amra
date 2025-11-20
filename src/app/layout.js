import { Poppins } from "next/font/google";

import content from "@/content/global";

import "./globals.css";

const poppinsFont = Poppins({
  variable: "--font-poppins",
  weight: ["200", "400", "600", "800"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: content.name,
  description: content.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppinsFont.variable} bg-complimentary text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
