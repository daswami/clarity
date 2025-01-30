import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Add this at the top of the file
const isValidUsername = (username: string): boolean => {
    // Only allow alphanumeric characters and underscores
    // Length between 3 and 20 characters
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };
  

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const supabaseUrl = process.env.SUPABASE_URL as string;
    const supabaseKey = process.env.SUPABASE_KEY as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    if (req.method === 'POST') {
      try {
        const { username } = req.body;
        console.log('Received username:', username);

        if (!username) {
          return res.status(400).json({ message: 'Username is required' });
        }

        // Add this check after the username existence check
        if (!isValidUsername(username)) {
            return res.status(400).json({ 
            message: 'Invalid username. Username must be 3-20 characters long and contain only letters, numbers, and underscores.' 
            });
        }

        // Check if username exists
        const { data: existingUsers, error: checkError } = await supabase
          .from('users')
          .select('id')
          .eq('username', username);

        if (checkError) {
          console.error('Error checking existing user:', checkError);
          return res.status(500).json({ message: 'Error checking username', error: checkError });
        }

        if (existingUsers && existingUsers.length > 0) {
          return res.status(400).json({ message: 'Username already taken' });
        }

        // Create new user
        const userId = uuidv4();
        
        const { data, error } = await supabase
          .from('users')
          .insert([{ 
            id: userId, 
            username: username,
            created_at: new Date().toISOString()
          }])
          .select();

        if (error) {
          console.error('Database insertion error:', error);
          return res.status(500).json({ 
            message: 'Error creating user', 
            error: error,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
        }

        return res.status(200).json({ userId, username });
      } catch (err) {
        console.error('Unexpected error:', err);
        return res.status(500).json({ 
          message: 'Unexpected error occurred', 
          error: err instanceof Error ? err.message : 'Unknown error' 
        });
      }
    }

    res.status(405).json({ message: 'Method not allowed' });
}
