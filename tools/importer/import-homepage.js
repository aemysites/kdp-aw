/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroOverlayParser from './parsers/hero-overlay.js';
import cardsPromoParser from './parsers/cards-promo.js';
import carouselCoverflowParser from './parsers/carousel-coverflow.js';
import columnsPromoParser from './parsers/columns-promo.js';
import columnsPanelsParser from './parsers/columns-panels.js';

// TRANSFORMER IMPORTS
import awrestaurantsCleanupTransformer from './transformers/awrestaurants-cleanup.js';

// PARSER REGISTRY
const parsers = {
  'hero-overlay': heroOverlayParser,
  'cards-promo': cardsPromoParser,
  'carousel-coverflow': carouselCoverflowParser,
  'columns-promo': columnsPromoParser,
  'columns-panels': columnsPanelsParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  awrestaurantsCleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'A&W Restaurants homepage with hero banner, limited-time offers grid, favorites carousel, mug club sign-up, app promo and franchising panels',
  urls: [
    'https://awrestaurants.com/',
  ],
  blocks: [
    {
      name: 'hero-overlay',
      instances: ['#main > div.px-0.bg-white.container > div.container-fluid'],
    },
    {
      name: 'cards-promo',
      instances: ['#main > div.px-0.bg-white.container > div.container'],
    },
    {
      name: 'carousel-coverflow',
      instances: ['div.swiper.swiper-rootys-favorites'],
    },
    {
      name: 'columns-promo',
      instances: ['div.justify-content-center.d-flex.align-items-stretch.bg-gradient-teal.row'],
      section: 'teal-gradient',
    },
    {
      name: 'columns-panels',
      instances: ['div.bg-orange-50.d-flex.align-items-stretch.row'],
      section: 'orange-light',
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
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
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
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

    // 4. afterTransform cleanup
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root/homepage URL to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
