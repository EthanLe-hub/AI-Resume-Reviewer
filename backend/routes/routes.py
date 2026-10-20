from fastapi import APIRouter, File, Form, UploadFile

from clients.gemini_client import generate_content
from services.pdf_service import extract_pdf_text

router = APIRouter()


@router.post("/api/review-resume")
async def review_resume(
    resumeFile: UploadFile = File(...),
    jobDescription: str = Form(...),
):
    try:
        resume_bytes = await resumeFile.read()
        extracted_text = extract_pdf_text(resume_bytes)

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
        {jobDescription}

        Resume:
        {extracted_text}
        """

        ai_analysis = generate_content(ai_prompt)
        return {"matchScore": ai_analysis}
    except Exception as e:
        return {"error": str(e)}
