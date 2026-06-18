# Administrator Operations & User Guide

This guide describes how to run, configure, and manage your portfolio website, including the database setup, login flows, and administration panel operations.

---

## 1. Quick Start Guide (Local Setup)

To run the application locally on your system, execute the following commands step-by-step:

### Step 1: Clone and Install Packages
Ensure Node.js is installed. Open terminal in the project directory and run:
```bash
npm install
```

### Step 2: Configure Environment Variables
Open the `.env` file in the project root. Update the `DATABASE_URL` with your local MySQL credentials:
```env
# Change username, password, host, port, and database name as necessary.
DATABASE_URL="mysql://root:@localhost:3306/portfolio"

# Change this to a secure random string for JWT encryption.
JWT_SECRET="super-secret-jwt-key-change-me-in-production-123456"
```

### Step 3: Run Database Migrations
Generate tables inside your MySQL database:
```bash
npx prisma db push
```

### Step 4: Run Seeder
Insert the default administrator credentials and placeholder bio/projects:
```bash
npx prisma db seed
```
> [!IMPORTANT]
> The default seeded login credentials are:
> *   **Username**: `admin`
> *   **Password**: `admin123`

### Step 5: Start Local Server
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view your portfolio page.

---

## 2. Accessing the Admin Backdoor
To prevent unauthorized attempts, there are no visible links or buttons pointing to the login page on the public portfolio interface.

1.  Open your browser and navigate to the hidden backdoor route:
    👉 **[http://localhost:3000/backdoor-admin](http://localhost:3000/backdoor-admin)**
2.  Enter the administrator credentials:
    *   **Username**: `admin`
    *   **Password**: `admin123` *(or your custom password)*
3.  Click **Sign In**. If credentials match, you will be redirected to the secure dashboard at `/admin/dashboard`.

---

## 3. Dashboard Operations

The administration dashboard is split into two easy-to-use tabs:

### Tab 1: Manage Projects
This section allows you to manage the projects displayed in the landing page's grid.
*   **Add a Project**:
    1.  Fill out the form: Title, Tech Stack (comma separated), Description, GitHub Link, Live Demo Link, and Preview Image URL (optional).
    2.  Click **Create Project**.
*   **Edit a Project**:
    1.  Locate the project in the list below the form.
    2.  Click the **Edit Icon (pencil)** next to it.
    3.  The form fields will populate with current details. Modify the fields and click **Save Changes** (or click *Cancel* to revert).
*   **Delete a Project**:
    1.  Locate the project in the list.
    2.  Click the **Delete Icon (trashcan)**.
    3.  Confirm the browser prompt to delete.

### Tab 2: Manage Profile & CV
This section allows you to customize the main bio content on your landing page.
1.  Click **Manage CV & Profile** in the sidebar.
2.  Modify the fields:
    *   **Full Name**: Displays as the primary headline on the page.
    *   **Professional Title**: Displays below your name in a neon gradient.
    *   **Biography Summary**: Your professional story. Keep this detailed and split into paragraphs.
    *   **CV Document URL**: The link that triggers when a user clicks "Download CV" (e.g., a Google Drive shared PDF link).
3.  Click **Update Profile** to save. The changes will reflect immediately on the home page.

---

## 4. Troubleshooting & FAQs

### Q: I changed the password in `prisma/seed.js` but it didn't update in the database. Why?
**Answer**: Make sure to execute the seed command after updating the file:
```bash
npx prisma db seed
```
If you get database connection errors, make sure your local MySQL server is running in XAMPP or your database system.

### Q: I get an "Authentication failed" (P1000) error when pushing.
**Answer**: This means your database username or password in `.env` is incorrect.
*   If using **XAMPP**, default setup has no password: `mysql://root:@localhost:3306/portfolio`.
*   If using **WampServer** or standalone **MySQL**, use your custom root password: `mysql://root:YOUR_PASSWORD@localhost:3306/portfolio`.

### Q: I log in, but the page does not redirect, or shows an error.
**Answer**:
1. Stop your development server (Ctrl + C) and run `npm run dev` again to clear runtime caching.
2. Ensure cookies are enabled in your browser, as the dashboard relies on the secure `admin_token` cookie to verify your session.

---

## 5. Production Deployment Guide
When you are ready to host the website online (e.g., on Vercel):

1.  **Cloud Database**: Set up a cloud MySQL instance using a provider like **TiDB Cloud** (Free Tier serverless MySQL) or **Railway.app**.
2.  **Environment Variables**: Inside your hosting dashboard (e.g., Vercel), add these variables:
    *   `DATABASE_URL`: Your cloud database connection URL.
    *   `JWT_SECRET`: A long, secure random string.
3.  **Database Sync**: Run `npx prisma db push` targeting the cloud database link to initialize the tables online, and run `npx prisma db seed` to initialize the admin user on the cloud database.
