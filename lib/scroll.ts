import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  lenisInstance = lenis;
}

export function scrollToSection(hash: string) {
  const target = document.querySelector(hash);
  if (!target) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(target as HTMLElement, { offset: -72 });
  } else {
    (target as HTMLElement).scrollIntoView({ behavior: 'smooth' });
  }
}
