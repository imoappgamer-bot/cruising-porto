/**
 * Migration incremental: adiciona campos de moderação por IA e consentimentos do utilizador.
 * Executa DEPOIS da migration base (20260223000000_create_base_tables.js).
 */
export async function up(queryInterface, Sequelize) {
  // moderationStatus em Comments
  await queryInterface.addColumn('Comments', 'moderationStatus', {
    type: Sequelize.ENUM('approved', 'pending_review', 'rejected'),
    allowNull: false,
    defaultValue: 'approved',
  });

  // moderationStatus em Messages
  await queryInterface.addColumn('Messages', 'moderationStatus', {
    type: Sequelize.ENUM('approved', 'pending_review', 'rejected'),
    allowNull: false,
    defaultValue: 'approved',
  });

  // Versões de termos aceites
  await queryInterface.addColumn('Users', 'acceptedTermsVersion', {
    type: Sequelize.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn('Users', 'acceptedPrivacyVersion', {
    type: Sequelize.STRING,
    allowNull: true,
  });

  // Consentimentos de privacidade
  await queryInterface.addColumn('Users', 'locationConsent', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });

  await queryInterface.addColumn('Users', 'proximityConsent', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });

  await queryInterface.addColumn('Users', 'behavioralPushConsent', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('Comments', 'moderationStatus');
  await queryInterface.removeColumn('Messages', 'moderationStatus');
  await queryInterface.removeColumn('Users', 'acceptedTermsVersion');
  await queryInterface.removeColumn('Users', 'acceptedPrivacyVersion');
  await queryInterface.removeColumn('Users', 'locationConsent');
  await queryInterface.removeColumn('Users', 'proximityConsent');
  await queryInterface.removeColumn('Users', 'behavioralPushConsent');
}
