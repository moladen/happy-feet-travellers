const AppError = require('@/utils/AppError');

const DATABASE_UNREACHABLE_MESSAGE =
  'Database is not reachable right now. Please check the Neon database connection and try again.';

function isDatabaseConnectionError(error) {
  return (
    error?.code === 'P1001' ||
    error?.name === 'PrismaClientInitializationError' ||
    String(error?.message || '').includes("Can't reach database server")
  );
}

function handleDatabaseError(error) {
  if (isDatabaseConnectionError(error)) {
    throw AppError.serviceUnavailable(DATABASE_UNREACHABLE_MESSAGE);
  }
  throw error;
}

async function withDatabaseErrors(action) {
  try {
    return await action();
  } catch (error) {
    handleDatabaseError(error);
  }
}

module.exports = {
  handleDatabaseError,
  withDatabaseErrors,
};
