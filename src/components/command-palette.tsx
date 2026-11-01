"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { ArrowUpRight, Box, Briefcase, FileText, House, Info, Mail, NotebookPen, User, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { site } from "@/lib/site";
import { play, setSound, useSoundOn } from "@/lib/sound";
import { caseStudies } from "@/content/work";
import { projects } from "@/content/projects";
import { notes } from "@/content/notes";
import { GitHubIcon, LinkedInIcon } from "./icons";
import { copyEmail } from "./say-hi";

/** Open the palette from anywhere (buttons dispatch this). */
export function openPalette() {
  window.dispatchEvent(new Event("open-palette"));
}

const item =
  "flex cursor-pointer items-center gap-3 rounded-[10px] px-3 py-2.5 text-[14.5px] text-ink-2 data-[selected=true]:bg-blue-fill data-[selected=true]:text-blue";
const heading =
  "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.08em] [&_[cmdk-group-heading]]:text-faint";

function Row({ icon, children, hint, onSelect, keywords }: { icon: ReactNode; children: ReactNode; hint?: string; onSelect: () => void; keywords?: string[] }) {
  return (
    <Command.Item className={item} onSelect={onSelect} keywords={keywords}>
      <span className="grid size-5 shrink-0 place-items-center text-muted">{icon}</span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {hint && <span className="font-mono text-[11px] text-faint">{hint}</span>}
    </Command.Item>
  );
}

/** ⌘K / Ctrl+K command palette: every page, project and note, plus quick actions. */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const soundOn = useSoundOn();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) play("open");
  }, [open]);

  const run = (fn: () => void) => {
    setOpen(false);
    setQuery("");
    play("tick");
    fn();
  };
  const go = (href: string) => run(() => router.push(href));
  const ext = (href: string) => run(() => window.open(href, "_blank", "noopener"));

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setQuery("");
      }}
      label="Command menu"
      overlayClassName="fixed inset-0 z-[150] bg-ink/20 backdrop-blur-[2px] animate-[fade-in_.15s_ease-out]"
      contentClassName="fixed left-1/2 top-[14vh] z-[151] w-[min(560px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-[18px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_30px_70px_-20px_rgba(18,21,42,0.45)] animate-[pop-in_.18s_var(--ease-out-soft)]"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <span className="font-mono text-[13px] text-blue">❯</span>
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder="Jump to a page, project or note…"
          className="term-input h-14 min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-faint"
        />
        <kbd className="rounded-[6px] bg-card px-1.5 py-0.5 font-mono text-[11px] text-muted">esc</kbd>
      </div>
      <Command.List className={`max-h-[min(420px,60vh)] overflow-y-auto overscroll-contain p-2 ${heading}`}>
        <Command.Empty className="px-3 py-8 text-center text-[14px] text-muted">
          Nothing matches. Try &ldquo;sap&rdquo;, &ldquo;notes&rdquo;, or &ldquo;email&rdquo;.
        </Command.Empty>

        {/sudo|hire/i.test(query) && (
          <Command.Group heading="sudo">
            <Row
              icon={<Mail className="size-4" />}
              hint="granted"
              keywords={["sudo", "hire", "rohan"]}
              onSelect={() =>
                run(() => {
                  copyEmail();
                  play("success");
                  toast("Permission granted", { description: "Email copied. I reply to everything." });
                })
              }
            >
              sudo hire rohan
            </Row>
          </Command.Group>
        )}

        <Command.Group heading="Pages">
          <Row icon={<House className="size-4" />} onSelect={() => go("/")}>Home</Row>
          <Row icon={<User className="size-4" />} onSelect={() => go("/about")}>About</Row>
          <Row icon={<Briefcase className="size-4" />} onSelect={() => go("/work")}>Work</Row>
          <Row icon={<Box className="size-4" />} onSelect={() => go("/projects")}>Projects</Row>
          <Row icon={<NotebookPen className="size-4" />} onSelect={() => go("/notes")}>Notes</Row>
          <Row icon={<FileText className="size-4" />} onSelect={() => go("/resume")}>Resume</Row>
          <Row icon={<Info className="size-4" />} onSelect={() => go("/site-info")}>Site info</Row>
        </Command.Group>

        <Command.Group heading="Case studies">
          {caseStudies.map((c) => (
            <Row key={c.slug} icon={<Briefcase className="size-4" />} hint={c.timeline} keywords={[c.slug, c.role]} onSelect={() => go(`/work/${c.slug}`)}>
              {c.company} · {c.title.join("")}
            </Row>
          ))}
        </Command.Group>

        <Command.Group heading="Projects">
          {projects.map((p) => (
            <Row key={p.slug} icon={<Box className="size-4" />} keywords={[p.slug, ...p.stack]} onSelect={() => go(`/projects#${p.slug}`)}>
              {p.title}
            </Row>
          ))}
        </Command.Group>

        <Command.Group heading="Notes">
          {notes.map((n) => (
            <Row key={n.slug} icon={<NotebookPen className="size-4" />} hint={n.topic} keywords={[n.topic]} onSelect={() => go(`/notes/${n.slug}`)}>
              {n.title}
            </Row>
          ))}
        </Command.Group>

        <Command.Group heading="Actions">
          <Row icon={<Mail className="size-4" />} hint={site.email} keywords={["email", "contact", "copy"]} onSelect={() => run(copyEmail)}>
            Copy email
          </Row>
          <Row icon={<GitHubIcon className="size-4" />} keywords={["code"]} onSelect={() => ext(site.links.github)}>
            Open GitHub <ArrowUpRight className="inline size-3.5" />
          </Row>
          <Row icon={<LinkedInIcon className="size-4" />} onSelect={() => ext(site.links.linkedin)}>
            Open LinkedIn <ArrowUpRight className="inline size-3.5" />
          </Row>
          <Row
            icon={soundOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            hint={soundOn ? "on" : "off"}
            keywords={["sound", "audio", "mute"]}
            onSelect={() => run(() => setSound(!soundOn))}
          >
            {soundOn ? "Turn sound off" : "Turn sound on"}
          </Row>
        </Command.Group>
      </Command.List>
      <div className="flex items-center justify-between border-t border-line px-4 py-2 font-mono text-[11px] text-faint">
        <span>↑↓ to move · ↵ to open</span>
        <span>⌘K anywhere</span>
      </div>
    </Command.Dialog>
  );
}
