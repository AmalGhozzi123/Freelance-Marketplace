import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Admin from './models/admin.model.js';

mongoose.connect('mongodb://localhost:27017/freelancy', { useNewUrlParser: true, useUnifiedTopology: true });

const plainPassword = 'malekamal';
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
  if (err) {
    console.error('Error hashing password:', err);
    mongoose.connection.close();
  } else {
    const adminUser = new Admin({
      email: 'malekamal@gmail.com',
      password: hashedPassword,
    });

    adminUser.save().then(() => {
      console.log('Admin user created');
      mongoose.connection.close();
    }).catch((saveError) => {
      console.error('Error saving admin user:', saveError);
      mongoose.connection.close();
    });
  }
});
