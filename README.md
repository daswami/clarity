# Clarity - AI-Powered Personal Growth Assistant

Clarity is an intelligent coaching platform that helps individuals navigate complex personal and professional situations. Using advanced AI technology, Clarity provides personalized guidance, behavioral insights, and actionable steps for various life challenges.

## Key Features

- **Relationship Guidance**: Get insights and strategies for managing personal relationships, communication challenges, and conflict resolution
- **Career Development**: Receive tailored advice for career transitions, professional growth, and workplace dynamics
- **Behavioral Analysis**: Understand patterns in your decisions and behaviors with AI-powered insights
- **Action Planning**: Get concrete, step-by-step guidance for implementing positive changes
- **Personalized Support**: Receive customized solutions that adapt to your unique situation and goals

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Generative AI
- **Authentication**: Custom lightweight auth system
- **Styling**: Custom components with Inter, Quicksand, and Plus Jakarta Sans fonts

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- Google AI API key

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
GOOGLE_API_KEY=your_google_ai_api_key
```

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
2. Follow the guided prompts to explore your personal growth
3. Rate each response based on its relevance
4. Get AI-generated insights and guidance
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
