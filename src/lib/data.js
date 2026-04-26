export const BUZZWORDS = [
  // === KLASSZIKUS FIDESZ-SZAVAK ===
  "Brüsszel", "Szuverenitás", "Migráció", "Béke", "Rezsi-csökkentés",
  "Gyurcsány", "Előre megyünk", "Stabilitás", "Nemzeti érdek", "Kétharmad",
  "Keresztény értékek", "Alaptörvény", "Dollárbaloldal", "Háborúpárti",
  "Külföldi ügynök", "Soros-terv", "Munka alapú", "Nemzeti konzultáció",

  // === ÚJ 2025–2026 FIDESZ-KAMPÁNY ===
  "Ukrán kémek", "Terrorista állam", "Poloskázás", "Biztos kéz",
  "Golyó a tárban", "Szembeszél", "Békemisszió", "Nemet mondunk",
  "Lázárinfó", "Feketeruhások", "Benzinárplafon", "13. havi nyugdíj",
  "Hatvanpuszta", "Magyar Péter drága tévedés", "Kampányköltség nincs határ",

  // === TISZA PÁRT / MAGYAR PÉTER ===
  "Árad a Tisza", "Rendszerváltás", "Működő ország", "Kompetenciakampány",
  "Sorsdöntő", "Orbán vagy nem Orbán", "Szigetek", "Nemzet hangja",
  "Megszorító csomag", "240 oldalas program",

  // === NAGY BOTRÁNYOK 2025–2026 ===
  "Pálinkás százados", "Orbán Gáspár", "Csádi misszió",
  "Vérrel tapasztalat", "Sandhurst", "50% veszteség",
  "Szabó Bence százados", "Henry ügynök", "Gundalf",
  "Alkotmányvédelmi Hivatal", "Titkosszolgálati botrány",
  "Matolcsy-klán", "PADME", "MNB-botrány", "Százmilliárdok",
  "Beköltözve Felcsútra", "Hajdú Péter", "Pancser",

  // === ORBÁN KOMMUNIKÁCIÓ / MÉMEK ===
  "Da-da-da", "Tudom hogy fáj az igazság", "Kívül tartjuk a háborún",
  "Rogán gonosz kutyái", "Nem hagyjuk!", "Leszavazza",

  // === ÁLTALÁNOS KAMPÁNY 2026 ===
  "Április 12.", "Sorsdöntő voksolás", "Körzetek átrajzolva",
  "Levélszavazás", "Orosz beavatkozás", "AI-kampány",
  "J.D. Vance Budapest", "Trump-megállapodás", "Ukránbarát kormány",

  // === GAZDASÁG / KÖZÉLET ===
  "Infláció", "Árrésstop", "Otthonteremtés 3%", "Adómentesség anyáknak",
  "Megélhetési válság", "Közpénz", "Elszámoltatás", "Oligarchák",
]

export const NEWS = [
  {
    id: 1,
    time: "Ma, 09:42",
    tag: "#százados",
    tagColor: "bg-primary-fixed text-on-primary-fixed-variant",
    title: "Pálinkás százados: a honvédség morális mélypontján van",
    body: "Egymillió megtekintés egy nap alatt – a toborzókampány egykori arca arról beszélt, hogy Orbán Gáspár 50%-os veszteséggel tervezte a csádi missziót.",
    reactions: ["sentiment_very_satisfied", "thumb_up"],
    color: "border-primary",
  },
  {
    id: 2,
    time: "Tegnap, 18:15",
    tag: "#titkosszolgálat",
    tagColor: "bg-secondary-container text-on-secondary-container",
    title: "Henry, Gundalf és az Alkotmányvédelmi Hivatal",
    body: "A Direkt36 szerint titkosszolgálati művelet zajlott a Tisza Párt bedöntése érdekében. Szabó Bence százados kitálalt, Orbán szerint 'pancser' lett belőle.",
    reactions: [],
    reactionIcon: "local_fire_department",
    reactionCount: "2,4M megtekintés",
    color: "border-secondary",
  },
  {
    id: 3,
    time: "Szerda, 11:20",
    tag: "#matolcsy",
    tagColor: "bg-white/20 text-white",
    title: "MNB-botrány: százmilliárdok és a PADME-ügy",
    body: "Az ÁSZ több százmilliárdos vagyonvesztést tárt fel. Orbán Hajdú Péternek: 'Matolcsy okozott nekem bajt, de várjuk meg a vizsgálatot.'",
    reactions: [],
    likes: 42,
    comments: 12,
    color: "border-outline",
  },
  {
    id: 4,
    time: "Kedd, 14:05",
    tag: "#kampány",
    tagColor: "bg-secondary-container text-on-secondary-container",
    title: "Feketeruhások védik Orbánt az országjárón",
    body: "Lázár János beismerte: a Fidesz áll az ellentüntetőket vegzáló feketeruhás osztagok mögött a kampánygyűléseken.",
    reactions: ["thumb_up"],
    likes: 88,
    color: "border-primary",
  },
]

export const LEADERBOARD = [
  { rank: 1, name: "István V.", points: 248, today: "+12", initials: "IV" },
  { rank: 2, name: "Katalin H.", points: 215, today: "+8", initials: "KH" },
  { rank: 3, name: "Balázs F.", points: 198, today: "+5", initials: "BF" },
  { rank: 4, name: "Mária S.", points: 176, today: "+3", initials: "MS" },
  { rank: 5, name: "Péter N.", points: 154, today: "+1", initials: "PN" },
]
