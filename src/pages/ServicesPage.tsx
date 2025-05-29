import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Settings, MousePointer } from 'lucide-react';

// Sample menu templates
const menuTemplates = [
  {
    id: '1',
    name: 'Clássico',
    description: 'Design elegante e simples, ideal para restaurantes tradicionais.',
    image: 'https://images.pexels.com/photos/6205791/pexels-photo-6205791.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    features: ['Layout responsivo', 'Categorias organizadas', 'Fotos de produtos', 'Sistema de busca']
  },
  {
    id: '2',
    name: 'Moderna',
    description: 'Visual contemporâneo com animações suaves e interface intuitiva.',
    image: 'https://images.pexels.com/photos/5824628/pexels-photo-5824628.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    features: ['Animações personalizadas', 'Tema escuro', 'Destaque para promoções', 'Pedidos online']
  },
  {
    id: '3',
    name: 'Cultural',
    description: 'Destaque para elementos culturais e regionais, perfeito para comidas típicas.',
    image: 'https://images.pexels.com/photos/6287554/pexels-photo-6287554.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    features: ['Elementos culturais', 'Histórias dos pratos', 'Galeria de imagens', 'Compartilhamento social']
  }
];

// Features of the system
const systemFeatures = [
  {
    icon: <Palette size={48} className="text-accent mb-4" />,
    title: 'Personalização Completa',
    description: 'Modifique cores, fontes, imagens e layout de acordo com a identidade visual do seu negócio.'
  },
  {
    icon: <Settings size={48} className="text-accent mb-4" />,
    title: 'Gestão de Conteúdo',
    description: 'Adicione, edite ou remova produtos, categorias e informações do cardápio facilmente pelo painel administrativo.'
  },
  {
    icon: <MousePointer size={48} className="text-accent mb-4" />,
    title: 'Experiência Interativa',
    description: 'Ofereça aos clientes um cardápio interativo com imagens, descrições detalhadas e opções de filtragem.'
  }
];

const ServicesPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  useEffect(() => {
    document.title = 'Sabor Digital - Nossos Serviços';
  }, []);
  
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="section bg-primary-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nossos Serviços</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Oferecemos soluções completas de cardápios digitais personalizáveis para restaurantes de todos os tipos e tamanhos.
            </p>
          </div>
        </div>
      </section>
      
      {/* Templates Section */}
      <section className="section">
        <div className="container-custom">
          <h2 className="title text-center">Modelos de Cardápios</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Escolha entre diversos modelos prontos ou personalize completamente seu cardápio digital.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {menuTemplates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ y: -10 }}
                className={`card cursor-pointer overflow-hidden ${
                  selectedTemplate === template.id ? 'ring-2 ring-accent' : ''
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={template.image} 
                    alt={template.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                  <p className="text-gray-400 mb-4">{template.description}</p>
                  <ul className="space-y-2">
                    {template.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-accent mr-2">•</span>
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="section bg-primary-light">
        <div className="container-custom">
          <h2 className="title text-center">Funcionalidades</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Nosso sistema oferece diversas funcionalidades para melhorar a experiência dos seus clientes e facilitar a gestão do seu negócio.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {systemFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <div className="flex flex-col items-center">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="section">
        <div className="container-custom">
          <h2 className="title text-center">Como Funciona</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-accent-dark"></div>
              
              {/* Timeline items */}
              <div className="space-y-12">
                {/* Step 1 */}
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="md:w-1/2 md:pr-8 md:text-right"
                  >
                    <div className="bg-primary-light p-6 rounded-lg shadow-lg">
                      <h3 className="text-xl font-semibold mb-2">1. Escolha um modelo</h3>
                      <p className="text-gray-400">
                        Selecione um de nossos modelos pré-definidos ou comece do zero com um design totalmente personalizado.
                      </p>
                    </div>
                  </motion.div>
                  <div className="absolute top-6 left-0 md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 rounded-full bg-accent border-4 border-primary"></div>
                </div>
                
                {/* Step 2 */}
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="md:w-1/2 md:ml-auto md:pl-8"
                  >
                    <div className="bg-primary-light p-6 rounded-lg shadow-lg">
                      <h3 className="text-xl font-semibold mb-2">2. Personalize o conteúdo</h3>
                      <p className="text-gray-400">
                        Adicione seus produtos, categorias, preços e imagens através do painel administrativo intuitivo.
                      </p>
                    </div>
                  </motion.div>
                  <div className="absolute top-6 left-0 md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 rounded-full bg-accent border-4 border-primary"></div>
                </div>
                
                {/* Step 3 */}
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="md:w-1/2 md:pr-8 md:text-right"
                  >
                    <div className="bg-primary-light p-6 rounded-lg shadow-lg">
                      <h3 className="text-xl font-semibold mb-2">3. Configure pagamentos</h3>
                      <p className="text-gray-400">
                        Defina métodos de pagamento, opções de entrega e integração com WhatsApp para notificações.
                      </p>
                    </div>
                  </motion.div>
                  <div className="absolute top-6 left-0 md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 rounded-full bg-accent border-4 border-primary"></div>
                </div>
                
                {/* Step 4 */}
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="md:w-1/2 md:ml-auto md:pl-8"
                  >
                    <div className="bg-primary-light p-6 rounded-lg shadow-lg">
                      <h3 className="text-xl font-semibold mb-2">4. Compartilhe e comece a vender</h3>
                      <p className="text-gray-400">
                        Disponibilize seu cardápio digital para os clientes e comece a receber pedidos imediatamente.
                      </p>
                    </div>
                  </motion.div>
                  <div className="absolute top-6 left-0 md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 rounded-full bg-accent border-4 border-primary"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;