export interface MandatoryDeclarationRule {
  rule: string;
  name: string;
  description: string;
  sampleRequirements: string;
}

export interface StatutoryUnitSymbol {
  symbol: string;
  fullName: string;
  dimension: string;
}

export interface ProhibitedUnitSymbol {
  invalid: string;
  correctAlternative: string;
  legalReason: string;
}

export interface LegalMetrologyActSection {
  section: string;
  title: string;
  description: string;
  penalty: string;
}

export const MANDATORY_DECLARATIONS_RULE_6: MandatoryDeclarationRule[] = [
  {
    rule: 'Rule 6(1)(a)',
    name: 'Manufacturer / Packer / Importer',
    description: 'Name and complete physical address of the manufacturer, or packer, or importer.',
    sampleRequirements: 'Must include qualifying prefix such as "Mfg by", "Packed by", or "Imported by" with complete physical location.',
  },
  {
    rule: 'Rule 6(1)(ea)',
    name: 'Country of Origin',
    description: 'Country of origin or manufacture of imported/indigenous commodities.',
    sampleRequirements: 'E.g., "Country of Origin: India" or "Made in India". Mandatory on both retail packaging and e-commerce listings.',
  },
  {
    rule: 'Rule 6(1)(b)',
    name: 'Generic Commodity Name',
    description: 'Common or generic name of the pre-packaged commodity.',
    sampleRequirements: 'True generic descriptor (e.g. "Toor Dal", "Hair Oil", "Wheat Flour") rather than solely trade branding.',
  },
  {
    rule: 'Rule 6(1)(c)',
    name: 'Net Quantity (SI Units)',
    description: 'Net quantity in standard SI units of weight, measure, or number.',
    sampleRequirements: 'Permitted symbols: g, kg, ml, L, l, cm, m, N, U. Plural or non-standard symbols like "gms", "gm", "ltrs" are illegal.',
  },
  {
    rule: 'Rule 6(1)(e)',
    name: 'MRP & Tax Inclusive Clause',
    description: 'Retail sale price in INR including all taxes.',
    sampleRequirements: 'Must explicitly state "inclusive of all taxes" or "incl. of all taxes" alongside the price figure.',
  },
  {
    rule: 'Rule 6(1)(e) Amdt',
    name: 'Unit Sale Price (USP)',
    description: 'Unit Sale Price per g, kg, ml, l, or number (mandatory w.e.f. Dec 2022).',
    sampleRequirements: 'Enables consumer comparison (e.g., "₹ 0.50 per g" or "₹ 120.00 / kg").',
  },
  {
    rule: 'Rule 6(1)(d)',
    name: 'Date of Mfg / Packing',
    description: 'Month and year of manufacture, packing, or import.',
    sampleRequirements: 'Clear numeric MM/YYYY or standard month-year string.',
  },
  {
    rule: 'Rule 6(1)(a) Proviso',
    name: 'Consumer Care Cell',
    description: 'Complete 4-point grievance redressal details.',
    sampleRequirements: 'Must contain: (1) Contact Designation, (2) Postal Address, (3) Telephone number, and (4) Email address.',
  },
];

export const VALID_SI_SYMBOLS: StatutoryUnitSymbol[] = [
  { symbol: 'g', fullName: 'Gram', dimension: 'Mass' },
  { symbol: 'kg', fullName: 'Kilogram', dimension: 'Mass' },
  { symbol: 'ml / mL', fullName: 'Millilitre', dimension: 'Volume' },
  { symbol: 'L / l', fullName: 'Litre', dimension: 'Volume' },
  { symbol: 'cm', fullName: 'Centimetre', dimension: 'Length' },
  { symbol: 'm', fullName: 'Metre', dimension: 'Length' },
  { symbol: 'N / U', fullName: 'Number / Unit', dimension: 'Count' },
];

export const INVALID_UNIT_SYMBOLS: ProhibitedUnitSymbol[] = [
  { invalid: 'gms', correctAlternative: 'g', legalReason: 'Plural unit symbol strictly banned under Rule 12 & SI norms.' },
  { invalid: 'gm', correctAlternative: 'g', legalReason: 'Non-standard abbreviation; only "g" is recognized under the Act.' },
  { invalid: 'ltrs / ltr', correctAlternative: 'L or l', legalReason: 'Non-statutory abbreviation; only "l" or "L" is legal.' },
  { invalid: 'ml.', correctAlternative: 'ml', legalReason: 'Punctuation dot in SI symbol is not permitted.' },
  { invalid: 'kilo', correctAlternative: 'kg', legalReason: 'Colloquial term not recognized under Schedule.' },
];

export const LEGAL_METROLOGY_ACT_SECTIONS: LegalMetrologyActSection[] = [
  {
    section: 'Section 18',
    title: 'Prohibition of Non-Standard Packages',
    description: 'No person shall manufacture, pack, sell, distribute, or offer for sale any pre-packaged commodity unless compliant with mandatory declarations.',
    penalty: 'Liable for seizure, inspection memo, and penalty under Section 36.',
  },
  {
    section: 'Section 36(1)',
    title: 'Penalty for Selling Non-Standard Packages',
    description: 'Whoever manufactures, packs, imports, sells, or offers for sale any non-standard or deficiently declared package.',
    penalty: 'Fine up to ₹25,000 (1st offence), up to ₹50,000 (2nd offence), up to ₹1,00,000 or imprisonment up to 1 year for subsequent offences.',
  },
  {
    section: 'Section 36(2)',
    title: 'Penalty for Short Weight or Measure',
    description: 'Whoever manufactures or sells pre-packaged commodities with actual quantity less than declared on packaging.',
    penalty: 'Fine from ₹10,000 to ₹50,000; repeat offence punishable with imprisonment up to 1 year.',
  },
  {
    section: 'Section 48',
    title: 'Compounding of Offences',
    description: 'Offences under Section 36(1) may be compounded by the Director, Controller, or authorized Legal Metrology officer upon payment of compounding sum.',
    penalty: 'Compounding fee in lieu of criminal court prosecution.',
  },
  {
    section: 'Section 15',
    title: 'Power of Inspection, Search & Seizure',
    description: 'Authorized legal metrology inspectors possess statutory powers to enter retail/wholesale premises, inspect packages, draw samples, and seize defective goods.',
    penalty: 'Seizure of defective stock under Form II / Panchnama.',
  },
];
