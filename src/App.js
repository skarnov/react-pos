import Auth from './components/Auth';
import AuthUser from './components/AuthUser';
import Login from './pages/Login';

function App() {
  const { getToken } = AuthUser();
  if (!getToken()) {
    return <Login />
  }
  return (
    <Auth />
  );
}

export default App;