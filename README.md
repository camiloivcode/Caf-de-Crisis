# Café de Crisis: La Guerra del Dólar

Simulador multijugador de cobertura cambiaria (Finanzas Corporativas). 3 equipos, 10 rondas, estilo Kahoot.

- Docente: crea la partida con el PIN del docente (`HOST_PIN` en `api/game.js`).
- Equipos: entran con el PIN de 4 letras que muestra la pantalla del docente.

## Local
    npm run dev    # http://localhost:3000 (estado en memoria)
    npm test

## Vercel
Importar el repo y conectar **Upstash Redis** (Storage > Marketplace) para compartir el estado entre dispositivos; luego redeploy. Opcional: `ROUND_MS` (duración de la ronda, 90000 por defecto).
