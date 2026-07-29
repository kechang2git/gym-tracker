# Gym Tracker

Local-first web app for tracking four reusable workout templates:

- Machine Full Body A
- Machine Full Body B
- Dumbbell Full Body A
- Dumbbell Full Body B

## Run Locally

Open `index.html` directly in a browser, or serve the folder with any static
server.

## Data Storage

Workout data is stored in the browser with `localStorage`.

Use **Backup** in the app to:

- Export a JSON backup
- Save to a selected folder when the browser supports folder access
- Import a JSON backup

On most phones, folder-level save access is limited by the browser. The reliable
mobile flow is to export a JSON file to Downloads/iCloud/Files and import that
file later.

## GitHub Pages

This app is static HTML/CSS/JS, so it can be hosted with GitHub Pages without a
backend.
