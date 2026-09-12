from services.ocr import extract_text
from services.field_extractor import extract_fields
from rules.engine import check_compliance


def analyze_product(image_bytes: bytes):
    if not image_bytes or len(image_bytes) < 16:
        raise ValueError("Uploaded file is empty or unreadable.")

    ocr_result = extract_text(image_bytes)
    product = extract_fields(ocr_result["text"])
    compliance = check_compliance(product)

    return {
        "product": product,
        "compliance": compliance,
        "ocr": {
            "text": ocr_result["text"],
            "confidence": ocr_result["ocr_confidence"],
            "character_count": ocr_result["character_count"],
            "image_size": ocr_result["image_size"],
            "words": ocr_result["words"],
        },
        "source": "tesseract-ocr",
    }