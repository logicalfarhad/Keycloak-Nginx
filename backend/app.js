const express = require('express');
const Keycloak = require('keycloak-connect');

const app = express();
const port = 3000;

// Define the Keycloak configuration object
const keycloakConfig = {
  realm: 'bfs-realm',
  bearerOnly: true,
  'auth-server-url': 'http://keycloak:8080/auth',
  'ssl-required': 'external',
  resource: 'resource-server'
};
//keycloak.protect
const keycloak = new Keycloak({ scope: 'openid' }, keycloakConfig);

app.use(keycloak.middleware());

app.get('/public', (req, res) => {
  res.json({ message: 'public' });
});

app.get('/user', keycloak.protect('realm:user'), (req, res) => {
  console.log(req.headers.authorization);
  res.json({ message: 'secured' });
});

app.get('/admin', keycloak.protect('realm:admin'), (req, res) => {
  res.json({ message: 'admin' });
});

app.use('*', (req, res) => {
  console.log(req.headers.authorization)
  res.send('No route has been hurt!');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
