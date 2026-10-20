from clients.gemini_client import generate_content
from services.pdf_service import extract_pdf_text


def review_resume(pdf_bytes: bytes, job_description: str) -> str:
    """Extract a resume and generate an LLM review for a job description."""
    extracted_text = extract_pdf_text(pdf_bytes)

    ai_prompt = f"""
    You are an expert technical recruiter and resume reviewer.

    Analyze the resume against the job description and calculate a match score
    from 0 to 100 based on experience, education, skills, projects, and tech stack.

    Return only valid JSON matching this exact structure:
    {{
      "matchScore": number,
      "summary": "string",
      "strengths": ["string"],
      "areasForImprovement": ["string"]
    }}

    Requirements:
    - matchScore must be a number from 0 to 100.
    - strengths and areasForImprovement must be JSON arrays of strings.
    - Do not include Markdown, code fences, or any text outside the JSON object.

    Job Description:
    {job_description}

    Resume:
    {extracted_text}
    """

    return generate_content(ai_prompt)
