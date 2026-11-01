"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import clsx from "clsx";

const HOPS = [
  {
    name: "User",
    sub: "employee",
    does: "Asks for a change in plain language. They're already signed in with their company account.",
    hands: "the request, inside their signed-in session",
  },
  {
    name: "Claude",
    sub: "MCP client",
    does: "Decides which tool to call. It never sees a password or holds a long-lived credential.",
    hands: "the tool call, with the user's token attached",
  },
  {
    name: "MCP server",
    sub: "SAP + Perforce tools",
    does: "Refuses any call without a valid user token. There is no shared service account to fall back on.",
    hands: "an authorization request on the user's behalf",
  },
  {
    name: "PKCE · XSUAA",
    sub: "SAP BTP auth",
    does: "OAuth with PKCE, so a public client can get tokens without a stored secret, and an intercepted code is useless on its own.",
    hands: "a token scoped to this user and these tools",
  },
  {
    name: "SAP auth",
    sub: "roles + scopes",
    does: "Checks the token and the user's roles before anything is written.",
    hands: "the identity to confirm",
  },
  {
    name: "Microsoft Entra",
    sub: "company identity",
    does: "The root of trust. It confirms the person behind the token is a real, active employee.",
    hands: "",
  },
];

/** The identity chain behind every agent write. Click a hop to see what it does and passes on. */
export function AuthChain() {
  const [n, setN] = useState(0);
  const h = HOPS[n];

  return (
    <div className="grid gap-4 rounded-[18px] bg-white p-4 shadow-[inset_0_0_0_1px_var(--color-line)] md:p-5">
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {HOPS.map((x, i) => (
          <li key={x.name} className="relative">
            <button
              type="button"
              onClick={() => setN(i)}
              aria-pressed={i === n}
              className={clsx(
                "grid h-full w-full gap-0.5 rounded-[12px] px-3 py-2.5 text-left transition-colors duration-200",
                i === n ? "bg-blue text-white" : i < n ? "bg-blue-fill text-ink" : "bg-card text-ink-2 hover:text-blue",
              )}
            >
              <span className="font-mono text-[10.5px] opacity-70">{i === 0 ? "start" : `hop ${i}`}</span>
              <span className="text-[13.5px] font-semibold leading-tight">{x.name}</span>
              <span className={clsx("text-[11.5px] leading-tight", i === n ? "text-white/75" : "text-muted")}>{x.sub}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="grid gap-3 rounded-[14px] bg-card/60 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] md:gap-6">
        <div className="grid content-start gap-1">
          <p className="font-mono text-[11px] text-faint">what {h.name} does</p>
          <p className="text-[15px] leading-relaxed text-ink-2">{h.does}</p>
        </div>
        <div className="grid content-start gap-1">
          {h.hands ? (
            <>
              <p className="font-mono text-[11px] text-faint">hands to {HOPS[n + 1].name}</p>
              <p className="flex items-start gap-2 text-[14.5px] leading-relaxed text-muted">
                <ArrowRight className="mt-1 size-4 shrink-0 text-blue" />
                {h.hands}
              </p>
            </>
          ) : (
            <>
              <p className="font-mono text-[11px] text-faint">end of the chain</p>
              <p className="flex items-start gap-2 text-[14.5px] leading-relaxed text-ink-2">
                <Check className="mt-1 size-4 shrink-0 text-ok" />
                The write is recorded against a verified person, not &ldquo;the agent&rdquo;.
              </p>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] text-faint">Simplified. Five hops between the user and the identity provider.</p>
        <button
          type="button"
          onClick={() => setN((x) => (x + 1) % HOPS.length)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-[13px] font-medium text-white transition-[scale] active:scale-[0.97]"
        >
          {n === HOPS.length - 1 ? "Start over" : "Next hop"} <ArrowRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
