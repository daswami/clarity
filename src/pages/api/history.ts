import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { withAuth } from '../../middleware/auth';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

type Data = {
  data?: any[];
  error?: string;
};

const convertToEST = (utcTimestamp: string) => {
  const date = new Date(utcTimestamp);
  // Create a date string in EST by subtracting 5 hours from UTC
  date.setHours(date.getHours());
  return date.toISOString();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await withAuth(req, res, async (userId) => {
    if (req.method === 'GET') {
      try {
        const { data, error } = await supabase
          .from('history')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // Convert UTC timestamps to EST
        const convertedData = data?.map(entry => ({
          ...entry,
          created_at: convertToEST(entry.created_at)
        }));

        res.status(200).json({ data: convertedData });
      } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
      }
    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }

      try {
        // First verify the entry belongs to the user
        const { data: entry } = await supabase
          .from('history')
          .select('user_id')
          .eq('id', id)
          .single();

        if (!entry || entry.user_id !== userId) {
          return res.status(403).json({ error: 'Not authorized to delete this entry' });
        }

        const { error } = await supabase
          .from('history')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);

        if (error) {
          throw error;
        }

        res.status(200).json({ data: [] });
      } catch (error) {
        console.error('Error deleting history entry:', error);
        res.status(500).json({ error: 'Failed to delete history entry' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  });
}
