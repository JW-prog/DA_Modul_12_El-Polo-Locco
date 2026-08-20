# El Pollo Loco

Ein 2D-Jump'n'Run-Browserspiel, umgesetzt mit purem JavaScript und der Canvas-API. Steuere Pepe durch die Wüste, sammle Münzen und Salsa-Flaschen ein, besiege Hühner und stelle dich am Ende dem Endboss.

![El Pollo Loco Startbildschirm](img/9_intro_outro_screens/start/startscreen_1.png)

## Features

- Charakteranimationen für Laufen, Springen, Verletzt-Sein und Sterben
- Gegner-KI für normale und kleine Hühner sowie einen Endboss mit eigenen Angriffsphasen
- Sammelbare Münzen und Salsa-Flaschen mit Statusanzeigen
- Wurfmechanik für Salsa-Flaschen inklusive Kollisionsabfrage
- Vollbild-, Pause- und Neustart-Funktionen
- Touch-Steuerung sowie Tastatursteuerung
- Responsives Layout inklusive Hochformat-Hinweis für mobile Geräte
- Soundeffekte und Hintergrundmusik mit Stumm-/Lautschaltung

## Steuerung

| Taste                | Aktion              |
| --------------------- | ------------------- |
| `←` / `→`             | Pepe bewegen         |
| `Leertaste`           | Springen             |
| `D`                   | Flasche werfen       |

Auf Touch-Geräten stehen die entsprechenden Buttons am Bildschirmrand zur Verfügung.

## Projektstruktur

```
index.html          Spielseite mit Overlays und Steuerelementen
styles.css           Layout, responsives Design, Overlays
audio-controls.css   Styles für die Audio-Steuerung
classes/             Spielobjekte (Character, Gegner, Level, World, ...)
js/                   Spiellogik, Level-Aufbau, Audio-Manager
img/                  Sprites, Hintergründe und UI-Grafiken
audio/                Sound- und Musikdateien
```

## Lokal starten

Da das Spiel ausschließlich aus statischen Dateien besteht, reicht ein lokaler Webserver, z. B.:

```bash
npx serve .
```

Anschließend im Browser `http://localhost:3000` (oder den ausgegebenen Port) öffnen.

## Technologien

- HTML5 Canvas
- Vanilla JavaScript (ES6-Klassen)
- CSS3 (Flexbox, Media Queries)

## Kontakt

Jens Wagner
