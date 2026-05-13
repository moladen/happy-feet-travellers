import { Outfit } from "next/font/google";
import "./globals.css";
import AppChrome from "@/components/common/AppChrome";

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Happy Feet Travellers - Affordable Group Tours from Pune",
  description: "Book affordable group tours from Pune. Trusted by 1000+ travelers. Customized packages, upcoming departures, and amazing experiences.",
  keywords: "group tours, travel packages, tour operator, Pune tours, affordable travel",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="page-canvas min-h-full flex flex-col font-sans text-foreground">
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
