# Claude Code Web Studio

**Plan, build, review and critique websites, web apps and mobile apps with Claude Code.**

Built by [Digivolve Innovations](https://digivolve.online), web design and software development in Dar es Salaam. This is the workflow we use on client projects.

A Claude Code plugin that takes a website, web app or mobile app from brief to client-ready review in four stages, and won't sign a project off until it clears a hard quality bar: a jury score of at least 8.0 with no category below 7.0, WCAG 2.2 AA accessibility, phone performance budgets, and no generic "AI-made" design patterns. Each stage runs in a fresh Claude session and hands over to the next through a `handover.md` file. The main session acts as manager: it keeps the design and architecture decisions and hands routine work to cheaper models (Sonnet for planned features and reviews, Haiku for scaffolding, installs, screenshots and mechanical edits).

| Stage | Command | What it does | Leaves behind |
|---|---|---|---|
| 1 | `/dv:plan` | Brief, architecture, design direction, CTA map, PR-sized steps each assigned to a model | `docs/plan/`, `handover.md` |
| 2 | `/dv:build` | Builds the plan step by step as manager, test-first for logic | Working app, `handover.md` |
| 3 | `/dv:review` | Reviews the code and the running product, breaks the UI with worst-case data, checks it feels native on phones, fixes what it finds | Fixed app, `handover.md` |
| 4 | `/dv:critic` | Fresh-eyes critique and score, with two independent critics. Below the bar, it sends a ranked fix list back instead of a report. | `[clientname]_review.md` |

Every stage loads only the skills that fit the surface: website, web app, or mobile app (Expo / React Native, Flutter, SwiftUI, Android native). Every rule is mandatory, and each stage keeps an evidence checklist that the next stage checks before it starts.

## How a project flows

```
/dv:plan ──handover.md──▶ /dv:build ──handover.md──▶ /dv:review ──handover.md──▶ /dv:critic
                              ▲                          ▲                           │
                              └── fix list, if the product is below the bar ─────────┘
```

1. **Every stage is a fresh session.** Each stage ends by writing `handover.md` in the project root, and the next stage starts in a new Claude session with only that file. Never continue or fork the previous session: its whole conversation would ride along on every turn of the next stage. Earlier handovers are kept in `docs/handover/`.
2. **Every stage proves its work.** Each stage keeps `docs/handover/<stage>-checklist.md`, and a line is ticked only with evidence beside it: a file path, a command result, a screenshot or a score. The next stage reads that checklist first and stops if any line is open.
3. **The design direction is locked visually, not just described.** Plan builds two or three directions side by side and you pick one. Plan then saves `docs/plan/directions/chosen/`: a page showing only that direction on the final tokens, plus desktop and phone screenshots of it. Everything else, including the comparison page, moves to `docs/plan/directions/rejected/`, which no later stage opens.
   - Build opens the two screenshots before any UI work, writes the tokens file value for value from `docs/plan/DESIGN.md`, and gives every UI agent the screenshot paths.
   - Build's self-check includes a fidelity agent that screenshots the built pages and compares palette, type, spacing, layout, motion feel and the signature moment against the chosen screenshots. Drift is fixed before handover.
   - Review compares again and sends design-level drift back to build.
   - Screenshots can't show motion, so scroll and WebGL behaviour is held by the motion rules in `DESIGN.md`.
4. **The quality bar is checked three times.** Build scores itself and fixes for up to three rounds before handing over. Review re-scores after its fixes. The critic scores independently from screenshots and the live product: at or above the bar it writes the client report, below it it sends a ranked fix list back to build or review. After three missed rounds it stops and reports to you.
5. **The main session manages; agents do the reading.** Skills load at the step that uses them. Heavy design skills run inside a Sonnet direction agent that returns a short brief. Routine work (scraping, installs, builds, tests, screenshots, measurements, log reading) goes to Haiku agents. Commands that take more than about two minutes run in the background. Every agent returns a short report with file paths, not pasted output.

## Keeping sessions lean

- **Install the plugin where you build sites, not everywhere.** Every bundled skill and agent adds an entry to the skill and agent listing of every session where it's enabled, even sessions that never use it.
- **Don't run duplicates.** If you already have ECC, Emil Kowalski's skills or the other bundled collections installed, you pay for both copies in every session's listing.
- **Prune connectors.** Every connected MCP server adds its tool definitions and instructions to every session. Turn off the ones a project doesn't need.
- **Start each stage fresh,** and check your context usage after the first turn. If it's far above what an empty session in your setup starts with, the stage has inherited something it shouldn't have.

## Install

In Claude Code:

```
/plugin marketplace add mustafabhaiji/design-skills
/plugin install dv@digivolve
```

Everything each stage needs is bundled, so you don't have to install the other skill collections first.

## Use

1. Open Claude Code in your project folder and run `/dv:plan`. Describe the client and the project. Approve the plan when it's ready.
2. Start a new session in the same folder, attach `handover.md`, and run `/dv:build`.
3. Start a new session, attach the new `handover.md`, and run `/dv:review`.
4. Start a new session, attach the new `handover.md`, and run `/dv:critic`.

Earlier handovers are kept in `docs/handover/`.

## Requirements

- Claude Code with subagents (the stages delegate to Sonnet and Haiku).
- Node.js 20+ for the `awwwards` and `jury` scripts, plus Playwright and axe-core for `jury`'s browser checks.
- Python 3 for the scripts in `oil-ui`, `ui-ux-pro-max` and `audit-reference-originality`.
- A browser automation tool (the built-in browser, Chrome, or a Playwright MCP server) for `browser-qa` and screenshot steps.
- Mobile: the toolchain for your stack (Xcode, Android Studio, Expo) if you want simulator screenshots.

## What's bundled

Skills, agents, commands and one reference document from the open-source repos below, each under MIT or Apache 2.0:

- [Emil Kowalski's skills](https://github.com/emilkowalski/skills): motion, mobile feel, UI stress tests
- [taste-skill](https://github.com/Leonxlnx/taste-skill) and [taste-skill-classics](https://github.com/Leonxlnx/taste-skill-classics) by Leonxlnx: visual design direction
- [juliobsz/skills](https://github.com/juliobsz/skills): award-level site builds (`awwwards`) and scoring (`jury`)
- [caveman](https://github.com/JuliusBrussee/caveman) by Julius Brussee: lean building, safe refactors and fixes, verification
- [ECC](https://github.com/affaan-m/ECC) by Affaan Mustafa: planning, stack patterns, testing, code and security review agents
- Anthropic's [knowledge-work plugins](https://github.com/anthropics/knowledge-work-plugins), [official plugins](https://github.com/anthropics/claude-plugins-official) and [skills](https://github.com/anthropics/skills): design critique, UX copy, research, frontend design, themes
- [Impeccable](https://github.com/pbakaus/impeccable) by Paul Bakaus and [Hallmark](https://github.com/Nutlope/hallmark) by Nutlope: anti-"AI slop" detection and polish
- [oil-ui](https://github.com/oil-oil/oil-ui): side-by-side design direction exploration
- [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill): palettes, font pairings and UX patterns
- [Vercel's Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines): the interface rulebook every web build is checked against
- [MiniMax skills](https://github.com/MiniMax-AI/skills): iOS, Android, Flutter and React Native platform guides
- [LottieFiles motion design](https://github.com/LottieFiles/motion-design-skill): motion principles for loaders, transitions and Lottie
- [Meng To's skills](https://github.com/MengTo/Skills): Three.js and WebGL, high-density rendering, reference originality audit, full-page capture

Full list, pinned commits and licences: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Credit for those skills belongs to their authors.

### Known limits

- Bundled skills are copied unmodified. Every sibling skill they point to is bundled, except the three `/superpowers:...` commands mentioned in `click-path-audit`, which come from a separate collection; that skill works without them.
- A few ECC skills expect tools from the full ECC install (its hooks or a browser MCP server). They still give useful guidance without them.
- The repo is large, most of it the reference libraries inside `design-taste-frontend` and `ui-ux-pro-max`.

## Updating the bundled skills

```
node scripts/sync-vendor.mjs            # re-copy at the pinned commits
node scripts/sync-vendor.mjs --latest   # move to each source's latest commit, then review the diff
```

The script replaces only the folders listed in `vendor.json` and regenerates `THIRD_PARTY_NOTICES.md`. Needs Node 18+ and git.

Maintainers: the four stage skills are edited as local `dv-plan`, `dv-build`, `dv-review` and `dv-critic` skills in `~/.claude/skills`, then rebuilt into this repo with:

```
node scripts/build-own-skills.mjs
```

It renames every reference to the plugin's `dv:` namespace and drops local-only parts such as install prerequisites and local paths.

## UI and CTA references

`skills/build/references/ui-sources.md` lists the component libraries the build stage uses as visual references, which ones are free to extract code from, and the rules for writing calls to action per placement (with [CTA Examples](https://ctaexamples.com/) as the copy reference).

## Licence

The four stage skills, scripts and manifests are MIT licensed (see [LICENSE](LICENSE)). Bundled third-party work keeps its own licence.

## About Digivolve

[Digivolve Innovations](https://digivolve.online) designs and builds websites, web apps and business software for companies in Tanzania and East Africa. Want a site or app built to this standard? [Get in touch](https://digivolve.online).
