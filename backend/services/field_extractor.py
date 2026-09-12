import re


LABEL_PREFIXES = (
    "manufactured by",
    "manufacture by",
    "mfd by",
    "packed by",
    "packaged by",
    "manufacturer",
    "packer",
    "imported by",
    "manufacturer / packer",
    "product",
    "net quantity",
    "net qty",
    "net wt",
    "net weight",
    "net volume",
    "mrp",
    "m.r.p.",
    "maximum retail price",
    "mfd",
    "mfg",
    "manufactured",
    "manufacturing date",
    "pkd",
    "packed",
    "packing date",
    "consumer care",
    "customer care",
    "toll free",
    "helpline",
    "contact",
    "complaints",
    "feedback",
    "country of origin",
    "made in",
    "best before",
    "use by",
    "expiry",
)


def clean_text(text):
    text = (text or "").replace("\r", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n+", "\n", text)
    return text.strip()


def normalize_value(value):
    if value is None:
        return None

    cleaned = re.sub(r"\s+", " ", value).strip(" \t\n:;,-")
    cleaned = cleaned.replace("\u2013", "-").replace("\u2014", "-")
    return cleaned or None


def _matches_label_prefix(line, prefixes):
    lowered = line.lower()
    return any(prefix in lowered for prefix in prefixes)


def find(patterns, text):
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
        if not match:
            continue

        candidate = normalize_value(match.group(1))
        if candidate:
            return candidate

    return None


def _extract_product_name(text):
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    for index, line in enumerate(lines[:12]):
        lowered = line.lower()
        if any(token in lowered for token in ["manufactured by", "net qty", "net wt", "mrp", "mfd", "consumer care", "best before", "country of origin", "ingredients", "nutrition", "contains"]) :
            continue
        if len(line) < 4 or len(line) > 90:
            continue
        if re.fullmatch(r"[A-Z0-9&/() .,'-]+", line) is None:
            continue
        if any(token in lowered for token in ["address", "phone", "tel", "email", "website", "pack of", "lot no", "batch", "qty", "mrp", "kg", "g", "ml", "l", "best before", "use by"]):
            continue
        if index <= 3:
            return line
    return None


def extract_fields(text):
    text = clean_text(text)
    if not text:
        return {
            "manufacturer": None,
            "product_name": None,
            "net_quantity": None,
            "mrp": None,
            "manufacturing_date": None,
            "best_before": None,
            "consumer_care": None,
            "country_of_origin": None,
            "unit_sale_price": None,
        }

    manufacturer = find([
        r"(?:manufactured\s*by|manufacture\s*by|manufacturing\s*by|mfd\s*by|packed\s*by|packaged\s*by|imported\s*by|manufacturer\s*/\s*packer|manufacturer\s*[:\-]?|packer\s*[:\-]?|importer\s*[:\-]?)\s*([A-Za-z0-9&./() ,'-]{3,80})",
        r"(?:manufacturer|packer|importer)\s*[:\-]?\s*([A-Za-z0-9&./() ,'-]{3,80})",
        r"(?:manufactured\s*by|packed\s*by|packaged\s*by|imported\s*by)\s*[:\-]?\s*([^\n]+)",
    ], text)

    product_name = _extract_product_name(text)
    if not product_name:
        product_name = find([
            r"(?:product\s*name)\s*[:\-]?\s*([^\n]+)",
            r"(?:name\s*of\s*(?:the\s*)?product)\s*[:\-]?\s*([^\n]+)",
            r"(?:^|\n)([A-Z][A-Za-z0-9&/() .,'-]{3,80})\s*\n(?:net\s*(?:quantity|qty|wt|weight)|mrp|mfd|manufactured|packed)",
        ], text)

    net_quantity = find([
        r"(?:net\s*(?:quantity|qty|wt|weight|volume|content)|quantity)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?\s*(?:kg|g|mg|l|ml|litre|liter|litres|liters))",
        r"\bnet\s*([0-9]+(?:\.[0-9]+)?\s*(?:kg|g|mg|l|ml|litre|liter|litres|liters))",
        r"(?:\bqty\b|\bquantity\b)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?\s*(?:kg|g|mg|l|ml|litre|liter|litres|liters))",
    ], text)

    mrp = find([
        r"(?:mrp|m\.r\.p\.|maximum\s*retail\s*price)\s*[:\-]?\s*(?:inr\.?\s*)?(?:rs\.?\s*)?(₹?\s*[0-9]+(?:\.[0-9]{1,2})?)",
        r"(?:rs\.?|₹)\s*([0-9]+(?:\.[0-9]{1,2})?)",
    ], text)

    manufacturing_date = find([
        r"(?:mfd|mfg|manufactured|manufacturing|manufacture|packing|packed|pkd)\s*(?:date)?\s*[:\-]?\s*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})",
        r"(?:mfd|mfg|manufactured|manufacturing|manufacture|packing|packed|pkd)\s*(?:date)?\s*[:\-]?\s*([0-9]{1,2}[\/\-][0-9]{2,4})",
        r"(?:mfd|mfg|pkd)\s*[:\-]?\s*([0-9]{2}[\/\-][0-9]{4})",
        r"(?:date\s*of\s*(?:manufacture|packing))\s*[:\-]?\s*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})",
    ], text)

    best_before = find([
        r"(?:best\s*before|best\s*before\s*date)\s*[:\-]?\s*([^\n]+)",
        r"(?:use\s*by|expiry)\s*[:\-]?\s*([^\n]+)",
    ], text)

    consumer_care = find([
        r"(?:consumer\s*care|customer\s*care|customer\s*service|toll\s*free|helpline|contact|complaints|feedback)\s*[:\-]?\s*([^\n]+)",
        r"(?:consumer\s*care|customer\s*care|customer\s*service|toll\s*free|helpline|contact|complaints|feedback)\s*[:\-]?\s*(?:tel\.?\s*)?([A-Za-z0-9+\-()\s]{3,80})",
    ], text)

    country_of_origin = find([
        r"(?:country\s*of\s*origin|origin)\s*[:\-]?\s*([A-Za-z ]+)",
        r"(?:made\s*in)\s*[:\-]?\s*([A-Za-z ]+)",
    ], text)

    unit_sale_price = find([
        r"(?:unit\s*sale\s*price|unit\s*price)\s*[:\-]?\s*(₹?\s*[0-9]+(?:\.[0-9]{1,2})?)",
    ], text)

    return {
        "manufacturer": manufacturer,
        "product_name": product_name,
        "net_quantity": net_quantity,
        "mrp": mrp,
        "manufacturing_date": manufacturing_date,
        "best_before": best_before,
        "consumer_care": consumer_care,
        "country_of_origin": country_of_origin,
        "unit_sale_price": unit_sale_price,
    }