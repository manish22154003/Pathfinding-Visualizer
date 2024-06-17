const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/instagram-clone', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema and model
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  profilePicture: String,
  bio: String,
});
const User = mongoose.model('User', UserSchema);

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email, password });
  await user.save();
  res.send({ message: 'User created successfully' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(400).send({ message: 'Invalid credentials' });
  const token = jwt.sign({ userId: user._id }, 'SECRET_KEY');
  res.send({ token });
});

app.listen(3000, () => console.log('Server started on port 3000'));
