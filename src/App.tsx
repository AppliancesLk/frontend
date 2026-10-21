import './App.css';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ToastRegion } from './components/feedback/ToastRegion';
import { SeasonalThemeProvider } from './context/SeasonalThemeProvider';
function App() {
  return (
    <SeasonalThemeProvider>
      <AuthProvider>
        <Outlet />
        <ToastRegion />
      </AuthProvider>
    </SeasonalThemeProvider>
  );
}
export default App;
