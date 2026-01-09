import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Static method to create a user with hashed password
userSchema.statics.createUser = async function ({ username, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new this({ username, email, password: hashedPassword });
  return user.save(); // returns the saved user
};

// Instance method to compare password at login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
