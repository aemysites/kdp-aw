import { getMetadata } from '../../scripts/aem.js';

// A&W footer: a fixed app-style bottom navigation bar with icon shortcuts.
// Content (icons + labels + links) is authored in /content/footer.plain.html.

/**
 * Fetch the footer fragment (localhost first, then DA/EDS production path).
 * @param {string} footerPath path to the footer doc without the .plain.html suffix
 * @returns {Promise<Document|null>}
 */
async function fetchFooter(footerPath) {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) {
    resp = await fetch(`${footerPath}.plain.html`);
  }
  if (!resp.ok) return null;
  const html = await resp.text();
  return new DOMParser().parseFromString(html, 'text/html');
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/content/footer';

  const doc = await fetchFooter(footerPath);
  block.textContent = '';

  const footer = document.createElement('div');
  footer.className = 'footer-nav';

  const list = doc ? doc.querySelector('ul') : null;
  if (list) {
    list.classList.add('footer-nav-list');
    // mark the link matching the current path as active
    const here = window.location.pathname.replace(/\/index$/, '/').replace(/\/$/, '') || '/';
    list.querySelectorAll('a').forEach((a) => {
      const href = (a.getAttribute('href') || '').replace(/\/$/, '') || '/';
      if (href === here) a.setAttribute('aria-current', 'page');
    });
    footer.append(list);
  } else if (doc) {
    while (doc.body.firstElementChild) footer.append(doc.body.firstElementChild);
  }

  block.append(footer);
}
