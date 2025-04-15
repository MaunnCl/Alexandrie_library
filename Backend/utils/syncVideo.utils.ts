import { db } from "../config/database";
import { congressTable } from "../schemas/congress";
import { getSignedFileUrl } from "../utils/aws.utils";  // Importer la fonction pour obtenir les URLs signées
import { SessionRepository } from "../repository/session.repository";  // Importer ton repository
import { ContentRepository } from "../repository/content.repository";  // Importer ton repository
import { OratorsRepository } from "../repository/orators.repository";  // Importer ton repository

async function generateVideoUrlsForAllCongresses() {
  // 1. Récupérer tous les congrès de la base de données
  const congresses = await db
    .select()
    .from(congressTable);

  if (!congresses || congresses.length === 0) {
    throw new Error("No congress found in the database.");
  }

  // 2. Parcourir chaque congrès pour générer les URLs des vidéos
  for (const congress of congresses) {
    const congressKey = congress.key;  // La clé du congrès
    console.log(`Generating URLs for congress: ${congress.name}`);

    // 3. Vérifier si les session_ids sont disponibles
    const sessionIds = congress.session_ids;
    if (!sessionIds || sessionIds.length === 0) {
      console.log(`No sessions found for congress: ${congress.name}`);
      continue;
    }

    // 4. Parcourir chaque session en utilisant la fonction `findById`
    const sessions = [];
    for (const sessionId of sessionIds) {
      const session = await SessionRepository.findById(sessionId);

      if (session) {
        sessions.push(session);
      } else {
        console.log(`Session with ID ${sessionId} not found`);
      }
    }

    if (!sessions || sessions.length === 0) {
      console.log(`No sessions found for congress: ${congress.name}`);
      continue;
    }

    // 5. Parcourir les sessions pour récupérer les vidéos et les orateurs
    for (const session of sessions) {
      const sessionName = session.name;
      const contentIds = session.content_ids;  // Les IDs des vidéos de cette session

      if (!contentIds || contentIds.length === 0) {
        console.log(`No content found for session: ${sessionName}`);
        continue;
      }

      for (const contentId of contentIds) {
        // 6. Utiliser la méthode findById pour récupérer le contenu
        const content = await ContentRepository.findById(contentId);

        if (!content) {
          console.log(`Content with id ${contentId} not found`);
          continue;
        }

        const videoTitle = content.title.replace(/\s/g, '_');  // Remplacer les espaces par '_'
        const oratorId = content.orator_id;

        // 7. Utiliser la méthode findById pour récupérer l'orateur
        const orator = await OratorsRepository.findById(oratorId);

        if (!orator) {
          console.log(`Orator with id ${oratorId} not found`);
          continue;
        }

        const oratorName = orator.name;

        // 8. Construire le nom de fichier S3 de la vidéo
        const videoKey = `${congressKey}/${sessionName}/${oratorName}/${videoTitle}.mp4`;

        // 9. Générer l'URL signée de la vidéo avec la fonction `getSignedFileUrl` d'AWS
        const videoUrl = await getSignedFileUrl(process.env.BUCKET_NAME!, videoKey);

        if (!videoUrl) {
            console.log(`No video found for ${videoKey}, skipping URL update.`);
            continue
          }
          
          try {
            // Utiliser la fonction 'update' pour mettre à jour l'URL dans la base de données
            const updatedContent = await ContentRepository.update(contentId, content.title, content.orator_id, content.description, videoUrl);
          
            if (updatedContent) {
              console.log(`Updated content ID ${contentId} with URL: ${videoUrl}`);
            } else {
              console.log(`Failed to update content ID ${contentId}`);
            }
          } catch (error) {
            console.error(`Error updating content ID ${contentId}: ${error.message}`);
          }
        }
    }
  }
}

// Appeler la fonction pour générer les URLs pour tous les congrès
generateVideoUrlsForAllCongresses()
  .then(() => {
    console.log("All video URLs generated and updated successfully.");
  })
  .catch((error) => {
    console.error("Error generating video URLs:", error.message);
  });