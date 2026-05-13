"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/admin/AdminIcons";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, booting } = useAdminAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!booting && isAuthenticated) {
      router.replace("/");
    }
  }, [booting, isAuthenticated, router]);

  if (booting) {
    return null;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#091424] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(8,22,36,0.92),rgba(17,59,93,0.72),rgba(244,162,97,0.28))]" />
      <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
        <div className="hidden px-8 py-10 lg:flex lg:flex-col lg:justify-between xl:px-14">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#d8ecfb] backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#f4a261]" />
              Happy Feet Travellers
            </p>
            <h1 className="mt-8 max-w-xl text-5xl font-bold leading-[1.02] text-white">
              A premium control room for tours, content, and traveller enquiries.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-white/78">
              Keep upcoming departures, customised tours, testimonials, and gallery moments perfectly in sync with the travel brand.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="grid max-w-3xl grid-cols-3 gap-4"
          >
            {[
              ["Upcoming trips", "Month-wise departures and quick edits"],
              ["Lead pipeline", "Search, status updates, and message review"],
              ["Content CMS", "Blogs, gallery, testimonials, and settings"],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/74">{desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-xl rounded-[36px] border border-white/18 bg-white/14 p-5 shadow-[0_40px_100px_-45px_rgba(0,0,0,0.72)] backdrop-blur-2xl sm:p-8"
          >
            <div className="rounded-[30px] bg-white px-6 py-7 text-[#17324d] shadow-[0_30px_80px_-40px_rgba(11,24,38,0.55)] sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#4f7b9d]">Secure admin login</p>
              <h2 className="mt-3 text-3xl font-bold text-[#17324d]">Welcome back</h2>
              <p className="mt-2 text-sm leading-6 text-[#65778a]">
                Sign in to manage tours, travel content, and inbound leads.
              </p>

              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  setBusy(true);
                  setMessage("");
                  const result = await login(credentials);
                  setBusy(false);
                  if (!result.success) {
                    setMessage(result.message);
                    return;
                  }
                  router.replace("/");
                }}
                className="mt-8 space-y-5"
              >
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#314559]">Email</span>
                  <input
                    type="email"
                    required
                    value={credentials.email}
                    onChange={(event) =>
                      setCredentials((current) => ({ ...current, email: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-[#d4e0eb] bg-[#fbfdff] px-4 py-3.5 text-sm outline-none transition focus:border-[#4fa3d1]"
                    placeholder="admin@happyfeet.com"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#314559]">Password</span>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={credentials.password}
                      onChange={(event) =>
                        setCredentials((current) => ({ ...current, password: event.target.value }))
                      }
                      className="w-full rounded-2xl border border-[#d4e0eb] bg-[#fbfdff] px-4 py-3.5 pr-12 text-sm outline-none transition focus:border-[#4fa3d1]"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#5f7489] transition hover:bg-[#edf6fd]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <Icon name={showPassword ? "eyeOff" : "eye"} className="h-5 w-5" />
                    </button>
                  </div>
                </label>

                {message ? (
                  <div className="rounded-2xl border border-[#f1d5bc] bg-[#fff5eb] px-4 py-3 text-sm text-[#9c5a24]">
                    {message}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-2xl bg-[#f4a261] px-4 py-3.5 text-sm font-semibold text-[#17324d] shadow-[0_20px_40px_-28px_rgba(244,162,97,0.88)] transition hover:bg-[#ee9654] disabled:opacity-60"
                >
                  {busy ? "Signing in..." : "Access admin panel"}
                </button>
              </form>

              <div className="mt-6 rounded-2xl bg-[#f7fbfe] px-4 py-3 text-xs leading-6 text-[#6a7b8d]">
                Protected access only. Media uploads are encoded directly in the CMS until a dedicated asset service is introduced.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
