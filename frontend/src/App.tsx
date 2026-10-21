import { useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:8000/api/review-resume';

function App() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!resumeFile || !jobDescription.trim()) {
      setError('Please provide a PDF and job description.');
      return;
    }

    const formData = new FormData();
    formData.append('resumeFile', resumeFile);
    formData.append('jobDescription', jobDescription);

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data.matchScore);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Request failed.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>AI Resume Reviewer</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Resume PDF
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(event) =>
              setResumeFile(event.target.files?.[0] ?? null)
            }
          />
        </label>

        <label>
          Job description
          <textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Reviewing...' : 'Review Resume'}
        </button>
      </form>

      {error && <p>{error}</p>}
      {result && <pre>{result}</pre>}
    </main>
  );
}

export default App;
