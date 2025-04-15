import { getSignedFileUrl, getOratorPhotosFromS3 } from "./aws.utils";  // Assure-toi que le chemin est correct
import { OratorsService } from "../services/orators.service";  // Adapte selon ton chemin d'importation
import { OratorsRepository } from "../repository/orators.repository";  // Adapte selon ton chemin d'importation

// Fonction pour automatiser l'association des photos
async function updateOratorsPhotos() {
  try {
    // Récupérer tous les orateurs depuis la base de données
    const orators = await OratorsRepository.findAll();
    
    // Récupérer les photos dans S3 (utiliser la fonction de aws.utils.ts)
    const photos = await getOratorPhotosFromS3();
    
    // Pour chaque orateur, tenter de récupérer la photo correspondante
    for (const orator of orators) {
      const familyName = orator.name.split(" ").pop()!.toLowerCase(); // Extraire le nom de famille de l'orateur, en minuscule

      // Chercher la photo correspondant au nom de famille dans S3
      const matchingPhoto = photos.find(photo => {
        const fileName = photo.Key?.split("/")[1]?.split(".")[0].toLowerCase();  // Extraire le nom du fichier sans extension
        return fileName === familyName;  // Comparaison avec le nom de famille de l'orateur
      });

      if (matchingPhoto) {
        // Générer l'URL signée de la photo
        const photoUrl = await getSignedFileUrl(process.env.BUCKET_NAME!, matchingPhoto.Key!);
        
        // Mettre à jour la photo de l'orateur dans la base de données
        await OratorsService.updatePhoto(orator.id, photoUrl);
        console.log(`Photo for ${orator.name} updated successfully`);
      } else {
        console.log(`Photo not found for ${orator.name}`);
      }
    }
    
    console.log("All orator photos have been updated.");
  } catch (error) {
    console.error("Error updating orator photos:", error.message);
  }
}

// Appel de la fonction
updateOratorsPhotos().catch(console.error);
