"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/admin/PageTransition";
import { CardSection, Field, TextArea, TextInput } from "@/components/admin/AdminFields";
import { Icon } from "@/components/admin/AdminIcons";
import { emptyTeamMemberForm } from "@/lib/admin-data";
import {
  TEAM_IMAGE_ACCEPT,
  TEAM_IMAGE_MAX_MB,
  resolveTeamImageUrl,
  validateTeamImageFile,
} from "@/lib/teamMembers";
import {
  createTeamMember,
  deleteTeamMember,
  listTeamMembers,
  reorderTeamMembers,
  updateTeamMember,
} from "@/services/adminService";

function buildTeamFormData(form, { requireImage = false, editingId = null } = {}) {
  const fd = new FormData();
  if (form.imageFile) fd.append("image", form.imageFile);
  else if (requireImage && !editingId) return null;

  fd.append("fullName", form.fullName.trim());
  fd.append("role", form.role.trim());
  fd.append("bio", form.bio.trim());
  if (form.instagramUrl?.trim()) fd.append("instagramUrl", form.instagramUrl.trim());
  if (form.linkedinUrl?.trim()) fd.append("linkedinUrl", form.linkedinUrl.trim());
  if (form.sortOrder !== "" && form.sortOrder != null) fd.append("sortOrder", String(form.sortOrder));
  fd.append("active", form.active ? "true" : "false");
  return fd;
}

