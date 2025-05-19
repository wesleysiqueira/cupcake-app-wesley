# Cupcake App 🧁

A modern web application for ordering and managing cupcake deliveries, built with Next.js 14 and HeroUI.

## ✨ Features

- 🛍️ Browse and order cupcakes
- 🛒 Shopping cart functionality
- 👤 User authentication and profile management
- 💳 Secure payment processing
- 📱 Responsive design for all devices
- 🌙 Dark/Light mode support

## 🛠️ Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [HeroUI v2](https://heroui.com/) - Modern UI components
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Prisma](https://www.prisma.io/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - Schema validation
- [Framer Motion](https://www.framer.com/motion/) - Animations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/cupcake-app.git
cd cupcake-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="your_database_url"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
├── app/                # Next.js app directory
│   ├── api/           # API routes
│   ├── cadastro/      # Registration pages
│   ├── carrinho/      # Shopping cart
│   ├── cupcake/       # Cupcake listing and details
│   ├── login/         # Authentication pages
│   ├── pagamento/     # Payment processing
│   └── perfil/        # User profile
├── components/        # Reusable components
├── lib/              # Utility functions
├── prisma/           # Database schema and migrations
├── public/           # Static assets
└── styles/           # Global styles
```

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
