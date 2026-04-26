# ⚠️ REPO: kozeletimozaik (gaiagent0/kozeletimozaik)
# git remote -v → kozeletimozaik | git pull origin main

# Jogi oldalak – Privacy Policy, ÁSZF, Adattörlés

## Cél
Három statikus HTML oldal a `public/` mappában, hogy ezek elérhetők legyenek:
- https://valasztasibingo.hu/privacy  → Adatvédelmi nyilatkozat
- https://valasztasibingo.hu/terms    → ÁSZF
- https://valasztasibingo.hu/delete   → Adattörlési útmutató

Ezeket a Facebook App beállításaiba kell beírni, és GDPR-kompatibilisnek kell lenniük.

---

## 1. public/privacy.html – Adatvédelmi nyilatkozat

```html
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Adatvédelmi nyilatkozat – Választási Bingó 2026</title>
  <style>
    body { font-family: sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; color: #333; }
    h1 { color: #aa0424; }
    h2 { margin-top: 2em; }
    a { color: #aa0424; }
  </style>
</head>
<body>
  <h1>Adatvédelmi nyilatkozat</h1>
  <p><strong>Utolsó frissítés:</strong> 2026. április</p>

  <h2>1. Az adatkezelő</h2>
  <p>Választási Bingó 2026 alkalmazás üzemeltetője.<br/>
  Kapcsolat: <a href="mailto:gaiagent0@gmail.com">gaiagent0@gmail.com</a></p>

  <h2>2. Milyen adatokat gyűjtünk?</h2>
  <p>Ha Google vagy Facebook fiókkal jelentkezik be, az alábbi adatokat kezeljük:</p>
  <ul>
    <li>Felhasználónév / megjelenítési név</li>
    <li>E-mail cím</li>
    <li>Profilkép URL</li>
    <li>Játékstatisztikák (bingók száma, pontok)</li>
  </ul>
  <p>Névtelen (vendég) belépés esetén semmilyen személyes adatot nem tárolunk.</p>

  <h2>3. Mire használjuk az adatokat?</h2>
  <ul>
    <li>Ranglista megjelenítéséhez</li>
    <li>Játékstatisztikák tárolásához</li>
    <li>Felhasználói fiók azonosításához</li>
  </ul>
  <p>Az adatokat harmadik félnek nem adjuk át, hirdetési célra nem használjuk.</p>

  <h2>4. Adattárolás</h2>
  <p>Az adatokat a <strong>Supabase</strong> (supabase.com) szolgáltatás tárolja, EU-s szervereken.
  Az adatmegőrzési idő: a fiók törléséig, de maximum 2 évig.</p>

  <h2>5. Az Ön jogai (GDPR)</h2>
  <ul>
    <li><strong>Hozzáférés:</strong> kérheti az Önről tárolt adatokat</li>
    <li><strong>Törlés:</strong> kérheti adatai törlését – lásd: <a href="/delete">adattörlési oldal</a></li>
    <li><strong>Tiltakozás:</strong> tiltakozhat az adatkezelés ellen</li>
    <li><strong>Hordozhatóság:</strong> kérheti adatai kiadását</li>
  </ul>
  <p>Kérés esetén írjon a <a href="mailto:gaiagent0@gmail.com">gaiagent0@gmail.com</a> címre.
  Válaszidő: 30 napon belül.</p>

  <h2>6. Sütik (cookies)</h2>
  <p>Az alkalmazás munkamenet-sütit és localStorage-ot használ a bejelentkezési állapot és beállítások tárolásához.
  Harmadik féltől származó követő sütiket nem alkalmazunk.</p>

  <h2>7. Kapcsolat</h2>
  <p>Adatvédelmi kérdésekkel forduljon hozzánk: <a href="mailto:gaiagent0@gmail.com">gaiagent0@gmail.com</a></p>

  <p><a href="/">← Vissza az alkalmazáshoz</a></p>
</body>
</html>
```

---

## 2. public/terms.html – ÁSZF

