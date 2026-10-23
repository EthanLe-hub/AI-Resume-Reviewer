# AI Resume Reviewer

AI Resume Reviewer helps job seekers understand how well their resume matches a specific job description. A user uploads a PDF resume, pastes a job description, and receives an AI-generated match score with an explanation of strengths, gaps, and recommended improvements.

## The User Problem

Job seekers often apply to roles without knowing whether their resume clearly demonstrates the requirements in the job description. Existing resume tools can be expensive, generic, or difficult to interpret. This project provides a focused way to compare one resume against one role and turn the result into practical next steps.

## Target Users

The initial user base is:

- Job seekers tailoring resumes for individual applications
- Students and recent graduates learning how to improve their resumes
- Career changers identifying missing skills or experience

The MVP is intentionally designed for an individual user completing one review at a time. It does not yet include accounts, saved reviews, collaboration, or recruiter workflows.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS

### Backend

- Python
- FastAPI
- Uvicorn
- `pypdf` for extracting text from uploaded PDF resumes
- `python-dotenv` for environment variables
- Google GenAI SDK with Gemini for resume analysis

## Architecture

The project is split into two processes:

```text
React/Vite frontend
        │
        │ multipart/form-data
        ▼
FastAPI backend
        │
        ▼
routes.py
        │
        ▼
review_service.py
        ├── pdf_service.py       Extracts resume text
        └── gemini_client.py     Sends the review prompt to Gemini
```

### Frontend responsibilities

- Collect the PDF resume and job description
- Validate the basic form inputs
- Submit the request to the backend
- Display loading and error states
- Render the structured review result, including the score, category scores, strengths, gaps, and recommendations

### Backend responsibilities

- `main.py`: Creates the FastAPI application, loads environment variables, configures CORS, and registers routes.
- `routes/routes.py`: Handles HTTP input and output for `POST /api/review-resume`.
- `services/review_service.py`: Coordinates PDF extraction, prompt construction, and AI review generation.
- `services/pdf_service.py`: Extracts text from PDF bytes.
- `clients/gemini_client.py`: Owns the Gemini client and model request.

The current API is transitioning from returning Gemini's JSON as a string to returning a parsed structured object. The frontend temporarily supports both formats.

## User Flow

1. The user opens the web application.
2. The user chooses a PDF resume from their local files.
3. The user pastes a target job description.
4. The frontend validates that both fields are present and that the file is a PDF.
5. The frontend sends both values to the backend as multipart form data.
6. The backend reads the PDF bytes and extracts its text.
7. The review service builds a detailed evaluation prompt.
8. Gemini compares the resume with the job description and returns a structured analysis.
9. The frontend displays the overall score, category scores, supporting evidence, gaps, and recommendations.

## API Contract

### `POST /api/review-resume`

Request fields:

- `resumeFile`: PDF file
- `jobDescription`: Plain-text job description

The intended analysis shape is:

```json
{
  "matchScore": 82,
  "matchLevel": "Strong",
  "summary": "The resume is a strong match for the role.",
  "categoryScores": {
    "requiredSkills": {
      "score": 26,
      "maximum": 30,
      "explanation": "The resume demonstrates most required skills."
    }
  },
  "strengths": [],
  "gaps": [],
  "recommendations": []
}
```

## Local Development

Start the backend from the `backend` directory:

```bash
cd backend
source .venv/bin/activate
python -m uvicorn main:app --reload
```

Start the frontend in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend is typically available at `http://localhost:5173` and the backend at `http://localhost:8000`.

The backend requires a `GOOGLE_API_KEY` environment variable.
