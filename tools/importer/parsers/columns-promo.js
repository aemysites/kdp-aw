/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-promo. Base block: columns.
 * Source: https://awrestaurants.com/
 * Generated: 2026-08-15
 *
 * Library structure (Columns): flexible columns/rows. Row 1 is the block name;
 * subsequent rows contain one cell per visual column. Column count is derived from
 * the natural visual grouping of the source content.
 *
 * Source note: this is the "Mug Club" promo — a promotional image on the left and a
 * text column on the right (heading with a subheading <span>, a descriptive
 * paragraph, and a "Sign Up" CTA). Empty spacer divs (`.d-none.d-lg-block` with no
 * content) are layout-only and excluded. Natural grouping => 2 columns.
 */
export default function parse(element, { document }) {
  // Left column: promotional image.
  const img = element.querySelector('img');

  // Right column: text content.
  const heading = element.querySelector('h1, h2, h3, h4');
  const paragraphs = Array.from(element.querySelectorAll('p'));
  const ctaLinks = Array.from(element.querySelectorAll('a.btn, a.button, a[class*="btn"]'));

  // Empty-block guard.
  if (!heading && paragraphs.length === 0 && !img && ctaLinks.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const textCell = [];
  if (heading) textCell.push(heading);
  paragraphs.forEach((p) => {
    if (p.textContent.trim()) textCell.push(p);
  });
  ctaLinks.forEach((a) => textCell.push(a));

  const cells = [];

  // Single content row with 2 columns: image | text.
  cells.push([img || '', textCell.length ? textCell : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
