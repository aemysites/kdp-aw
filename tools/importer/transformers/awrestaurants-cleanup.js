/* eslint-disable */
/* global WebImporter */

/**
 * Site-wide cleanup transformer for awrestaurants.com.
 *
 * All selectors below were verified against migration-work/cleaned.html and
 * migration-work/page-structure.json (excludedRegions). No selector is guessed.
 *
 * Removes non-authorable site chrome (header nav, rooty nav overlay, fixed
 * footer nav), decorative-only assets (parallax onion-ring particles, Rooty
 * mascot, cheese-curd animation), and script/style/embed noise so the import
 * contains only page-level authorable content.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Consent / widget / overlay chrome that can interfere with block parsing.
    WebImporter.DOMUtils.remove(element, [
      '#didomi-host', // cookie/consent host (cleaned.html line 2)
      '#usntA42Toggle', // "Enable accessibility" widget toggle (line 4)
      '.visually-hidden-focusable', // "Skip to main content" link (line 13)
      '#nav-container', // rooty nav overlay - expandable navigation (line 72)
    ]);

    // Decorative-only assets removed before parsing so block parsers do not
    // pick them up as content images.
    WebImporter.DOMUtils.remove(element, [
      '.parallaxparticles_wrapper__cgXzt', // onion-ring particles + Rooty mascot breakout (lines 503-527)
      '.rooty-arm-h', // rooty overlay arm images (lines 232-233)
      '.rooty-arm-v', // rooty overlay arm images (lines 234-235)
      'div.mt-5.d-flex.justify-content-center.row', // decorative cheese-curd animation row (lines 611-618)
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome (header / nav / footer).
    WebImporter.DOMUtils.remove(element, [
      '.rootynav_navBarStyles__xD4Pp', // top navigation bar - logo / set location / hamburger (line 15)
      '.footernav_footerLinkContainer__YIqwl', // fixed bottom footer navigation (line 620)
      'h1.sr-only', // visually-hidden "A&W Homepage" page label (line 239)
      'header',
      'footer',
      'nav',
    ]);

    // Leftover non-authorable elements and markup noise.
    WebImporter.DOMUtils.remove(element, [
      'iframe', // stray tracking/announcer iframes (lines 11, 692-694)
      'next-route-announcer', // Next.js route announcer element (line 696)
      'source', // empty <source> inside <picture>; keep the <img>
      'script',
      'style',
      'link',
      'noscript',
    ]);
  }
}
