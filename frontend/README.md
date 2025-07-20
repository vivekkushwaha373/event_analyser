# Event Search Frontend (React + Vite + Tailwind)

## Setup & Installation

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173/`

## Usage
- Enter a search string (IP or field-based, e.g., `dstaddr=221.181.27.227`), start time, and end time.
- Click "Search" to query the backend and view results.

## Notes
- The frontend expects the backend API to be running at `http://localhost:8000/api/search/`.
- Make sure CORS is enabled in the backend for local development.
