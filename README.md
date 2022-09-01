# ESEI - Project management!

## Installation

Clone repository and install dependency.
```bash
git clone https://github.com/ahmadrosid/esei.git
cd esei
yarn install

# Or 
npm install
```

Setup config and init database.
```bash
cp .env.example .env
npx prisma db push
yarn seed
yarn dev

# Or
npm run seed
npm run dev
```
