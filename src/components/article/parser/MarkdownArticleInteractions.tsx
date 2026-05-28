const MARKDOWN_ARTICLE_INTERACTIONS_SCRIPT = String.raw`
(() => {
  if (window.__suzuMarkdownInteractions === true) {
    return;
  }

  window.__suzuMarkdownInteractions = true;

  const SWIPE_THRESHOLD = 44;
  const PREVIEW_CLOSE_DELAY = 220;
  let swipeStart = null;

  const getRoot = () => document.querySelector('.post-content');

  const getActiveCarouselIndex = (carousel) => {
    return Array
      .from(carousel.querySelectorAll('.markdown-gallery-carousel-item'))
      .findIndex((item) => item.dataset.active === 'true');
  };

  const selectCarouselItem = (carousel, nextIndex) => {
    const items = Array.from(carousel.querySelectorAll('.markdown-gallery-carousel-item'));
    const dots = Array.from(carousel.querySelectorAll('.markdown-gallery-carousel-dot'));

    if (items.length === 0) {
      return;
    }

    const activeIndex = (nextIndex + items.length) % items.length;

    items.forEach((item, index) => {
      const isActive = index === activeIndex;
      item.dataset.active = String(isActive);
      item.toggleAttribute('aria-hidden', !isActive);
      item.toggleAttribute('inert', !isActive);
    });

    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.dataset.active = String(isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });
  };

  const openImagePreview = (button) => {
    const image = button.querySelector('img');

    if (image == null) {
      return;
    }

    const src = image.currentSrc || image.src;
    const alt = image.alt || 'Image preview';
    const overlay = document.createElement('div');
    const frame = document.createElement('div');
    const title = document.createElement('span');
    const closeButton = document.createElement('button');
    const previewImage = document.createElement('img');
    const caption = document.createElement('span');
    const titleId = 'markdown-image-preview-' + Math.random().toString(36).slice(2);
    const previousOverflow = document.body.style.overflow;

    const close = () => {
      overlay.dataset.visible = 'false';
      document.body.style.overflow = previousOverflow;
      window.setTimeout(() => overlay.remove(), PREVIEW_CLOSE_DELAY);
    };

    overlay.className = 'markdown-image-preview fixed inset-0 z-[9999] flex min-h-dvh items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6';
    overlay.dataset.visible = 'false';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', titleId);

    frame.className = 'markdown-image-preview-frame relative flex max-h-full w-full max-w-6xl flex-col items-center gap-3';
    title.id = titleId;
    title.className = 'sr-only';
    title.textContent = 'Image preview: ' + alt;

    closeButton.type = 'button';
    closeButton.className = 'absolute right-2 top-2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/65 text-2xl leading-none text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white';
    closeButton.setAttribute('aria-label', 'Close image preview');
    closeButton.textContent = '×';

    previewImage.src = src;
    previewImage.alt = alt;
    previewImage.className = 'max-h-[85dvh] max-w-full rounded-md object-contain shadow-2xl';

    caption.className = 'max-w-3xl text-center text-sm leading-relaxed text-white/85';
    caption.textContent = alt;

    closeButton.addEventListener('click', close);
    overlay.addEventListener('click', close);
    frame.addEventListener('click', (event) => event.stopPropagation());

    frame.append(title, closeButton, previewImage, caption);
    overlay.append(frame);
    document.body.append(overlay);
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => {
      overlay.dataset.visible = 'true';
      closeButton.focus({ preventScroll: true });
    });
  };

  const handleClick = (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const root = getRoot();

    if (target == null || root == null || !root.contains(target)) {
      return;
    }

    const carouselAction = target.closest('button[data-carousel-action]');

    if (carouselAction != null) {
      const carousel = carouselAction.closest('.markdown-gallery-carousel');
      const activeIndex = carousel == null ? -1 : getActiveCarouselIndex(carousel);

      if (carousel != null && activeIndex >= 0) {
        event.preventDefault();
        event.stopPropagation();
        selectCarouselItem(
          carousel,
          activeIndex + (carouselAction.dataset.carouselAction === 'next' ? 1 : -1),
        );
      }

      return;
    }

    const carouselDot = target.closest('button[data-carousel-index]');

    if (carouselDot != null) {
      const carousel = carouselDot.closest('.markdown-gallery-carousel');
      const nextIndex = Number(carouselDot.dataset.carouselIndex);

      if (carousel != null && Number.isInteger(nextIndex)) {
        event.preventDefault();
        event.stopPropagation();
        selectCarouselItem(carousel, nextIndex);
      }

      return;
    }

    const previewButton = target.closest('button[data-markdown-image-preview]');

    if (previewButton != null) {
      event.preventDefault();
      event.stopPropagation();
      openImagePreview(previewButton);
    }
  };

  const handlePointerDown = (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const root = getRoot();
    const carousel = target == null ? null : target.closest('.markdown-gallery-carousel');

    if (
      root == null
      || carousel == null
      || !root.contains(carousel)
      || event.pointerType === 'mouse'
    ) {
      return;
    }

    swipeStart = {
      carousel,
      x: event.clientX,
      y: event.clientY,
    };
  };

  const handlePointerUp = (event) => {
    if (swipeStart == null) {
      return;
    }

    const deltaX = event.clientX - swipeStart.x;
    const deltaY = event.clientY - swipeStart.y;
    const carousel = swipeStart.carousel;
    swipeStart = null;

    if (
      Math.abs(deltaX) < SWIPE_THRESHOLD
      || Math.abs(deltaX) < Math.abs(deltaY) * 1.25
    ) {
      return;
    }

    const activeIndex = getActiveCarouselIndex(carousel);

    if (activeIndex >= 0) {
      event.preventDefault();
      selectCarouselItem(carousel, activeIndex + (deltaX < 0 ? 1 : -1));
    }
  };

  const handleKeyDown = (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    document
      .querySelector('.markdown-image-preview[data-visible="true"] button[aria-label="Close image preview"]')
      ?.click();
  };

  getRoot()?.setAttribute('data-markdown-interactions', 'ready');
  document.addEventListener('click', handleClick, true);
  document.addEventListener('pointerdown', handlePointerDown);
  document.addEventListener('pointerup', handlePointerUp);
  document.addEventListener('pointercancel', () => {
    swipeStart = null;
  });
  window.addEventListener('keydown', handleKeyDown);
})();
`

/**
 * Runtime event delegation for Markdown that is rendered as static article DOM.
 */
export function MarkdownArticleInteractions() {
  return (
    <script
      id="markdown-article-interactions"
      // The script only wires event delegation for static Markdown DOM.
      // Keeping it inline avoids requiring the generated Markdown subtree to hydrate.
      dangerouslySetInnerHTML={{ __html: MARKDOWN_ARTICLE_INTERACTIONS_SCRIPT }}
    />
  )
}
