import { Oswald, Poppins } from "next/font/google";
import "./globals.css";
import AppChrome from "@/components/common/AppChrome";
import { getPublicSettings } from "@/services/settingsService";

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata = {
  title: "Happy Feet Travellers — Curated Group Tours Across India & Beyond",
  description:
    "Experience-first group departures and carefully curated travel across India. Honest pricing, smaller groups, and support from enquiry to homecoming.",
  keywords:
    "group tours India, curated travel experiences, small group travel, customized holidays, tour operator India",
};

export default async function RootLayout({ children }) {
  const settings = await getPublicSettings();

  return (
    <html
      lang="en"
      className={`${poppins.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="page-canvas min-h-full flex flex-col font-sans text-foreground">
        <AppChrome settings={settings}>{children}</AppChrome>
      </body>
    </html>
  );
}
