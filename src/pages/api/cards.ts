import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { withAuth } from '../../middleware/auth';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

type Data = {
  data?: any[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return withAuth(req, res, async (userId) => {
    if (req.method === 'GET') {
      try {
        const { data, error } = await supabase
          .from('cards')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        res.status(200).json({ data });
      } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).json({ error: 'Failed to fetch cards' });
      }
    } else if (req.method === 'POST') {
      console.log(req.body);
      const { title, description, tool } = req.body;

      try {
        const { data, error } = await supabase
          .from('cards')
          .insert([
            {
              title,
              description,
              tool,
              user_id: userId,
            }
          ])
          .select();

        if (error) {
          throw error;
        }

        res.status(200).json({ data });
      } catch (error) {
        console.error('Error saving card:', error);
        res.status(500).json({ error: 'Failed to save card' });
      }
    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }

      try {
        const { error } = await supabase
          .from('cards')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);

        if (error) {
          throw error;
        }

        res.status(200).json({ data: [] });
      } catch (error) {
        console.error('Error deleting card:', error);
        res.status(500).json({ error: 'Failed to delete card' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  });
}
