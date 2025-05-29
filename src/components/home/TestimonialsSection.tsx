import { motion } from 'framer-motion';

const TestimonialsSection = () => {
  return (
    <section className="section bg-primary-light">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="title">Nossos Clientes em Ação</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Veja como nossos clientes estão utilizando o Sabor Digital para transformar a experiência de seus estabelecimentos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Mobile User */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative mx-auto max-w-sm">
              {/* Phone frame */}
              <div className="relative z-10 border-8 border-gray-800 rounded-[40px] shadow-xl bg-black">
                <img 
                  src="https://images.pexels.com/photos/4350099/pexels-photo-4350099.jpeg" 
                  alt="Cliente usando aplicativo no celular" 
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
            
            <div className="mt-8 text-center">
              <h3 className="text-xl font-semibold mb-2">Acesso Mobile</h3>
              <p className="text-gray-400">
                Seus clientes podem acessar o cardápio digital diretamente pelo celular, 
                tornando o pedido mais rápido e conveniente.
              </p>
            </div>
          </motion.div>
          
          {/* Laptop User */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative mx-auto">
              {/* Laptop frame */}
              <div className="relative z-10">
                <div className="relative bg-gray-800 rounded-t-xl p-4">
                  <img 
                    src="https://images.pexels.com/photos/5082976/pexels-photo-5082976.jpeg" 
                    alt="Cliente usando sistema no notebook" 
                    className="rounded-lg w-full h-[400px] object-cover"
                  />
                </div>
                <div className="bg-gray-800 h-8 rounded-b-xl"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-gray-700 rounded-t-lg"></div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-12 -left-12 w-40 h-40 bg-accent/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-xl"></div>
            </div>
            
            <div className="mt-8 text-center">
              <h3 className="text-xl font-semibold mb-2">Gestão Simplificada</h3>
              <p className="text-gray-400">
                Gerencie seu cardápio, pedidos e configurações através de uma 
                interface intuitiva pelo computador.
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="card"
          >
            <div className="flex items-center mb-4">
              <img 
                src="https://images.pexels.com/photos/3771839/pexels-photo-3771839.jpeg" 
                alt="Cliente" 
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <h4 className="font-semibold">Ana Silva</h4>
                <p className="text-sm text-gray-400">Restaurante Sabor & Arte</p>
              </div>
            </div>
            <p className="text-gray-400">
              "O Sabor Digital revolucionou nosso atendimento. Os clientes adoram a praticidade 
              e nossa equipe economiza muito tempo com a gestão dos pedidos."
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="card"
          >
            <div className="flex items-center mb-4">
              <img 
                src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg" 
                alt="Cliente" 
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <h4 className="font-semibold">João Santos</h4>
                <p className="text-sm text-gray-400">Café Aroma</p>
              </div>
            </div>
            <p className="text-gray-400">
              "A facilidade de atualizar preços e itens do cardápio é incrível. 
              Além disso, as análises nos ajudam a entender melhor nosso negócio."
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="card"
          >
            <div className="flex items-center mb-4">
              <img 
                src="https://images.pexels.com/photos/3770091/pexels-photo-3770091.jpeg" 
                alt="Cliente" 
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <h4 className="font-semibold">Maria Oliveira</h4>
                <p className="text-sm text-gray-400">Pizzaria Bella</p>
              </div>
            </div>
            <p className="text-gray-400">
              "Desde que implementamos o Sabor Digital, nossas vendas aumentaram 
              significativamente. A integração com WhatsApp é perfeita!"
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;