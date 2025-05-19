# Korean Political Tendency Test

A web-based political tendency test that shows users where they fall on the political spectrum based on their answers to questions across different categories (economic, security, social, environment, law).

## Features

- 4-page structure: start page, survey page, loading page, and results page
- Responsive design for mobile and desktop
- URL-based routing system (/start, /questions, /analyzing, /result)
- Result sharing capabilities
- Animated UI elements

## Getting Started

### Prerequisites

- Node.js 14 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/tendency-test.git
cd tendency-test
```

2. Install dependencies
```bash
npm install
```

3. Start the server
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Development Mode

For development with automatic restarts:
```bash
npm run dev
```

## URL Routes

The application uses client-side routing with the following paths:

- `/start` - Start page
- `/questions` - Survey page with questions
- `/analyzing` - Loading/analysis page
- `/result` - Results page

## Deployment

The application can be deployed to any static hosting service or Node.js hosting platforms like Vercel, Netlify, or Heroku.

## License

This project is licensed under the MIT License. 