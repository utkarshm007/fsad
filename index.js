const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const hashPassword = require('./middlewares/hashPassword');
const authorizeRole = require('./middlewares/authorizeRoles');
const app = express();
const PORT = 3000;
const secretKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxNjI5NjQ3MywiZXhwIjoxNzE2MzAwMDczfQ.gFhBWeepQNzydkFtctIcqi2NzG9aoYUsD9iEOFf4m8Q';
app.use(bodyParser.json());
// const users = [
//   { id: 1, username: 'user1', password: 'password1' },
//   { id: 2, username: 'user2', password: 'password2' }
// ];

const users = [
  { id: 1, username: 'user1', password: 'password1', role: "Admin" },
  { id: 2, username: 'user2', password: 'password2', role: "User" },
  { id: 3, username: 'user3', password: 'password3', role: "User" }
];

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
  
  res.json({ token });
});

// Dummy protected route
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});

app.post('/registration', hashPassword, (req, res) => {
  const {name,username,password} = req.body;
  const user = users.find(u => u.username === username);
  
  if (user) {
    return res.status(401).json({ message: 'Choose another username' });
  }
  console.log(req.body.hashedpassword);
  users.push({id:3,username: username,password: password,hashedpassword:req.body.hashedpassword});
  console.log(users);
  res.json(req.body);
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = users[0];
    next();
  });
}

app.get('/admin', authorizeRole('admin'), (req, res) => {
  res.json({ message: 'Welcome to the admin route' });
});

app.get('/user', (req, res) => {
  res.json({ message: `Welcome User` });
});




// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

