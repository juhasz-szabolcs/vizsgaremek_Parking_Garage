# Parkoló Garázs Frontend

## 🚗 Projekt Áttekintés
Ez egy modern parkoló garázs kezelő rendszer frontend része, amely lehetővé teszi a felhasználók számára autóik parkolásának kezelését. A projekt Svelte keretrendszerben készült, és egy .NET Core backend API-val kommunikál.

## ✨ Jelenlegi Funkciók

### Felhasználói Funkciók
- [x] Felhasználói regisztráció
- [x] Bejelentkezés/Kijelentkezés
- [x] Autók kezelése
  - [x] Saját autók listázása
  - [x] Új autó hozzáadása
  - [x] Autó adatainak megjelenítése (márka, modell, rendszám)
  - [x] Autó logók automatikus betöltése
- [x] Parkolás kezelése
  - [x] Parkolóhely foglalása
  - [x] Parkolás leállítása
  - [x] Parkolóhelyek vizuális megjelenítése
  - [x] Foglalt/szabad helyek jelzése

### Technikai Megvalósítások
- [x] Reszponzív felhasználói felület
- [x] API integrációk
- [x] Hibakezelés
- [x] Felhasználói visszajelzések
- [x] Autentikáció kezelése
- [x] Automatikus állapot frissítések

## 🎯 Tervezett Funkciók

### Felhasználói Funkciók
- [ ] Autó szerkesztése
- [ ] Parkolási előzmények megtekintése
- [ ] Parkolási díj kalkuláció
- [ ] Értesítések kezelése
  - [ ] Parkolás lejáratáról
  - [ ] Új funkciókról
  - [ ] Rendszer karbantartásról
- [ ] Kedvenc parkolóhelyek mentése
- [ ] QR kód alapú parkolás indítás/leállítás

### Admin Funkciók
- [ ] Admin felület kialakítása
  - [ ] Felhasználók kezelése
  - [ ] Parkolóhelyek kezelése
  - [ ] Statisztikák megtekintése
- [ ] Parkolóhelyek karbantartási módjának beállítása
- [ ] Rendszerbeállítások módosítása
- [ ] Felhasználói tevékenységek naplózása

### Technikai Fejlesztések
- [ ] Offline mód támogatása
- [ ] PWA (Progressive Web App) funkciók
- [ ] Teljesítmény optimalizálás
- [ ] Unit tesztek írása
- [ ] E2E tesztek implementálása
- [ ] Dokumentáció bővítése
- [ ] CI/CD pipeline kialakítása

## 🛠️ Telepítés és Futtatás

1. Klónozd le a repository-t:
```bash
git clone [repository URL]
```

2. Telepítsd a függőségeket:
```bash
npm install
```

3. Indítsd el a fejlesztői szervert:
```bash
npm run dev
```

## 🔧 Környezeti Változók

A projekt a következő környezeti változókat használja:

- `VITE_API_URL`: A backend API URL-je (alapértelmezett: http://localhost:5025)

## 📚 Technológiai Stack

- Svelte
- TypeScript
- Vite
- Axios
- TailwindCSS

## 🤝 Közreműködés

A projekthez való hozzájárulást szívesen fogadjuk! Kérjük, hogy a változtatásokat pull request formájában küldd el.

## 📝 Megjegyzések

- A projekt aktív fejlesztés alatt áll
- A backend API dokumentációja külön repository-ban található
- A felhasználói felület magyar nyelvű
- A projekt MIT licenc alatt áll

## 🐛 Ismert Hibák

- [ ] Parkolás leállítása után néha nem frissül azonnal az autó státusza
- [ ] Bizonyos böngészőkben a parkolóhely térkép nem megfelelően jelenik meg
- [ ] Mobil nézetben a navigáció néha összecsúszik

## 📊 Jövőbeli Tervek

- Felhasználói statisztikák bevezetése
- Parkolási díj online fizetése
- Mobilalkalmazás fejlesztése
- Többnyelvű támogatás
- Parkolóhely foglalási rendszer
- Automatikus rendszámfelismerés integrálása

https://codecanyon.net/item/parkir-parking-booking-react-native-cli-app-ui-kit/56073916

https://codecanyon.net/item/parking-spot-booking-app-car-parking-app-smart-parking-app-flutter-parkspot-multi-language/45709425

## Deployment

A projekt sikeresen telepítve van és működik a következő szolgáltatásokon:

- **Frontend**: [Netlify](https://parking-garage-app.netlify.app)
- **Backend**: [Render](https://parkinggarageapibackend.onrender.com)
- **Adatbázis**: [Aiven MySQL](https://aiven.io)

### Kapcsolatok

- Frontend (Netlify) -> Backend (Render): HTTPS-en keresztül működik
- Backend (Render) -> Adatbázis (Aiven): SSL/TLS titkosítással védett kapcsolat
- CORS beállítások megfelelően konfigurálva a Netlify és Render közötti kommunikációhoz
- Cookie beállítások optimalizálva a cross-origin kérésekhez

