// api/tests/team.test.js
import request from 'supertest';
import app from '../app.js';
import { sequelize } from '../models/index.js';

// Utilitaire : inscrit un user de test et retourne son cookie JWT
const getAuthCookie = async () => {
  // Tentative d'inscription (peut échouer si le user existe déjà en BDD de test — pas grave)
  await request(app)
    .post('/api/auth/signup')
    .send({
      username: 'testuser_jest',
      password: 'TestPassword1',
      confirm: 'TestPassword1'
    });

  // Connexion pour récupérer le cookie HttpOnly
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      username: 'testuser_jest',
      password: 'TestPassword1'
    });

  // set-cookie est un tableau, on le joint en string pour l'header Cookie
  const cookies = loginRes.headers['set-cookie'];
  if (!cookies) throw new Error('Aucun cookie reçu — vérifiez que la BDD est accessible et que JWT_SECRET est défini');
  return Array.isArray(cookies) ? cookies.join('; ') : cookies;
};

// ─── Suite de tests POST /team ────────────────────────────────────────
describe("POST /team — Création d'une équipe", () => {
  let authCookie;

  beforeAll(async () => {
    authCookie = await getAuthCookie();
  });

  it('T01 — Crée une équipe avec un token valide (nominal)', async () => {
    const res = await request(app)
      .post('/team')
      .set('Cookie', authCookie)
      .send({ name: 'Team Feu', description: 'Mon équipe principale' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Team Feu');
  });

  it('T02 — Retourne 401 sans token (non authentifié)', async () => {
    const res = await request(app)
      .post('/team')
      .send({ name: 'Team Eau' });

    expect(res.statusCode).toBe(401);
  });

  it('T03 — Retourne 401 avec un token forgé', async () => {
    const res = await request(app)
      .post('/team')
      .set('Cookie', 'token=tokencompletementfaux')
      .send({ name: 'Team Plante' });

    expect(res.statusCode).toBe(401);
  });

  it('T04 — Retourne 400 si le champ name est absent', async () => {
    const res = await request(app)
      .post('/team')
      .set('Cookie', authCookie)
      .send({ description: 'Sans nom' });

    expect(res.statusCode).toBe(400);
  });

  it('T05 — Retourne 400 si le champ name est vide', async () => {
    const res = await request(app)
      .post('/team')
      .set('Cookie', authCookie)
      .send({ name: '' });

    expect(res.statusCode).toBe(400);
  });

  it('T06 — Neutralise un payload XSS dans le champ name', async () => {
    const res = await request(app)
      .post('/team')
      .set('Cookie', authCookie)
      .send({ name: "<script>alert('xss')</script>" });

    const nameIsClean = !res.body?.name?.includes('<script>');
    expect(nameIsClean || res.statusCode === 400).toBe(true);
  });
});

// ─── Suite de tests GET /team/:id ─────────────────────────────────────
describe("GET /team/:id — Validation de l'ID", () => {

  it("T07 — Retourne 400 si l'ID n'est pas un entier", async () => {
    const res = await request(app).get('/team/abc');
    expect(res.statusCode).toBe(400);
  });

  it("T08 — Retourne 404 si l'équipe n'existe pas", async () => {
    const res = await request(app).get('/team/99999');
    expect(res.statusCode).toBe(404);
  });
});
afterAll(async () => {
  await sequelize.close();
});