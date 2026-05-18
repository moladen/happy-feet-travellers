import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider";

export const metadata = {
  title: "Happy Feet Travellers Admin",
  description: "Premium CMS for tours, departures, blogs, enquiries, and website content.",
};

export default function AdminLayout({ children }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
