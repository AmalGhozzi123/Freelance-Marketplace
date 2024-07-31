// authRoutes.js

import express from 'express';
import bcrypt from 'bcrypt';
import Admin from '../models/admin.model.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Vérification des informations d'authentification dans la base de données
  const admin = await Admin.findOne({ email });

  if (admin && bcrypt.compareSync(password, admin.password)) {
    // L'authentification réussie, enregistrez les informations de l'administrateur dans la session
    req.session.adminId = admin._id;
    res.send('Admin login successful');
  } else {
    res.status(401).send('Invalid email or password');
  }
});

export default router;
