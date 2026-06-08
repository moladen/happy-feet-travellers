'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchPublicTeamMembers } from '@/services/teamMembersService';
import SectionState from '@/components/common/SectionState';
import { USER_MESSAGES } from '@/lib/userMessages';

function SocialLink({ href, label, children }) {
  if (!href?.trim()) return null;
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white/90 backdrop-blur-md transition hover:border-cta/60 hover:bg-cta/25 hover:text-white"
      aria-label={label}
    >
      {children}
    </Link>
  );
}

function TeamCard({ member, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/10 p-6 text-center shadow-[0_24px_48px_-28px_rgba(6,17,27,0.55)] backdrop-blur-xl"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cta/20 blur-2xl transition group-hover:bg-[#7ec8e3]/30"
        aria-hidden
      />
      <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-[#7ec8e3]/15 blur-2xl" aria-hidden />

      <div className="relative mx-auto mb-5 h-32 w-32">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cta via-[#7ec8e3] to-primary opacity-80 blur-md transition group-hover:opacity-100" />
        <div className="relative h-full w-full overflow-hidden rounded-full ring-4 ring-white/30 transition group-hover:ring-cta/50">
          <Image
            src={member.imageUrl}
            alt={member.fullName}
            fill
            sizes="128px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      <h3 className="font-display text-xl font-bold text-white">{member.fullName}</h3>
      <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-[#FFE0C2]/90">
        {member.role}
      </p>
      <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-white/75">{member.bio}</p>

      <div className="mt-5 flex items-center justify-center gap-2.5">
        <SocialLink href={member.instagramUrl} label={`${member.fullName} on Instagram`}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.5 1 .5.5.8 1 1 1.5.2.5.4 1.1.4 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-1 1.5-.5.5-1 .8-1.5 1-.5.2-1.1.4-2.3.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.5-1-.5-.5-.8-1-1-1.5-.2-.5-.4-1.1-.4-2.3-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.3.2-.6.5-1 1-1.5.5-.5 1-.8 1.5-1 .5-.2 1.1-.4 2.3-.4 1.3-.1 1.7-.1 4.9-.1zm0 2.2a8.1 8.1 0 1 0 0 16.2 8.1 8.1 0 0 0 0-16.2zm0 3.4a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4zm7.6-4.9a1.9 1.9 0 1 1-3.8 0 1.9 1.9 0 0 1 3.8 0z" />
          </svg>
        </SocialLink>
        <SocialLink href={member.linkedinUrl} label={`${member.fullName} on LinkedIn`}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.06h4.52V23.5H.24V8.06zm7.32 0h4.33v2.11h.06c.6-1.14 2.08-2.35 4.28-2.35 4.58 0 5.42 3.01 5.42 6.93v8.75h-4.52v-7.77c0-1.85-.03-4.23-2.58-4.23-2.58 0-2.98 2.02-2.98 4.1v7.9H7.56V8.06z" />
          </svg>
        </SocialLink>
      </div>
    </motion.article>
  );
}

function TeamSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-[1.75rem] border border-white/15 bg-white/5 p-6 backdrop-blur-md"
        >
          <div className="mx-auto mb-5 h-32 w-32 rounded-full bg-white/10" />
          <div className="mx-auto h-5 w-32 rounded-full bg-white/10" />
          <div className="mx-auto mt-3 h-3 w-24 rounded-full bg-white/10" />
          <div className="mx-auto mt-4 h-12 w-full max-w-xs rounded-2xl bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export default function TeamSection() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchPublicTeamMembers();
        if (!active) return;
        setMembers(data);
        setError('');
      } catch {
        if (!active) return;
        setError('unavailable');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="relative mb-12 overflow-hidden rounded-[2rem] border border-[#dceaf7]/80 bg-gradient-to-br from-[#0f1c2e] via-primary to-[#2a5f85] p-8 md:p-10">
      <div
        className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-cta/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-[#7ec8e3]/20 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-[#FFE0C2]/90">
          Meet the crew
        </p>
        <h2 className="font-display mt-2 text-center text-3xl font-bold text-white md:text-4xl">
          The people behind your journey
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-white/75 md:text-base">
          Travel-obsessed planners, ops leads, and trip captains you&apos;ll actually reach on WhatsApp — people who
          know the routes across India.
        </p>

        <div className="mt-10">
          {loading ? (
            <>
              <SectionState type="loading" loadingKey="team" className="mb-6 [&_.section-state__loading-text]:text-white/85" />
              <TeamSkeleton />
            </>
          ) : null}
          {!loading && error ? (
            <SectionState
              type="error"
              title="Profiles unavailable"
              message={USER_MESSAGES.noTeam}
              className="border-white/15 bg-black/20 [&_.section-state__title]:text-white [&_.section-state__message]:text-white/80"
            />
          ) : null}
          {!loading && !error && members.length === 0 ? (
            <SectionState
              type="empty"
              title="Meet the team soon"
              message={USER_MESSAGES.noTeam}
              className="border-white/15 bg-black/20 [&_.section-state__title]:text-white [&_.section-state__message]:text-white/80"
            />
          ) : null}
          {!loading && !error && members.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {members.map((member, index) => (
                <TeamCard key={member.id} member={member} index={index} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
