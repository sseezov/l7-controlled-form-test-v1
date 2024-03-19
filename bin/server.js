// @ts-check
import fastify from 'fastify';

const server = () => {
  const app = fastify();

  app.post('/users', (_req, reply) => {
    reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(JSON.stringify({ message: 'user has been created sucessfully' }));
  });

  return app;
};

const port = 3000;

server().listen(port);
