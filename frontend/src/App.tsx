import { useState, type FormEvent } from 'react';
import './App.css';
import { ReviewResult } from './components/ReviewResult';
import type { ReviewAnalysis } from './types';

const API_URL = 'http://localhost:8000/api/review-resume';

function parseReviewAnalysis(value: unknown): ReviewAnalysis {
  const parsed = typeof value === 'string' ? JSON.parse(value) : value;

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('The backend returned an invalid review format.');
  }

  return parsed as ReviewAnalysis;
}

function App() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<ReviewAnalysis | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setResult(null);

    if (!resumeFile || !resumeFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please provide a PDF resume.');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please provide a job description.');
      return;
    }

    const formData = new FormData();
    formData.append('resumeFile', resumeFile);
    formData.append('jobDescription', jobDescription.trim());

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || `Request failed with status ${response.status}.`);
      }

      setResult(parseReviewAnalysis(data.analysis ?? data.matchScore ?? data));
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
            onChange={(event) => setResumeFile(event.target.files?.[0] ?? null)}
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
      {result && <ReviewResult result={result} />}
    </main>
  );
}

export default App;
