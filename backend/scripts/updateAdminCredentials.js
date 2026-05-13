const path = require('path');
const readline = require('readline');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

const USAGE = `
Update the admin email and/or password.

Usage:
  node scripts/updateAdminCredentials.js --current-email old@example.com --email new@example.com --password "NewPassword123"
  node scripts/updateAdminCredentials.js --email new@example.com
  node scripts/updateAdminCredentials.js --password "NewPassword123"
  node scripts/updateAdminCredentials.js --interactive

Options:
  --current-email <email>   Existing admin email (recommended if email is changing)
  --email <email>           New admin email
  --password <password>     New admin password
  --interactive             Prompt for values in the terminal
  --help                    Show this help message
`;

function parseArgs(argv) {
  const parsed = {
    currentEmail: null,
    email: null,
    password: null,
    interactive: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
      continue;
    }

    if (arg === '--interactive' || arg === '-i') {
      parsed.interactive = true;
      continue;
    }

    if (!arg.startsWith('--')) {
      throw new Error(`Unexpected argument: ${arg}`);
    }

    const value = argv[i + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for ${arg}`);
    }

    if (arg === '--current-email') parsed.currentEmail = value.trim();
    else if (arg === '--email') parsed.email = value.trim().toLowerCase();
    else if (arg === '--password') parsed.password = value;
    else throw new Error(`Unknown option: ${arg}`);

    i += 1;
  }

  return parsed;
}

function ask(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

async function promptForArgs(initialArgs) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    console.log('Interactive admin credential update');
    console.log('Press Enter to keep a field unchanged.\n');

    const currentEmail = await ask(
      rl,
      `Current admin email${initialArgs.currentEmail ? ` [${initialArgs.currentEmail}]` : ' (optional)'}: `
    );
    const email = await ask(
      rl,
      `New admin email${initialArgs.email ? ` [${initialArgs.email}]` : ' (optional)'}: `
    );
    const password = await ask(rl, 'New admin password (optional): ');

    return {
      ...initialArgs,
      currentEmail: currentEmail || initialArgs.currentEmail,
      email: (email || initialArgs.email || '').trim().toLowerCase() || null,
      password: password || initialArgs.password || null,
    };
  } finally {
    rl.close();
  }
}

async function getTargetAdmin(currentEmail) {
  if (currentEmail) {
    const admin = await prisma.admin.findUnique({ where: { email: currentEmail } });
    if (!admin) {
      throw new Error(`No admin found with email "${currentEmail}".`);
    }
    return admin;
  }

  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: 'asc' },
    take: 2,
  });

  if (admins.length === 0) {
    throw new Error(
      'No admin record found. Create the first admin via login bootstrap or seed, then run this command again.'
    );
  }

  if (admins.length > 1) {
    throw new Error('Multiple admins found. Re-run this command with --current-email to choose which admin to update.');
  }

  return admins[0];
}

async function main() {
  try {
    let args = parseArgs(process.argv.slice(2));

    if (args.help) {
      console.log(USAGE.trim());
      return;
    }

    const shouldPrompt =
      args.interactive || (!args.email && !args.password && process.stdin.isTTY && process.stdout.isTTY);

    if (shouldPrompt) {
      args = await promptForArgs(args);
    }

    if (!args.email && !args.password) {
      throw new Error('Provide at least one of --email or --password.');
    }

    const admin = await getTargetAdmin(args.currentEmail);
    const data = {};

    if (args.email) {
      data.email = args.email;
    }

    if (args.password) {
      data.password = await bcrypt.hash(args.password, 10);
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: admin.id },
      data,
      select: { id: true, email: true, updatedAt: true },
    });

    console.log('Admin credentials updated successfully.');
    console.log(`  Admin ID: ${updatedAdmin.id}`);
    console.log(`  Email: ${updatedAdmin.email}`);
    console.log(`  Updated: ${updatedAdmin.updatedAt.toISOString()}`);

    if (args.email || args.password) {
      console.log('\nReminder: also update ADMIN_EMAIL / ADMIN_PASSWORD in backend/.env if you use env-based bootstrap values.');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error('\n' + USAGE.trim());
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
