# Event Search Backend (Django)

## Setup & Installation

1. **Clone the repository and navigate to the backend directory**

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Ensure your event data files are in the `events/` folder at the project root.**

4. **Apply migrations**
   ```bash
   python manage.py migrate
   ```

5. **Run the development server**
   ```bash
   python manage.py runserver
   ```
   The API will be available at `http://localhost:8000/api/search/`

## API Usage

### POST `/api/search/`
- **Body (JSON):**
  - `search_string`: (string) IP or field-based query (e.g., `dstaddr=221.181.27.227`)
  - `start_time`: (epoch, int)
  - `end_time`: (epoch, int)
- **Returns:**
  - List of matching events, file name, and search time

## Production
- For concurrent requests, use Gunicorn or Uvicorn:
  ```bash
  gunicorn eventsearch.wsgi:application --workers 4
  # or for async
  uvicorn eventsearch.asgi:application --workers 4
  ```
## locally
- use uvicorn eventsearch.asgi:application --workers 4 --host 127.0.0.1 --port 8000

## Notes
- The backend scans all files in the `events/` folder for every search.
- CORS is enabled for local frontend development. 