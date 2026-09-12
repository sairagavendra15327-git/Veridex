import io
import os

import pytesseract
from PIL import Image, ImageEnhance, ImageFilter, UnidentifiedImageError
from pytesseract import Output


def _resolve_tesseract_cmd():
    configured = os.getenv("TESSERACT_CMD", "").strip()
    if configured:
        return configured

    fallback = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    if os.path.exists(fallback):
        return fallback

    return "tesseract"


pytesseract.pytesseract.tesseract_cmd = _resolve_tesseract_cmd()


def _load_image(image_bytes: bytes) -> Image.Image:
    if not image_bytes or len(image_bytes) < 16:
        raise ValueError("Uploaded image is empty or corrupted.")

    try:
        image = Image.open(io.BytesIO(image_bytes))
        image.load()
    except (UnidentifiedImageError, OSError) as exc:
        raise ValueError("Unsupported or corrupt image file. Please upload a valid JPG, JPEG, or PNG image.") from exc

    if image.mode not in {"RGB", "L", "RGBA", "CMYK"}:
        image = image.convert("RGB")

    return image


def extract_text(image_bytes: bytes):
    image = _load_image(image_bytes)

    original_width, original_height = image.size
    if min(original_width, original_height) < 400:
        scale = 1400 / max(original_width, original_height)
        image = image.resize(
            (max(1, int(original_width * scale)), max(1, int(original_height * scale)))
        )

    try:
        gray = image.convert("L")
        gray = ImageEnhance.Contrast(gray).enhance(1.5)
        gray = gray.filter(ImageFilter.SHARPEN)

        text = pytesseract.image_to_string(gray, config="--psm 6")
        data = pytesseract.image_to_data(gray, config="--psm 6", output_type=Output.DICT)
    except pytesseract.TesseractNotFoundError as exc:
        raise RuntimeError("Tesseract OCR is not installed or configured for this environment.") from exc

    cleaned_text = text.replace("\x0c", "").strip()
    if not cleaned_text:
        raise ValueError("OCR produced no readable text. Please upload a clearer product label image.")

    words = []
    for i, word in enumerate(data.get("text", [])):
        word = (word or "").strip()
        if not word:
            continue

        try:
            confidence = float(data.get("conf", [0])[i])
        except (TypeError, ValueError, IndexError):
            confidence = 0

        if confidence < 20:
            continue

        box = {
            "x": data.get("left", [0])[i],
            "y": data.get("top", [0])[i],
            "width": data.get("width", [0])[i],
            "height": data.get("height", [0])[i],
        }

        words.append({
            "text": word,
            "confidence": round(confidence, 1),
            "box": box,
        })

    average_confidence = (
        round(sum(word["confidence"] for word in words) / len(words), 1)
        if words else 0
    )

    return {
        "text": cleaned_text,
        "character_count": len(cleaned_text),
        "image_size": image.size,
        "ocr_confidence": average_confidence,
        "words": words,
    }