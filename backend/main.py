import io
import os
from dotenv import load_dotenv # To load the environment variables from the .env file. 
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
# from openai import OpenAI
from google import genai # To use the Google GenAI API (Gemini API). 
from pypdf import PdfReader # To read the pdf file. 

load_dotenv() # Load the environment variables from the .env file. 

app = FastAPI() # Create a fastapi instance.

# Add middleware to allow CORS, allowing the frontend to access the backend: 
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


# Define the OpenAI client:
# aiClient = OpenAI(api_key=os.environ.get("OPENAI_API_KEY")) 
aiClient = genai.Client(api_key=os.environ.get("GOOGLE_API_KEY")) 

@app.post("/api/review-resume") # Review the resume and return the review:
async def review_resume(
    resumeFile: UploadFile = File(...), 
    jobDescription: str = Form(...)
):
    try: 
        # 1) Read the uploaded PDF resume file in-memory using the PdfReader class:
        resumeBytes = await resumeFile.read() # Read the resume file as bytes. 
        resumeStream = io.BytesIO(resumeBytes) # Create a stream from the bytes to read the pdf file. 
        resumeReader = PdfReader(resumeStream) # Create a reader object to read the pdf file. 

        extractedText = ""
        for page in resumeReader.pages:
            extractedText += page.extract_text() or "" # Get the text from the pdf file and store it in the extractedText variable (string). 

        # 2) Create a prompt for the OpenAI API to analyze the resume and give a score based on the job description: 
        aiPrompt = f"""
        You are an expert technical recruiter and resume reviewer. 
        You are given the following resume and a provided job description. 
        Analyze the resume against the job description. 
        Then grade the match on a scale of 0 to 100 based on experience, education, skills, projects, and tech stack. 

        Job Description: {jobDescription}
        Resume: {extractedText}

        Provide a concise match score (out of 100) and a brief breakdown of strengths and areas for improvement. 
        """

        # 3) Send the created prompt to the GenAI API (Gemini API) to get the response: 
        # The message content includes the system prompt plus the user prompt. 
        aiResponse = aiClient.models.generate_content(
            model = "models/gemini-3.8-flash", 
            contents = aiPrompt, 
        )

        aiAnalysis = aiResponse.text # Get the response from the GenAI API (Gemini API) (step 3). 
        return {"matchScore": aiAnalysis} # Return the match score to the client. 

    except Exception as e:
        return{"error": str(e)} # Return the error to the client. 
