# 🚀 LegAI – AI Assisted Legal Document Management System

---

## 📌 Opis projekta

**LegAI** je full-stack web aplikacija razvijena sa ciljem automatizacije generisanja i upravljanja pravnim dokumentima uz asistenciju veštačke inteligencije.

Sistem omogućava korisnicima da kroz interaktivni *wizard* kreiraju pravne dokumente, dobiju objašnjenja pravnih pojmova putem AI asistenta i preuzmu dokumente u **DOCX** formatu.

---

## 🏗️ Arhitektura sistema

Aplikacija je razvijena kao **client-server** sistem:

- 🔹 **Backend:** ASP.NET Core (REST API)
- 🔹 **Frontend:** React
- 🔹 **Baza podataka:** Microsoft SQL Server
- 🔹 **Generisanje dokumenata:** OpenXML SDK
- 🔹 **AI integracija:** OpenAI API
- 🔹 **Autentifikacija:** JWT + ASP.NET Core Identity

---

## 👥 Tipovi korisnika i funkcionalnosti

### 👤 Posetilac
- Pregled dostupnih šablona
- Informacije o aplikaciji

### 👤 Registrovani korisnik
- Registracija i prijava
- Popunjavanje wizard forme
- Generisanje pravnih dokumenata
- Preuzimanje dokumenata u DOCX formatu
- Čuvanje istorije dokumenata
- AI asistent za:
  - Objašnjenje pravnih termina
  - Preporuku odgovarajućeg šablona

### 🛠️ Administrator
- Dodavanje novih šablona
- Brisanje postojećih šablona
- Upravljanje korisnicima
- Pregled osnovne statistike sistema

---

## 🧰 Tehnologije

**Backend:**
- C#
- ASP.NET Core
- Entity Framework Core
- ASP.NET Core Identity
- JWT autentifikacija

**Frontend:**
- React
- Hooks (useState, useEffect, useContext)

**Baza podataka:**
- Microsoft SQL Server

**Dodatne tehnologije:**
- OpenXML SDK (generisanje DOCX dokumenata)
- OpenAI API (GPT modeli)

---

## 🔐 Bezbednost

- JWT autentifikacija
- Role-based autorizacija (User / Admin)
- ASP.NET Core Identity za upravljanje korisnicima
- Zaštićeni API endpointi

---

## ⚙️ Pokretanje aplikacije

### 🖥️ Backend
- cd AppAI
- dotnet build
- dotnet run --project AppAI.Api

### 🖥️ Frontend
- npm install
- npm run dev

---

## 📈 Buduća unapređenja
- Automatska konverzija DOCX → PDF
- Elektronsko potpisivanje dokumenata
- Višejezička podrška
- Naprednije AI funkcije za analizu teksta i predlog izmena
- Povezivanje sa pravnim registrima i javno dostupnim servisima
