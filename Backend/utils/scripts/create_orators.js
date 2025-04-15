import axios from 'axios';

const orators = [
  {"id": 1, "name": "Julia Wendon", "city": "London", "country": "United Kingdom"},
  {"id": 2, "name": "Sean Bagshaw", "city": "Edmonto", "country": "Canada"},
  {"id": 3, "name": "Giorgio Berlot", "city": "Trieste", "country": "Italy"},
  {"id": 4, "name": "Didier Payen", "city": "Paris", "country": "France"},
  {"id": 5, "name": "John Kellum", "city": "Pittsburgh", "country": "United States"},
  {"id": 6, "name": "Michael Pinsky", "city": "Pittsburgh", "country": "United States"},
  {"id": 7, "name": "Antoine Vieillard-Baron", "city": "Boulogne-Billancourt", "country": "France"},
  {"id": 8, "name": "Xavier Monnet", "city": "Le Kremlin-Bicêtre", "country": "France"},
  {"id": 9, "name": "Ignacio Monge", "city": "Jerez de la Frontera", "country": "Spain"},
  {"id": 10, "name": "Berthold Bein", "city": "Kiel", "country": "Germany"},
  {"id": 11, "name": "Manu Malbrain", "city": "Antwerp", "country": "Belgium"},
  {"id": 12, "name": "Maxime Cannesson", "city": "Irvine", "country": "United States"},
  {"id": 13, "name": "Jean-Louis Teboul", "city": "Le Kremlin-Bicêtre", "country": "France"},
  {"id": 14, "name": "Michel Slama", "city": "Amiens", "country": "France"},
  {"id": 15, "name": "Andrew Rhodes", "city": "London", "country": "United Kingdom"},
  {"id": 16, "name": "Niall Ferguson", "city": "Toronto", "country": "Canada"},
  {"id": 17, "name": "Neil R Machinyre", "city": "Durham", "country": "United States"},
  {"id": 18, "name": "Christer Sinderby", "city": "Toronto", "country": "Canada"},
  {"id": 19, "name": "Paolo Pelosi", "city": "Genoa", "country": "Italy"},
  {"id": 20, "name": "Robert M Kacmarek", "city": "Boston", "country": "United States"},
  {"id": 21, "name": "Laurent Brochard", "city": "Geneva", "country": "Switzerland"},
  {"id": 22, "name": "Arthur S Slutsky", "city": "Toronto", "country": "Canada"},
  {"id": 23, "name": "Edgar Jimenez", "city": "Orlando", "country": "United States"},
  {"id": 24, "name": "Sameer Jog", "city": "Pune", "country": "India"},
  {"id": 25, "name": "Peter Andrews", "city": "Edinburgh", "country": "United Kingdom"},
  {"id": 26, "name": "Charles Phillips", "city": "Portland", "country": "United States"},
  {"id": 27, "name": "Jason Christie", "city": "Philadelphia", "country": "United States"},
  {"id": 28, "name": "Ognjen Gajic", "city": "Rochester", "country": "United States"},
  {"id": 29, "name": "Samir Jaber", "city": "Montpellier", "country": "France"},
  {"id": 30, "name": "Jan A Hazelzet", "city": "Rotterdam", "country": "Netherlands"},
  {"id": 31, "name": "Patrick T Murray", "city": "Dublin", "country": "Ireland"},
  {"id": 32, "name": "Jerry Nolan", "city": "Bath", "country": "United Kingdom"},
  {"id": 33, "name": "Jean-Charles Preiser", "city": "Brussels", "country": "Belgium"},
  {"id": 34, "name": "Tobias Welte", "city": "Hannover", "country": "Germany"},
  {"id": 35, "name": "Jean-Louis Vincent", "city": "Brussels", "country": "Belgium"},
  {"id": 36, "name": "Steven Opal", "city": "Providence", "country": "United States"},
  {"id": 37, "name": "R Phillip Dellinger", "city": "Camden", "country": "United States"},
  {"id": 38, "name": "Konrad Reinhart", "city": "Jena", "country": "Germany"},
  {"id": 39, "name": "Evangelos Giamarellos-Bourboulis", "city": "Athens", "country": "Greece"},
  {"id": 40, "name": "Derek C Angus", "city": "Pittsburgh", "country": "United States"},
  {"id": 41, "name": "Konstantin Mayer", "city": "Giessen", "country": "Germany"},
  {"id": 42, "name": "Derek Gilroy", "city": "London", "country": "United Kingdom"},
  {"id": 43, "name": "Edward Abraham", "city": "Birmingham", "country": "United States"},
  {"id": 44, "name": "Nino Stocchetti", "city": "Milan", "country": "Italy"},
  {"id": 45, "name": "Alain Combes", "city": "Paris", "country": "France"},
  {"id": 46, "name": "Michael Quintel", "city": "Göttingen", "country": "Germany"},
  {"id": 47, "name": "Antonio Pesenti", "city": "Milan", "country": "Italy"},
  {"id": 48, "name": "Shane Tibby", "city": "London", "country": "United Kingdom"},
  {"id": 49, "name": "Marco Ranieri", "city": "Turin", "country": "Italy"},
  {"id": 50, "name": "Claudio Ronco", "city": "Vicenza", "country": "Italy"},
  {"id": 51, "name": "Georgios Baltopoulos", "city": "Athens", "country": "Greece"},
  {"id": 52, "name": "John G Laffey", "city": "Galway", "country": "Ireland"},
  {"id": 53, "name": "Steffen Rex", "city": "Aachen", "country": "Germany"},
  {"id": 54, "name": "Peter Radermacher", "city": "Ulm", "country": "Germany"},
  {"id": 55, "name": "Kees Polderman", "city": "Pittsburgh", "country": "United States"},
  {"id": 56, "name": "Hiroyuki Hirasawa", "city": "Chiba", "country": "Japan"},
  {"id": 57, "name": "Fekri Abroug", "city": "Monastir", "country": "Tunisia"},
  {"id": 58, "name": "Antonio Artigas", "city": "Sabadell", "country": "Spain"},
  {"id": 59, "name": "Marcelo Amato", "city": "Sao Paulo", "country": "Brazil"},
  {"id": 60, "name": "Jose-Arthur Paiva", "city": "Porto", "country": "Portugal"},
  {"id": 61, "name": "Anthony Gordon", "city": "London", "country": "United Kingdom"},
  {"id": 62, "name": "Claus Krenn", "city": "Vienna", "country": "Austria"},
  {"id": 63, "name": "Djillali Annane", "city": "Garches", "country": "France"},
  {"id": 64, "name": "Karl Werdan", "city": "Halle", "country": "Germany"},
  {"id": 65, "name": "Paul Wischmeyer", "city": "Aurora", "country": "United States"}
]

const BASE_URL = 'http://localhost:8080/api/orators';

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