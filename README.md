# Online Doctor Care - AI-Assisted Telemedicine & Clinical Care Platform

> **"Your Health, Your Care, Your Doctor."**  
> Certified Virtual Health Consultation, Preliminary Safety Triage, and Registered Physician Platform for India.  
> Supporting **English**, **हिन्दी (Hindi)**, and **मराठी (Marathi)**.

---

## 1. Overview & Architecture

Online Doctor Care is a production-oriented, full-stack healthcare web application designed in accordance with:
- **Telemedicine Practice Guidelines (2020)** issued by the Board of Governors in supersession of the Medical Council of India (MCI) / National Medical Commission (NMC).
- **Digital Personal Data Protection (DPDP) Act, 2023** (India).

### Technology Stack
- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express, tsx.
- **AI Engine:** Google Gemini API (`gemini-3.8-flash` via `@google/genai` TypeScript SDK on the server-side).
- **Safety Layer:** Deterministic Red-Flag Triage Engine intercepting acute emergencies prior to and alongside AI generation.
- **Data & Access Control:** Multi-role Authentication (Patient, Doctor, Administrator), DPDP Consent Tracking, SOAP Clinical Notes, Double-Booking Collision Prevention.

---

## 2. Key Modules & Functional Workflows

1. **Multilingual System (`en`, `hi`, `mr`):**
   - Seamless language switching during ongoing chats and assessments without session disruption.
   - Comprehensive translations across navigation, triage questions, emergency instructions, and consent screens.

2. **Deterministic Emergency Triage Layer:**
   - Pre-computation check for acute life-threatening emergencies (chest pain, respiratory distress, stroke signs FAST, unconsciousness, severe hemorrhage, poisoning).
   - Instant routing to **National Emergency 112** and **Ambulance 108** without waiting for generative model calls.

3. **AI Symptom Assessment & Chat:**
   - Structured multi-factor intake (duration, severity, progression, associated symptoms, age group, voluntary pregnancy/existing conditions).
   - Outputs informational cards (A: Symptom Summary, B: General Health Info, C: Recommended Next Steps, D: Share With Doctor, E: Mandatory Medical Disclaimer).
   - Strict ban on unverified antibiotic/medication prescriptions.

4. **Doctor Consultation Booking & Collision Prevention:**
   - Profiles with verified State Medical Council registrations (MMC, DMC, KMC).
   - Slot reservation with double-booking collision prevention.
   - Attach recent AI assessments with informed patient consent.

5. **Doctor Portal (SOAP Clinical Records):**
   - Clear distinction between AI educational summaries and Doctor-Authored Clinical Notes (Subjective, Objective, Assessment, Plan).
   - Fee and schedule management.

6. **Admin Portal & Governance:**
   - Verification queue for doctor registration credentials.
   - DPDP immutable security audit trail.
   - Platform branding and emergency contact configuration.

7. **In-App Automated Test Suite:**
   - Live assertions validating emergency detection, adversarial prompt rejection, patient data isolation, slot collision prevention, and consent withdrawal.

---

## 3. Environment Configuration

Copy `.env.example` to `.env`:

```bash
# GEMINI_API_KEY: Injected by AI Studio or set locally from Google AI Studio
GEMINI_API_KEY="your_gemini_api_key_here"

# PORT: Default 3000
PORT=3000
```

---

## 4. Development & Production Deployment

### Running Locally
```bash
# Start full-stack server (Express + Vite middlewares)
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
# Build frontend bundle
npm run build

# Start production server
npm start
```

---

## 5. Pre-Launch Security & Clinical Safety Checklist

- [x] **No Client-Side Secrets:** Gemini API keys are accessed solely on the server side (`server.ts`).
- [x] **Red Flag Emergency Interceptor:** Deterministic offline safety triage rules execute before AI responses.
- [x] **DPDP Act 2023 Compliance:** Consent capture, withdrawal mechanism, and right to erasure (data deletion) implemented.
- [x] **Minor Guardian Consent:** Guardian declaration mandatory for patients under 18 years.
- [x] **Physician Authenticity:** Doctor profiles display valid registration councils (e.g. Maharashtra Medical Council) and registration numbers.
- [x] **Anti-Hallucination & Disclaimer:** Clear disclaimers that AI cannot diagnose or prescribe medicines.
- [x] **Double-Booking Prevention:** Algorithm guarantees no overlapping confirmed slots for any doctor.
