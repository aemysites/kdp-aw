/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-overlay.js
  function parse(element, { document }) {
    const picture = element.querySelector("picture");
    const bgImage = picture || element.querySelector("img");
    const heading = element.querySelector('h1, h2, h3, .h1, [class*="title"]');
    const subheading = element.querySelector('p, [class*="subtitle"], [class*="subheading"]');
    const allCtas = Array.from(element.querySelectorAll('a.btn, a.button, a[class*="btn"]'));
    const seenHrefs = /* @__PURE__ */ new Set();
    const ctaLinks = [];
    allCtas.forEach((a) => {
      const href = a.getAttribute("href") || a.textContent.trim();
      if (!seenHrefs.has(href)) {
        seenHrefs.add(href);
        ctaLinks.push(a);
      }
    });
    if (!heading && !bgImage && ctaLinks.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    if (contentCell.length) {
      cells.push([contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-promo.js
  function parse2(element, { document }) {
    const cards = Array.from(element.querySelectorAll("div.card"));
    if (cards.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const link = card.querySelector("a");
      const picture = card.querySelector("picture");
      const img = card.querySelector("img");
      const imageCell = picture || img || "";
      const textCell = [];
      const badge = card.querySelector('.badge, [class*="badge"]');
      if (badge && badge.textContent.trim()) {
        const badgeP = document.createElement("p");
        badgeP.textContent = badge.textContent.trim();
        textCell.push(badgeP);
      }
      const heading = card.querySelector('h1, h2, h3, h4, .title, [class*="title"]');
      const href = link && link.getAttribute("href");
      if (heading) {
        if (href) {
          const cta = document.createElement("a");
          cta.setAttribute("href", href);
          cta.textContent = heading.textContent.trim();
          const linkedHeading = document.createElement(heading.tagName.toLowerCase());
          linkedHeading.appendChild(cta);
          textCell.push(linkedHeading);
        } else {
          textCell.push(heading);
        }
      }
      cells.push([imageCell, textCell.length ? textCell : ""]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-coverflow.js
  function parse3(element, { document }) {
    const slides = Array.from(element.querySelectorAll(".swiper-slide"));
    if (slides.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    slides.forEach((slide) => {
      const link = slide.querySelector("a");
      const picture = slide.querySelector("picture");
      const img = slide.querySelector("img");
      const imageCell = picture || img || "";
      const textCell = [];
      const heading = slide.querySelector('h1, h2, h3, h4, .title, [class*="title"]');
      const href = link && link.getAttribute("href");
      if (heading) {
        const titleText = heading.textContent.trim();
        if (href) {
          const cta = document.createElement("a");
          cta.setAttribute("href", href);
          cta.textContent = titleText;
          const linkedHeading = document.createElement(heading.tagName.toLowerCase());
          linkedHeading.appendChild(cta);
          textCell.push(linkedHeading);
        } else {
          textCell.push(heading);
        }
      }
      cells.push([imageCell, textCell.length ? textCell : ""]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-coverflow", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse4(element, { document }) {
    const img = element.querySelector("img");
    const heading = element.querySelector("h1, h2, h3, h4");
    const paragraphs = Array.from(element.querySelectorAll("p"));
    const ctaLinks = Array.from(element.querySelectorAll('a.btn, a.button, a[class*="btn"]'));
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
    cells.push([img || "", textCell.length ? textCell : ""]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-panels.js
  function parse5(element, { document }) {
    let columns = Array.from(element.querySelectorAll(":scope > .col-md-6, :scope > .col-12"));
    if (columns.length < 2) {
      columns = Array.from(element.querySelectorAll(".col-md-6"));
    }
    if (columns.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const row = [];
    columns.forEach((col) => {
      const panel = col.cloneNode(true);
      Array.from(panel.querySelectorAll("div")).forEach((div) => {
        if (!div.textContent.trim() && !div.querySelector("img, picture, a, h1, h2, h3, h4, span")) {
          div.remove();
        }
      });
      const seenSrc = /* @__PURE__ */ new Set();
      Array.from(panel.querySelectorAll("img")).forEach((img) => {
        const src = img.getAttribute("src");
        if (src && seenSrc.has(src)) {
          const pic = img.closest("picture");
          (pic || img).remove();
        } else if (src) {
          seenSrc.add(src);
        }
      });
      row.push(panel);
    });
    cells.push(row);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-panels", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/awrestaurants-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#didomi-host",
        // cookie/consent host (cleaned.html line 2)
        "#usntA42Toggle",
        // "Enable accessibility" widget toggle (line 4)
        ".visually-hidden-focusable",
        // "Skip to main content" link (line 13)
        "#nav-container"
        // rooty nav overlay - expandable navigation (line 72)
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".parallaxparticles_wrapper__cgXzt",
        // onion-ring particles + Rooty mascot breakout (lines 503-527)
        ".rooty-arm-h",
        // rooty overlay arm images (lines 232-233)
        ".rooty-arm-v",
        // rooty overlay arm images (lines 234-235)
        "div.mt-5.d-flex.justify-content-center.row"
        // decorative cheese-curd animation row (lines 611-618)
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".rootynav_navBarStyles__xD4Pp",
        // top navigation bar - logo / set location / hamburger (line 15)
        ".footernav_footerLinkContainer__YIqwl",
        // fixed bottom footer navigation (line 620)
        "h1.sr-only",
        // visually-hidden "A&W Homepage" page label (line 239)
        "header",
        "footer",
        "nav"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        // stray tracking/announcer iframes (lines 11, 692-694)
        "next-route-announcer",
        // Next.js route announcer element (line 696)
        "source",
        // empty <source> inside <picture>; keep the <img>
        "script",
        "style",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-overlay": parse,
    "cards-promo": parse2,
    "carousel-coverflow": parse3,
    "columns-promo": parse4,
    "columns-panels": parse5
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "A&W Restaurants homepage with hero banner, limited-time offers grid, favorites carousel, mug club sign-up, app promo and franchising panels",
    urls: [
      "https://awrestaurants.com/"
    ],
    blocks: [
      {
        name: "hero-overlay",
        instances: ["#main > div.px-0.bg-white.container > div.container-fluid"]
      },
      {
        name: "cards-promo",
        instances: ["#main > div.px-0.bg-white.container > div.container"]
      },
      {
        name: "carousel-coverflow",
        instances: ["div.swiper.swiper-rootys-favorites"]
      },
      {
        name: "columns-promo",
        instances: ["div.justify-content-center.d-flex.align-items-stretch.bg-gradient-teal.row"],
        section: "teal-gradient"
      },
      {
        name: "columns-panels",
        instances: ["div.bg-orange-50.d-flex.align-items-stretch.row"],
        section: "orange-light"
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
