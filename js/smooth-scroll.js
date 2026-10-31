const header = document.querySelector("header");
const navigationLinks = document.querySelectorAll('header a[href^="#"]');
const navigationMenu = document.querySelector("#menu-principal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeScrollFrame;

const scrollToSection = (target, targetId) => {
  window.cancelAnimationFrame(activeScrollFrame);

  const headerHeight = header?.getBoundingClientRect().height ?? 0;
  const targetPosition = Math.max(
    0,
    target.getBoundingClientRect().top + window.scrollY - headerHeight - 12
  );

  if (prefersReducedMotion.matches) {
    window.scrollTo(0, targetPosition);
    history.replaceState(null, "", `#${targetId}`);
    return;
  }

  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  const duration = 850;
  let startTime;

  const animateScroll = (timestamp) => {
    startTime ??= timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easedProgress = progress < 0.5
      ? 4 * progress ** 3
      : 1 - ((-2 * progress + 2) ** 3) / 2;

    window.scrollTo(0, startPosition + distance * easedProgress);

    if (progress < 1) {
      activeScrollFrame = window.requestAnimationFrame(animateScroll);
    } else {
      activeScrollFrame = undefined;
      history.replaceState(null, "", `#${targetId}`);
    }
  };

  activeScrollFrame = window.requestAnimationFrame(animateScroll);
};

navigationLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = decodeURIComponent(link.hash.slice(1));
    const target = document.getElementById(targetId);

    if (!target) return;

    event.preventDefault();

    const beginScroll = () => scrollToSection(target, targetId);
    if (navigationMenu?.classList.contains("show") && window.bootstrap?.Collapse) {
      navigationMenu.addEventListener("hidden.bs.collapse", beginScroll, { once: true });
      window.bootstrap.Collapse.getOrCreateInstance(navigationMenu).hide();
      return;
    }

    beginScroll();
  });
});
