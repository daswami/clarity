# Clarity - AI-Powered Essay Writing Assistant

Clarity is an intelligent web application that helps users explore different angles and perspectives for their essays. By leveraging Google's Generative AI, it provides thoughtful insights and structured approaches to essay writing.

## Features

- **Multi-Step Essay Analysis**: Break down your essay topic through guided prompts
- **AI-Generated Insights**: Get unique perspectives and angles using Google's Generative AI
- **Save & Organize**: Bookmark useful insights for later reference
- **History Tracking**: Review and revisit your previous essay explorations
- **User Authentication**: Secure, username-based authentication system
- **Modern UI**: Clean, responsive interface with smooth transitions

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Generative AI
- **Authentication**: Custom lightweight auth system
- **Styling**: Custom components with Inter, Quicksand, and Plus Jakarta Sans fonts

## Prerequisites

- Node.js 16+ and npm/yarn
- Supabase account and project
- Google AI API key

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
GOOGLE_API_KEY=your_google_ai_api_key
```

## Database Setup

1. Create tables in Supabase:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- History table
CREATE TABLE history (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT,
  content JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Cards table
CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

2. Enable Row Level Security (RLS) on tables:
   - Disable RLS on users table
   - Enable RLS with appropriate policies on history and cards tables (see notes.md for detailed policies)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd esai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter a username to get started (no password required)
2. Follow the guided prompts to explore your essay topic
3. Rate each response based on its relevance
4. Get AI-generated insights and angles
5. Save useful perspectives for later reference
6. Access your history and saved cards anytime

## Project Structure

```
src/
├── components/     # React components
├── pages/         # Next.js pages and API routes
├── styles/        # Global styles and Tailwind config
├── utils/         # Utility functions
└── middleware/    # Authentication middleware
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
