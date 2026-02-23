import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

// USER MODEL
const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  nickname: { type: DataTypes.STRING, unique: true, allowNull: false },
  age: { type: DataTypes.INTEGER },
  gender: { type: DataTypes.ENUM('male', 'female', 'other'), allowNull: false },
  role: { type: DataTypes.ENUM('top', 'bottom', 'versatile'), allowNull: false },
  city: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  photo_url: { type: DataTypes.STRING },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_banned: { type: DataTypes.BOOLEAN, defaultValue: false },
  last_login: { type: DataTypes.DATE },
  private_mode: { type: DataTypes.BOOLEAN, defaultValue: false },
  show_distance_only: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { hooks: {
  beforeCreate: async (user) => { user.password = await bcrypt.hash(user.password, 10); },
  beforeUpdate: async (user) => { if (user.changed('password')) user.password = await bcrypt.hash(user.password, 10); }
}});

// LOCATION MODEL
const Location = sequelize.define('Location', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  type: { type: DataTypes.ENUM('park', 'sauna', 'mall', 'restroom', 'beach', 'bar', 'club', 'other'), allowNull: false },
  latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: false },
  longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  neighborhood: { type: DataTypes.STRING },
  directions: { type: DataTypes.TEXT },
  best_hours: { type: DataTypes.STRING },
  lighting: { type: DataTypes.ENUM('well_lit', 'dim', 'dark'), defaultValue: 'well_lit' },
  is_hidden: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_dangerous: { type: DataTypes.BOOLEAN, defaultValue: false },
  rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  total_checkins: { type: DataTypes.INTEGER, defaultValue: 0 },
  active_now: { type: DataTypes.INTEGER, defaultValue: 0 },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// CHECK-IN MODEL
const CheckIn = sequelize.define('CheckIn', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  location_id: { type: DataTypes.UUID, allowNull: false },
  anonymous: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// COMMENT MODEL
const Comment = sequelize.define('Comment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  location_id: { type: DataTypes.UUID, allowNull: false },
  text: { type: DataTypes.TEXT, allowNull: false },
  rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  is_moderated: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// ALERT MODEL
const Alert = sequelize.define('Alert', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  location_id: { type: DataTypes.UUID, allowNull: false },
  alert_type: { type: DataTypes.ENUM('police', 'robbery', 'homophobia', 'construction', 'other'), allowNull: false },
  description: { type: DataTypes.TEXT },
  expires_at: { type: DataTypes.DATE },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// MESSAGE MODEL
const Message = sequelize.define('Message', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  from_user_id: { type: DataTypes.UUID, allowNull: false },
  to_user_id: { type: DataTypes.UUID, allowNull: false },
  text: { type: DataTypes.TEXT, allowNull: false },
  read: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// RELATIONSHIPS
User.hasMany(CheckIn, { foreignKey: 'user_id', onDelete: 'CASCADE' });
CheckIn.belongsTo(User, { foreignKey: 'user_id' });

Location.hasMany(CheckIn, { foreignKey: 'location_id', onDelete: 'CASCADE' });
CheckIn.belongsTo(Location, { foreignKey: 'location_id' });

User.hasMany(Comment, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

Location.hasMany(Comment, { foreignKey: 'location_id', onDelete: 'CASCADE' });
Comment.belongsTo(Location, { foreignKey: 'location_id' });

Location.hasMany(Alert, { foreignKey: 'location_id', onDelete: 'CASCADE' });
Alert.belongsTo(Location, { foreignKey: 'location_id' });

User.hasMany(Alert, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Alert.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Message, { as: 'sent_messages', foreignKey: 'from_user_id', onDelete: 'CASCADE' });
User.hasMany(Message, { as: 'received_messages', foreignKey: 'to_user_id', onDelete: 'CASCADE' });

export { User, Location, CheckIn, Comment, Alert, Message };
export default sequelize;
