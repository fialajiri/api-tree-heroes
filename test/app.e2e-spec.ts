import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prismaService = app.get<PrismaService>(PrismaService);
  });

  describe('user signup and login test', () => {
    beforeEach(async () => {
      await prismaService.clearUsersFromDb();
    });
    it('should sign up user with correct credentials', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query:
            'mutation {signup(signUpInput: {email: "test@test.com", password: "123456"}){id, email, password }}',
        })
        .expect(200);

      expect(body.data.signup.id).toBeDefined();
      expect(body.data.signup.email).toEqual('test@test.com');
    });

    it('should throw an error with incorrect email input', async () => {
      const res = await request(app.getHttpServer()).post('/graphql').send({
        query:
          'mutation {signup(signUpInput: {email: "thisEmailIsInvalid", password: "123456"}){id, email, password }}',
      });

      expect(res.body.errors[0].extensions.originalError.statusCode).toBe(400);
    });

    it('should throw an error with password length less then 6 characters', async () => {
      const res = await request(app.getHttpServer()).post('/graphql').send({
        query:
          'mutation {signup(signUpInput: {email: "thisEmailIsInvalid", password: "123"}){id, email, password }}',
      });
      expect(res.body.errors[0].extensions.originalError.statusCode).toBe(400);
    });

    it('should sign up the user and set the cookie', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query:
            'mutation {signup(signUpInput: {email: "test@test.com", password: "123456"}){id, email, password }}',
        })
        .expect(200);
      const cookie = res.get('Set-Cookie');

      expect(cookie[0]).toBeDefined();
    });

    it('should log in a signup user', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query:
            'mutation {signup(signUpInput: {email: "test@test.com", password: "123456"}){id, email, password }}',
        })
        .expect(200);

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query:
            'mutation {login(loginInput: {email: "test@test.com", password: "123456"}){id, email, password }}',
        })
        .expect(200);

      expect(res.body.data.login.id).toBeDefined();
      expect(res.body.data.login.email).toEqual('test@test.com');
      const cookie = res.get('Set-Cookie');

      expect(cookie[0]).toBeDefined();
    });
  });

  describe('hero CRUD operations', () => {
    beforeEach(async () => {
      await prismaService.clearHeroesFromDb();
    });
    let cookie: string[];
    beforeAll(async () => {
      console.log('before2');
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query:
            'mutation {signup(signUpInput: {email: "test2@test.com", password: "123456"}){id, email, password }}',
        })
        .expect(200);
      cookie = res.get('Set-Cookie');
    });

    it('should return Unauthorized for createHero mutation without valid cookie', async () => {
      const name = 'Spiderman';
      const age = 21;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {createHero(createHeroInput: {name: "${name}", age: ${age}}){id, name, age }}`,
        });

      expect(body.errors[0].message).toEqual('Unauthorized');
    });

    it('should create a hero', async () => {
      const name = 'Spiderman';
      const age = 21;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createHero(createHeroInput: {name: "${name}", age: ${age}}){id, name, age }}`,
        })
        .expect(200);

      expect(body.data.createHero.id).toBeDefined();
      expect(body.data.createHero.name).toEqual(name);
      expect(body.data.createHero.age).toEqual(age);
    });

    it('should return Unauthorized for updateHero mutation without valid cookie', async () => {
      const name = 'Spiderman';
      const age = 21;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createHero(createHeroInput: {name: "${name}", age: ${age}}){id, name, age }}`,
        })
        .expect(200);

      const newAge = 22;
      const { body: bodySecond } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {updateHero(updateHeroInput: {id: ${body.data.createHero.id}, name: "${name}", age: ${newAge}}){id, name, age }}`,
        })
        .expect(200);

      expect(bodySecond.errors[0].message).toEqual('Unauthorized');
    });

    it('should change hero name', async () => {
      const name = 'Spiderman';
      const age = 21;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createHero(createHeroInput: {name: "${name}", age: ${age}}){id, name, age }}`,
        })
        .expect(200);

      const newAge = 22;
      const { body: bodySecond } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {updateHero(updateHeroInput: {id: ${body.data.createHero.id}, name: "${name}", age: ${newAge}}){id, name, age }}`,
        })
        .expect(200);

      expect(bodySecond.data.updateHero.age).toEqual(newAge);
    });

    it('should return Unauthorized for hero query without valid cookie', async () => {
      const name = 'Spiderman';
      const age = 21;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createHero(createHeroInput: {name: "${name}", age: ${age}}){id, name, age }}`,
        })
        .expect(200);

      const id = body.data.createHero.id;

      const { body: bodySecond } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `{hero(id: ${id}) {id, name, age, archEnemy {name}, superpowers {name, id} }}`,
        })
        .expect(200);

      expect(bodySecond.errors[0].message).toEqual('Unauthorized');
    });

    it('should get a hero by id', async () => {
      const name = 'Spiderman';
      const age = 21;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createHero(createHeroInput: {name: "${name}", age: ${age}}){id, name, age }}`,
        })
        .expect(200);

      const id = body.data.createHero.id;

      const { body: bodySecond } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `{hero(id: ${id}) {id, name, age, archEnemy {name}, superpowers {name, id} }}`,
        })
        .expect(200);

      expect(bodySecond.data.hero.name).toEqual(name);
    });

    it('should return Unauthorized for heroes query without valid cookie', async () => {
      const nameFirst = 'Captain America';
      const ageFirst = '75';
      const nameSecond = 'Thor';
      const ageSecond = '1500';

      await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createHero(createHeroInput: {name: "${nameFirst}", age: ${ageFirst}}){id, name, age }}`,
        })
        .expect(200);

      await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createHero(createHeroInput: {name: "${nameSecond}", age: ${ageSecond}}){id, name, age }}`,
        })
        .expect(200);

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `{heroes{id, name, age, superpowers {name id} }}`,
        })
        .expect(200);

      expect(body.errors[0].message).toEqual('Unauthorized');
    });

    it('should get all heroes from db', async () => {
      const nameFirst = 'Captain America';
      const ageFirst = '75';
      const nameSecond = 'Thor';
      const ageSecond = '1500';
      const numberOfHeroes = 2;

      await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createHero(createHeroInput: {name: "${nameFirst}", age: ${ageFirst}}){id, name, age }}`,
        })
        .expect(200);

      await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createHero(createHeroInput: {name: "${nameSecond}", age: ${ageSecond}}){id, name, age }}`,
        })
        .expect(200);

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `{heroes{id, name, age, superpowers {name id} }}`,
        })
        .expect(200);

      expect(body.data.heroes.length).toBe(numberOfHeroes);
    });

    it('should return Unauthorized for removeHero mutation without valid cookie', async () => {
      const name = 'Wonder Woman';
      const age = 3001;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createHero(createHeroInput: {name: "${name}", age: ${age}}){id, name, age }}`,
        })
        .expect(200);

      const id = body.data.createHero.id;

      const { body: bodySecond } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {removeHero(id: ${id}){id}}`,
        });

      expect(bodySecond.errors[0].message).toEqual('Unauthorized');
    });

    it('should delete a hero', async () => {
      const name = 'Wonder Woman';
      const age = 3001;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createHero(createHeroInput: {name: "${name}", age: ${age}}){id, name, age }}`,
        })
        .expect(200);

      const id = body.data.createHero.id;

      await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {removeHero(id: ${id}){id}}`,
        })
        .expect(200);

      const { body: bodySecond } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `{hero(id: ${id}) {id, name, age, archEnemy {name}, superpowers {name, id} }}`,
        })
        .expect(200);

      expect(bodySecond.data.hero).toEqual(null);
    });
  });
  describe('Superpower CRUD operations', () => {
    beforeEach(async () => {
      await prismaService.clearHeroesFromDb();
    });
    let cookie: string[];
    beforeAll(async () => {
      console.log('before2');
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query:
            'mutation {signup(signUpInput: {email: "test3@test.com", password: "123456"}){id, email, password }}',
        })
        .expect(200);
      cookie = res.get('Set-Cookie');
    });
    it('should create a superpower and assign it to a hero', async () => {
      const heroName = 'The Flash';
      const heroAge = 28;
      const superpowerOne = 'Superhuman speed';
      const superpowerTwo = 'Time manipulation';
      const numberOfSuperpowers = 2;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createHero(createHeroInput: {name: "${heroName}", age: ${heroAge}}){id, name, age }}`,
        })
        .expect(200);

      const heroId = body.data.createHero.id;

      await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createSuperpower(createSuperpowerInput: {name: "${superpowerOne}", heroId: ${heroId}}){id, name, heroId}}`,
        })
        .expect(200);

      await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createSuperpower(createSuperpowerInput: {name: "${superpowerTwo}", heroId: ${heroId}}){id, name, heroId}}`,
        })
        .expect(200);

      const { body: bodySecond } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `{hero(id: ${heroId}) {id, name, age, archEnemy {name}, superpowers {name, id} }}`,
        })
        .expect(200);

      expect(bodySecond.data.hero.name).toEqual(heroName);
      expect(bodySecond.data.hero.superpowers.length).toEqual(
        numberOfSuperpowers,
      );
    });
    it('should modify a superpower name', async () => {
      const heroName = 'Harley Quinn';
      const heroAge = 27;
      const superpowerOne = 'Skilled gymnast';
      const superpowerTwo = 'Extreme crazyness';

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createHero(createHeroInput: {name: "${heroName}", age: ${heroAge}}){id, name, age }}`,
        })
        .expect(200);

      const heroId = body.data.createHero.id;

      const { body: bodySecond } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createSuperpower(createSuperpowerInput: {name: "${superpowerOne}", heroId: ${heroId}}){id, name, heroId}}`,
        })
        .expect(200);

      const superpowerId = bodySecond.data.createSuperpower.id;

      await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {updateSuperpower(updateSuperpowerInput: {name: "${superpowerTwo}", id: ${superpowerId}}){id, name, heroId}}`,
        })
        .expect(200);

      const { body: bodyThird } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `{hero(id: ${heroId}) {id, name, age, archEnemy {name}, superpowers {name, id} }}`,
        })
        .expect(200);

      expect(bodyThird.data.hero.name).toEqual(heroName);
      expect(bodyThird.data.hero.superpowers[0].name).toEqual(superpowerTwo);
    });

    it('should get superpower by id', async () => {
      const heroName = 'Black Panther';
      const heroAge = 35;
      const superpowerOne = 'Enhanced strength,';

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createHero(createHeroInput: {name: "${heroName}", age: ${heroAge}}){id, name, age }}`,
        })
        .expect(200);

      const heroId = body.data.createHero.id;

      const { body: bodySecond } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createSuperpower(createSuperpowerInput: {name: "${superpowerOne}", heroId: ${heroId}}){id, name, heroId}}`,
        })
        .expect(200);

      const superpowerId = bodySecond.data.createSuperpower.id;

      const { body: bodyThird } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `{superpower(id: ${superpowerId}){id, name, heroId}}`,
        })
        .expect(200);

      expect(bodyThird.data.superpower.name).toEqual(superpowerOne);
      expect(bodyThird.data.superpower.id).toEqual(superpowerId);
      expect(bodyThird.data.superpower.heroId).toEqual(heroId);
    });

    it('should get all hero superpowers', async () => {
      const heroName = 'Doctor Strange';
      const heroAge = 42;
      const superpowerOne = 'Mastery of the mystic arts';
      const superpowerTwo = 'Reality manipulation';
      const numberOfSuperpowers = 2;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createHero(createHeroInput: {name: "${heroName}", age: ${heroAge}}){id, name, age }}`,
        })
        .expect(200);

      const heroId = body.data.createHero.id;

      await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createSuperpower(createSuperpowerInput: {name: "${superpowerOne}", heroId: ${heroId}}){id, name, heroId}}`,
        })
        .expect(200);

      await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createSuperpower(createSuperpowerInput: {name: "${superpowerTwo}", heroId: ${heroId}}){id, name, heroId}}`,
        })
        .expect(200);

      const { body: bodySecond } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `{superpowers(heroId: ${heroId}){id, name, heroId}}`,
        })
        .expect(200);

      expect(bodySecond.data.superpowers.length).toEqual(numberOfSuperpowers);
    });

    it('should remove a superpower from hero', async () => {
      const heroName = 'Hulk';
      const heroAge = 38;
      const superpowerOne = 'Superhuman strength';
      const numberOfSuperpowers = 0;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createHero(createHeroInput: {name: "${heroName}", age: ${heroAge}}){id, name, age }}`,
        })
        .expect(200);

      const heroId = body.data.createHero.id;

      const { body: bodySecond } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createSuperpower(createSuperpowerInput: {name: "${superpowerOne}", heroId: ${heroId}}){id, name, heroId}}`,
        })
        .expect(200);

      const superpowerId = bodySecond.data.createSuperpower.id;
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {removeSuperpower(id: ${superpowerId}){id}}`,
        })
        .expect(200);

      const { body: bodyThird } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `{superpowers(heroId: ${heroId}){id, name, heroId}}`,
        })
        .expect(200);

      expect(bodyThird.data.superpowers.length).toEqual(numberOfSuperpowers);
    });
  });

  describe('Villan CRUD operations', () => {
    beforeEach(async () => {
      await prismaService.clearHeroesFromDb();
    });
    let cookie: string[];
    beforeAll(async () => {
      console.log('before2');
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query:
            'mutation {signup(signUpInput: {email: "test4@test.com", password: "123456"}){id, email, password }}',
        })
        .expect(200);
      cookie = res.get('Set-Cookie');
    });

    it('should create a villan and assign him to a hero as his arch enemy', async () => {
      const heroName = 'Black Widow';
      const heroAge = 38;
      const archEnemy = 'Taskmaster';

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createHero(createHeroInput: {name: "${heroName}", age: ${heroAge}}){id, name, age }}`,
        })
        .expect(200);

      const heroId = body.data.createHero.id;

      await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createVillan(createVillanInput: {name: "${archEnemy}", heroId: ${heroId}}){id, name }}`,
        })
        .expect(200);

      const { body: bodySecond } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `{hero(id: ${heroId}) {id, name, age, archEnemy {name}, superpowers {name, id} }}`,
        })
        .expect(200);

      expect(bodySecond.data.hero.name).toEqual(heroName);
      expect(bodySecond.data.hero.archEnemy.name).toEqual(archEnemy);
    });

    it('should modify villans name', async () => {
      const heroName = 'Iron Man';
      const heroAge = 52;
      const archEnemy = 'The Mandarin';
      const archEnemyTwo = 'Thanos';

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createHero(createHeroInput: {name: "${heroName}", age: ${heroAge}}){id, name, age }}`,
        })
        .expect(200);

      const heroId = body.data.createHero.id;

      const { body: bodySecond } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createVillan(createVillanInput: {name: "${archEnemy}", heroId: ${heroId}}){id, name }}`,
        })
        .expect(200);

      const villanId = bodySecond.data.createVillan.id;

      await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {updateVillan(updateVillanInput: {name: "${archEnemyTwo}", id: ${villanId}}){id, name }}`,
        })
        .expect(200);

      const { body: bodyThird } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `{hero(id: ${heroId}) {id, name, age, archEnemy {name}, superpowers {name, id} }}`,
        })
        .expect(200);

      expect(bodyThird.data.hero.name).toEqual(heroName);
      expect(bodyThird.data.hero.archEnemy.name).toEqual(archEnemyTwo);
    });

    it('should find all villans', async () => {
      const heroName = 'Batman';
      const heroAge = 45;
      const archEnemy = 'The Joker';
      const numberOfVillans = 1;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createHero(createHeroInput: {name: "${heroName}", age: ${heroAge}}){id, name, age }}`,
        })
        .expect(200);

      const heroId = body.data.createHero.id;

      await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createVillan(createVillanInput: {name: "${archEnemy}", heroId: ${heroId}}){id, name }}`,
        })
        .expect(200);

      const { body: bodySecond } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `{villans{id, name, heroId }}`,
        })
        .expect(200);

      expect(bodySecond.data.villans.length).toEqual(numberOfVillans);
    });

    it('should delete a villan', async () => {
      const heroName = 'Spider-Man';
      const heroAge = 25;
      const archEnemy = 'Green Goblin';
      const numberOfVillans = 0;

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createHero(createHeroInput: {name: "${heroName}", age: ${heroAge}}){id, name, age }}`,
        })
        .expect(200);

      const heroId = body.data.createHero.id;

      const { body: bodySecond } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {createVillan(createVillanInput: {name: "${archEnemy}", heroId: ${heroId}}){id, name }}`,
        })
        .expect(200);

      const villanId = bodySecond.data.createVillan.id;

      await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `mutation {removeVillan(id: ${villanId}){id, name, heroId }}`,
        })
        .expect(200);

      const { body: bodyThird } = await request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', cookie)
        .send({
          query: `{villans{id, name, heroId }}`,
        })
        .expect(200);

      expect(bodyThird.data.villans.length).toEqual(numberOfVillans);
    });
  });
});
