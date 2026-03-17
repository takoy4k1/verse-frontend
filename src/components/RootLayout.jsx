import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      {/* 
        This wrapper div spans the full width and takes up the remaining vertical space. 
        You can add your desired tailwind gradient classes here (e.g., bg-gradient-to-br from-purple-500 to-indigo-500).
      */}
      <div className="flex-grow w-full bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:via-gray-600 dark:to-black">
        <main className="container mx-auto px-4 py-8 max-w-2xl h-full">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
