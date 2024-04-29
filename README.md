This is a backend project built with Express and TypeScript. It provides an API for creating and retrieving content records, generating summaries, insights, and quotes using OpenAI's GPT-4-Turbo model.

## Prerequisites

-   Node.js (v18 or higher)
-   Yarn package manager
-   Docker and Docker Compose

## Getting Started

1. Install dependencies:

```bash
yarn
```

2. Build Docker images:

```bash
yarn docker:build
```

3. Start the database and other services using Docker Compose:

```bash
yarn docker:up
```

4. Set up environment variables:

-   Create a `.env` file in the root directory.
-   Copy the contents of `.env.example` into the `.env` file.
-   Fill in the required values for the environment variables.

5. Start the development server:

```bash
yarn dev
```

The server will be running at `http://localhost:3111`.

## API Endpoints

-   `POST /content`: Create a new content record.
-   `GET /content/:id`: Retrieve a content record by ID.

## Testing

To run the tests, use the following command:

```bash
yarn test
```

This will run the unit tests and integration tests using Jest.

## Logging

The project uses Winston for logging. Logs are written to the console and stored in the `combined.log` and `error.log` files.

## Rate Limiting

The API endpoints are protected by rate limiting middleware. Each IP is limited to 100 requests per 1-minute window.

## OpenAI Integration

The project uses OpenAI's GPT-4-Turbo model to generate summaries, insights, and quotes for the content records. The OpenAI API key needs to be provided in the `.env` file.

## Database

The project uses PostgreSQL as the database and Prisma as the ORM. The database schema is defined in `prisma/schema.prisma`.

## Acknowledgements

-   [Express](https://expressjs.com/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Prisma](https://www.prisma.io/)
-   [OpenAI](https://www.openai.com/)
-   [Winston](https://github.com/winstonjs/winston)
-   [Jest](https://jestjs.io/)
-   [Supertest](https://github.com/visionmedia/supertest)
