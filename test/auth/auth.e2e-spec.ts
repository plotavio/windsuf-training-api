import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import { createTestUser } from '../factories/user.factory';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    it('should authenticate user and return JWT token', async () => {
      // Create a test user
      const userData = createTestUser(1);
      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      // Attempt login
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(201);

      expect(response.body.access_token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.password).toBeUndefined();
    });

    it('should fail with invalid credentials', async () => {
      // Create a test user
      const userData = createTestUser(2);
      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      // Attempt login with wrong password
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userData.email,
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should protect routes with JWT guard', async () => {
      // Try to access protected route without token
      await request(app.getHttpServer())
        .get('/users')
        .expect(401);

      // Create a test user and get token
      const userData = createTestUser(3);
      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(201);

      const token = loginResponse.body.access_token;

      // Access protected route with token
      await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should validate login dto', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: '123', // too short
        })
        .expect(400);
    });
  });
});
