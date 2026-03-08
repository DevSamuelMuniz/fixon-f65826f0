import { useEffect } from 'react';
import type { Problem } from '@/types/database';

interface HowToJsonLdProps {
  problem: Problem;
  categorySlug: string;
  problemSlug: string;
}

export function HowToJsonLd({ problem, categorySlug, problemSlug }: HowToJsonLdProps) {
  useEffect(() => {
    const BASE_URL = 'https://fixon.lovable.app';
    const url = `${BASE_URL}/${categorySlug}/${problemSlug}`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: problem.title,
      description: problem.meta_description || problem.quick_answer,
      url,
      datePublished: problem.created_at,
      dateModified: problem.updated_at,
      inLanguage: 'pt-BR',
      author: {
        '@type': 'Organization',
        name: 'Fix-on',
        url: BASE_URL,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Fix-on',
        url: BASE_URL,
      },
      // Quick answer as abstract
      abstract: problem.quick_answer,
      // Steps mapped to HowToStep
      step: problem.steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.title,
        text: step.description,
        url: `${url}#passo-${index + 1}`,
      })),
      // Total steps count
      totalTime: `PT${Math.max(5, problem.steps.length * 3)}M`,
      // Keywords from tags
      ...(problem.tags && problem.tags.length > 0
        ? { keywords: problem.tags.join(', ') }
        : {}),
    };

    // Also add BreadcrumbList for rich snippets
    const breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Início',
          item: BASE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: problem.category?.name || categorySlug,
          item: `${BASE_URL}/${categorySlug}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: problem.title,
          item: url,
        },
      ],
    };

    // Remove any existing JSON-LD scripts we manage
    document.querySelectorAll('script[data-fixon-jsonld]').forEach(el => el.remove());

    // Inject HowTo
    const howToScript = document.createElement('script');
    howToScript.type = 'application/ld+json';
    howToScript.setAttribute('data-fixon-jsonld', 'howto');
    howToScript.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(howToScript);

    // Inject BreadcrumbList
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.setAttribute('data-fixon-jsonld', 'breadcrumb');
    breadcrumbScript.textContent = JSON.stringify(breadcrumbJsonLd);
    document.head.appendChild(breadcrumbScript);

    return () => {
      document.querySelectorAll('script[data-fixon-jsonld]').forEach(el => el.remove());
    };
  }, [problem, categorySlug, problemSlug]);

  return null;
}
