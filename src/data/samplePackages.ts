import { SamplePackagingItem } from '../types';

export const SAMPLE_PACKAGING_CASES: SamplePackagingItem[] = [
  {
    id: 'sample-fmcg-compliant',
    title: 'Tata Sampann Toor Dal (1 kg Retail Pack)',
    category: 'Food & Staples (Rule 6 Fully Compliant)',
    badge: '100% Compliant',
    badgeType: 'success',
    description: 'Fully compliant retail food packaging featuring SI unit "kg", qualifying prefix "Packed by", MRP with "incl. of all taxes", USP "₹165.00/kg", and 4-point consumer care cell.',
    imageSrc: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    expectedResult: {
      audit_metadata: {
        source_type: "physical_label_or_listing",
        image_quality_assessment: "CLEAR"
      },
      declarations: {
        manufacturer_or_packer: {
          found: true,
          raw_text: "Packed by: Tata Consumer Products Ltd., Kirloskar Business Park, Hebbal, Bengaluru, Karnataka - 560024",
          qualifying_prefix: "Packed by",
          entity_name: "Tata Consumer Products Ltd.",
          full_address: "Kirloskar Business Park, Hebbal, Bengaluru, Karnataka - 560024"
        },
        country_of_origin: {
          found: true,
          raw_text: "Country of Origin: India",
          country_name: "India"
        },
        common_or_generic_name: {
          found: true,
          raw_text: "Unpolished Toor Dal (Pigeon Pea)"
        },
        net_quantity: {
          found: true,
          raw_text: "Net Quantity: 1 kg",
          numeric_value: 1,
          declared_unit: "kg",
          is_standard_si_unit: true
        },
        mrp: {
          found: true,
          raw_text: "MRP ₹165.00 (inclusive of all taxes)",
          currency_symbol: "₹",
          numeric_amount: 165,
          has_tax_inclusive_clause: true,
          raw_tax_clause_text: "inclusive of all taxes"
        },
        unit_sale_price: {
          found: true,
          raw_text: "Unit Sale Price: ₹ 165.00 / kg",
          declared_unit_price: 165,
          declared_base_unit: "kg"
        },
        date_of_manufacture_or_pack: {
          found: true,
          raw_text: "PKD: 08/2024",
          parsed_month_year: "08/2024"
        },
        expiry_or_best_before: {
          found: true,
          raw_text: "Best before 12 months from packing"
        },
        consumer_care_details: {
          found: true,
          raw_text: "For feedback or complaints, write to Consumer Care Executive at Tata Consumer Products Ltd., Address as above, Call: 1800-108-4488, Email: customercare@tataconsumer.com",
          has_contact_person_or_office: true,
          has_postal_address: true,
          has_phone_number: true,
          has_email_address: true,
          extracted_phone: "1800-108-4488",
          extracted_email: "customercare@tataconsumer.com"
        }
      },
      font_readability: {
        estimated_numeral_height_mm: 6.2,
        minimum_required_height_mm: 6.0,
        is_font_height_compliant: true,
        contrast_evaluation: 'HIGH',
        readability_score: 98,
        conspicuous_placement_compliant: true,
        observations: 'Clear dark print over off-white background on the Principal Display Panel. Meets the First Schedule 6 mm requirement for packages exceeding 1 kg.'
      },
      misleading_packaging: {
        is_misleading: false,
        has_deceptive_stickers: false,
        findings: []
      },
      detected_languages: ["English", "Hindi"]
    }
  },
  {
    id: 'sample-si-violation',
    title: 'Herbal Hair Therapy Oil (200 gms)',
    category: 'Cosmetics / Non-SI Unit Violation',
    badge: 'Statutory Violation',
    badgeType: 'danger',
    description: 'Contains non-standard SI unit violation "200 gms" (strictly prohibited under Rule 6(1)(c); must be "g" or "ml") and lacks the mandatory "inclusive of all taxes" clause on MRP.',
    imageSrc: 'https://images.unsplash.com/photo-1608248597359-3a362243d607?auto=format&fit=crop&w=800&q=80',
    expectedResult: {
      audit_metadata: {
        source_type: "physical_label_or_listing",
        image_quality_assessment: "CLEAR"
      },
      declarations: {
        manufacturer_or_packer: {
          found: true,
          raw_text: "Mfg by: Ayur Botanicals Pvt. Ltd., Plot 14, Sector 5, Haridwar, Uttarakhand - 249403",
          qualifying_prefix: "Mfg by",
          entity_name: "Ayur Botanicals Pvt. Ltd.",
          full_address: "Plot 14, Sector 5, Haridwar, Uttarakhand - 249403"
        },
        country_of_origin: {
          found: true,
          raw_text: "Made in India",
          country_name: "India"
        },
        common_or_generic_name: {
          found: true,
          raw_text: "Herbal Hair Care Oil"
        },
        net_quantity: {
          found: true,
          raw_text: "Net Wt: 200 gms",
          numeric_value: 200,
          declared_unit: "gms",
          is_standard_si_unit: false
        },
        mrp: {
          found: true,
          raw_text: "M.R.P. Rs. 249.00",
          currency_symbol: "Rs.",
          numeric_amount: 249,
          has_tax_inclusive_clause: false,
          raw_tax_clause_text: null
        },
        unit_sale_price: {
          found: false,
          raw_text: null,
          declared_unit_price: null,
          declared_base_unit: null
        },
        date_of_manufacture_or_pack: {
          found: true,
          raw_text: "Mfg Date: 05/2024",
          parsed_month_year: "05/2024"
        },
        expiry_or_best_before: {
          found: true,
          raw_text: "Use before 24 months from Mfg."
        },
        consumer_care_details: {
          found: true,
          raw_text: "Customer support: contact@ayurbotanicals.in",
          has_contact_person_or_office: false,
          has_postal_address: false,
          has_phone_number: false,
          has_email_address: true,
          extracted_phone: null,
          extracted_email: "contact@ayurbotanicals.in"
        }
      },
      font_readability: {
        estimated_numeral_height_mm: 2.1,
        minimum_required_height_mm: 4.0,
        is_font_height_compliant: false,
        contrast_evaluation: 'ADEQUATE',
        readability_score: 64,
        conspicuous_placement_compliant: true,
        observations: 'Net quantity numeral height is ~2.1 mm, which violates the 4.0 mm statutory threshold for commodities of 200g-500g under the First Schedule of Rule 9.'
      },
      misleading_packaging: {
        is_misleading: true,
        has_deceptive_stickers: false,
        findings: [
          'Prohibited abbreviation "gms" utilized instead of statutory SI metric symbol "g"',
          'Absence of mandatory "inclusive of all taxes" declaration under Rule 6(1)(e)'
        ]
      },
      detected_languages: ["English"]
    }
  },
  {
    id: 'sample-ecommerce-missing-origin',
    title: 'Gourmet Roasted Pistachios (E-Commerce Label)',
    category: 'E-Commerce / Defective Packaging',
    badge: 'Deficient Declarations',
    badgeType: 'warning',
    description: 'E-commerce listing package missing mandatory Country of Origin (violating Rule 6(1)(ea)) and missing postal address in Consumer Care Cell.',
    imageSrc: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    expectedResult: {
      audit_metadata: {
        source_type: "physical_label_or_listing",
        image_quality_assessment: "PARTIALLY_OBSCURED"
      },
      declarations: {
        manufacturer_or_packer: {
          found: true,
          raw_text: "Marketed by: GreenCrunch Foods, Andheri East, Mumbai",
          qualifying_prefix: "Marketed by",
          entity_name: "GreenCrunch Foods",
          full_address: "Andheri East, Mumbai"
        },
        country_of_origin: {
          found: false,
          raw_text: null,
          country_name: null
        },
        common_or_generic_name: {
          found: true,
          raw_text: "Roasted & Salted California Pistachios"
        },
        net_quantity: {
          found: true,
          raw_text: "Net Weight: 250 g",
          numeric_value: 250,
          declared_unit: "g",
          is_standard_si_unit: true
        },
        mrp: {
          found: true,
          raw_text: "MRP: ₹ 399.00 (incl. of all taxes)",
          currency_symbol: "₹",
          numeric_amount: 399,
          has_tax_inclusive_clause: true,
          raw_tax_clause_text: "incl. of all taxes"
        },
        unit_sale_price: {
          found: true,
          raw_text: "USP ₹ 1.60 / g",
          declared_unit_price: 1.6,
          declared_base_unit: "g"
        },
        date_of_manufacture_or_pack: {
          found: true,
          raw_text: "Packed: 09/2024",
          parsed_month_year: "09/2024"
        },
        expiry_or_best_before: {
          found: true,
          raw_text: "Best before 6 months"
        },
        consumer_care_details: {
          found: true,
          raw_text: "Grievance Officer: Ph +91-9820011223, email support@greencrunch.com",
          has_contact_person_or_office: true,
          has_postal_address: false,
          has_phone_number: true,
          has_email_address: true,
          extracted_phone: "+91-9820011223",
          extracted_email: "support@greencrunch.com"
        }
      },
      font_readability: {
        estimated_numeral_height_mm: 4.2,
        minimum_required_height_mm: 4.0,
        is_font_height_compliant: true,
        contrast_evaluation: 'HIGH',
        readability_score: 85,
        conspicuous_placement_compliant: true,
        observations: 'Satisfies numeral height for 250g package (4mm required). High contrast black on yellow pouch.'
      },
      misleading_packaging: {
        is_misleading: true,
        has_deceptive_stickers: false,
        findings: [
          'Missing statutory Country of Origin declaration under Rule 6(1)(aa)',
          'Incomplete Consumer Care quad: Physical postal address omitted'
        ]
      },
      detected_languages: ["English"]
    }
  }
];
