# ✅ VerifiedFeed.com

A simple platform to verify posts using community voting.

## 🚀 Overview
Users can:

* Submit a claim (text, link, image)
* Vote if it's ✅ Real, ❌ Fake, or 🤔 Uncertain
* Comment and discuss the post

## 🧰 Tech Stack

* **Frontend:** Next.js + Tailwind CSS
* **Backend:** Node.js (API routes)
* **Database:** PostgreSQL + Prisma ORM
* **Auth:** Firebase Auth or Clerk
* **Storage:** Cloudinary or Firebase
* **Hosting:** Vercel

## 🧱 Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  posts     Post[]
  votes     Vote[]
  comments  Comment[]
}

model Post {
  id        String   @id @default(uuid())
  userId    String
  title     String
  mediaUrl  String?
  createdAt DateTime @default(now())
  votes     Vote[]
  comments  Comment[]
}

model Vote {
  id        String   @id @default(uuid())
  userId    String
  postId    String
  type      String
  createdAt DateTime @default(now())
}

model Comment {
  id        String   @id @default(uuid())
  userId    String
  postId    String
  content   String
  createdAt DateTime @default(now())
}

## ✅ Getting Started
# Clone the repo
git clone https://github.com/your-username/verifiedfeed.git
cd verifiedfeed

# Install dependencies
npm install

# Setup database
npx prisma db push

# Start dev server
npm run dev

## 🌐 Live URL

Coming soon: [https://www.verifiedfeed.com](https://www.verifiedfeed.com)

## 📜 License

MIT License
