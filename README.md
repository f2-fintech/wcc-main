# White Coat Club

A modern, premium community platform for doctors. Built with Next.js 14 (App Router), MongoDB, Tailwind CSS, Framer Motion, and NextAuth.

## Setup Instructions (Local Development)

### 1. Database Setup
Create a local MongoDB database named `wcclanding` or create a cluster on MongoDB Atlas. 
Get your connection string.

### 2. Environment Variables
Copy `.env.example` to `.env.local` and fill in the required values:
```bash
cp .env.example .env.local
```
- `MONGODB_URI`: Your MongoDB connection string.
- `NEXTAUTH_SECRET`: Generate a random string (e.g. `openssl rand -base64 32`).
- `AWS_*`: Your AWS S3 bucket credentials for image uploads.
- `EMAIL_SERVER_*`: Your Nodemailer SMTP credentials (e.g. Gmail App Password).

### 3. Install Dependencies
If you haven't already:
```bash
npm install
```

### 4. Seed the Database
Run the seed script to create your first Admin user:
```bash
npm run seed:admin
```
This will create:
- **Email:** `admin@whitecoatclub.com`
- **Password:** `admin123`

### 5. Run the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
Access the admin panel at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## Deployment Notes (Vercel + MongoDB Atlas)

### 1. MongoDB Atlas Setup
- Create a project and cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Whitelist the IP address `0.0.0.0/0` (Allow access from anywhere) so Vercel can connect.
- Create a Database User and get the connection string.

### 2. AWS S3 Setup
- Create an S3 Bucket on AWS.
- Uncheck "Block all public access" if you want images to be publicly viewable directly from S3 (or configure Bucket Policies).
- Create an IAM User with `AmazonS3FullAccess` (or scoped access to just your bucket).
- Get the Access Key ID and Secret Access Key.

### 3. Vercel Deployment
1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com) and import the repository.
3. In the Environment Variables section on Vercel, add ALL the variables from your `.env.local`:
   - `MONGODB_URI`
   - `NEXTAUTH_URL` (set to your production domain, e.g. `https://whitecoatclub.com`)
   - `NEXTAUTH_SECRET`
   - `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET_NAME`
   - `EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, `EMAIL_SERVER_USER`, `EMAIL_SERVER_PASSWORD`, `EMAIL_FROM`
4. Click **Deploy**.

Because we're using Next.js App Router and Mongoose with connection caching (`lib/db.ts`), serverless cold starts will handle database connections properly without connection pooling exhaustion.
