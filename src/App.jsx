import React, { useState } from 'react'; // <-- ¡Corregido! Ya incluye useState
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LibraryProvider } from './context/LibraryContext';
import { Login } from './pages/Login';
import { Libros } from './pages/Libros';
import { Autores } from './pages/Autores';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { useAuth } from './hooks/useAuth';

const RootApp = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('libros'); // 'libros' o 'autores'

  // Si el usuario no ha iniciado sesión, se queda en el Login
  if (!token) {
    return <Login />;
  }

  // Si ya inició sesión, montamos el Sidebar interactivo y renderizamos la pestaña activa
  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'libros' ? <Libros /> : <Autores />}
    </DashboardLayout>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LibraryProvider>
          <RootApp />
        </LibraryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;