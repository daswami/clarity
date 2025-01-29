import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

type Data = {
  message: string;
  result?: any;
};

const sanitizeJSON = (rawOutput: string) => {
  // Escape quotes within the content but not those that define JSON keys/values
  let sanitized = rawOutput;

  // Remove backticks and the word "json"
  sanitized = sanitized.replace(/```json|```/g, "");

  // Escape double quotes inside strings
  sanitized = sanitized.replace(/(?<!\\)"/g, '\\"').replace(/\\"/g, '"');

  // Remove non-standard quotation marks
  // sanitized = sanitized.replace(/[‘’“”]/g, '"');

  // Ensure brackets are balanced
  const openBrackets = (sanitized.match(/\[/g) || []).length;
  const closeBrackets = (sanitized.match(/\]/g) || []).length;
  if (openBrackets !== closeBrackets) {
    throw new Error("Unmatched brackets in response");
  }

  const openCurly = (sanitized.match(/{/g) || []).length;
  const closeCurly = (sanitized.match(/}/g) || []).length;
  if (openCurly !== closeCurly) {
    throw new Error("Unmatched curly braces in response");
  }

  // Remove trailing commas
  sanitized = sanitized.replace(/,(\s*[}\]])/g, "$1");

  return sanitized;

};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { id } = req.body;

    // Fetch the entry from Supabase
    const supabaseUrl = process.env.SUPABASE_URL as string;
    const supabaseKey = process.env.SUPABASE_KEY as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: entry, error: fetchError } = await supabase
      .from('history')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !entry) {
      console.error('Error fetching entry:', fetchError);
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Create the prompt with the fetched data
    const prompt = `As an empathetic AI coach, analyze the following responses about a personal dilemma and provide structured guidance:

Decision: ${entry.decision}
Emotional State: ${entry.emotion}
Current Situation: ${entry.today}
Fears: ${entry.fear}
Future Vision: ${entry.future}
Friend's Perspective: ${entry.friend}
Assumptions: ${entry.assumption}

Based on these responses, create a structured analysis following this exact format:

1. Title: A compelling, problem-reframing title that captures the core challenge and hints at transformation.

2. Psychological Insight: 3-5 sentences providing deep, personalized analysis of their emotional drivers and blind spots, explaining the underlying psychology and priming them for new thinking.

3. Three Solutions:
For each solution, provide:
- Solution Title: A clear, action-oriented title
- What It Is: One concise, thought-provoking sentence describing the approach
- Why It Works: 2-3 sentences explaining the psychological principles that make this approach effective
- How to Try It: 1-2 practical, low-barrier action steps to get started

4. Final Challenge: A specific, actionable question that prompts immediate reflection or action.

Format your response exactly like this:
TITLE: [Your Title]
INSIGHT: [Your Psychological Insight]
SOLUTION_1_TITLE: [First Solution Title]
SOLUTION_1_DESCRIPTION: What It Is: [description]
Why It Works: [explanation]
How to Try It: [steps]
SOLUTION_2_TITLE: [Second Solution Title]
SOLUTION_2_DESCRIPTION: What It Is: [description]
Why It Works: [explanation]
How to Try It: [steps]
SOLUTION_3_TITLE: [Third Solution Title]
SOLUTION_3_DESCRIPTION: What It Is: [description]
Why It Works: [explanation]
How to Try It: [steps]
CHALLENGE: [Your Final Challenge]

Keep the tone empathetic but direct, and ensure each solution is practical and actionable.`;

    // Initialize Gemini
    const geminiApiKey: string = process.env.GOOGLE_API_KEY ?? '';
    const googleAI = new GoogleGenerativeAI(geminiApiKey);
    const geminiModel = googleAI.getGenerativeModel({
      model: "gemini-pro",
    });

    // Generate content
    const result = await geminiModel.generateContent(prompt);
    let response = await result.response.text();

    response = sanitizeJSON(response);
    console.log(response);

    // Parse the response
    const titleMatch = response.match(/TITLE: (.*)/);
    const insightMatch = response.match(/INSIGHT: ([\s\S]*?)(?=SOLUTION_1_TITLE:)/);
    const solution1TitleMatch = response.match(/SOLUTION_1_TITLE: (.*)/);
    const solution1DescMatch = response.match(/SOLUTION_1_DESCRIPTION: ([\s\S]*?)(?=SOLUTION_2_TITLE:)/);
    const solution2TitleMatch = response.match(/SOLUTION_2_TITLE: (.*)/);
    const solution2DescMatch = response.match(/SOLUTION_2_DESCRIPTION: ([\s\S]*?)(?=SOLUTION_3_TITLE:)/);
    const solution3TitleMatch = response.match(/SOLUTION_3_TITLE: (.*)/);
    const solution3DescMatch = response.match(/SOLUTION_3_DESCRIPTION: ([\s\S]*?)(?=CHALLENGE:)/);
    const challengeMatch = response.match(/CHALLENGE: (.*)/);

    const structuredResponse = {
      title: titleMatch ? titleMatch[1].trim() : '',
      insight: insightMatch ? insightMatch[1].trim() : '',
      solutions: [
        {
          title: solution1TitleMatch ? solution1TitleMatch[1].trim() : '',
          description: solution1DescMatch ? solution1DescMatch[1].trim() : ''
        },
        {
          title: solution2TitleMatch ? solution2TitleMatch[1].trim() : '',
          description: solution2DescMatch ? solution2DescMatch[1].trim() : ''
        },
        {
          title: solution3TitleMatch ? solution3TitleMatch[1].trim() : '',
          description: solution3DescMatch ? solution3DescMatch[1].trim() : ''
        }
      ],
      challenge: challengeMatch ? challengeMatch[1].trim() : ''
    };

    // Update the entry in Supabase
    const { error: updateError } = await supabase
      .from('history')
      .update({
        title: structuredResponse.title,
        insight: structuredResponse.insight,
        conetitle: structuredResponse.solutions[0].title,
        conedesc: structuredResponse.solutions[0].description,
        ctwotitle: structuredResponse.solutions[1].title,
        ctwodesc: structuredResponse.solutions[1].description,
        cthreetitle: structuredResponse.solutions[2].title,
        cthreedesc: structuredResponse.solutions[2].description,
        challenge: structuredResponse.challenge,
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating entry:', updateError);
      return res.status(500).json({ message: 'Failed to update entry' });
    }

    res.status(200).json({ message: 'Success', result: structuredResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to process request' });
  }
}