RULE_VERSION = "LM-PCR-2011-current-baseline"


def _build_check(field, rule_id, status, value, message, recommendation):
    return {
        "rule_id": rule_id,
        "field": field,
        "status": status,
        "value": value,
        "message": message,
        "recommendation": recommendation,
    }


def check_field(product, field, rule_id, description, recommendation):
    value = product.get(field)
    if value:
        return _build_check(
            field,
            rule_id,
            "PASS",
            value,
            f"{description} detected in the image text.",
            recommendation,
        )

    return _build_check(
        field,
        rule_id,
        "FAIL",
        None,
        f"Required declaration not detected from the image: {description}.",
        recommendation,
    )


def check_compliance(product):
    """
    Deterministic preliminary checks for packaged commodity declarations.
    This is decision-support only; final legal determination remains with the
    authorized inspector.
    """

    product = product or {}
    checks = []

    checks.append(
        check_field(
            product,
            "manufacturer",
            "LM-6-MANUFACTURER",
            "Manufacturer / packer / importer details",
            "Verify the manufacturer, packer, or importer details on the package label during physical inspection.",
        )
    )

    checks.append(
        check_field(
            product,
            "product_name",
            "LM-6-COMMODITY-NAME",
            "Product name / commodity name",
            "Validate the actual packaged commodity name against the label shown in the photograph.",
        )
    )

    checks.append(
        check_field(
            product,
            "net_quantity",
            "LM-6-NET-QUANTITY",
            "Net quantity declaration",
            "Verify the net content and unit, and confirm the declaration is legible on the principal display panel.",
        )
    )

    checks.append(
        check_field(
            product,
            "mrp",
            "LM-6-MRP",
            "Maximum retail price declaration",
            "Check that the retail price statement is visible and matches the package label during inspection.",
        )
    )

    checks.append(
        check_field(
            product,
            "manufacturing_date",
            "LM-6-MANUFACTURE-DATE",
            "Manufacture / packing date",
            "Confirm the production or packing date remains readable and matches the package details on-site.",
        )
    )

    checks.append(
        check_field(
            product,
            "consumer_care",
            "LM-6-CONSUMER-CARE",
            "Consumer care / grievance contact detail",
            "Check whether a valid contact detail is present and legible on the label.",
        )
    )

    if product.get("country_of_origin"):
        checks.append(
            _build_check(
                "country_of_origin",
                "LM-6-COUNTRY-ORIGIN",
                "PASS",
                product["country_of_origin"],
                "Country of origin declaration detected in the image.",
                "Retain the declaration and review whether it is required for the product category and market context.",
            )
        )
    else:
        checks.append(
            _build_check(
                "country_of_origin",
                "LM-6-COUNTRY-ORIGIN",
                "REVIEW",
                None,
                "Country of origin applicability requires review; this may be conditional on product sourcing and labeling context.",
                "Inspect the package to determine whether the declaration is required and whether it is omitted or simply not captured in the photograph.",
            )
        )

    if product.get("best_before"):
        checks.append(
            _build_check(
                "best_before",
                "LM-6-BEST-BEFORE",
                "PASS",
                product["best_before"],
                "Best before / use by declaration detected in the image.",
                "Confirm the statement remains visible and legible on the package during physical verification.",
            )
        )
    else:
        checks.append(
            _build_check(
                "best_before",
                "LM-6-BEST-BEFORE",
                "REVIEW",
                None,
                "Best before / use by applicability could not be confidently determined from the photograph alone.",
                "Review the product type and packaging text to determine whether this declaration is required or simply not visible in the image.",
            )
        )

    if product.get("unit_sale_price"):
        checks.append(
            _build_check(
                "unit_sale_price",
                "LM-6-UNIT-SALE-PRICE",
                "PASS",
                product["unit_sale_price"],
                "Unit sale price / per-unit declaration detected.",
                "Confirm the unit pricing statement is legible and relevant to the package presentation.",
            )
        )
    else:
        checks.append(
            _build_check(
                "unit_sale_price",
                "LM-6-UNIT-SALE-PRICE",
                "REVIEW",
                None,
                "Unit sale price applicability could not be determined reliably from the image and may depend on package category or legal context.",
                "Review if the product is subject to a unit-price requirement and whether the declaration is omitted or simply not captured in the photograph.",
            )
        )

    failures = [check for check in checks if check["status"] == "FAIL"]
    reviews = [check for check in checks if check["status"] == "REVIEW"]

    if failures:
        status = "FAIL"
    elif reviews:
        status = "REVIEW"
    else:
        status = "PASS"

    return {
        "status": status,
        "rule_version": RULE_VERSION,
        "checks": checks,
        "summary": {
            "total": len(checks),
            "passed": sum(1 for check in checks if check["status"] == "PASS"),
            "failed": len(failures),
            "review": len(reviews),
        },
    }