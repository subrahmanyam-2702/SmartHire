import Navbar from './components/common/Navbar';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <AppRouter />
      </main>
    </div>
  );
}
