"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import PageTransition from "@/components/admin/PageTransition";
import { emptyBlogForm } from "@/lib/admin-data";
import { createBlog } from "@/services/adminService";

export default function NewBlogPage() {
  const router = useRouter();
  const [form, setForm] = useState({ ...emptyBlogForm });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <PageTransition className="space-y-5">
      {message ? (
        <div className="rounded-[26px] border border-[#f2d4bd] bg-[#fff5eb] px-5 py-4 text-sm text-[#a35a23]">
          {message}
        </div>
      ) : null}
      <BlogForm
        form={form}
        setForm={setForm}
        busy={busy}
        onSubmit={async (payload) => {
          setBusy(true);
          const result = await createBlog(payload);
          setBusy(false);
          if (!result.success) {
            setMessage(result.message);
            return;
          }
          router.push("/admin/blogs");
        }}
      />
    </PageTransition>
  );
}
