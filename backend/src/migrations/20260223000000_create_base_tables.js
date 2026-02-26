/**
 * Migration base: criação das tabelas principais.
 * Executa apenas se as tabelas ainda não existirem.
 */
export async function up(queryInterface, Sequelize) {
  // USERS
  await queryInterface.createTable('Users', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    email: { type: Sequelize.STRING, unique: true, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    nickname: { type: Sequelize.STRING, unique: true, allowNull: false },
    age: { type: Sequelize.INTEGER },
    gender: { type: Sequelize.ENUM('male', 'female', 'other'), allowNull: false },
    role: { type: Sequelize.ENUM('top', 'bottom', 'versatile'), allowNull: false },
    city: { type: Sequelize.STRING },
    description: { type: Sequelize.TEXT },
    photo_url: { type: Sequelize.STRING },
    is_verified: { type: Sequelize.BOOLEAN, defaultValue: false },
    is_banned: { type: Sequelize.BOOLEAN, defaultValue: false },
    last_login: { type: Sequelize.DATE },
    private_mode: { type: Sequelize.BOOLEAN, defaultValue: false },
    show_distance_only: { type: Sequelize.BOOLEAN, defaultValue: true },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });

  // LOCATIONS
  await queryInterface.createTable('Locations', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.TEXT },
    type: { type: Sequelize.ENUM('park', 'sauna', 'mall', 'restroom', 'beach', 'bar', 'club', 'other'), allowNull: false },
    latitude: { type: Sequelize.DECIMAL(10, 8), allowNull: false },
    longitude: { type: Sequelize.DECIMAL(11, 8), allowNull: false },
    city: { type: Sequelize.STRING, allowNull: false },
    neighborhood: { type: Sequelize.STRING },
    directions: { type: Sequelize.TEXT },
    best_hours: { type: Sequelize.STRING },
    lighting: { type: Sequelize.ENUM('well_lit', 'dim', 'dark'), defaultValue: 'well_lit' },
    is_hidden: { type: Sequelize.BOOLEAN, defaultValue: false },
    is_dangerous: { type: Sequelize.BOOLEAN, defaultValue: false },
    rating: { type: Sequelize.DECIMAL(3, 2), defaultValue: 0 },
    total_checkins: { type: Sequelize.INTEGER, defaultValue: 0 },
    active_now: { type: Sequelize.INTEGER, defaultValue: 0 },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });

  // CHECK-INS
  await queryInterface.createTable('CheckIns', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    user_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
    location_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'Locations', key: 'id' }, onDelete: 'CASCADE' },
    anonymous: { type: Sequelize.BOOLEAN, defaultValue: false },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });

  // COMMENTS
  await queryInterface.createTable('Comments', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    user_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
    location_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'Locations', key: 'id' }, onDelete: 'CASCADE' },
    text: { type: Sequelize.TEXT, allowNull: false },
    rating: { type: Sequelize.INTEGER },
    tags: { type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: [] },
    is_moderated: { type: Sequelize.BOOLEAN, defaultValue: false },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });

  // ALERTS
  await queryInterface.createTable('Alerts', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    user_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
    location_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'Locations', key: 'id' }, onDelete: 'CASCADE' },
    alert_type: { type: Sequelize.ENUM('police', 'robbery', 'homophobia', 'construction', 'other'), allowNull: false },
    description: { type: Sequelize.TEXT },
    expires_at: { type: Sequelize.DATE },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });

  // MESSAGES
  await queryInterface.createTable('Messages', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    from_user_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
    to_user_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
    text: { type: Sequelize.TEXT, allowNull: false },
    read: { type: Sequelize.BOOLEAN, defaultValue: false },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('Messages');
  await queryInterface.dropTable('Alerts');
  await queryInterface.dropTable('Comments');
  await queryInterface.dropTable('CheckIns');
  await queryInterface.dropTable('Locations');
  await queryInterface.dropTable('Users');
}
