import { Poppins } from "next/font/google";

import content from "@/content/global";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import AuthProvider from "@/ui/components/authProvider";
import "@/ui/globals.css";

const poppinsFont = Poppins({
  variable: "--font-poppins",
  weight: ["200", "400", "600", "800"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: content.name,
  description: content.description,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: content.name,
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: "#000000",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default async function RootLayout({ children }) {
  const { currentUser } = await getAuthenticatedAppForUser();

  return (
    <html lang="en">
      <body
        className={`${poppinsFont.variable} bg-accent text-white antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
