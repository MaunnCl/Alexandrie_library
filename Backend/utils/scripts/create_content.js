import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/contents';

const contents = [
  { title: "Liver support", orator_id: 1 },
  { title: "Extracorporeal therapies in sepsis", orator_id: 2 },
  { title: "Continuous plasma filtration and absorption", orator_id: 3 },
  { title: "I am skeptical", orator_id: 4 },
  { title: "Will it ever work?", orator_id: 5 },
  { title: "The physiologic basis of preload markers", orator_id: 6 },
  { title: "Heart-lung interactions visualized by echo", orator_id: 7 },
  { title: "Prediction of fluid responsiveness", orator_id: 8 },
  { title: "Fluid responsiveness in early resuscitation", orator_id: 9 },
  { title: "What are the pitfalls?", orator_id: 10 },
  { title: "Fluid responsiveness: is it valid in IAH?", orator_id: 11 },
  { title: "Also in children?", orator_id: 12 },
  { title: "Passive leg raising: the advantages", orator_id: 13 },
  { title: "Passive leg raising: the limitations", orator_id: 14 },
  { title: "What about a fluid challenge ?", orator_id: 15 },
  { title: "How mechanical ventilation is used today", orator_id: 16 },
  { title: "Airway pressure release ventilation", orator_id: 17 },
  { title: "NAVA with endotracheal flowthrough", orator_id: 18 },
  { title: "Noisy ventilation", orator_id: 19 },
  { title: "Adaptive support ventilation with closed loop CO2 control", orator_id: 20 },
  { title: "What are we heading for ?", orator_id: 21 },
  { title: "The rationale", orator_id: 22 },
  { title: "High frequency oscillatory ventilation", orator_id: 23 },
  { title: "Use in ARDS", orator_id: 24 },
  { title: "Use in head injury", orator_id: 25 },
  { title: "Translaryngeal ventilation", orator_id: 20 },
  { title: "How to monitor ?", orator_id: 16 },
  { title: "We need new definitions", orator_id: 26 },
  { title: "We need more mechanistic criteria", orator_id: 27 },
  { title: "How can we prevent ARDS ?", orator_id: 28 },
  { title: "Has the incidence decreased ?", orator_id: 20 },
  { title: "ARDS in obese patients", orator_id: 29 },
  { title: "What are the effective pharmacologic interventions ?", orator_id: 17 },
  { title: "Sepsis in children", orator_id: 30 },
  { title: "Acute kidney injury", orator_id: 31 },
  { title: "CPR", orator_id: 32 },
  { title: "Glucose control", orator_id: 33 },
  { title: "Macrolides: More than antibiotics", orator_id: 34 },
  { title: "Eritoran as a new TLR4 inhibitor", orator_id: 35 },
  { title: "Eritoran: Study results", orator_id: 36 },
  { title: "Lactoferrin", orator_id: 37 },
  { title: "Other therapies in the pipeline", orator_id: 35 },
  { title: "Has the incidence changed ?", orator_id: 38 },
  { title: "Have the definitions changed ?", orator_id: 35 },
  { title: "Towards better stratification ?", orator_id: 39 },
  { title: "Has the outcome from sepsis changed", orator_id: 40 },
  { title: "Mechanisms of repair", orator_id: 41 },
  { title: "Resolution of inflammation", orator_id: 42 },
  { title: "Role of efferocytosis in the resolution of inflammation", orator_id: 43 },
  { title: "Acute brain injury", orator_id: 44 },
  { title: "Potential indications", orator_id: 45 },
  { title: "Recent developments", orator_id: 46 },
  { title: "Practical aspects", orator_id: 47 },
  { title: "Use in children", orator_id: 48 },
  { title: "Extracorporeal CO2 removal in chronic lung disease", orator_id: 49 },
  { title: "Combining CO2 removal with CRRT", orator_id: 50 },
  { title: "Blocking microRNAs", orator_id: 43 },
  { title: "Immunostimulating therapies", orator_id: 51 },
  { title: "SIRT1 activators", orator_id: 36 },
  { title: "Hemoglobin solutions", orator_id: 35 },
  { title: "Gene therapies", orator_id: 52 },
  { title: "Antioxidants", orator_id: 53 },
  { title: "Hydrogen sulfide", orator_id: 54 },
  { title: "Challenges to sepsis research", orator_id: 40 },
  { title: "Hypothermia", orator_id: 55 },
  { title: "In India", orator_id: 24 },
  { title: "In Japan", orator_id: 56 },
  { title: "In North Africa", orator_id: 57 },
  { title: "Regional differences in one country", orator_id: 58 },
  { title: "In South America", orator_id: 59 },
  { title: "Does adequate antibiotic therapy prevent MOF ?", orator_id: 60 },
  { title: "Vasopressin", orator_id: 61 },
  { title: "Immunoglobulins", orator_id: 62 },
  { title: "NO blockade", orator_id: 54 },
  { title: "Beta-blockade", orator_id: 63 },
  { title: "Ivabradine", orator_id: 64 },
  { title: "Extracorporeal therapies", orator_id: 56 },
  { title: "Pharmaconutrition", orator_id: 65 },
  { title: "Acute kidney injury", orator_id: 2 }
];

async function createContents() {
  for (const content of contents) {
    try {
      const response = await axios.post(BASE_URL, content);
      console.log(`✅ Created content "${content.title}" for orator ID ${content.orator_id}`);
    } catch (error) {
      console.error(`❌ Error creating content "${content.title}":`, error.response?.data || error.message);
    }
  }
}

createContents();
