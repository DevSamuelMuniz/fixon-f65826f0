import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const BASE_URL = 'https://fixon.lovable.app';

    // Fetch all published problems with their category slugs
    const { data: problems, error: problemsError } = await supabase
      .from('problems')
      .select('slug, category_id, updated_at, featured')
      .eq('status', 'published')
      .order('updated_at', { ascending: false });

    if (problemsError) throw problemsError;

    // Fetch all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, slug, updated_at')
      .order('display_order');

    if (categoriesError) throw categoriesError;

    // Build category map
    const categoryMap = new Map<string, string>();
    for (const cat of categories ?? []) {
      categoryMap.set(cat.id, cat.slug);
    }

    const now = new Date().toISOString().split('T')[0];

    // Static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/comunidade', priority: '0.8', changefreq: 'daily' },
      { url: '/busca', priority: '0.7', changefreq: 'weekly' },
      { url: '/sobre', priority: '0.5', changefreq: 'monthly' },
      { url: '/contato', priority: '0.5', changefreq: 'monthly' },
      { url: '/privacidade', priority: '0.3', changefreq: 'yearly' },
      { url: '/termos', priority: '0.3', changefreq: 'yearly' },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- Static Pages -->`;

    for (const page of staticPages) {
      xml += `
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    }

    // Category pages
    xml += `\n\n  <!-- Category Pages -->`;
    for (const cat of categories ?? []) {
      const lastmod = cat.updated_at ? cat.updated_at.split('T')[0] : now;
      xml += `
  <url>
    <loc>${BASE_URL}/${cat.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }

    // Problem pages
    xml += `\n\n  <!-- Problem Pages (${problems?.length ?? 0} total) -->`;
    for (const problem of problems ?? []) {
      const catSlug = categoryMap.get(problem.category_id);
      if (!catSlug) continue;
      const lastmod = problem.updated_at ? problem.updated_at.split('T')[0] : now;
      const priority = problem.featured ? '0.9' : '0.7';
      xml += `
  <url>
    <loc>${BASE_URL}/${catSlug}/${problem.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    }

    xml += `\n\n</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // cache for 1 hour
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
