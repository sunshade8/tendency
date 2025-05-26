# Korean Political Tendency Test

A web application that helps users identify their political tendency through a questionnaire.

## Features

- Interactive questionnaire with 20 political statements
- Real-time progress tracking
- Categories: Economic, Security, Social, Environmental, and Law
- Analysis of political tendency based on responses
- Shareable results

## Project Structure

- `index.html`: Main entry page
- `questions.html`: Questionnaire interface
- `analyzing.html`: Loading page between questionnaire and results
- `result.html`: Results display page
- `styles.css`: Styling for all pages
- `script.js`: Core functionality and logic
- `api/`: Serverless API functions
- `images/`: Character and UI images

## Deployment to Vercel

This project is configured for deployment on Vercel, with serverless API functions to handle question retrieval and result calculation.

### Prerequisites

- Node.js (version 14 or higher)
- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Vercel CLI (included as a dev dependency)

### Deployment Steps

1. **Login to Vercel CLI**:
   ```
   npx vercel login
   ```

2. **Deploy the application**:
   ```
   npm run deploy
   ```
   
   Or directly with Vercel CLI:
   ```
   npx vercel
   ```

3. **Set up environment variables** (if needed):
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add any required environment variables

4. **Make the deployment production-ready**:
   ```
   npx vercel --prod
   ```

### Important Deployment Notes

- The project uses serverless functions in the `/api` directory
- Static assets are served directly by Vercel's CDN
- The `vercel.json` file configures the routing and build settings
- Ensure your frontend URLs point to the correct API endpoints

### Vercel Analytics

This project is configured with Vercel Analytics to track user interactions:

1. **Automatic Page Views**: All page views are automatically tracked by the Vercel Analytics script
2. **Custom Events**: The following custom events are tracked:
   - `start_test`: When a user starts the test
   - `submit_answers`: When a user submits their answers
   - `share_results`: When a user shares their results

To view analytics:
1. Go to your Vercel project dashboard
2. Navigate to Analytics
3. You can view metrics like page views, visitors, and custom events

## Local Development

1. **Install dependencies**:
   ```
   npm install
   ```

2. **Start the development server**:
   ```
   npm run dev
   ```

3. **Access the application**:
   Open `http://localhost:3001` in your browser

## License

[Specify your license here]

## Credits

[sunshade8/organization] 