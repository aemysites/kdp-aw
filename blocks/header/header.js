import { getMetadata } from '../../scripts/aem.js';

// A&W header: solid white top bar (Set Location · logo · hamburger) that opens
// a full-screen brown navigation drawer. Content is authored in
// /content/nav.plain.html; this script reads that DOM and wires up behavior.

/**
 * Fetch the nav fragment (localhost first, then DA/EDS production path).
 * @param {string} navPath path to the nav doc without the .plain.html suffix
 * @returns {Promise<Document|null>}
 */
async function fetchNav(navPath) {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) {
    resp = await fetch(`${navPath}.plain.html`);
  }
  if (!resp.ok) return null;
  const html = await resp.text();
  return new DOMParser().parseFromString(html, 'text/html');
}

/**
 * Toggle the drawer open/closed.
 * @param {Element} nav the nav element
 * @param {boolean} [force] explicit state
 */
function toggleDrawer(nav, force) {
  const open = typeof force === 'boolean' ? force : !nav.classList.contains('nav-open');
  nav.classList.toggle('nav-open', open);
  document.body.classList.toggle('nav-drawer-open', open);
  const toggle = nav.querySelector('.nav-hamburger button');
  if (toggle) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // resolve nav path from block metadata, default to the nav doc
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/content/nav';

  const doc = await fetchNav(navPath);
  block.textContent = '';

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');

  const sections = doc ? [...doc.body.children] : [];
  // sections: [0] bar (set-location + logo), [1] primary/app/secondary,
  // [2] connect + social, [3] regional + copyright

  // --- Top bar ---
  const bar = document.createElement('div');
  bar.className = 'nav-bar';

  const barSource = sections[0];
  const barLinks = barSource ? [...barSource.querySelectorAll('a')] : [];
  const setLocation = barLinks.find((a) => /location/i.test(a.getAttribute('href') || '') && a.textContent.trim());
  const logoLink = barLinks.find((a) => a.getAttribute('href') === '/' || a.querySelector('img[alt*="Logo" i]'));

  const barLeft = document.createElement('div');
  barLeft.className = 'nav-bar-left';
  if (setLocation) {
    setLocation.classList.add('nav-set-location');
    barLeft.append(setLocation);
  }

  const barCenter = document.createElement('div');
  barCenter.className = 'nav-bar-center';
  if (logoLink) {
    logoLink.classList.add('nav-logo');
    logoLink.setAttribute('aria-label', 'A&W Home');
    barCenter.append(logoLink);
  }

  const barRight = document.createElement('div');
  barRight.className = 'nav-bar-right';
  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = `<button type="button" aria-controls="nav-drawer" aria-expanded="false" aria-label="Open menu">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  barRight.append(hamburger);

  bar.append(barLeft, barCenter, barRight);

  // --- Drawer ---
  const drawer = document.createElement('div');
  drawer.className = 'nav-drawer';
  drawer.id = 'nav-drawer';

  // drawer header: centered logo + close button
  const drawerHead = document.createElement('div');
  drawerHead.className = 'nav-drawer-head';
  if (logoLink) {
    const logoClone = logoLink.cloneNode(true);
    logoClone.classList.remove('nav-logo');
    logoClone.classList.add('nav-drawer-logo');
    const img = logoClone.querySelector('img');
    if (img) img.src = img.src.replace('aw-logo-dark', 'aw-logo-white');
    drawerHead.append(logoClone);
  }
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'nav-drawer-close';
  closeBtn.setAttribute('aria-label', 'Close menu');
  closeBtn.innerHTML = '<span></span><span></span>';
  drawerHead.append(closeBtn);
  drawer.append(drawerHead);

  // drawer body: remaining authored sections (skip section 0 = bar)
  const drawerBody = document.createElement('div');
  drawerBody.className = 'nav-drawer-body';
  // drawer sections after the bar: [0] primary/app/secondary links, [1] social, [2] regional
  const groupClasses = ['nav-primary', 'nav-social', 'nav-regional'];
  sections.slice(1).forEach((section, i) => {
    const group = document.createElement('div');
    group.className = `nav-group ${groupClasses[i] || ''}`.trim();
    // The primary block holds three <ul>s (primary, app, secondary).
    if (i === 0) {
      const lists = [...section.querySelectorAll(':scope > ul')];
      lists.forEach((ul, li) => {
        const cls = ['nav-primary-list', 'nav-app-list', 'nav-links-list'][li] || 'nav-links-list';
        ul.classList.add(cls);
        group.append(ul);
      });
    } else {
      [...section.children].forEach((child) => group.append(child));
    }
    drawerBody.append(group);
  });
  drawer.append(drawerBody);

  nav.append(bar, drawer);

  // --- Behavior ---
  hamburger.querySelector('button').addEventListener('click', () => toggleDrawer(nav));
  closeBtn.addEventListener('click', () => toggleDrawer(nav, false));
  // close when a drawer link is clicked
  drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggleDrawer(nav, false)));
  // Escape closes
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && nav.classList.contains('nav-open')) toggleDrawer(nav, false);
  });
  // reset drawer state when resizing to a wide viewport
  const wide = window.matchMedia('(min-width: 900px)');
  wide.addEventListener('change', () => {
    if (nav.classList.contains('nav-open')) toggleDrawer(nav, false);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
