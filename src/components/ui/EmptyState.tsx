"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center gap-3 p-8 min-h-[180px] text-center rounded-xl"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="text-[var(--text-muted)] opacity-50">
        {icon || <Inbox size={36} strokeWidth={1.2} />}
      </div>
      <p className="text-sm font-medium text-[var(--text-secondary)]">
        {title}
      </p>
      {description && (
        <p className="text-xs text-[var(--text-muted)] max-w-[200px] leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
