import './App.css';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ToastRegion } from './components/feedback/ToastRegion';
function App() {
  return (
    <AuthProvider>
      <Outlet />
      <ToastRegion />
    </AuthProvider>
  );
}
export default App;
