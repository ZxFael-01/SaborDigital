import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary pt-12 pb-6">
      <div className="container-custom mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-accent mr-2"
              >
                <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
                <line x1="6" y1="17" x2="18" y2="17"></line>
              </svg>
              <span className="text-xl font-bold text-white">Sabor Digital</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Sistema completo para gerenciamento de cardápios digitais, modernos e personalizáveis.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold text-lg mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-accent transition-colors">
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-accent transition-colors">
                  Nossos Serviços
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-accent transition-colors">
                  Login / Cadastro
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-accent transition-colors">
                  Suporte
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold text-lg mb-4">Nossos Serviços</h4>
            <ul className="space-y-2">
              <li className="text-gray-400 hover:text-accent transition-colors">
                Cardápios Digitais
              </li>
              <li className="text-gray-400 hover:text-accent transition-colors">
                Gestão de Pedidos
              </li>
              <li className="text-gray-400 hover:text-accent transition-colors">
                Personalização de Marca
              </li>
              <li className="text-gray-400 hover:text-accent transition-colors">
                Análise de Vendas
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold text-lg mb-4">Contato</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Phone size={16} className="mr-2" />
                <a href="tel:+5583986147817" className="hover:text-accent transition-colors">
                  (83) 98614-7817
                </a>
              </li>
              <li className="flex items-center text-gray-400">
                <Mail size={16} className="mr-2" />
                <a href="mailto:rafael.fxz021@gmail.com" className="hover:text-accent transition-colors">
                  rafael.fxz021@gmail.com
                </a>
              </li>
              <li className="flex items-start text-gray-400">
                <MapPin size={16} className="mr-2 mt-1" />
                <span>Brasil</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} Sabor Digital. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;