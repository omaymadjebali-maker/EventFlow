# EVENTFLOW (Full Stack) — Vue 3 + Pinia + Express + Mongo + JWT + RBAC + Docker

## Run
```bash
docker-compose up --build
```

- Front: http://localhost:5173
- API health: http://localhost:5000/health

## Quick test flow
1) Register an ORGANIZER
2) Login, copy the token
3) Create an event (Create page is protected)
4) Register a PARTICIPANT and login
5) Click "S'inscrire" in dashboard

## Notes
- RBAC is enforced in the API (middleware).
- Organizer can only update/delete **their own** events (admin can do everything).
