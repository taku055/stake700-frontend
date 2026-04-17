export function getLocaleFromPath(path = location.pathname) {
  const m = path.match(/^\/(en|es|pt)(?:\/|$)/);
  return m ? m[1] as 'en' | 'es' | 'pt' : 'en';
}

export function localeHref(path: string, locale = getLocaleFromPath()) {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${clean}`;
}

export type Lang = 'en' | 'es' | 'pt';

export function swapLangInPath(next: Lang, path = location.pathname) {
  const has = path.match(/^\/(en|es|pt)(?:\/|$)/);
  if (has) return path.replace(/^\/(en|es|pt)/, `/${next}`);
  // if no locale in path, prefix it:
  return `/${next}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function getLangFromPath(path = location.pathname): Lang {
  const m = path.match(/^\/(en|es|pt)(?:\/|$)/);
  return (m ? m[1] : 'en') as Lang;
}