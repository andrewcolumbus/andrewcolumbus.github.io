# iOS 6 source pixels

`ios6-status-original.png` is the unchanged 640 × 40 Retina screenshot from
[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:IOS_6_Status_Bar.png),
uploaded by TheMostAmazingTechnik on August 3, 2013 from their own iOS 6 device.
The file page lists it as public domain (simple geometry).

Original URL: <https://upload.wikimedia.org/wikipedia/commons/7/75/IOS_6_Status_Bar.png>

Battery crop: `42x20+592+9`. The source's full charge state is preserved.
Open `../battery-pixel-check.html` through the local preview server to compare
all 840 pixels against the actual asset selected by the site's stylesheet.

Signal crop: `38x20+8+9`. The five bars are 6 Retina pixels wide, separated
by 2 pixels, with heights 8, 10, 13, 16 and 20. They display at 19 × 10 CSS
pixels, inset 4px from the left and 4.5px from the top.

`ios6-header-original.png` is Matt Neuburg's original illustration of his
running UIKit example in *Programming iOS 6*, chapter 25, figure 25.21:
<https://www.apeth.com/iOSBook/ch25.html#FIGnavbar>.
Original URL: <https://www.apeth.com/iOSBook/figs/pios_2521.png>.
SHA-256: `9906abbab982292cf877dd387c62805772baeeb47e03132de44bafda856c98d5`.
The 339 × 88 image contains an unscaled 320px-wide screen beginning at x=10,
y=10. We sample unobstructed columns x=100…115: y=10…29 for the status bar,
y=30…73 for the 44px navigation bar, and y=74…76 for its shadow over white.
Only the background color rows are reproduced; the original labels/buttons
are not used by the site.

This PNG embeds Apple's Generic RGB profile. The SVG rows are the screenshot's
color-managed **sRGB** values, sampled through Safari's default sRGB canvas;
copying the raw file RGB numbers would produce visible color errors. The
unchanged original, including its profile, remains here for independent checks.
The shadow is transparent black, with coverage 36/255, 19/255 and 6/255,
matching the original over white while allowing the site's pinstripe through.

`ios6-low-signal-original.png` is FanHabbo's January 1, 2013 iPhone 3GS
screenshot of Cydia on iOS 6.0.1, listed under the BSD license on
[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Cydia_corriendo_en_iOS_6_con_un_iPhone_3GS.png).
Original URL: <https://upload.wikimedia.org/wikipedia/commons/2/29/Cydia_corriendo_en_iOS_6_con_un_iPhone_3GS.png>.
At native 1× resolution it shows two active bars and three **1px-high baseline
dashes**, each 3px wide with a 1px gap. The dashes occupy x=12…14, 16…18,
20…22 at y=13, with a one-pixel black shadow immediately above them. Measured
shadow coverage is approximately one third. This is a geometry/shadow reference,
not a color match to the other screenshot's black status-bar variant.

Signal levels 1–4 derive from the full-signal glyph: active bars retain their
original columns; inactive bars collapse to the bottom two Retina rows. The
site preserves the full-signal source's `#bfbfbf` foreground and adds the
blue-bar variant's one-pixel upward shadow. Thus only level 5's foreground has
a direct 760-pixel screenshot equality check; lower levels have exhaustive
reference-derived geometry checks, not independent full-state screenshot matches.
One inline head script chooses a uniformly random level 1–5 per document load,
before first paint. It does not reroll on theme changes or store a preference.

Open `../header-pixel-check.html` through the preview server for background,
signal, shadow, responsive geometry and Glass-isolation checks. Header source
pixels are native 1×, signal/battery source pixels are native 2×; do not describe
the entire custom title/header as pixel-identical to a single original screenshot.

Verified in Safari: signal foreground 0/760 differing pixels, status-bar paint
0/320, navigation-bar paint 0/704, shadow over white 0/48; maximum RGB error 0.
All five generated levels and 320/375/420px geometry checks pass. Fresh loads
produced levels 4 then 2. Random selection may legitimately repeat a value.
The Glass theme still uses its own four-bar icon and battery, and was checked
visually after toggling both directions. `main.js` remains unchanged.
