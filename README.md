# Fetch Dog Adoption

A React application that allows users to browse, search, and find their perfect furry companion for adoption. This project was built as part of the Fetch Frontend Take-Home Exercise.

## Live Demo

Visit the live application at: [https://fetch-dog-adoption.vercel.app](https://fetch-dog-adoption.vercel.app)

## Features

- User authentication with name and email
- Browse available dogs with filtering by breed and age
- Sort results by breed, name, or age in ascending or descending order
- Pagination for viewing large sets of results
- Add favorite dogs to your list
- View all dog details including ID, name, age, breed, and location
- Generate a match from your favorite dogs
- Responsive design for mobile and desktop
- Persistent storage of favorites and authentication state

## Tech Stack

- React 18 with TypeScript
- TailwindCSS for styling
- shadcn-ui for UI components
- TanStack Query for data fetching and caching
- React Router for navigation
- React Context API for state management
- Axios for API requests
- Vite for build tooling and development server

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16.0.0 or later)
- npm (v7.0.0 or later) or yarn (v1.22.0 or later)

## Installation and Local Development

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/fetch-dog-adoption.git
   cd fetch-dog-adoption
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## How to Use the Application

1. **Login**: Enter your name and email on the login screen to authenticate with the service.

2. **Search for Dogs**:
   - Use the breed dropdown to filter by specific dog breeds
   - Set minimum and maximum age filters
   - Sort results by breed, name, or age (click the sort buttons to toggle between ascending and descending)
   - Browse through pages of results using the pagination controls

3. **Favorites**:
   - Add dogs to your favorites by clicking the "Add to Favorites" button on any dog card
   - View all your favorites by clicking the "Favorites" link in the navigation
   - Remove dogs from your favorites by clicking the "Remove from Favorites" button

4. **Generate a Match**:
   - After adding dogs to your favorites, go to the Favorites page
   - Click the "Generate Match" button to find your perfect match
   - View your match details on the Match page

5. **View Dog Details**:
   - Click the info icon on any dog card to see all details about the dog
   - The dialog shows the dog's ID, name, age, breed, and location

## Project Structure

```
├── public/              # Static assets
├── src/                 # Source code
│   ├── components/      # Reusable components
│   │   ├── ui/          # UI components from shadcn-ui
│   │   ├── DogCard.tsx  # Dog card component
│   │   ├── Navigation.tsx # Navigation component
│   ├── contexts/        # Context API providers
│   │   ├── AuthContext.tsx # Authentication context
│   │   ├── DogContext.tsx # Dog data context
│   │   ├── FavoriteContext.tsx # Favorites context
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Layout components
│   │   ├── MainLayout.tsx # Main authenticated layout
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   │   ├── login/       # Login page
│   │   ├── search/      # Search page
│   │   ├── favorites/   # Favorites page
│   │   ├── match/       # Match page
│   ├── routes/          # Routing configuration
│   ├── services/        # API services
│   │   ├── api.ts       # API client and endpoints
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Entry point
├── .gitignore           # Git ignore file
├── index.html           # HTML entry point
├── package.json         # Project dependencies
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
```

## API Reference

This project uses the Fetch API for accessing dog adoption data. The base URL is `https://frontend-take-home-service.fetch.com`.

### Key Endpoints:

- **Authentication**:
  - `POST /auth/login` - Login with name and email
  - `POST /auth/logout` - Logout and invalidate session

- **Dogs**:
  - `GET /dogs/breeds` - Get all available dog breeds
  - `GET /dogs/search` - Search for dogs with filters
  - `POST /dogs` - Get details for specific dogs by ID
  - `POST /dogs/match` - Generate a match from a list of dog IDs

- **Locations**:
  - `POST /locations` - Get location details by ZIP codes
  - `POST /locations/search` - Search for locations

## Deployment

To build the application for production:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory, ready to be deployed to a static hosting service like Vercel, Netlify, or GitHub Pages.

### Deployment Steps for Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure the build settings:
   - Build Command: `npm run build` or `yarn build`
   - Output Directory: `dist`
   - Install Command: `npm install` or `yarn install`
4. Deploy the application

## Troubleshooting

- **Authentication Issues**: If you encounter authentication problems, try clearing your browser cookies and local storage, then log in again.
- **API Rate Limiting**: The API may have rate limiting. If you encounter 429 errors, wait a few minutes before trying again.
- **Image Loading**: Some dog images may fail to load. The application provides fallback images in these cases.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
