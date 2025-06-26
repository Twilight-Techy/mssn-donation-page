# MSSN LASU Epe Chapter Donation Page

This is a donation page for the Muslim Students' Society of Nigeria (MSSN), Lagos State University (LASU), Epe Chapter.

## Database Setup

This project uses SQLite with Prisma ORM. Follow these steps to set up the database:

1. **Generate Prisma Client**

   \`\`\`bash
   npm run prisma:generate
   \`\`\`

   This will generate the Prisma Client in the custom output path specified in the schema.

2. **Create and Apply Migrations**

   \`\`\`bash
   npm run prisma:migrate
   \`\`\`

   This will create the SQLite database file and apply the schema.

3. **Initialize the Database**

   \`\`\`bash
   npm run db:init
   \`\`\`

   This will test the database connection and set up any initial data if needed.

4. **View Database with Prisma Studio (Optional)**

   \`\`\`bash
   npm run prisma:studio
   \`\`\`

   This will open Prisma Studio in your browser, allowing you to view and edit the database.

## Development

\`\`\`bash
npm run dev
\`\`\`

## Build for Production

\`\`\`bash
npm run build
\`\`\`

## Start Production Server

\`\`\`bash
npm start