export default function TeamManagementPage() {
  const inputRef = useRef(null);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ ...emptyTeamMemberForm });
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    const result = await listTeamMembers();
    if (!result.success) {
      setMessage(result.message);
      return;
    }
    setMembers(result.data?.members || []);
    setMessage("");
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await listTeamMembers();
      if (cancelled) return;
      if (!result.success) {
        setMessage(result.message);
        return;
      }
      setMembers(result.data?.members || []);
      setMessage("");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const resetForm = () => {
    if (form.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(form.previewUrl);
    setForm({ ...emptyTeamMemberForm });
    setEditing(null);
    setError("");
  };

  const setImageFile = (file) => {
    const validation = validateTeamImageFile(file);
    if (validation) {
      setError(validation);
      return;
    }
    setError("");
    if (form.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(form.previewUrl);
    setForm((current) => ({ ...current, imageFile: file, previewUrl: URL.createObjectURL(file) }));
  };

  const startEdit = (member) => {
    if (form.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(form.previewUrl);
    setEditing(member);
    setForm({
      fullName: member.fullName || "",
      role: member.role || "",
      bio: member.bio || "",
      instagramUrl: member.instagramUrl || "",
      linkedinUrl: member.linkedinUrl || "",
      sortOrder: String(member.sortOrder ?? ""),
      active: member.active !== false,
      imageFile: null,
      previewUrl: resolveTeamImageUrl(member.imageUrl),
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const moveMember = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= members.length) return;
    const order = [...members];
    const [item] = order.splice(index, 1);
    order.splice(target, 0, item);
    setBusy(true);
    const result = await reorderTeamMembers(order.map((m) => m.id));
    setBusy(false);
    if (!result.success) {
      setMessage(result.message);
      return;
    }
    setMembers(result.data?.members || order);
  };

  const previewSrc = form.previewUrl || (editing ? resolveTeamImageUrl(editing.imageUrl) : "");

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[28px] border border-[#e7eef4] bg-[linear-gradient(135deg,#f0f8ff,#fff8f1)] p-6 shadow-[0_24px_50px_-32px_rgba(31,78,121,0.45)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#4f7b9d]">
            About us · team
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[#17324d]">Team Management</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#5f6f7f]">
            Add and update team introductions for the About page. Profile photos (JPG, PNG, WebP up to{" "}
            {TEAM_IMAGE_MAX_MB}MB) publish instantly on the website.
          </p>
        </div>
        <Link
          href="/about"
          target="_blank"
          className="inline-flex items-center gap-2 self-start rounded-full border border-[#d8e7f2] bg-white px-4 py-2.5 text-sm font-semibold text-[#1f4e79] shadow-sm transition hover:border-[#4fa3d1]"
        >
          <Icon name="eye" className="h-4 w-4" />
          Preview About page
        </Link>
      </div>

      {message ? (
        <div className="rounded-[26px] border border-[#f2d4bd] bg-[#fff5eb] px-5 py-4 text-sm text-[#a35a23]">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-[26px] border border-[#f5c4c4] bg-[#fff0f0] px-5 py-4 text-sm text-[#9b2c2c]">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] xl:items-start">
        <CardSection
          title={editing ? "Edit team member" : "Add team member"}
          description="Square or portrait photos work best (800×800 recommended). Include social links for Instagram and LinkedIn."
        >
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setError("");
              if (!form.fullName.trim() || form.fullName.trim().length < 2) {
                setError("Full name is required.");
                return;
              }
              if (!form.role.trim() || form.role.trim().length < 2) {
                setError("Role / designation is required.");
                return;
              }
              if (!form.bio.trim() || form.bio.trim().length < 10) {
                setError("Bio must be at least 10 characters.");
                return;
              }
              const fd = buildTeamFormData(form, { requireImage: !editing, editingId: editing?.id });
              if (!fd) {
                setError("Choose a profile photo to upload.");
                return;
              }
              setBusy(true);
              const result = editing
                ? await updateTeamMember(editing.id, fd)
                : await createTeamMember(fd);
              setBusy(false);
              if (!result.success) {
                setError(result.message);
                return;
              }
              resetForm();
              await load();
              setMessage(
                editing ? "Team member updated on the About page." : "Team member published to the About page."
              );
            }}
            className="space-y-5"
          >
            <div className="flex flex-col gap-4 rounded-[24px] border border-[#e7eef4] bg-[#fbfdff] p-5 sm:flex-row sm:items-start">
              <div className="relative mx-auto h-36 w-36 shrink-0 overflow-hidden rounded-full border-4 border-white bg-[#edf2f7] shadow-[0_16px_40px_-20px_rgba(31,78,121,0.5)] sm:mx-0">
                {previewSrc ? (
                  <motion.div
                    key={previewSrc}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35 }}
                    className="relative h-full w-full"
                  >
                    <Image src={previewSrc} alt="Profile preview" fill unoptimized sizes="144px" className="object-cover" />
                  </motion.div>
                ) : (
                  <div className="grid h-full w-full place-items-center text-[#6f8295]">
                    <Icon name="team" className="h-12 w-12" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <p className="text-sm font-semibold text-[#17324d]">Profile photo</p>
                <p className="text-xs text-[#6f8295]">JPG · PNG · WebP · max {TEAM_IMAGE_MAX_MB}MB</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="rounded-full bg-[#1f4e79] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#173b5d]"
                  >
                    {previewSrc ? "Change photo" : "Upload photo"}
                  </button>
                  {previewSrc ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (form.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(form.previewUrl);
                        setForm((c) => ({
                          ...c,
                          imageFile: null,
                          previewUrl: editing ? resolveTeamImageUrl(editing.imageUrl) : "",
                        }));
                      }}
                      className="rounded-full border border-[#d5e1eb] px-4 py-2 text-sm font-semibold text-[#425264]"
                    >
                      Clear selection
                    </button>
                  ) : null}
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept={TEAM_IMAGE_ACCEPT}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImageFile(file);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Full name">
                <TextInput
                  value={form.fullName}
                  onChange={(e) => setForm((c) => ({ ...c, fullName: e.target.value }))}
                  placeholder="Aniket Patil"
                />
              </Field>
              <Field label="Designation / role">
                <TextInput
                  value={form.role}
                  onChange={(e) => setForm((c) => ({ ...c, role: e.target.value }))}
                  placeholder="Founder · Trip planning"
                />
              </Field>
              <Field label="Instagram URL">
                <TextInput
                  value={form.instagramUrl}
                  onChange={(e) => setForm((c) => ({ ...c, instagramUrl: e.target.value }))}
                  placeholder="https://instagram.com/username"
                />
              </Field>
              <Field label="LinkedIn URL">
                <TextInput
                  value={form.linkedinUrl}
                  onChange={(e) => setForm((c) => ({ ...c, linkedinUrl: e.target.value }))}
                  placeholder="https://linkedin.com/in/username"
                />
              </Field>
            </div>

            <Field label="Short bio">
              <TextArea
                rows={4}
                value={form.bio}
                onChange={(e) => setForm((c) => ({ ...c, bio: e.target.value }))}
                placeholder="What they do on trips and how travellers know them."
              />
            </Field>

            <Field label="Sort order (optional)">
              <TextInput
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(e) => setForm((c) => ({ ...c, sortOrder: e.target.value }))}
                placeholder="Auto"
              />
            </Field>

            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#e7eef4] bg-[#fbfdff] px-4 py-3">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((c) => ({ ...c, active: e.target.checked }))}
                className="h-4 w-4 rounded border-[#c9dbe8] text-[#1f4e79]"
              />
              <span className="text-sm font-medium text-[#314559]">Show on About page</span>
            </label>

            <div className="flex flex-wrap items-center gap-3 border-t border-[#e7eef4] pt-5">
              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-[#f4a261] px-5 py-3 text-sm font-semibold text-[#17324d] shadow-[0_18px_36px_-24px_rgba(244,162,97,0.9)] transition hover:bg-[#ef9551] disabled:opacity-60"
              >
                {busy ? "Saving..." : editing ? "Save changes" : "Add team member"}
              </button>
              {editing ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-[#d5e1eb] px-5 py-3 text-sm font-semibold text-[#425264]"
                >
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>
        </CardSection>

        <CardSection
          title="Team roster"
          description={`${members.length} member${members.length === 1 ? "" : "s"} · order matches About page`}
        >
          {!members.length ? (
            <p className="text-sm text-[#6f8295]">No team members yet. Add your first profile above.</p>
          ) : (
            <ul className="space-y-4">
              {members.map((member, index) => {
                const src = resolveTeamImageUrl(member.imageUrl);
                return (
                  <li
                    key={member.id}
                    className="flex gap-4 overflow-hidden rounded-[22px] border border-[#e7eef4] bg-white p-3 shadow-[0_12px_32px_-24px_rgba(31,78,121,0.4)]"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#edf2f7]">
                      <Image src={src} alt={member.fullName} fill unoptimized sizes="80px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#17324d]">{member.fullName}</p>
                      <p className="truncate text-xs text-[#6f8295]">{member.role}</p>
                      {!member.active ? (
                        <span className="mt-1 inline-block rounded-full bg-[#fff5eb] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#a35a23]">
                          Hidden
                        </span>
                      ) : null}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={busy || index === 0}
                          onClick={() => moveMember(index, -1)}
                          className="rounded-lg border border-[#d5e1eb] px-2.5 py-1.5 text-xs font-semibold text-[#1f4e79] disabled:opacity-40"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={busy || index === members.length - 1}
                          onClick={() => moveMember(index, 1)}
                          className="rounded-lg border border-[#d5e1eb] px-2.5 py-1.5 text-xs font-semibold text-[#1f4e79] disabled:opacity-40"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => startEdit(member)}
                          className="rounded-lg bg-[#edf5fb] px-2.5 py-1.5 text-xs font-semibold text-[#1f4e79]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={async () => {
                            if (!window.confirm(`Remove ${member.fullName} from the About page?`)) return;
                            setBusy(true);
                            const result = await deleteTeamMember(member.id);
                            setBusy(false);
                            if (!result.success) {
                              setMessage(result.message);
                              return;
                            }
                            if (editing?.id === member.id) resetForm();
                            await load();
                            setMessage("Team member removed.");
                          }}
                          className="rounded-lg border border-[#f5c4c4] px-2.5 py-1.5 text-xs font-semibold text-[#9b2c2c]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardSection>
      </div>
    </PageTransition>
  );
}
