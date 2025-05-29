import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageSquare, Send } from 'lucide-react';

const SupportPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    document.title = 'Sabor Digital - Suporte';
  }, []);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      
      // Reset submitted state after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };
  
  return (
    <div className="pt-20 min-h-screen">
      <section className="section bg-primary-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Suporte</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Estamos aqui para ajudar. Entre em contato conosco para tirar dúvidas ou resolver problemas.
            </p>
          </div>
        </div>
      </section>
      
      <section className="section">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="title mb-8">Informações de Contato</h2>
              
              <div className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="card flex items-start"
                >
                  <div className="bg-accent rounded-full p-3 mr-4">
                    <Phone className="text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">WhatsApp</h3>
                    <p className="text-gray-400 mb-2">Atendimento de segunda a sexta, das 8h às 18h</p>
                    <a 
                      href="https://wa.me/5583986147817" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:underline inline-flex items-center"
                    >
                      (83) 98614-7817
                      <MessageSquare size={16} className="ml-1" />
                    </a>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="card flex items-start"
                >
                  <div className="bg-accent rounded-full p-3 mr-4">
                    <Mail className="text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email</h3>
                    <p className="text-gray-400 mb-2">Responderemos em até 24 horas</p>
                    <a 
                      href="mailto:rafael.fxz021@gmail.com" 
                      className="text-accent hover:underline"
                    >
                      rafael.fxz021@gmail.com
                    </a>
                  </div>
                </motion.div>
              </div>
              
              <div className="mt-12">
                <h3 className="subtitle">Perguntas Frequentes</h3>
                <div className="space-y-4 mt-6">
                  <div className="card">
                    <h4 className="font-semibold mb-2">Como faço para me tornar um administrador?</h4>
                    <p className="text-gray-400">
                      Ao criar sua conta, você terá acesso como cliente. Para obter acesso administrativo, entre em contato com nosso suporte.
                    </p>
                  </div>
                  
                  <div className="card">
                    <h4 className="font-semibold mb-2">Posso usar o sistema sem internet?</h4>
                    <p className="text-gray-400">
                      Não, o sistema requer conexão com a internet para funcionar corretamente, pois é baseado em nuvem.
                    </p>
                  </div>
                  
                  <div className="card">
                    <h4 className="font-semibold mb-2">Como personalizo as cores do meu cardápio?</h4>
                    <p className="text-gray-400">
                      No painel administrativo, acesse a seção "Aparência" para modificar cores, fontes e elementos visuais do seu cardápio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <h2 className="title mb-8">Envie uma Mensagem</h2>
              
              <div className="card">
                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="bg-success/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Send className="text-success" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Mensagem Enviada!</h3>
                    <p className="text-gray-400">
                      Obrigado por entrar em contato. Responderemos o mais breve possível.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                        Nome
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        className="input w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        className="input w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                        Mensagem
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        className="input w-full resize-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      ></textarea>
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        className="btn btn-primary w-full flex items-center justify-center"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send size={16} className="mr-2" />
                            Enviar Mensagem
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
              
              <div className="mt-8">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Horário de Atendimento</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Segunda a Sexta</span>
                      <span>8h às 18h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sábado</span>
                      <span>9h às 13h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Domingo</span>
                      <span>Fechado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;