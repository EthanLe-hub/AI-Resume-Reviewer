import { useState } from 'react';
import './App.css';

function App() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription) {
      alert('Please upload a PDF resume and paste a job description.');
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('resumeFile', resumeFile);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await fetch('http://localhost:8000/api/review-resume', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log("Backend response:", data);
      setResult(data.matchScore);
    } catch (err) {
      console.error(err);
      alert('Failed to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '40px auto', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h2>AI Resume Reviewer & Job-Match Score</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Upload Resume (PDF only):
          </label>
          <input 
            type="file" 
            accept=".pdf" 
            onChange={(e) => setResumeFile(e.target.files?.[0] || null)} 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Paste Job Description:
          </label>
          <textarea 
            rows={8}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description text here..."
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '12px 20px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
        >
          {loading ? 'Analyzing Resume...' : 'Get Match Score'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', border: '1px solid #dee2e6' }}>
          <h3>Analysis & Match Score:</h3>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{result}</p>
        </div>
      )}
    </div>
  );
}

export default App;