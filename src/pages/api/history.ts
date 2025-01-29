import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

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
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Convert UTC timestamps to EST
      const convertedData = data?.map(entry => ({
        ...entry,
        created_at: convertToEST(entry.created_at)
      }));

      //console.log('Converted data:', convertedData);
      //const convertedData = data;

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
      const { error } = await supabase
        .from('history')
        .delete()
        .eq('id', id);

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
}
