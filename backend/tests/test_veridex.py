import io
import unittest

from PIL import Image

from services.analyzer import analyze_product
from services.field_extractor import extract_fields


class VeridexBackendTests(unittest.TestCase):
    def test_blank_image_is_rejected_as_unreadable(self):
        image = Image.new('RGB', (200, 200), color='white')
        buffer = io.BytesIO()
        image.save(buffer, format='PNG')

        with self.assertRaises(ValueError):
            analyze_product(buffer.getvalue())

    def test_extract_fields_handles_realistic_ocr_variations(self):
        ocr_text = """
        ROYAL HERITAGE
        MANUFACTURED BY: ABC FOOD INDUSTRIES PVT LTD
        NET WT 500 g
        MRP Rs. 299.00
        MFD: 12/04/2026
        CONSUMER CARE: +91 9876543210
        COUNTRY OF ORIGIN: INDIA
        BEST BEFORE: 12/2028
        """

        result = extract_fields(ocr_text)

        self.assertIsNotNone(result["manufacturer"])
        self.assertIn("ABC FOOD INDUSTRIES", result["manufacturer"])
        self.assertEqual(result["net_quantity"], "500 g")
        self.assertEqual(result["mrp"], "299.00")
        self.assertEqual(result["manufacturing_date"], "12/04/2026")
        self.assertEqual(result["consumer_care"], "+91 9876543210")
        self.assertEqual(result["country_of_origin"], "INDIA")
        self.assertEqual(result["best_before"], "12/2028")


if __name__ == '__main__':
    unittest.main()
