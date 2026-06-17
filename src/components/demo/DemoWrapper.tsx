"use client";

import { type ReactNode } from "react";
import { DemoProvider } from "@/components/demo/DemoMode";
import DemoGuide from "@/components/demo/DemoGuide";

export default function DemoWrapper({ children }: { children: ReactNode }) {
  return (
    <DemoProvider>
      {children}
      <DemoGuide />
    </DemoProvider>
  );
}
