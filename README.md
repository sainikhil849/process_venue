

# 📚 [process\_venue](https://stellar-book-reviews.vercel.app/)

A modern and responsive book review platform built with React and TypeScript. Discover, rate, and review your favorite books with ease.

## 🚀 Features

* 📖 **Book Management**: Browse and search through an expanding list of books
* ⭐ **Review System**: Submit and view book reviews with star ratings
* 🧩 **Component-Based Architecture**: Clean separation of concerns using reusable components
* 📱 **Responsive Design**: Built with Tailwind CSS and shadcn/ui for consistent mobile & desktop UI
* ⚡ **Real-time Data Fetching**: Powered by TanStack Query
* 🔒 **Type Safety**: Entire codebase is written in TypeScript

## 🌐 Live Demo

👉 Visit the live app here: [https://stellar-book-reviews.vercel.app](https://stellar-book-reviews.vercel.app)

## 🛠️ Tech Stack

| Layer         | Tools Used                   |
| ------------- | ---------------------------- |
| Frontend      | React 18, TypeScript         |
| Styling       | Tailwind CSS, shadcn/ui      |
| Data Fetching | TanStack Query (React Query) |
| Forms         | React Hook Form + Zod        |
| Routing       | React Router DOM             |
| Charts        | Recharts                     |
| Icons         | Lucide React                 |
| Build Tool    | Vite                         |

## 📋 Prerequisites

Make sure you have installed:

* Node.js (v16 or above)
* npm, yarn, or bun package manager

## 🚀 Getting Started Locally

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/process_venue.git
cd process_venue
```

### 2. Install Dependencies

```bash
npm install  # or yarn install or bun install
```

### 3. Start the Development Server

```bash
npm run dev  # or yarn dev or bun dev
```

Access the app at `http://localhost:8080`

## 🌲 Project Structure

```
src/
├── components/          
│   ├── ui/             
│   ├── BookCard.tsx    
│   ├── ReviewForm.tsx  
│   ├── ReviewList.tsx  
│   └── ErrorBoundary.tsx 
├── hooks/              
│   ├── useBooks.ts     
│   └── useReviews.ts   
├── pages/              
│   ├── Index.tsx       
│   └── NotFound.tsx    
├── services/           
│   └── api.ts          
├── types/              
│   └── book.ts         
└── lib/                
    └── utils.ts        
```

## 🌐 API Integration

The frontend connects to a RESTful backend. Configure the base URL in `src/services/api.ts`.

### API Endpoints

| Method | Endpoint                 | Description                |
| ------ | ------------------------ | -------------------------- |
| `GET`  | `/api/books`             | Fetch all books            |
| `POST` | `/api/books`             | Add a new book             |
| `GET`  | `/api/books/:id/reviews` | Get all reviews for a book |
| `POST` | `/api/books/:id/reviews` | Submit a new review        |

### Sample Response

```ts
interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  publishedYear: number;
  averageRating: number;
  totalReviews: number;
}

interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}
```

## 🔧 Environment Variables

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=BookReview Platform
```

## 📦 Build and Deploy

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set build settings:

   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
3. Deploy — automatic on push to `main`

### Manual Deploy

```bash
npm run build
# Upload the dist/ directory to your static hosting platform
```

## 🧪 Testing

### 1. Install Testing Tools

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest jsdom
```

### 2. Add Test Files

Place test files next to components with `.test.tsx` suffix.

### 3. Run Tests

```bash
npm run test
```

## 📌 Available Scripts

* `npm run dev` — Start dev server
* `npm run build` — Production build
* `npm run preview` — Preview build
* `npm run lint` — Check code style

## 💡 Development Tips

* Use **TanStack Query** for remote state
* Manage local state with React hooks
* Create reusable hooks inside `src/hooks`
* Prefer `shadcn/ui` for layout/UI consistency
* Follow Tailwind CSS utility-first methodology

## 🤝 Contributing

1. Fork the project
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push and open a Pull Request





## 🔄 Changelog



* Initial release with book and review functionality
* Mobile-first responsive layout
* TypeScript and Tailwind CSS integration


