import { supabaseClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get user session from cookie
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

    // Fetch today's tasks for user
    const { data: userTasks, error: userTasksError } = await supabaseClient
      .from('user_tasks')
      .select(`
        id,
        task_id,
        assigned_date,
        completed,
        completed_at,
        proof_url,
        tasks:task_id (
          id,
          title,
          description,
          category,
          difficulty,
          estimated_time,
          required_proof
        )
      `)
      .eq('user_id', userId)
      .eq('assigned_date', today);

    if (userTasksError) {
      console.error('Error fetching tasks:', userTasksError);
      return NextResponse.json(
        { error: 'Failed to fetch tasks' },
        { status: 500 }
      );
    }

    // If no tasks for today, generate them
    if (!userTasks || userTasks.length === 0) {
      return NextResponse.json(
        {
          success: true,
          tasks: [],
          message: 'No tasks assigned yet. Tasks are generated at 00:00 UTC.',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        tasks: userTasks,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Dashboard tasks error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
