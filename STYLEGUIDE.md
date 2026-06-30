**Color System**

- Background: `--bg` — #FFF3CE
- Secondary background: `--bg-2` — #FFE8B8
- Tertiary background: `--bg-3` — #FFE0A8
- Border: `--border` — #F5D9A6
- Text: `--text` — #53413A
- Muted text: `--text-muted` — rgba(83,65,58,0.7)
- Accent (headings / primary buttons): `--accent` — #7981E0
- Accent2 (secondary buttons / highlights): `--accent2` — #FF6527
- Tag background: `--tag-bg` — #FFD4A4
- White: `--white` — #ffffff

**Usage Guidance**

- Headings: Use `--accent` for prominent headings when shown on darker backgrounds; otherwise use `--text` on light backgrounds.
- Primary buttons: Use `--accent` background with white text (`--white`). On hover, use `--accent2`.
- Secondary buttons: Use transparent/ghost style with `--border` and `--text` or `--accent` on hover.
- Tags and skill chips: Use `--tag-bg` as background and `--accent2` for label color.
- Body copy: Use `--text` for primary content and `--text-muted` for supporting copy.

**Example components**

Heading (Playfair Display, 48px) — color `--accent` or `--text`

Secondary Heading (Inter 20px) — color `--accent2`

Paragraph — color `--text`

Primary Button — background `--accent`, color `--white`

Secondary Button — transparent background, border `--border`, color `--text` (hover `--accent`)

Tag — background `--tag-bg`, color `--accent2`

**Notes**

This palette matches the visual samples you provided. Replace any existing images or components that used the old green palette to maintain consistency.
