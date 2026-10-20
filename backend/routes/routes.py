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
        You are given the following resume and a provided job description.
        Analyze the resume against the job description.
        Then grade the match on a scale of 0 to 100 based on experience, education, skills, projects, and tech stack.

        Job Description: {jobDescription}
        Resume: {extracted_text}

        Provide a concise match score (out of 100) and a brief breakdown of strengths and areas for improvement.
        """

        ai_analysis = generate_content(ai_prompt)
        return {"matchScore": ai_analysis}
    except Exception as e:
        return {"error": str(e)}
