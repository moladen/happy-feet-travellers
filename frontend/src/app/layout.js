import { Oswald, Poppins } from "next/font/google";
import "./globals.css";
import AppChrome from "@/components/common/AppChrome";
import JsonLd from "@/components/seo/JsonLd";
import { buildOrganizationSchema } from "@/lib/schema/organization";
import { getSiteUrl } from "@/lib/schema/siteUrl";
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
  metadataBase: new URL(getSiteUrl()),
  title: "Happy Feet Travellers — Curated Group Tours Across India & Beyond",
  description:
    "Experience-first group departures and carefully curated travel across India. Honest pricing, smaller groups, and support from enquiry to homecoming.",
  keywords:
    "group tours India, curated travel experiences, small group travel, customized holidays, tour operator India",
  other: {
    "facebook-domain-verification": "c1dhxxrbj9tx9urr1yerednkmz3t3h",
  },
};

export default async function RootLayout({ children }) {
  const settings = await getPublicSettings();
  const organizationSchema = buildOrganizationSchema(settings);

  return (
    <html
      lang="en"
      className={`${poppins.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="page-canvas min-h-full flex flex-col font-sans text-foreground">
        <JsonLd data={organizationSchema} />
        <AppChrome settings={settings}>{children}</AppChrome>
      </body>
    </html>
  );
}
