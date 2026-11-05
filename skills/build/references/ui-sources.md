# UI component and motion sources

These sites are **visual references**. Look at a component, understand what makes it work (layout, timing, easing, layering), then build your own version in the project's stack and the client's tokens.

Surveyed 2026-11-05; component names are as listed on each site.

## The rule: extract or rebuild

- **Extract** (copy or install the code) only when the source states a free licence for commercial use. Today that is: Magic UI free components, Animate UI, Uiverse, Anime.js (as an npm library). Keep the licence notice where the licence requires it. Magic UI Pro is paid: rebuild, don't extract.
- **Rebuild** everything else: look at it live, screenshot it, then write it from scratch. Never copy its code, shaders, assets or class names. Applies to Vengeance UI, StringTune and HorizonX.
- If a "rebuild" source later shows a clear free licence (in its repo or docs), it can move to extract. Say so to the user when that happens.
- Either way, restyle to the client's brand; never ship demo colours.

## Engine rule

One primary animation engine per site. GSAP owns scroll (pins, scrubs, stacks). Motion (framer-motion) is fine inside React components. Use Anime.js only when the site has no GSAP, or for one isolated effect GSAP does badly. Rebuilt StringTune-style effects are written in whatever engine the site already uses. Never load three engines.

## Sources

| Source | Use | What it is | Stack | Look at it for |
|---|---|---|---|---|
| [Magic UI](https://magicui.design/docs/components) | **Extract** (free tier, MIT); Pro: rebuild | 70+ landing-page components | React + Tailwind + Motion, shadcn-style CLI | Marquee, Animated Beam, Border Beam, Shine Border, Magic Card, Dock, Globe, Orbiting Circles, Shimmer Button, Number Ticker, Morphing Text, Text Animate, Lens |
| [Animate UI](https://animate-ui.com/docs/primitives) | **Extract** (MIT) | Animated Radix / Base UI / React Aria primitives | React, CLI | Dialog, Dropdown Menu, Tabs, Toast, Carousel, Liquid Button, Ripple Button, Shine, Particles, Rolling Text, Counting Number, Sliding Number, Magnetic, Tilt, Page Transition |
| [Uiverse](https://uiverse.io/) | **Extract** (free for commercial use, MIT repo) | 7,000+ community elements | Copy-paste HTML/CSS, Tailwind or React | CSS-only buttons, loaders, toggles, checkboxes, cards, tooltips, inputs |
| [Anime.js](https://animejs.com/) | **Extract** (MIT, install via `npm i animejs`) | Animation engine, ~27 KB | Vanilla JS | SVG drawing (createDrawable), morphTo, motion paths, springs, draggable, stagger, onScroll |
| [Vengeance UI](https://www.vengenceui.com/components) | **Rebuild** (licence not stated) | 77 animated React components | React, Tailwind, Framer Motion, some GSAP / R3F | Aurora Hero, Liquid Metal, Liquid Text, Flip Text, Morph Text, Image Trail, Cylinder Carousel, Glass Dock, Magnetic Spotlight Marquee, Wave Grid Background, Candy Button |
| [StringTune](https://string-tune.fiddle.digital/skill-hub) | **Rebuild** (licence not stated) | Attribute-driven JS effects | Vanilla JS | Reveal on scroll, Parallax, Lerp, Glide, Magnetic, Spotlight, Split, Kinetic text, Text with progress, Footer shifting, Masonry Grid |
| [HorizonX](https://horizonx.so/) | **Rebuild only** (paid) | Premium WebGL heroes, shaders, UI kits | three.js, WebGL, Lenis | Full WebGL hero pages and shader backgrounds: Plasma Orb, Chromatic Orb, Liquid Glass, Spiral Flux, Tunnel Fold Slider, Crest Water Hero. Look at the public previews only; never sign up, pay, or download. |

## Picking

- **Hero / signature moment:** study HorizonX, Vengeance UI Aurora Hero or Liquid Metal, then build your own (WebGL/shader in the main session). Magic UI Globe can be extracted.
- **Logo walls, social proof:** extract Magic UI Marquee; Vengeance UI Magnetic Spotlight Marquee as a look reference.
- **Feature grids:** extract Magic UI Magic Card, Border Beam, Animated Beam.
- **Numbers and stats:** extract Magic UI Number Ticker or Animate UI Counting / Sliding Number.
- **Headlines:** extract Magic UI Text Animate; rebuild Vengeance UI Flip/Morph Text or StringTune Split/Kinetic text looks.
- **Buttons and small controls:** extract Animate UI Liquid or Ripple Button, Magic UI Shimmer Button, or Uiverse CSS.
- **Menus, dialogs, tabs:** extract Animate UI primitives (accessible, keep Radix/Base UI behaviour).
- **SVG illustration motion:** Anime.js createDrawable and morphTo.

## CTA copy: [CTA Examples](https://ctaexamples.com/)

A library of 100+ short call-to-action phrases grouped by goal: E-Commerce, Digital Product, Free Trial, App Downloads, SaaS, Membership, Webinar, Newsletter, Call, Survey, Recruitment, Schedule, Event, Donation, Upsell, Referral. Use it as a starting point, never as final copy.

Rules for every CTA on a site:
- **Placement decides the words.** Each CTA is written for where it sits and what the visitor wants at that moment, following the CTA map in `docs/plan/DESIGN.md`. The same generic label ("Get Started", "Learn More") repeated across a site is a defect.
- **Match the funnel stage.** Early sections invite exploring (see the work, how it works); middle sections ask for proof or a low-risk step (see a demo, get a quote); late sections ask for the commitment (book a call, buy, start a trial).
- **Be specific to the offer.** Name the thing or the outcome: "Book a 20-minute strategy call", "Start with the Growth plan", "Get the wholesale price list", not "Submit" or "Click here".
- **One primary per view.** One primary CTA per section, at most one or two secondary ones per page view, visually ranked.
- **Localise when the location changes.** Country or city pages use local terms, currency, phone format and the channel people actually use there (for example WhatsApp in East Africa).
- **Mobile:** the primary CTA stays reachable with a thumb; touch target at least 44px.

## Design systems of real brands: [awesome-design-md](https://github.com/VoltAgent/awesome-design-md)

84 DESIGN.md files describing the design systems of well-known product sites (tokens as YAML front matter, then prose). Two uses:
- **Format:** `docs/plan/DESIGN.md` follows the same DESIGN.md format, so every stage and tool reads one source of tokens.
- **Benchmark:** when setting direction, read two or three systems from brands working at the level you're aiming for, to calibrate how complete and specific a system should be: type scale, spacing rhythm, colour roles, motion rules.

Never copy a brand's identity, palette, type pairing or layout into client work, and never ship anything that could pass for that brand. Read only; nothing here is bundled.
