import { motion } from 'framer-motion';
import { ShoppingCart, Palette, BarChart2, Smartphone } from 'lucide-react';

const features = [
  {
    icon: <ShoppingCart className="text-accent text-4xl mb-4" />,
    title: 'Sistema de Vendas',
    description: 'Gerencie pedidos, pagamentos e entregas diretamente pelo cardápio digital com integração ao WhatsApp.'
  },
  {
    icon: <Palette className="text-accent text-4xl mb-4" />,
    title: 'Personalização Total',
    description: 'Adapte cores, imagens e layout de acordo com a identidade visual do seu negócio.'
  },
  {
    icon: <BarChart2 className="text-accent text-4xl mb-4" />,
    title: 'Dashboard Analítico',
    description: 'Acompanhe vendas, produtos mais populares e períodos de pico para tomar decisões estratégicas.'
  },
  {
    icon: <Smartphone className="text-accent text-4xl mb-4" />,
    title: 'Responsivo',
    description: 'Cardápios adaptados para qualquer dispositivo, proporcionando a melhor experiência para seus clientes.'
  }
];

const FeaturesSection = () => {
  return (
    <section className="section bg-primary-light">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="title">Recursos Principais</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Nosso sistema oferece tudo que você precisa para criar e gerenciar cardápios digitais profissionais.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card text-center hover:scale-105 transition-transform"
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
  );
};

export default FeaturesSection;