# Decideful - Decision Journal App

A digital decision journal that helps users make better decisions by tracking their reasoning, expected outcomes, and actual results. Built with Next.js, TypeScript, and Firebase.

## Features

- 🔐 Secure authentication with Firebase Auth
- 📝 Create and manage decisions with detailed context
- 🎯 Set milestones with expected dates and categories
- 📊 Track outcomes and compare with expectations
- 📱 Mobile-first responsive design
- 🔄 Real-time data synchronization
- 📈 Learn from decision-making patterns

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Firebase Auth, Firestore Database
- **Forms**: React Hook Form with Zod validation
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Firebase configuration values.

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5346](http://localhost:5346) in your browser.

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database
4. Copy your Firebase config to `.env.local`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── decisions/      # Decision-related components
│   └── ui/             # Reusable UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Library configurations
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run tests and linting
6. Submit a pull request

## License

This project is licensed under the MIT License.
