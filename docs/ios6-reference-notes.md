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

The site uses a decorative full-signal, unplugged battery variant: five square
steps at 3/5/7/9/11px and a 21 × 10px battery body with a 2 × 4px terminal.
Those are CSS approximations of the period's glyphs, not extracted Apple assets.
The existing 82% decorative battery fill is retained.

The icon gap changes from 5px to 10px; the existing 5px icon inset and 30px
tile remain. Vertical padding changes from 10px to 7px to give 44px simple
rows; multi-line rows still grow with their content. The 420px column,
cytyle pinstripe, typography, fieldset borders, section labels, disclosure
chevrons and corner badges retain their existing values.

Andrew's photo is centered above his name and tagline as requested. This is
a personal masthead layout, not a reproduction of a native Settings header.
Liquid Glass keeps its own row spacing and modern status-bar glyphs.
