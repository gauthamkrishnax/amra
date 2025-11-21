import { Poppins } from "next/font/google";

import content from "@/content/global";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import "@/ui/globals.css";

const poppinsFont = Poppins({
  variable: "--font-poppins",
  weight: ["200", "400", "600", "800"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: content.name,
  description: content.description,
};

export default async function RootLayout({ children }) {
  const { currentUser } = await getAuthenticatedAppForUser();

  // if (!currentUser) {
  //   redirect("/signIn");
  // }

  return (
    <html lang="en">
      <body
        className={`${poppinsFont.variable} bg-accent text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
