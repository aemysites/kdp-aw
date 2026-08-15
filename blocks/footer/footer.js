// A&W footer: a fixed app-style bottom navigation bar with icon shortcuts.
// Content (icons + labels + links) is authored in the footer document.

/**
 * Fetch the footer fragment. Tries the local content path first (aem up serves
 * content/ under /content), then falls back to the root path used by DA/EDS
 * production, where the footer doc lives at /footer (served as
 * /footer.plain.html).
 * @returns {Promise<Document|null>}
 */
async function fetchFooter() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) {
    resp = await fetch('/footer.plain.html');
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
  const doc = await fetchFooter();
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
