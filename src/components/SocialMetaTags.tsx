import { useEffect } from 'react';
import type { Problem } from '@/types/database';

interface SocialMetaTagsProps {
  problem: Problem;
  categorySlug: string;
  problemSlug: string;
}

const BASE_URL = 'https://fixon.lovable.app';
const DEFAULT_IMAGE = `${BASE_URL}/pwa-512x512.png`;

function setMeta(property: string, content: string, isName = false) {
  const attr = isName ? 'name' : 'property';
  let el = document.querySelector(`meta[${attr}="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, property);
    el.setAttribute('data-fixon-social', 'true');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function SocialMetaTags({ problem, categorySlug, problemSlug }: SocialMetaTagsProps) {
  useEffect(() => {
    const url = `${BASE_URL}/${categorySlug}/${problemSlug}`;
    const title = `${problem.title} - Fix-on`;
    const description = problem.meta_description || problem.quick_answer;
    const image = DEFAULT_IMAGE;

    // ── Open Graph ──────────────────────────────────────────────
    setMeta('og:type', 'article');
    setMeta('og:site_name', 'Fix-on');
    setMeta('og:title', title);
    setMeta('og:description', description);
    setMeta('og:url', url);
    setMeta('og:image', image);
    setMeta('og:image:width', '512');
    setMeta('og:image:height', '512');
    setMeta('og:image:alt', problem.title);
    setMeta('og:locale', 'pt_BR');

    // Article-specific OG
    setMeta('article:published_time', problem.created_at);
    setMeta('article:modified_time', problem.updated_at);
    if (problem.category?.name) {
      setMeta('article:section', problem.category.name);
    }
    if (problem.tags?.length) {
      setMeta('article:tag', problem.tags.join(', '));
    }

    // ── Twitter Card ─────────────────────────────────────────────
    setMeta('twitter:card', 'summary', true);
    setMeta('twitter:site', '@fixonapp', true);
    setMeta('twitter:title', title, true);
    setMeta('twitter:description', description, true);
    setMeta('twitter:image', image, true);
    setMeta('twitter:image:alt', problem.title, true);

    // ── Canonical ────────────────────────────────────────────────
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('data-fixon-social', 'true');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    return () => {
      // Remove all injected tags on unmount
      document.querySelectorAll('[data-fixon-social]').forEach(el => el.remove());
    };
  }, [problem, categorySlug, problemSlug]);

  return null;
}
