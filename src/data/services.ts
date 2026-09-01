/**
 * The service catalogue.
 *
 * Single source of truth: `npm run seed` writes it into MongoDB, and the
 * public pages fall back to it when the database is not reachable yet, so the
 * site never renders an empty catalogue.
 */

export type ServiceSeed = {
  title: string;
  slug: string;
  category: string;
  icon: string;
  shortDescription: string;
  description: string;
  startingPrice: number;
  estimatedDays: string;
  documentsRequired: string[];
  eligibility: string[];
  steps: string[];
  faqs: { question: string; answer: string }[];
  keywords: string[];
  popular?: boolean;
  order: number;
};

export const COMMON_STEPS = [
  "Raise your request online or send us a message on WhatsApp",
  "Our executive calls you, verifies your papers and confirms the final price",
  "Pay 10% booking amount — we start the same day",
  "We prepare, submit and follow up with the department",
  "You see a preview of the finished document on your tracking page",
  "Clear the remaining 90% and download the original instantly",
];

export const SERVICE_CATALOGUE: ServiceSeed[] = [
  {
    title: "Caste Certificate",
    slug: "caste-certificate",
    category: "Certificates",
    icon: "ScrollText",
    shortDescription:
      "SC / ST / OBC caste certificate applied, followed up and delivered — no queues, no tehsil visits.",
    description:
      "A caste certificate is required for reserved-category admissions, government job applications, scholarships and welfare schemes. We prepare the application, attach the correct annexures, submit it to the tehsil or e-district portal and follow up until it is issued. You track every stage from your phone.",
    startingPrice: 499,
    estimatedDays: "7–15 working days",
    documentsRequired: [
      "Aadhaar card of the applicant",
      "Ration card or family ID",
      "Caste certificate of father or blood relative (if available)",
      "Proof of residence (electricity bill, voter ID or rent agreement)",
      "Passport size photograph",
      "Self-declaration affidavit (we prepare this for you)",
    ],
    eligibility: [
      "Applicant belongs to a notified SC, ST or OBC community",
      "Family has been resident of the state as per state rules",
    ],
    steps: COMMON_STEPS,
    faqs: [
      {
        question: "How long does a caste certificate take?",
        answer:
          "Most caste certificates are issued in 7 to 15 working days. Timelines depend on your tehsil and on how quickly the verification officer visits. We follow up every 48 hours and update your tracking page.",
      },
      {
        question: "Do I need to visit the tehsil office myself?",
        answer:
          "In most districts, no. We handle the filing and follow-up. If the department insists on a physical biometric or signature, we tell you in advance and book the slot for you.",
      },
      {
        question: "What if my application is rejected?",
        answer:
          "If the department rejects the file for a document that we missed, we refile at no extra service charge. Government fees paid at actuals are not refundable.",
      },
    ],
    keywords: [
      "caste certificate online",
      "SC ST OBC certificate apply",
      "jati praman patra",
      "caste certificate agent",
    ],
    popular: true,
    order: 1,
  },
  {
    title: "Income Certificate",
    slug: "income-certificate",
    category: "Certificates",
    icon: "IndianRupee",
    shortDescription:
      "Income certificate for scholarships, EWS quota, fee waivers and government schemes.",
    description:
      "An income certificate states your family annual income and is asked for by colleges, scholarship portals, EWS applications and most welfare schemes. We compile the income proof, draft the affidavit, file the application and chase the verification.",
    startingPrice: 399,
    estimatedDays: "5–10 working days",
    documentsRequired: [
      "Aadhaar card",
      "Ration card or family ID",
      "Salary slip, Form 16 or income affidavit",
      "Proof of residence",
      "Passport size photograph",
    ],
    eligibility: ["Applicant or family resides in the state of application"],
    steps: COMMON_STEPS,
    faqs: [
      {
        question: "How long is an income certificate valid?",
        answer:
          "Most states issue it with a validity of one financial year. Renew it before every new admission or scholarship season.",
      },
      {
        question: "I am self-employed. What income proof do I give?",
        answer:
          "A self-declaration affidavit works in most states. We draft it in the correct format and get it notarised for you.",
      },
    ],
    keywords: [
      "income certificate online",
      "aay praman patra",
      "income certificate for scholarship",
    ],
    popular: true,
    order: 2,
  },
  {
    title: "Domicile / Residence Certificate",
    slug: "domicile-certificate",
    category: "Certificates",
    icon: "Home",
    shortDescription:
      "Proof that you are a permanent resident of the state — needed for state quota seats and jobs.",
    description:
      "A domicile (mool nivas) certificate proves permanent residence in a state and is mandatory for state-quota college seats, state government jobs and several welfare schemes. We handle the paperwork end to end.",
    startingPrice: 449,
    estimatedDays: "7–15 working days",
    documentsRequired: [
      "Aadhaar card",
      "Proof of residence for the required number of years",
      "Ration card or voter ID",
      "School leaving certificate or birth certificate",
      "Passport size photograph",
    ],
    eligibility: ["Continuous residence in the state as per state rules"],
    steps: COMMON_STEPS,
    faqs: [
      {
        question: "Is domicile the same as a residence certificate?",
        answer:
          "In most states they are the same document, issued by the tehsildar. A few states issue them separately — we file whichever your purpose requires.",
      },
    ],
    keywords: [
      "domicile certificate",
      "mool nivas praman patra",
      "residence certificate apply",
    ],
    popular: true,
    order: 3,
  },
  {
    title: "Birth Certificate",
    slug: "birth-certificate",
    category: "Civil Registration",
    icon: "Baby",
    shortDescription:
      "New registration, delayed registration and name or spelling corrections.",
    description:
      "We register births with the municipal corporation or gram panchayat, handle delayed registrations that need a magistrate order, and correct wrong names, dates or spellings on existing certificates.",
    startingPrice: 599,
    estimatedDays: "7–21 working days",
    documentsRequired: [
      "Hospital discharge summary or birth slip",
      "Aadhaar of both parents",
      "Marriage certificate of parents (if available)",
      "Proof of address at the time of birth",
      "Affidavit for delayed registration (we prepare it)",
    ],
    eligibility: ["Birth occurred within the jurisdiction of the registrar"],
    steps: COMMON_STEPS,
    faqs: [
      {
        question:
          "The birth was 15 years ago and never registered. Can it still be done?",
        answer:
          "Yes. That is a delayed registration and needs a magistrate or revenue officer order along with an affidavit. We handle the full process, it usually takes 3 to 6 weeks.",
      },
      {
        question: "Can you correct a spelling mistake on an existing certificate?",
        answer:
          "Yes. Corrections need an affidavit plus supporting proof such as a school record or Aadhaar. Send us a photo of the current certificate and we will confirm what is needed.",
      },
    ],
    keywords: [
      "birth certificate online",
      "janm praman patra",
      "delayed birth registration",
    ],
    order: 4,
  },
  {
    title: "Death Certificate",
    slug: "death-certificate",
    category: "Civil Registration",
    icon: "FileHeart",
    shortDescription:
      "Registration, extra copies and corrections — handled with care and without repeat visits.",
    description:
      "A death certificate is required to settle bank accounts, insurance claims, property transfer and pension. We register the death, obtain certified copies and correct errors on already-issued certificates.",
    startingPrice: 599,
    estimatedDays: "5–15 working days",
    documentsRequired: [
      "Hospital or cremation ground certificate",
      "Aadhaar of the deceased",
      "Aadhaar of the applicant and relationship proof",
      "Proof of address of the deceased",
    ],
    eligibility: ["Applicant is a family member or legal heir"],
    steps: COMMON_STEPS,
    faqs: [
      {
        question: "How many copies should I take?",
        answer:
          "Take at least four. Banks, insurers, the pension office and the property registrar each keep one original.",
      },
    ],
    keywords: ["death certificate online", "mrityu praman patra"],
    order: 5,
  },
  {
    title: "Marriage Certificate",
    slug: "marriage-certificate",
    category: "Civil Registration",
    icon: "HeartHandshake",
    shortDescription:
      "Court or registrar marriage registration, with appointment booking and witness guidance.",
    description:
      "Marriage registration under the Hindu Marriage Act or the Special Marriage Act. We prepare the application, book the registrar appointment, guide your witnesses and collect the certificate.",
    startingPrice: 1999,
    estimatedDays: "15–45 working days",
    documentsRequired: [
      "Aadhaar and age proof of both partners",
      "Marriage invitation card and photographs",
      "Address proof of both partners",
      "Two witnesses with Aadhaar",
      "Affidavits from both partners (we prepare them)",
    ],
    eligibility: [
      "Bride is 18 or above and groom is 21 or above",
      "Marriage was solemnised, or the couple wishes to register under the Special Marriage Act",
    ],
    steps: COMMON_STEPS,
    faqs: [
      {
        question: "Do both partners have to appear in person?",
        answer:
          "Yes. The registrar requires both partners and two witnesses to be physically present on the appointment date. We book the slot and prepare everything else beforehand.",
      },
      {
        question: "How long does Special Marriage Act registration take?",
        answer:
          "It carries a mandatory 30-day public notice period, so plan for 45 days end to end.",
      },
    ],
    keywords: [
      "marriage certificate online",
      "court marriage registration",
      "vivah praman patra",
    ],
    order: 6,
  },
  {
    title: "PAN Card",
    slug: "pan-card",
    category: "Identity",
    icon: "CreditCard",
    shortDescription:
      "New PAN, correction, reprint and Aadhaar linking — filed the same day.",
    description:
      "We file new PAN applications, corrections to name, date of birth or photo, reprints of lost cards, and Aadhaar-PAN linking. Most new PANs come as an e-PAN within 48 hours.",
    startingPrice: 299,
    estimatedDays: "2–10 working days",
    documentsRequired: [
      "Aadhaar card",
      "Passport size photograph",
      "Signature on white paper",
      "Proof of date of birth",
    ],
    eligibility: ["Indian citizen or entity requiring a PAN"],
    steps: COMMON_STEPS,
    faqs: [
      {
        question: "How fast can I get a PAN?",
        answer:
          "If your Aadhaar mobile number is active for OTP, the e-PAN usually arrives within 48 hours. The physical card follows in 10 to 15 days by post.",
      },
      {
        question: "Can you fix a wrong name on my PAN?",
        answer:
          "Yes. Name, father name, date of birth, photo and signature corrections are all supported. Send us the current PAN and the correct spelling as per Aadhaar.",
      },
    ],
    keywords: [
      "pan card apply online",
      "pan correction",
      "new pan card agent",
      "e-pan",
    ],
    popular: true,
    order: 7,
  },
  {
    title: "Passport Assistance",
    slug: "passport-assistance",
    category: "Identity",
    icon: "Plane",
    shortDescription:
      "Fresh passport, renewal and tatkal — form filling, appointment booking and document checking.",
    description:
      "Passport rejections are almost always caused by mismatched addresses or wrong annexures. We fill the form correctly, verify every document against the current PSK checklist, book your appointment slot and brief you on the interview.",
    startingPrice: 999,
    estimatedDays: "Appointment in 2–15 days",
    documentsRequired: [
      "Aadhaar card",
      "Birth certificate or 10th marksheet",
      "Proof of present address",
      "Old passport (for renewal)",
      "Annexures as applicable (we prepare them)",
    ],
    eligibility: ["Indian citizen"],
    steps: COMMON_STEPS,
    faqs: [
      {
        question: "Do you guarantee a tatkal appointment?",
        answer:
          "Tatkal slots are released by the passport portal and are limited. We monitor releases and book the earliest available slot for you, but the release timing is controlled by the government.",
      },
      {
        question: "Will you come with me to the passport office?",
        answer:
          "The passport office allows only the applicant inside. We prepare a printed checklist and stay on call during your appointment.",
      },
    ],
    keywords: [
      "passport apply online",
      "tatkal passport",
      "passport appointment booking",
    ],
    order: 8,
  },
  {
    title: "Aadhaar Update Assistance",
    slug: "aadhaar-update",
    category: "Identity",
    icon: "Fingerprint",
    shortDescription:
      "Name, address, date of birth and mobile number updates guided end to end.",
    description:
      "Aadhaar corrections get rejected for small formatting reasons. We tell you exactly which proof will be accepted, prepare the supporting affidavit if needed and guide the update through to approval.",
    startingPrice: 249,
    estimatedDays: "5–15 working days",
    documentsRequired: [
      "Current Aadhaar number",
      "Proof supporting the new detail",
      "Registered mobile number for OTP",
    ],
    eligibility: ["Existing Aadhaar holder"],
    steps: COMMON_STEPS,
    faqs: [
      {
        question: "Can biometrics be updated online?",
        answer:
          "No. Fingerprint, iris and photo updates need a visit to an Aadhaar centre. We book the slot and give you the exact document list.",
      },
    ],
    keywords: ["aadhaar update", "aadhaar address change", "aadhaar correction"],
    order: 9,
  },
  {
    title: "Voter ID (EPIC)",
    slug: "voter-id",
    category: "Identity",
    icon: "Vote",
    shortDescription:
      "New voter registration, address shift and correction of name or photo.",
    description:
      "We file Form 6, 7, 8 and 8A as applicable, track the BLO verification and deliver the digital EPIC as soon as it is issued.",
    startingPrice: 249,
    estimatedDays: "15–30 working days",
    documentsRequired: [
      "Aadhaar card",
      "Age proof",
      "Proof of current address",
      "Passport size photograph",
    ],
    eligibility: ["Indian citizen aged 18 or above"],
    steps: COMMON_STEPS,
    faqs: [
      {
        question: "I moved cities. Do I need a new voter ID?",
        answer:
          "No, you shift the existing one. We file Form 8 for a change of constituency so your EPIC number stays the same.",
      },
    ],
    keywords: ["voter id apply", "voter card correction", "epic card"],
    order: 10,
  },
  {
    title: "Affidavit & Notary",
    slug: "affidavit-notary",
    category: "Legal Drafting",
    icon: "Stamp",
    shortDescription:
      "Any affidavit drafted on the correct stamp paper and notarised — same day in most cases.",
    description:
      "Name change, single status, income declaration, gap year, address proof, joint ownership, no-objection and lost-document affidavits. We draft in the accepted legal format, arrange the stamp paper and get it notarised.",
    startingPrice: 299,
    estimatedDays: "Same day – 2 working days",
    documentsRequired: [
      "Aadhaar card of the deponent",
      "Details to be declared in the affidavit",
      "Supporting document, if the affidavit refers to one",
    ],
    eligibility: ["Deponent is 18 or above"],
    steps: COMMON_STEPS,
    faqs: [
      {
        question: "Which affidavits do you draft?",
        answer:
          "Name change, date of birth correction, single status, income, gap certificate, address proof, lost document, NOC, guardianship and general declarations. If you describe your need on WhatsApp we will confirm the format.",
      },
      {
        question: "Is a notarised affidavit valid everywhere in India?",
        answer:
          "A notarised affidavit is accepted for most administrative purposes across India. Court matters may require a specific jurisdiction — tell us the purpose and we will draft accordingly.",
      },
    ],
    keywords: [
      "affidavit online",
      "notary near me",
      "name change affidavit",
      "stamp paper affidavit",
    ],
    popular: true,
    order: 11,
  },
  {
    title: "Ration Card",
    slug: "ration-card",
    category: "Welfare",
    icon: "ShoppingBasket",
    shortDescription:
      "New ration card, member addition or removal, and address transfer.",
    description:
      "We file new ration card applications, add newborns and spouses, remove members and transfer cards between districts, then follow up with the food and civil supplies department.",
    startingPrice: 449,
    estimatedDays: "15–30 working days",
    documentsRequired: [
      "Aadhaar of all family members",
      "Proof of residence",
      "Marriage certificate (for adding a spouse)",
      "Surrender certificate (for a transfer)",
    ],
    eligibility: ["Family resides in the state and meets the category criteria"],
    steps: COMMON_STEPS,
    faqs: [
      {
        question: "Can I add my newborn to the existing card?",
        answer:
          "Yes, with the birth certificate and the child Aadhaar enrolment slip. It usually takes 2 to 4 weeks.",
      },
    ],
    keywords: [
      "ration card apply",
      "ration card member add",
      "new ration card online",
    ],
    order: 12,
  },
  {
    title: "EWS Certificate",
    slug: "ews-certificate",
    category: "Certificates",
    icon: "BadgeCheck",
    shortDescription:
      "Economically Weaker Section certificate for the 10% general category quota.",
    description:
      "The EWS certificate must be issued in the exact central or state format demanded by your exam or admission. We use the right format the first time, so your form is not rejected at the last date.",
    startingPrice: 499,
    estimatedDays: "7–15 working days",
    documentsRequired: [
      "Aadhaar card",
      "Income proof of the whole family",
      "Land and property details",
      "Ration card or family ID",
      "Self-declaration affidavit (we prepare it)",
    ],
    eligibility: [
      "Family income below the notified limit",
      "Not covered under SC, ST or OBC reservation",
    ],
    steps: COMMON_STEPS,
    faqs: [
      {
        question: "Which format do you issue — central or state?",
        answer:
          "Tell us the exam or admission and we file in that exact format. Using the wrong format is the most common reason EWS forms get rejected.",
      },
    ],
    keywords: [
      "ews certificate apply",
      "ews income certificate",
      "10 percent quota certificate",
    ],
    order: 13,
  },
  {
    title: "Shop Licence (Gumasta)",
    slug: "shop-establishment-licence",
    category: "Business",
    icon: "Store",
    shortDescription:
      "Shop & Establishment registration so you can open a current account and run legally.",
    description:
      "Every shop, office and commercial establishment needs a Shop & Establishment (Gumasta) registration. Banks ask for it before opening a current account. We register your establishment and hand over the certificate.",
    startingPrice: 1499,
    estimatedDays: "7–20 working days",
    documentsRequired: [
      "Aadhaar and PAN of the owner",
      "Shop address proof (rent agreement or electricity bill)",
      "Passport size photograph",
      "Shop photograph with the name board",
    ],
    eligibility: ["Business operating within the municipal limits"],
    steps: COMMON_STEPS,
    faqs: [
      {
        question: "Do I need a Gumasta for a home-based business?",
        answer:
          "Usually yes, if you are trading commercially. Most banks require it before issuing a current account in the business name.",
      },
    ],
    keywords: [
      "gumasta licence",
      "shop establishment registration",
      "shop act licence",
    ],
    order: 14,
  },
  {
    title: "Udyam / MSME Registration",
    slug: "udyam-msme-registration",
    category: "Business",
    icon: "Factory",
    shortDescription:
      "Government registration filed correctly so your loan and tender benefits actually apply.",
    description:
      "Udyam registration unlocks priority-sector loans, tender preference and subsidy schemes. The category you file under decides your benefits, so it must match your turnover and investment correctly.",
    startingPrice: 499,
    estimatedDays: "1–3 working days",
    documentsRequired: [
      "Aadhaar of the proprietor or partner",
      "PAN of the business",
      "Bank account details",
      "Turnover and investment figures",
    ],
    eligibility: ["Micro, small or medium enterprise as per the MSMED Act"],
    steps: COMMON_STEPS,
    faqs: [
      {
        question: "Is Udyam registration free?",
        answer:
          "The government charges no fee. Our charge is only for filing it correctly and for the classification advice — we never mark up a government fee.",
      },
    ],
    keywords: ["udyam registration", "msme registration online", "udyog aadhaar"],
    order: 15,
  },
  {
    title: "GST Registration",
    slug: "gst-registration",
    category: "Business",
    icon: "ReceiptIndianRupee",
    shortDescription:
      "GSTIN application with correct HSN selection and follow-up on department queries.",
    description:
      "We prepare and file your GST registration, respond to the department clarification notice if one is raised, and hand over the GSTIN certificate. Most rejections come from an unclear address proof — we check that first.",
    startingPrice: 1499,
    estimatedDays: "7–15 working days",
    documentsRequired: [
      "PAN of the business or proprietor",
      "Aadhaar of the proprietor, partners or directors",
      "Business address proof",
      "Bank statement or cancelled cheque",
      "Passport size photographs",
    ],
    eligibility: ["Turnover above the threshold, or voluntary registration"],
    steps: COMMON_STEPS,
    faqs: [
      {
        question: "What if the GST officer raises a query?",
        answer:
          "We file the clarification reply for you at no extra service charge within the 7-day window.",
      },
    ],
    keywords: ["gst registration online", "gstin apply", "new gst number"],
    order: 16,
  },
];
