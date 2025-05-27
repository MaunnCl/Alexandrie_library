import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/contents';

const contents = [
  { title: "Lithium dilution techniques to estimate cardiac output", orator_id:  15},
  { title: "Echo doppler techniques", orator_id:  7},
  { title: "Thermodilution technique to estimate cardiac output", orator_id:  159},
  { title: "Arterial pressure waveform derived cardiac output", orator_id:  160},
  { title: "Bioimpedance and bioreactance techniques", orator_id:  152},
  { title: "Extravascular lung water", orator_id:  161},
  { title: "Transesophageal doppler", orator_id:  162},
  { title: "Pressure monitoring", orator_id:  13},
  { title: "Ultrasound dilution technique to estimate cardiac output", orator_id:  163},
];
contents
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
