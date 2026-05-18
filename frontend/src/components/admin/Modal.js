"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/admin/AdminIcons";

export default function Modal({ open, title, description, onClose, children, footer }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#06111b]/50 backdrop-blur-[2px]"
            onClick={onClose}
            aria-label="Close modal"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/70 bg-white/96 shadow-[0_42px_100px_-42px_rgba(11,24,38,0.6)]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#ebf0f5] px-6 py-5">
              <div>
                <h3 className="text-2xl font-bold text-[#17324d]">{title}</h3>
                {description ? <p className="mt-1 text-sm text-[#66788b]">{description}</p> : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-[#d6e2ec] p-2 text-[#567186] transition hover:bg-[#f6fbff]"
                aria-label="Close modal"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
            {footer ? <div className="border-t border-[#ebf0f5] px-6 py-4">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
