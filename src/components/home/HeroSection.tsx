import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/5695880/pexels-photo-5695880.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </div>
      
      {/* Content */}
      <div className="container-custom relative z-10 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Cardápios Digitais<br />
              <span className="text-accent">Personalizáveis</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-lg">
              Crie e gerencie cardápios digitais para seu restaurante, com sistema completo de vendas, pagamentos e análise de dados.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/services" className="btn btn-primary">
                Conheça Nossos Serviços
              </Link>
              <Link to="/register" className="btn btn-outline flex items-center justify-center">
                Comece Agora <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </motion.div>
          
          {/* Image/Device Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative mx-auto max-w-sm">
              {/* Phone frame */}
              <div className="relative z-10 border-8 border-gray-800 rounded-[40px] shadow-xl bg-black">
                <img 
                  src="https://images.pexels.com/photos/5865511/pexels-photo-5865511.jpeg" 
                  alt="Digital Menu Preview" 
                  className="rounded-[32px] h-[580px] w-full object-cover"
                />
                
                {/* Phone Elements */}
                <div className="absolute top-0 inset-x-0">
                  <div className="h-6 w-24 mx-auto bg-gray-800 rounded-b-xl"></div>
                </div>
                <div className="absolute bottom-0 inset-x-0 flex justify-center pb-2">
                  <div className="h-1 w-16 bg-gray-700 rounded-full"></div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-12 -right-12 w-40 h-40 bg-accent/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;