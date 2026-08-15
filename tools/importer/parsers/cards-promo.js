/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-promo. Base block: cards.
 * Source: https://awrestaurants.com/
 * Generated: 2026-08-15
 *
 * Library structure (Cards): 2 columns, multiple rows.
 *   Row 1: block name (added by createBlock)
 *   Each subsequent row = one card:
 *     Cell 1: Image or Icon (mandatory)
 *     Cell 2: Text content — Title (heading), Description, and/or CTA link
 *
 * Source note: each card is a `div.card` wrapping a single `<a>` that contains a
 * `span.badge` (e.g. "Limited Time Only!" / "New!"), a `<picture>` image, and an
 * `<h2 class="title">`. The whole card links to the product page, so we build a
 * CTA link (title text -> card href) in the text cell to preserve the link target.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('div.card'));

  // Empty-block guard.
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    const link = card.querySelector('a');

    // Cell 1: image (prefer the full <picture>, fall back to <img>).
    const picture = card.querySelector('picture');
    const img = card.querySelector('img');
    const imageCell = picture || img || '';

    // Cell 2: text content.
    const textCell = [];

    // Badge (e.g. "New!", "Limited Time Only!") — surface as a small paragraph.
    const badge = card.querySelector('.badge, [class*="badge"]');
    if (badge && badge.textContent.trim()) {
      const badgeP = document.createElement('p');
      badgeP.textContent = badge.textContent.trim();
      textCell.push(badgeP);
    }

    // Title heading. Preserve the card's link target by wrapping the heading text
    // in an anchor (avoids duplicating the title as a separate CTA line).
    const heading = card.querySelector('h1, h2, h3, h4, .title, [class*="title"]');
    const href = link && link.getAttribute('href');
    if (heading) {
      if (href) {
        const cta = document.createElement('a');
        cta.setAttribute('href', href);
        cta.textContent = heading.textContent.trim();
        const linkedHeading = document.createElement(heading.tagName.toLowerCase());
        linkedHeading.appendChild(cta);
        textCell.push(linkedHeading);
      } else {
        textCell.push(heading);
      }
    }

    cells.push([imageCell, textCell.length ? textCell : '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
  element.replaceWith(block);
}
