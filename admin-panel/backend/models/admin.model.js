// admin.model.js

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hash du mot de passe avant de sauvegarder dans la base de données
adminSchema.pre('save', function (next) {
  const admin = this;
  if (!admin.isModified('password')) return next();

  const salt = bcrypt.genSaltSync(10);
  admin.password = bcrypt.hashSync(admin.password, salt);
  next();
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
