import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { Toaster } from "sonner";
import { TopBar } from "@/components/top-bar";
import { MobileDock } from "@/components/mobile-dock";
import { Footer } from "@/components/footer";
import { CursorPrompt } from "@/components/cursor";
import { site } from "@/lib/site";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: site.name, template: `%s · ${site.name}` },
  description: "Rohan Waghmare builds production AI systems: fine-tuned models, agents and retrieval, fast enough to ship.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${newsreader.variable} ${geist.variable} ${geistMono.variable}`}>
      <body>
        <TopBar />
        {/* The white sheet scrolls over the sticky night footer and reveals it. */}
        <div className="relative z-[2] min-h-dvh rounded-b-[40px] bg-paper pb-28 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.25),0_1px_0_rgba(0,0,0,0.05)] md:rounded-b-[64px] md:pb-36">
          <main id="main">{children}</main>
        </div>
        <Footer />
        <MobileDock />
        <CursorPrompt />
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: "!rounded-[14px] !border-0 !font-sans !shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_16px_40px_-14px_rgba(0,0,0,0.25)]",
          }}
        />
        <div className="paper-grain" aria-hidden="true" />
      </body>
    </html>
  );
}
