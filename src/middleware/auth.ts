import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export async function withAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: (userId: string) => Promise<void>
) {
  const supabaseUrl = process.env.SUPABASE_URL as string;
  const supabaseKey = process.env.SUPABASE_KEY as string;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const userId = req.headers['x-user-id'] as string;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Verify user exists
  const { data: user, error } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();

  if (error || !user) {
    return res.status(401).json({ message: 'Invalid user' });
  }

  await handler(userId);
}
