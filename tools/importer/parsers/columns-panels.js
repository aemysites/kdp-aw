/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-panels. Base block: columns.
 * Source: https://awrestaurants.com/
 * Generated: 2026-08-15
 *
 * Library structure (Columns): flexible columns/rows. Row 1 is the block name;
 * subsequent rows contain one cell per visual column. Column count is derived from
 * the natural visual grouping of the source content.
 *
 * Source note: two side-by-side panels, each a direct-child `.col-md-6`:
 *   Left  = App-download promo (phone image, heading, "Promo Code" label, "20OFF"
 *           code image + text, iOS + Google Play store badge links).
 *   Right = Franchising panel (store image, "Own an A&W" heading, paragraph,
 *           "Franchising Info" CTA).
 * The phone image is duplicated for responsive breakpoints (`d-lg-none` /
 * `d-none d-lg-block`) with an identical src, so duplicate images are removed by
 * src. Empty layout spacer divs are stripped. Natural grouping => 2 columns.
 */
export default function parse(element, { document }) {
  // Direct-child columns define the visual grouping.
  let columns = Array.from(element.querySelectorAll(':scope > .col-md-6, :scope > .col-12'));
  // Fallback: any descendant column-6 panels if direct children not found.
  if (columns.length < 2) {
    columns = Array.from(element.querySelectorAll('.col-md-6'));
  }

  // Empty-block guard.
  if (columns.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  const row = [];

  columns.forEach((col) => {
    // Work on a clone so the source DOM is untouched during cleanup.
    const panel = col.cloneNode(true);

    // Remove empty layout-only spacer divs (no text and no media).
    Array.from(panel.querySelectorAll('div')).forEach((div) => {
      if (!div.textContent.trim() && !div.querySelector('img, picture, a, h1, h2, h3, h4, span')) {
        div.remove();
      }
    });

    // Dedupe responsive-duplicate images by src (keep first occurrence).
    const seenSrc = new Set();
    Array.from(panel.querySelectorAll('img')).forEach((img) => {
      const src = img.getAttribute('src');
      if (src && seenSrc.has(src)) {
        // Remove the wrapping <picture> if present, else the <img>.
        const pic = img.closest('picture');
        (pic || img).remove();
      } else if (src) {
        seenSrc.add(src);
      }
    });

    row.push(panel);
  });

  cells.push(row);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-panels', cells });
  element.replaceWith(block);
}
