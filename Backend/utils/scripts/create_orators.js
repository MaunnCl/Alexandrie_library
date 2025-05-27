import axios from 'axios';

const orators = [
  {"id": 66, "name": "Zaccaria Ricci", "city": "Rome", "country": "Italy"},
  {"id": 67, "name": "Rinaldo Bellomo", "city": "Melbourne", "country": "Australia"},
  {"id": 68, "name": "Patrick Saudan", "city": "Geneva", "country": "Switzerland"},
  {"id": 69, "name": "John R. Prowle", "city": "London", "country": "United Kingdom"},
  {"id": 70, "name": "Olivier Joannes-Boyau", "city": "Bordeaux", "country": "France"},
  {"id": 71, "name": "Peter Pickkers", "city": "Nijmegen", "country": "Netherlands"},
  {"id": 72, "name": "Michael Joannidis", "city": "Innsbruck", "country": "Austria"},
  {"id": 73, "name": "Frédéric S. Tacone", "city": "Brussels", "country": "Belgium"},
  {"id": 74, "name": "Massimo Antonelli", "city": "Rome", "country": "Italy"},
  {"id": 75, "name": "Daniel De Backer", "city": "Brussels", "country": "Belgium"},
  {"id": 76, "name": "Franco Turani", "city": "Rome", "country": "Italy"}
]

const BASE_URL = 'http://0.0.0.0:8080/api/orators';

async function createOrators() {
  for (const orator of orators) {
    try {
      const response = await axios.post(BASE_URL, {
        id: orator.id,
        name: orator.name,
        city: orator.city,
        country: orator.country,
        content_ids: []
      });
      console.log(`✅ Created orator ${orator.name}:`, response.status);
    } catch (error) {
      console.error(`❌ Error creating ${orator.name}:`);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up the request:", error.message);
      }
    }
  }
}

createOrators();