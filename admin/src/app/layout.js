import { Outfit } from "next/font/google";
import "./globals.css";
import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider";

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Happy Feet Travellers Admin",
  description: "Premium CMS for tours, departures, blogs, enquiries, and website content.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans text-[var(--admin-text)]">
        <AdminAuthProvider>{children}</AdminAuthProvider>
      </body>
    </html>
  );
}
