# ESEI - Project management!

## Installation

Clone repository and install dependency.
```bash
git clone https://github.com/ahmadrosid/esei.git
cd esei
yarn install
# Or if you don't use yarn you can use npm
npm install
```

Setup config and init database.
```bash
cp .env.example .env
npx prisma db push
yarn seed
yarn dev

# Or if you don't use yarn you can use npm
npm run seed
npm run dev
```
