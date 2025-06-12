---
title: How to export a website's mobile view to PDF
date: 2025-06-12 09:34:25
categories:
tags:
summary:
hideSummary:
description:
image: pdf-mobile-s.jpeg
location:
---
<div class="table-wrapper">
 
- [Background: my reading devices are small](#Background-my-reading-devices-are-small)
- [Test case: reading Ink \& Switch paper on a small device](#Test-case-reading-Ink-Switch-paper-on-a-small-device)
  - [problem: web-exported PDFs do not look good on small devices](#problem-web-exported-PDFs-do-not-look-good-on-small-devices)
- [Solution: export to PDF with forced mobile view](#Solution-export-to-PDF-with-forced-mobile-view)
</div>

## Background: my reading devices are small

For unholy reasons that defy all design personas, I read on a phone-sized device (I will NOT give up my vacation power-position of laying down and holding the device above my face with one hand ok??[^1]). For TEN YEARS an iPhone 13 mini sized phone was my only reading device for ebooks, online articles, papers, RSS feeds. If I got truly frustrated with an article format, I'd dig out my laptop, but this is the last resort since the laptop precludes laying down. When I got my iPhone pro max sized e-ink device this week, the size upgrade was conspicuous! 

{% figure src="ebooks-comparison.jpeg" caption="ebook on the Palma vs iPhone 13 mini. The Palma (one of the smallest flagship e-readers on the market) feels massive!" class="" %}

## Test case: reading Ink & Switch paper on a small device

The research lab Ink & Switch drops banquets of knowledge on their website. Reading their papers is an hour-long beast mode affair and certainly requires of me the horizontal power-position. Immediately after I got the Palma, the Lab dished out their latest feast, [an ode to malleable software](https://www.inkandswitch.com/essay/malleable-software/). I used the encouraging "print/view as PDF button"[^2], and load the PDF on the e-reader.

### problem: web-exported PDFs do not look good on small devices

The Ink & Switch papers have super cute marginalia notes. In a phone-sized viewport, the marginalia takes up half the screen, causing the body of the article to squeeze into only the left half of the screen, which is aesthetically and morally uncomfortable:

{% figure src="pdf-print.jpeg" caption="Left: The paper in PDF format on e-reader. Right: The paper in mobile web format on phone." class="" %}

The simplest solution is to rotate the screen into landscape mode (then I had to fiddle around to set up the correct zoom distance):

{% figure src="pdf-print-landscape.jpeg" caption="The same paper viewed in landscape mode." class="" %}

That's acceptable. The text is a readable size. The pagination is awkward since the page size is mis-matched with the screen size, but I could go back and re-export the PDF in landscape mode. But the screen ratio doesn't lend itself to this view, and holding the reader horizontally with one hand while laying down is unwieldy. I think I can do better.


## Solution: export to PDF with forced mobile view

<figure>
<img src="pdf-mobile.jpeg" class='' >
<figcaption><p>

Palma e-reader on the left showing the PDF exported with mobile view[^3], vs mobile view displayed on the phone on the right.
</p></figcaption>
</figure>

I read phone-shaped articles for years before the e-reader, so why not go back to that tried-and-true format that developers already have on their checklist to support. Here's how I forced the print dialog to use a small viewport, as if a mobile device:

1. Open devtools
2. In the "rendering" tab, [set "Emulate CSS media type"](https://developer.chrome.com/docs/devtools/rendering/emulate-css#emulate_css_media_type_enable_print_preview) to <u>**screen**</u> (as opposed to "print", which is the usual mode in the print dialog.)
    {% figure src="emulate-css-media-type.jpeg" caption="" class="small" %}
3. Bring up the print dialog (cmd-p) and click "more settings". Set the following:
   1. Destination: Save as PDF
   2. Paper size: pick a default that's small (such as A5), or create a custom paper size[^2] with a ratio that matches your device (but it has to be small enough that it triggers the mobile view instead of the desktop view).
   3. Margins: none
   4. Scale: play around with scale until the font ratio is what you want to see on your e-reader
   5. Options: enable background graphics (shows background color in divs)
   {% figure src="settings.jpeg" caption="" class="" %}
4. Save!

How I got here aka What didn't work, ordered in increasing complexity and desperation (and because I wanted to exhaust all non-devtools possibilities):

1. Loaded it on the e-reader's browser. This didn't work because I'd like to make highlights and annotations, and read offline, which I can't do in the browser. 
2. Print -> Export to PDF on my laptop. The [original attempt](#problem-web-exported-PDFs-do-not-look-good-on-small-devices), which only allowed desktop/print format[^4]
3. Tried #2 again but with "paper size"[^2] set to the miniature dimensions of my e-reader, and modulating the "scale" setting, hoping it would trigger the mobile view. It would not.
4. Tried #2 but on the e-reader's browser. Images were missing??
5. Tried #2 but on my phone, reasoning it was already displaying the mobile view I wanted. The resulting PDF was still desktop/print format, which makes sense in retrospect, since when people print from their phones it's usually onto a paper-sized piece of paper, not a phone-sized piece of paper.
6. Time to go back to the laptop and open the browser devtools[^5].
   1. Used the [device toolbar](https://developer.chrome.com/docs/devtools/device-mode#viewport) to set view to "iPhone 13 mini". nope. huh.
   2. Opened "sources" tab, and deleted `@media print` styles from the CSS. Surprisingly that didn't do it.
   3. Thought more about the media type query, figured out how to emulate it: in the "rendering" tab [set "Emulate CSS media type"](https://developer.chrome.com/docs/devtools/rendering/emulate-css#emulate_css_media_type_enable_print_preview) to screen. Woah!!! Now when I bring up the print dialog (cmd-p) and set the paper size to something small, it switches from desktop to mobile view as if the printer was just another screen. yay!

Alright. Time to read that paper while laying on the ground in my ideal focus position: head in the shade of trees, feet in the sun. ☀️ 



[^1]: My unreasonable e-reader criteria: 
    1. I must be able to use it one-handed while laying on my back.
    2. Due to above, dropping it onto my face while I fall asleep has to be low-consequence. So no iPad.
    3. I'm a no-bag person. It has to fit in my pocket or else I won't have it with me. It's the same reason I stopped using my mirrorless-DSLR camera over my phone camera. Even though I hand-sew upgrades to my pockets, most e-readers are is still too big since pocket size is limited by leg circumference.

[^2]: I exported to PDF with a custom "paper size" with my e-reader's dimensions, which I created through my OS's native print dialog. Took a while to find, and I won't detail it here because I can't seem to find it again, it has dissolved back into the mists of inconsistent settings dialogs.
[^3]: A discerning reader will note that the gray background for the maginalia is missing in the e-reader view. I went back and fixed this by enabling the print setting "enable background graphics". I did not go back and take another photo.
[^4]: desktop/print format = the marginalia floating to the right of the text body, rather than the marginalia inline with the text body (as in the mobile/small screen view)
[^5]: The circumstances of cracking open brower devtools to tweak the PDF export of a treatise on malleable software for my niche e-reader device is not lost on me. 