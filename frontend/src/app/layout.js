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
  title: "Happy Feet Travellers - Affordable Group Tours from Pune",
  description: "Book affordable group tours from Pune. Trusted by 1000+ travelers. Customized packages, upcoming departures, and amazing experiences.",
  keywords: "group tours, travel packages, tour operator, Pune tours, affordable travel",
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
