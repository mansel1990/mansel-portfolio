"use client";

import { ReactNode } from "react";

interface MainContentProps {
  children: ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  return (
    <main className="lg:ml-[45%] lg:max-w-[calc(100%-600px)] xl:ml-[600px] min-h-screen pt-20 lg:pt-0">
      <div className="mx-auto max-w-5xl px-6 lg:px-12">
        {children}
      </div>
    </main>
  );
}
