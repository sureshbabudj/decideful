# Firebase Setup Guide

This guide will help you set up Firebase for the Decideful decision journal app.

## Prerequisites

- Node.js 18+ installed
- A Google account
- Firebase CLI installed globally: `npm install -g firebase-tools`

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `decideful-app` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## Step 3: Create Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll update security rules later)
4. Select a location close to your users
5. Click "Done"

## Step 4: Get Firebase Configuration

1. Go to "Project settings" (gear icon in left sidebar)
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (`</>`)
4. Enter app nickname: `decideful-web`
5. Click "Register app"
6. Copy the Firebase configuration object

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

## Step 6: Deploy Security Rules

1. Login to Firebase CLI:

   ```bash
   firebase login
   ```

2. Initialize Firebase in your project:

   ```bash
   firebase init
   ```

   - Select "Firestore" and "Emulators"
   - Choose your existing project
   - Accept default file names
   - Select Firestore and Authentication emulators

3. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Step 7: Test with Emulators (Development)

1. Start Firebase emulators:

   ```bash
   npm run firebase:emulators
   ```

2. In another terminal, start the development server:

   ```bash
   npm run dev
   ```

3. Visit http://localhost:4000 to access the Firebase Emulator UI

## Step 8: Production Deployment

When ready for production:

1. Update Firestore rules to production mode
2. Deploy your Next.js app to Vercel
3. Add environment variables to your Vercel project
4. Test authentication and data operations

## Security Rules

The app includes production-ready security rules in `firestore.rules`:

- Users can only access their own data
- Decisions are scoped to the authenticated user
- Notifications are user-specific
- All other access is denied

## Firestore Indexes

The app includes optimized indexes in `firestore.indexes.json` for:

- User decisions ordered by creation date
- User decisions filtered by status and review date
- User notifications ordered by read status and creation date

## Troubleshooting

### Common Issues

1. **Environment variables not loading**: Make sure `.env.local` is in the project root and restart your development server.

2. **Emulator connection errors**: Ensure emulators are running before starting the app.

3. **Permission denied errors**: Check that security rules are deployed and user is authenticated.

4. **CORS errors**: Make sure you're using the correct Firebase project ID and auth domain.

### Getting Help

- Check the [Firebase Documentation](https://firebase.google.com/docs)
- Review the [Next.js Firebase integration guide](https://nextjs.org/docs/app/building-your-application/authentication)
- Check the browser console for detailed error messages
