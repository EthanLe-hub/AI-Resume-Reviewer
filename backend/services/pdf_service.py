import io

from pypdf import PdfReader


def extract_pdf_text(pdf_bytes: bytes) -> str:
    """Extract and concatenate text from all pages in a PDF."""
    reader = PdfReader(io.BytesIO(pdf_bytes))
    return "".join(page.extract_text() or "" for page in reader.pages)
