import { supabaseClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let session;
    try {
      session = JSON.parse(sessionCookie.value);
    } catch {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const userId = session.userId;
    const today = new Date().toISOString().split('T')[0];

    // Get user stats
    const { data: user } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get today's progress
    const { data: progress } = await supabaseClient
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    // Get today's task stats
    const { data: userTasks } = await supabaseClient
      .from('user_tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('assigned_date', today);

    const tasksCompleted = userTasks?.filter(t => t.completed).length || 0;
    const tasksTotal = userTasks?.length || 0;
    const completionRate = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0;

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
          rank_percentile: user.rank_percentile,
          subscription_status: user.subscription_status,
        },
        progress: {
          tasksCompleted,
          tasksTotal,
          completionRate: Math.round(completionRate),
          streak: user.streak,
          xp: user.xp,
          level: user.level,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Progress error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
