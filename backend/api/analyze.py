from fastapi import APIRouter, File, HTTPException, UploadFile, status

from services.analyzer import analyze_product


router = APIRouter()


@router.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    if file is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No file was uploaded.")

    content_type = (file.content_type or "").lower()
    if content_type and not content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Unsupported file type. Please upload a JPG, JPEG, or PNG image.",
        )

    try:
        image_bytes = await file.read()
        if not image_bytes:
            raise ValueError("Uploaded file is empty.")

        result = analyze_product(image_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - defensive fallback
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The analysis service could not process this image.",
        ) from exc

    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "analysis": result,
    }