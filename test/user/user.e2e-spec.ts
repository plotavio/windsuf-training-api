import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import { createTestUser } from '../factories/user.factory';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authToken: string;
  let testUserCounter = 0;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    // Clear database before each test
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    await dataSource.query('TRUNCATE TABLE users');
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');

    // Create an admin user and get auth token
    const adminUser = createTestUser(++testUserCounter);
    await request(app.getHttpServer())
      .post('/users')
      .send(adminUser)
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: adminUser.email,
        password: adminUser.password,
      })
      .expect(201);

    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      // Create 9 more test users (1 admin user already exists)
      for (let i = 0; i < 9; i++) {
        const userData = createTestUser(++testUserCounter);
        await request(app.getHttpServer())
          .post('/users')
          .send(userData)
          .expect(201);
      }

      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(10);
      expect(response.body[0].password).toBeUndefined();
    });
  });

  describe('GET /users/:id', () => {
    it('should return a single user', async () => {
      const userData = createTestUser(++testUserCounter);
      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      const userId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.password).toBeUndefined();
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .get('/users/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const userData = createTestUser(++testUserCounter);
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      expect(response.body.email).toBe(userData.email);
      expect(response.body.password).toBeUndefined();
    });
  });

  describe('Data Validation', () => {
    it('should validate email format', async () => {
      const userData = createTestUser(++testUserCounter);
      userData.email = 'invalid-email';

      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(400);
    });

    it('should prevent duplicate emails', async () => {
      const userData = createTestUser(++testUserCounter);
      
      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(409);
    });

    it('should prevent duplicate citizen IDs', async () => {
      const userData1 = createTestUser(++testUserCounter);
      const userData2 = createTestUser(++testUserCounter);
      userData2.citizenId = userData1.citizenId;

      await request(app.getHttpServer())
        .post('/users')
        .send(userData1)
        .expect(201);

      await request(app.getHttpServer())
        .post('/users')
        .send(userData2)
        .expect(409);
    });
  });

  describe('DELETE and Restore User', () => {
    it('should soft delete and restore a user', async () => {
      // Create a user to delete
      const userData = createTestUser(++testUserCounter);
      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      const userId = createResponse.body.id;

      // Soft delete the user
      await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify user is in deleted list
      const deletedResponse = await request(app.getHttpServer())
        .get('/users/deleted')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(deletedResponse.body.find(u => u.id === userId)).toBeDefined();
      expect(deletedResponse.body.find(u => u.id === userId).deletedAt).toBeDefined();

      // Restore the user
      await request(app.getHttpServer())
        .post(`/users/${userId}/restore`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify user is back in main list
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.deletedAt).toBeNull();
    });

    it('should return 404 when restoring non-existent user', async () => {
      await request(app.getHttpServer())
        .post('/users/999999/restore')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe('User with ID 999999 not found or already restored');
        });
    });
  });
});
