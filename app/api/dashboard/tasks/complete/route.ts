import { supabaseClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
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
    const { userTaskId, proofUrl } = await request.json();

    if (!userTaskId) {
      return NextResponse.json(
        { error: 'Task ID required' },
        { status: 400 }
      );
    }

    // Update task completion
    const { data: updatedTask, error: updateError } = await supabaseClient
      .from('user_tasks')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        proof_url: proofUrl || null,
      })
      .eq('id', userTaskId)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating task:', updateError);
      return NextResponse.json(
        { error: 'Failed to update task' },
        { status: 500 }
      );
    }

    // Get user's current stats
    const { data: user } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    // Get task details to calculate XP
    const { data: userTask } = await supabaseClient
      .from('user_tasks')
      .select(`
        tasks:task_id (
          difficulty
        )
      `)
      .eq('id', userTaskId)
      .single();

    if (user && userTask) {
      const difficulty = (userTask.tasks as any).difficulty || 5;
      const baseXP = 100;
      const difficultyMultiplier = 1 + (difficulty - 1) * 0.1;
      const streakBonus = 1 + (user.streak * 0.1);
      const xpGained = Math.round(baseXP * difficultyMultiplier * streakBonus);

      // Update user XP
      const newXP = user.xp + xpGained;
      const newLevel = Math.floor(newXP / 1000);

      await supabaseClient
        .from('users')
        .update({
          xp: newXP,
          level: newLevel,
        })
        .eq('id', userId);
    }

    return NextResponse.json(
      {
        success: true,
        task: updatedTask,
        xpGained: user ? Math.round(
          100 * (1 + ((userTask?.tasks as any)?.difficulty || 5 - 1) * 0.1) * (1 + (user.streak * 0.1))
        ) : 0,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Task completion error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
