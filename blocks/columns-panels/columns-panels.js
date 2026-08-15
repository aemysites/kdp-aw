/**
 * loads and decorates the columns-panels block
 *
 * Two side-by-side panels:
 *  - left  "app promo": white bg, phone image beside heading + promo code + store badges
 *  - right "franchise": storefront image on top, orange band with heading + copy + button
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;
  const panels = [...row.children];
  const [left, right] = panels;

  // helper: the <p> that wraps a bare picture (EDS wraps images in <p>)
  const picturePara = (panel) => [...panel.children]
    .find((child) => child.tagName === 'P' && child.querySelector(':scope > picture'));

  // ---- LEFT PANEL: app promo (image | content) ----
  if (left) {
    left.classList.add('columns-panels-app');
    const phone = picturePara(left);
    const imgCol = document.createElement('div');
    imgCol.className = 'columns-panels-app-img';
    const content = document.createElement('div');
    content.className = 'columns-panels-app-content';

    [...left.children].forEach((child) => {
      if (child === phone) imgCol.append(child);
      else content.append(child);
    });
    left.append(imgCol, content);

    // classify content paragraphs
    const paras = [...content.querySelectorAll(':scope > p')];
    const badges = paras.filter((p) => p.querySelector('a picture'));
    const textOnly = paras.filter((p) => !p.querySelector('a, picture'));
    if (textOnly[0]) textOnly[0].classList.add('columns-panels-promo-label');
    if (textOnly[1]) textOnly[1].classList.add('columns-panels-promo-code');
    badges.forEach((p) => p.classList.add('columns-panels-badge'));
  }

  // ---- RIGHT PANEL: franchise (image on top, orange band below) ----
  if (right) {
    right.classList.add('columns-panels-franchise');
    const store = picturePara(right);
    if (store) store.classList.add('columns-panels-franchise-img');
    const content = document.createElement('div');
    content.className = 'columns-panels-franchise-content';

    [...right.children].forEach((child) => {
      if (child !== store) content.append(child);
    });
    right.append(content);

    // ensure the CTA renders as a pill button even if EDS button decoration
    // didn't run on this link
    const cta = content.querySelector('p > a:only-child');
    if (cta && !cta.classList.contains('button')) {
      cta.classList.add('button');
      cta.parentElement.classList.add('button-container');
    }
  }
}
