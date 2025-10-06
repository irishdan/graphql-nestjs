import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '~/app.module';

describe('GraphQl', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('Graphql endpoint is setup', async () => {
    const response = await request(app.getHttpServer()).post('/graphql').set('Accept', 'application/json');

    expect(response.status).toBe(400);
  });
});
