const express = require('express');
const sequelize = require('./database');
const User = require('./models/User');

const app = express();
app.use(express.json());

// Connexion DB
sequelize.authenticate()
  .then(() => console.log('Connexion SQLite OK'))
  .catch(err => console.error(err));

// GET - tous les utilisateurs
app.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// GET - un utilisateur
app.get('/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
  res.json(user);
});

// POST - créer
app.post('/users', async (req, res) => {
  const user = await User.create({ name: req.body.name });
  res.status(201).json(user);
});

// PUT - modifier
app.put('/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

  user.name = req.body.name;
  await user.save();
  res.json(user);
});

// DELETE - supprimer
app.delete('/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

  await user.destroy();
  res.status(204).send();
});

app.listen(3000, () => {
  console.log('API Sequelize + SQLite lancée sur http://localhost:3000');
});
