/**
 * WorkerAI brand tokens — electric blue gradient (client theme).
 * Use these class strings so the dark theme stays consistent app-wide.
 */

/** Primary CTA / user message bubble gradient */
export const brandGradient =
  "bg-gradient-to-br from-[#00b4ff] via-[#0088ff] to-[#0066ff]";

export const brandGradientHorizontal =
  "bg-gradient-to-r from-[#00b4ff] via-[#0088ff] to-[#0066ff]";

/** Primary CTA — gradient + smooth neon hover (see globals.css `.btn-brand`) */
export const brandCta =
  "btn-brand inline-flex items-center justify-center font-semibold text-white";

/** Round send / icon CTA — same neon hover */
export const brandCtaRound =
  "btn-neon-round inline-flex items-center justify-center text-white";

/** @deprecated Use brandCta — neon hover is in CSS now */
export const brandGlow = "";

/** Full-app gradient canvas (use on shell + auth pages in dark mode) */
export const appCanvas = "app-canvas min-h-dvh";

/** Sidebar / header panels with blue-tinted glass */
export const appPanel = "app-panel";
export const appPanelSolid = "app-panel-solid";
export const appCard = "app-card";

/** Dark surfaces — blue-tinted, not flat grey-black */
export const surfaceApp = "dark:bg-transparent";
export const surfacePanel = "dark:app-panel";
export const surfaceElevated = "dark:app-card";

/** Active sidebar nav item (dark) */
export const navActive =
  "nav-active font-medium text-[#0066ff] dark:text-[#e0f7ff]";

export const navActiveIcon = "nav-active-icon text-[#0088ff] dark:text-[#00d4ff]";

/** Chat agent bubble in dark mode */
export const chatAgentBubble =
  "dark:bg-[#141c2e] dark:ring-1 dark:ring-[#00b4ff]/10";

/** Focus ring on inputs */
export const brandFocus =
  "focus:border-[#00b4ff] focus:ring-2 focus:ring-[#00b4ff]/25 dark:focus:ring-[#00b4ff]/35";

/** Sign-in / sign-up — light + dark */
export const authCard =
  "app-panel-solid w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-[#0f1523] dark:shadow-2xl dark:shadow-black/40";

export const authBrandTitle = "text-lg font-semibold tracking-tight text-slate-900 dark:text-white";
export const authBrandSubtitle = "text-sm text-slate-500 dark:text-slate-400";
export const authHeading = "text-2xl font-semibold text-slate-900 dark:text-white";
export const authLabel = "mb-1.5 block text-sm font-medium text-slate-800 dark:text-white";
export const authInput =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-2 ring-transparent transition focus:border-[#00b4ff]/60 focus:ring-[#00b4ff]/25 dark:border-white/10 dark:bg-[#151c2e] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-[#00b4ff]/50 dark:focus:ring-[#00b4ff]/25";
export const authLink = "font-medium text-[#0066ff] hover:underline dark:text-[#7ab6ff]";
export const authMuted = "text-sm text-slate-500 dark:text-slate-400";
export const authFooter = "text-[11px] leading-relaxed text-slate-500";
export const authFieldError = "mt-1 text-xs text-rose-600 dark:text-rose-400";
export const authServerMessage = "text-center text-xs text-slate-600 dark:text-slate-300";
export const authEyeButton =
  "absolute top-1/2 right-2 -translate-y-1/2 rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white";

/** Quick-reply chips */
export const brandChip =
  "border-[#00b4ff]/35 bg-[#00b4ff]/10 text-[#0066ff] hover:bg-[#00b4ff]/15 dark:border-[#00b4ff]/40 dark:bg-[#00b4ff]/12 dark:text-[#7dd3fc] dark:hover:bg-[#00b4ff]/20";

/** Chat message area — stronger blue wash */
export const chatBackgroundWash =
  "radial-gradient(ellipse 100% 80% at 10% 0%, rgba(0,180,255,0.2), transparent 50%), radial-gradient(ellipse 90% 70% at 90% 100%, rgba(0,102,255,0.15), transparent 45%), linear-gradient(180deg, rgba(3,8,24,0.3) 0%, rgba(6,24,40,0.5) 100%)";
