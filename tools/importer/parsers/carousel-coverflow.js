/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-coverflow. Base block: carousel.
 * Source: https://awrestaurants.com/
 * Generated: 2026-08-15
 *
 * Library structure (Carousel): 2 columns, multiple rows.
 *   Row 1: block name (added by createBlock)
 *   Each subsequent row = one slide:
 *     Cell 1: Image (mandatory, no other content)
 *     Cell 2: Text content — Title (heading), Description, and/or CTA link
 *
 * Source note: each slide is `div.swiper-slide` wrapping an `<a>` (the slide link)
 * that contains a `<picture>` image and an `<h2 class="title">` (title text inside a
 * nested span). The whole slide links to a menu page, so the title is wrapped in an
 * anchor to preserve the link target without duplicating text. The `#swiper-left` /
 * `#swiper-right` nav buttons are UI controls, not content, and are excluded.
 */
export default function parse(element, { document }) {
  const slides = Array.from(element.querySelectorAll('.swiper-slide'));

  // Empty-block guard.
  if (slides.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  slides.forEach((slide) => {
    const link = slide.querySelector('a');

    // Cell 1: image only (prefer <picture>, fall back to <img>).
    const picture = slide.querySelector('picture');
    const img = slide.querySelector('img');
    const imageCell = picture || img || '';

    // Cell 2: text content (title, linked to the slide href if present).
    const textCell = [];
    const heading = slide.querySelector('h1, h2, h3, h4, .title, [class*="title"]');
    const href = link && link.getAttribute('href');
    if (heading) {
      const titleText = heading.textContent.trim();
      if (href) {
        const cta = document.createElement('a');
        cta.setAttribute('href', href);
        cta.textContent = titleText;
        const linkedHeading = document.createElement(heading.tagName.toLowerCase());
        linkedHeading.appendChild(cta);
        textCell.push(linkedHeading);
      } else {
        textCell.push(heading);
      }
    }

    cells.push([imageCell, textCell.length ? textCell : '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-coverflow', cells });
  element.replaceWith(block);
}
