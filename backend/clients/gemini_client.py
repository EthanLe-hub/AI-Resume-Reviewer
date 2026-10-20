import os

from google import genai


client = genai.Client(api_key=os.environ.get("GOOGLE_API_KEY"))


def generate_content(prompt: str) -> str:
    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
    )
    return response.text
