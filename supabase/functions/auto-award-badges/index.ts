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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const payload = await req.json();
    const record = payload.record;
    const table = payload.table;

    // Handle new answer → check answer-count badges
    if (table === 'forum_answers' && record?.user_id) {
      const userId = record.user_id;

      const { count } = await supabase
        .from('forum_answers')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      const answerCount = count || 0;

      // Badge milestones
      const milestones: Array<{ min: number; badge: string }> = [
        { min: 1, badge: 'newcomer' },
        { min: 5, badge: 'contributor' },
        { min: 10, badge: 'helper' },
        { min: 25, badge: 'expert' },
        { min: 50, badge: 'guru' },
      ];

      for (const milestone of milestones) {
        if (answerCount >= milestone.min) {
          // Upsert — ignore if already awarded
          await supabase
            .from('user_badges')
            .upsert(
              { user_id: userId, badge_type: milestone.badge },
              { onConflict: 'user_id,badge_type', ignoreDuplicates: true }
            );
        }
      }
    }

    // Handle question resolved → award problem_solver to author of solution
    if (table === 'forum_questions' && record?.status === 'resolved') {
      const { data: solution } = await supabase
        .from('forum_answers')
        .select('user_id')
        .eq('question_id', record.id)
        .eq('is_solution', true)
        .maybeSingle();

      if (solution?.user_id) {
        await supabase
          .from('user_badges')
          .upsert(
            { user_id: solution.user_id, badge_type: 'problem_solver' },
            { onConflict: 'user_id,badge_type', ignoreDuplicates: true }
          );
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('auto-award-badges error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
