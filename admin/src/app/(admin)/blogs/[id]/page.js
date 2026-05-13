"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import PageTransition from "@/components/admin/PageTransition";
import { createBlogForm } from "@/lib/admin-data";
import { getBlog, updateBlog } from "@/services/adminService";

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const result = await getBlog(params.id);
      if (!result.success) {
        setMessage(result.message);
        return;
      }
      setForm(createBlogForm(result.data));
    };

    load();
  }, [params.id]);

  if (!form) {
    return (
      <PageTransition>
        <div className="rounded-[28px] border border-white/70 bg-white/88 px-6 py-10 text-sm text-[#607386] shadow-[0_24px_48px_-34px_rgba(31,78,121,0.45)]">
          {message || "Loading blog details..."}
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="space-y-5">
      {message ? (
        <div className="rounded-[26px] border border-[#d9e9d5] bg-[#f3fbf1] px-5 py-4 text-sm text-[#28623b]">
          {message}
        </div>
      ) : null}
      <BlogForm
        form={form}
        setForm={setForm}
        busy={busy}
        mode="edit"
        onSubmit={async (payload) => {
          setBusy(true);
          const result = await updateBlog(params.id, payload);
          setBusy(false);
          setMessage(result.message);
          if (result.success) {
            router.push("/blogs");
          }
        }}
      />
    </PageTransition>
  );
}