```html
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Általános Szerződési Feltételek – Választási Bingó 2026</title>
  <style>
    body { font-family: sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; color: #333; }
    h1 { color: #aa0424; }
    h2 { margin-top: 2em; }
    a { color: #aa0424; }
  </style>
</head>
<body>
  <h1>Általános Szerződési Feltételek</h1>
  <p><strong>Utolsó frissítés:</strong> 2026. április</p>

  <h2>1. A szolgáltatás</h2>
  <p>A Választási Bingó 2026 (valasztasibingo.hu) egy szórakoztató, interaktív webalkalmazás,
  amely a 2026-os magyarországi országgyűlési választások kampányidőszakához kapcsolódik.
  A szolgáltatás ingyenes és kizárólag szórakoztatási célt szolgál.</p>

  <h2>2. Felhasználási feltételek</h2>
  <ul>
    <li>Az alkalmazást csak személyes, nem kereskedelmi célra használhatja</li>
    <li>Tilos a rendszer megkerülése, feltörése vagy visszaélésszerű használata</li>
    <li>A tartalom szatirikus és szórakoztató jellegű, nem minősül politikai propaganda anyagnak</li>
  </ul>

  <h2>3. Felelősségkorlátozás</h2>
  <p>Az alkalmazás „ahogy van" alapon érhető el. Az üzemeltető nem vállal felelősséget
  a szolgáltatás megszakadásából vagy a tartalom pontosságából eredő károkért.</p>

  <h2>4. Szellemi tulajdon</h2>
  <p>Az alkalmazás forráskódja és dizájnja az üzemeltető tulajdona.
  A felhasználók által generált tartalom (bingó eredmények) a felhasználóké.</p>

  <h2>5. Módosítások</h2>
  <p>Az ÁSZF-t bármikor módosíthatjuk. A változásokról az alkalmazáson belül értesítünk.</p>

  <h2>6. Kapcsolat</h2>
  <p><a href="mailto:gaiagent0@gmail.com">gaiagent0@gmail.com</a></p>

  <p><a href="/">← Vissza az alkalmazáshoz</a></p>
</body>
</html>
```

---

## 3. public/delete.html – Adattörlési útmutató

```html
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Adattörlés – Választási Bingó 2026</title>
  <style>
    body { font-family: sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; color: #333; }
    h1 { color: #aa0424; }
    .box { background: #fff5f5; border-left: 4px solid #aa0424; padding: 16px 20px; border-radius: 4px; margin: 20px 0; }
    a { color: #aa0424; }
  </style>
</head>
<body>
  <h1>Adattörlési kérelem</h1>
  <p>A GDPR és a Facebook adatkezelési irányelvei alapján Ön jogosult kérni
  az alkalmazásban tárolt személyes adatainak törlését.</p>

  <div class="box">
    <strong>Adattörlés kérése:</strong><br/>
    Írjon e-mailt a <a href="mailto:gaiagent0@gmail.com">gaiagent0@gmail.com</a> címre,
    tárgy: <em>"Adattörlési kérelem"</em>.<br/>
    Válaszidő: 30 napon belül töröljük az összes adatát.
  </div>

  <h2>Milyen adatokat törlünk?</h2>
  <ul>
    <li>Felhasználói profil (név, e-mail, profilkép)</li>
    <li>Játékstatisztikák (bingók, pontok)</li>
    <li>Bingó munkamenetek</li>
    <li>Ranglista bejegyzések</li>
  </ul>

  <h2>Azonnali törlés – saját maga is megteheti</h2>
  <p>Az alkalmazásban: <strong>Beállítások → Kijelentkezés</strong> – ezzel megszűnik a munkamenete.
  A teljes fióktörléshez küldjön e-mailt a fenti címre.</p>

  <p><a href="/">← Vissza az alkalmazáshoz</a></p>
</body>
</html>
```

---

## 4. vercel.json – statikus HTML oldalak routing

Ellenőrizd a `vercel.json`-t – győződj meg róla hogy a `/privacy`, `/terms`, `/delete` útvonalak
a megfelelő HTML fájlokra mutatnak. Ha szükséges, add hozzá:

```json
{
  "rewrites": [
    { "source": "/privacy", "destination": "/privacy.html" },
    { "source": "/terms", "destination": "/terms.html" },
    { "source": "/delete", "destination": "/delete.html" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Ha már van `rewrites` a fájlban, csak az első 3 sort szúrd be a meglévő lista elejére.

---

## Lépések

1. `public/privacy.html` létrehozása
2. `public/terms.html` létrehozása
3. `public/delete.html` létrehozása
4. `vercel.json` ellenőrzése / frissítése
5. `npm run build` – 0 hiba
6. `git add public/privacy.html public/terms.html public/delete.html vercel.json`
7. `git commit -m "feat: adatvédelem, ÁSZF, adattörlés oldalak (GDPR + Facebook App Review)"`
8. `git push origin main`

## Siker kritériumok
- [ ] https://valasztasibingo.hu/privacy betöltődik
- [ ] https://valasztasibingo.hu/terms betöltődik
- [ ] https://valasztasibingo.hu/delete betöltődik
- [ ] Az oldalak mobilon is olvashatók
- [ ] `npm run build` 0 hiba
