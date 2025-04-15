import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

async function updateOratorsWithContentIds() {
  try {
    // 1. Récupère tous les contenus
    const { data: contents } = await axios.get(`${BASE_URL}/contents`);

    // 2. Regroupe les ids des contenus par orator_id
    const oratorsMap = {}; // orator_id -> [content_id]
    for (const content of contents) {
      const oratorId = content.orator_id;
      if (!oratorsMap[oratorId]) {
        oratorsMap[oratorId] = [];
      }
      oratorsMap[oratorId].push(content.id);
    }

    // 3. PATCH chaque orator avec ses content_ids
    for (const [oratorId, contentIds] of Object.entries(oratorsMap)) {
      try {
        const res = await axios.put(`${BASE_URL}/orators/${oratorId}`, {
          content_ids: contentIds,
        });
        console.log(`✅ Orator ${oratorId} updated with contents: ${contentIds.join(', ')}`);
      } catch (err) {
        console.error(`❌ Failed to update orator ${oratorId}`, err.response?.data || err.message);
      }
    }
  } catch (err) {
    console.error('❌ Error fetching content or updating orators', err.message);
  }
}

updateOratorsWithContentIds();
