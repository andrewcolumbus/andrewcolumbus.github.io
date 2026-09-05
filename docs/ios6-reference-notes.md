# iOS 6 spacing and status-bar references

Visual references inspected for this adjustment are actual iPhone screenshots
from [Ars Technica's September 19, 2012 iOS 6 review](https://arstechnica.com/gadgets/2012/09/review-ios-6-gets-the-spit-and-polish-treatment/):

- [Privacy](https://cdn.arstechnica.net/wp-content/uploads/2012/09/Privacy_overall.jpg):
  320 × 480 image; approximately 29–30px icons, a 10px gap to the labels, and
  44px single-line rows. Contacts, Calendars and Reminders share one text edge.
- [Contacts](https://cdn.arstechnica.net/wp-content/uploads/2012/09/privacy_contacts.jpg):
  confirms the same icon spacing and row height with third-party app icons.
- [Do Not Disturb](https://cdn.arstechnica.net/wp-content/uploads/2012/09/donotdisturb.jpg):
  blue-tinted 20px status bar, pale embossed glyphs, and a compact battery
  outline with a centered terminal. These shots show low cellular reception
  and a plugged-in battery.

The signal now uses the lossless status-bar reference below: 3px-wide bars,
1px gaps, and native heights of 4/5/6.5/8/10 CSS pixels. Its 19 × 10px glyph
sits 4px from the left and 4.5px from the top. Reception is decorative and
randomized once, before first paint, to 1–5 bars on each document load.
Inactive bars collapse to 1px-high baseline dashes, following FanHabbo's
lossless iOS 6.0.1 Cydia screenshot, with the original one-pixel upward shadow.
The foreground retains the full-signal source's gray, not the Cydia shot's tint.
See [source provenance and exactness limits](reference/README.md).

The navigation and status-bar backgrounds now use exact, color-managed rows
from Matt Neuburg's [iOS 6 UIKit example](https://www.apeth.com/iOSBook/ch25.html#FIGnavbar).
The 44px navigation bar includes the original highlight and bottom rule,
followed by its three-pixel shadow. The status bar remains 20px. Title text
uses normal Helvetica tracking and stays live HTML; custom labels and the
theme toggle are not claimed to be pixel-identical to that screenshot.

[Header and signal checks](header-pixel-check.html) verify native foreground
and paint pixels, all five reference-derived signal geometries, 320/375/420px
layouts, and Glass isolation. The source's Generic RGB profile is respected
when deriving sRGB colors. No estimated two-stop gradient remains in the bars.

The battery uses the exact glyph pixels from the lossless
[iOS 6 status-bar screenshot](https://commons.wikimedia.org/wiki/File:IOS_6_Status_Bar.png)
uploaded by TheMostAmazingTechnik on August 3, 2013. The source is preserved in
`reference/ios6-status-original.png`; its battery crop is `42x20+592+9`.
`assets/battery-ios6.svg` encodes the original pixels as paths on that 42 × 20
grid, including all 25 nonzero gray levels and the hollow terminal. Source
gray levels are represented as coverage of `#bfbfbf` over black, so the empty
areas are transparent on the site's blue bar.

The icon displays at 21 × 10 CSS pixels, 4.5px from the status bar's top and
3px from its right edge, matching the reference's Retina geometry. The full
charge state is taken from the reference; it is decorative, not a live reading.
The earlier 82% fill and estimated gradients have been replaced by source pixels.

Open [the pixel comparison](battery-pixel-check.html) through the preview server.
It reads the asset and dimensions selected by the actual site stylesheet,
compares all 840 rendered pixels against the screenshot over its original
black background, and checks the icon's size and placement. Verified in Safari:
**0 differing pixels, maximum RGB channel error 0**, with all geometry checks
passing. This exact match is for the documented full-battery glyph at native
2× resolution on the reference background; the page retains its blue status bar.

The icon gap changes from 5px to 10px; the existing 5px icon inset and 30px
tile remain. Vertical padding changes from 10px to 7px to give 44px simple
rows; multi-line rows still grow with their content. The 420px column,
cytyle pinstripe, typography, fieldset borders, section labels, disclosure
chevrons and corner badges retain their existing values.

Andrew's photo is centered above his name and tagline as requested. This is
a personal masthead layout, not a reproduction of a native Settings header.
Liquid Glass keeps its own row spacing and modern status-bar glyphs.
