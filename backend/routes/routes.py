from fastapi import APIRouter, File, Form, UploadFile

from services.review_service import review_resume as review_resume_service

router = APIRouter()


@router.post("/api/review-resume")
async def review_resume(
    resumeFile: UploadFile = File(...),
    jobDescription: str = Form(...),
):
    try:
        resume_bytes = await resumeFile.read()
        ai_analysis = review_resume_service(resume_bytes, jobDescription)
        return {"matchScore": ai_analysis}
    except Exception as e:
        return {"error": str(e)}
