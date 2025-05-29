import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useEffect } from 'react';

const NotFoundPage = () => {
  useEffect(() => {
    document.title = 'Página Não Encontrada - Sabor Digital';
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container-custom max-w-md text-center">
        <h1 className="text-8xl font-bold text-accent mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Página Não Encontrada</h2>
        <p className="text-gray-400 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link to="/" className="btn btn-primary inline-flex items-center">
          <Home size={16} className="mr-2" />
          Voltar para a Página Inicial
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;