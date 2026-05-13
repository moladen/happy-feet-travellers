const prisma = require('@/config/database');
const env = require('@/config/env');
const AppError = require('@/utils/AppError');
const { withDatabaseErrors } = require('@/utils/databaseErrors');
const {
  generateToken,
  hashPassword,
  comparePassword,
} = require('@/utils/authUtils');

async function loginAdmin({ email, password }) {
  return withDatabaseErrors(async () => {
    let admin = await prisma.admin.findUnique({ where: { email } });

    // First-time bootstrap: provision admin from env if no admin record exists
    if (!admin) {
      if (
        env.admin.email &&
        env.admin.password &&
        email === env.admin.email &&
        password === env.admin.password
      ) {
        admin = await prisma.admin.create({
          data: { email, password: await hashPassword(password) },
        });
      } else {
        throw AppError.unauthorized('Invalid credentials');
      }
    }

    const ok = await comparePassword(password, admin.password);
    if (!ok) throw AppError.unauthorized('Invalid credentials');

    const token = generateToken({ id: admin.id, email: admin.email });

    return {
      token,
      admin: { id: admin.id, email: admin.email },
    };
  });
}

async function getAdminProfile(adminId) {
  return withDatabaseErrors(async () => {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { id: true, email: true },
    });
    if (!admin) throw AppError.notFound('Admin not found');
    return admin;
  });
}

module.exports = {
  loginAdmin,
  getAdminProfile,
};
