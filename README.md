## Description

Introducing the "APITREE - HEROES" application – a nifty platform designed to unleash your inner superhero creator! This splendid app empowers you to craft your very own superhero persona, complete with a dazzling array of cool superpowers and, of course, a formidable arch enemy.

Underneath its digital hood, the APITREE - HEROES app is ingeniously crafted using the Nest.js framework, a web framework that's as robust as a superhero's shield. Harnessing the power of GraphQL, the app seamlessly communicates and exchanges data, ensuring a super-responsive and efficient user experience.

Bolstering its technological prowess, APITREE - HEROES has its data superheroically stored in a PostgreSQL database, managed with the Prisma ORM (Object-Relational Mapping). This dynamic duo ensures that your superhero creations, superpowers, and arch enemies are securely stored and easily accessible whenever your heroic heart desires.

So, whether you're envisioning an unstoppable force of good or a mischievous anti-hero, APITREE - HEROES is your digital canvas to let your superhero imagination soar to new heights! 🦸‍♂️💥🚀

## Installation
If you're not on the Docker hype train, buckle up and get ready for some npm magic:
```bash
$ npm install
```

## Running the app
For the fearless souls venturing into the tech wild without Docker, here's your quest:

First, summon the mighty PostgreSQL database to your realm, and forge a connection string of power. Open your .env file and inscribe the incantation like so:

```DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?schema=public"```

Next, gear up for the adventure:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

But hey, if Docker is your co-pilot, just hit the launch button:

```bash
$ docker compose up
```

## Test

I've thrown in a stellar collection of end-to-end tests – a galactic spectacle covering every nook and cranny of GraphQL. We're talking queries, mutations, ensuring all routes are guarded against those non-logged-in invaders, and of course, making sure input validation is as tight as a superhero's spandex suit:

```bash
# e2e tests
$ npm run test:e2e
```

So, whether you're setting sail on the npm seas or taking flight with Docker, the APITREE - HEROES app is ready to rock your world! 🚀🌐🦸‍♀️
