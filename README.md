

## Getting Started
```bash
.env file

DATABASE_URL="mongodb+srv://brennynesh:vt8He25Cy3SYErCn@graphiq.zqscc.mongodb.net/graphiq?retryWrites=true&w=majority&appName=graphiq"
JWT_SECRET="graphiq-admin-jwt-secret-2024"

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dhfg3suis
NEXT_PUBLIC_CLOUDINARY_API_KEY=298684687375513
CLOUDINARY_API_SECRET=4-3OX3DzX-ArnMRvLcXhH7BIWgc
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=graphiqmedia

CLOUDINARY_CLOUD_NAME=dhfg3suis
CLOUDINARY_API_KEY=298684687375513
CLOUDINARY_API_SECRET=4-3OX3DzX-ArnMRvLcXhH7BIWgc

```


First, run the development server:

```bash
npm install

npx prisma migrate dev --name remove_duplicate_blog_model

npx prisma generate

npx prisma db push 


npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

