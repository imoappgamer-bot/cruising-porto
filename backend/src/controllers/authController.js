import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// Register new user
export const register = async (req, res) => {
  try {
    const { email, password, nickname, age, gender, role, city } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const existingNickname = await User.findOne({ where: { nickname } });
    if (existingNickname) {
      return res.status(400).json({ error: 'Nickname already taken' });
    }

    // Create user (password auto-hashed by model hook)
    const user = await User.create({
      email,
      password,
      nickname,
      age,
      gender,
      role,
      city,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: process.env.JWT_EXPIRATION || '7d' }
    );

    // Return user without password
    const userResponse = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      age: user.age,
      gender: user.gender,
      role: user.role,
      city: user.city,
    };

    res.status(201).json({ token, user: userResponse });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await user.update({ last_login: new Date() });

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: process.env.JWT_EXPIRATION || '7d' }
    );

    const userResponse = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      age: user.age,
      gender: user.gender,
      role: user.role,
      city: user.city,
    };

    res.json({ token, user: userResponse });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};
