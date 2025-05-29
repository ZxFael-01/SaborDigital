import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Truck, ShoppingBag, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

type DeliveryMethod = 'delivery' | 'pickup';
type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'cash';

const CheckoutPage = () => {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  
  // Form fields
  const [name, setName] = useState(user?.email.split('@')[0] || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [notes, setNotes] = useState('');
  
  // Calculated values
  const deliveryFee = deliveryMethod === 'delivery' ? 10 : 0;
  const total = totalPrice + deliveryFee;
  
  useEffect(() => {
    document.title = 'Sabor Digital - Finalizar Pedido';
    
    // Redirect if cart is empty
    if (items.length === 0 && !orderComplete) {
      navigate('/');
    }
  }, [items, navigate, orderComplete]);
  
  const formatWhatsAppMessage = () => {
    let message = `*Novo Pedido*\n\n`;
    message += `*Cliente:* ${name}\n`;
    message += `*Telefone:* ${phone}\n\n`;
    
    message += `*Itens do Pedido:*\n`;
    items.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (R$ ${(item.price * item.quantity).toFixed(2)})\n`;
    });
    
    message += `\n*Subtotal:* R$ ${totalPrice.toFixed(2)}\n`;
    
    if (deliveryMethod === 'delivery') {
      message += `*Taxa de Entrega:* R$ ${deliveryFee.toFixed(2)}\n`;
      message += `*Endereço:* ${address}, ${city}, ${zipCode}\n`;
    } else {
      message += `*Retirada no Local*\n`;
    }
    
    message += `*Total:* R$ ${total.toFixed(2)}\n`;
    message += `*Forma de Pagamento:* ${getPaymentMethodLabel(paymentMethod)}\n`;
    
    if (notes) {
      message += `\n*Observações:* ${notes}\n`;
    }
    
    message += `\n*Tempo estimado:* 30-40 minutos`;
    
    return encodeURIComponent(message);
  };
  
  const getPaymentMethodLabel = (method: PaymentMethod) => {
    switch (method) {
      case 'credit_card': return 'Cartão de Crédito';
      case 'debit_card': return 'Cartão de Débito';
      case 'pix': return 'PIX';
      case 'cash': return 'Dinheiro';
    }
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (deliveryMethod === 'delivery' && (!address || !city || !zipCode)) {
      toast.error('Por favor, preencha o endereço de entrega completo');
      setIsSubmitting(false);
      return;
    }
    
    if (!phone) {
      toast.error('Por favor, informe um telefone para contato');
      setIsSubmitting(false);
      return;
    }
    
    // Simulate order processing
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderComplete(true);
      
      // Clear cart
      clearCart();
    }, 2000);
  };
  
  if (orderComplete) {
    const whatsappLink = `https://wa.me/5583986147817?text=${formatWhatsAppMessage()}`;
    
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="container-custom max-w-md text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="bg-success/20 rounded-full p-6 inline-flex mx-auto">
              <CheckCircle size={48} className="text-success" />
            </div>
          </motion.div>
          
          <h1 className="text-2xl font-bold mb-4">Pedido Realizado com Sucesso!</h1>
          <p className="text-gray-400 mb-8">
            Seu pedido foi recebido e está sendo processado. O tempo estimado de preparo é de 30-40 minutos.
          </p>
          
          <div className="space-y-4">
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full inline-flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Acompanhar no WhatsApp
            </a>
            
            <button 
              onClick={() => navigate('/')}
              className="btn btn-outline w-full"
            >
              Voltar para o Cardápio
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-20">
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-8">Finalizar Pedido</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Customer Information */}
              <div className="card mb-6">
                <h2 className="text-xl font-semibold mb-4">Informações do Cliente</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                      Telefone (WhatsApp)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder="(00) 00000-0000"
                      className="input w-full"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Delivery Method */}
              <div className="card mb-6">
                <h2 className="text-xl font-semibold mb-4">Método de Entrega</h2>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <button
                    type="button"
                    className={`flex-1 p-4 border rounded-lg flex items-center transition-colors ${
                      deliveryMethod === 'delivery' 
                        ? 'border-accent bg-accent/10' 
                        : 'border-gray-700 hover:border-accent/50'
                    }`}
                    onClick={() => setDeliveryMethod('delivery')}
                  >
                    <Truck className={`mr-3 ${deliveryMethod === 'delivery' ? 'text-accent' : 'text-gray-400'}`} />
                    <div className="text-left">
                      <div className="font-medium">Entrega</div>
                      <div className="text-sm text-gray-400">30-40 minutos</div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    className={`flex-1 p-4 border rounded-lg flex items-center transition-colors ${
                      deliveryMethod === 'pickup' 
                        ? 'border-accent bg-accent/10' 
                        : 'border-gray-700 hover:border-accent/50'
                    }`}
                    onClick={() => setDeliveryMethod('pickup')}
                  >
                    <ShoppingBag className={`mr-3 ${deliveryMethod === 'pickup' ? 'text-accent' : 'text-gray-400'}`} />
                    <div className="text-left">
                      <div className="font-medium">Retirada</div>
                      <div className="text-sm text-gray-400">20-30 minutos</div>
                    </div>
                  </button>
                </div>
                
                {/* Delivery Address (only shown for delivery) */}
                {deliveryMethod === 'delivery' && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
                        Endereço
                      </label>
                      <input
                        id="address"
                        type="text"
                        required
                        className="input w-full"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
                          Cidade
                        </label>
                        <input
                          id="city"
                          type="text"
                          required
                          className="input w-full"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-300 mb-1">
                          CEP
                        </label>
                        <input
                          id="zipCode"
                          type="text"
                          required
                          className="input w-full"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Payment Method */}
              <div className="card mb-6">
                <h2 className="text-xl font-semibold mb-4">Forma de Pagamento</h2>
                
                <div className="space-y-3">
                  <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'credit_card' 
                      ? 'border-accent bg-accent/10' 
                      : 'border-gray-700 hover:border-accent/50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="sr-only"
                      checked={paymentMethod === 'credit_card'}
                      onChange={() => setPaymentMethod('credit_card')}
                    />
                    <div className="flex items-center">
                      <CreditCard className={`mr-3 ${paymentMethod === 'credit_card' ? 'text-accent' : 'text-gray-400'}`} />
                      <span>Cartão de Crédito</span>
                    </div>
                  </label>
                  
                  <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'debit_card' 
                      ? 'border-accent bg-accent/10' 
                      : 'border-gray-700 hover:border-accent/50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="sr-only"
                      checked={paymentMethod === 'debit_card'}
                      onChange={() => setPaymentMethod('debit_card')}
                    />
                    <div className="flex items-center">
                      <CreditCard className={`mr-3 ${paymentMethod === 'debit_card' ? 'text-accent' : 'text-gray-400'}`} />
                      <span>Cartão de Débito</span>
                    </div>
                  </label>
                  
                  <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'pix' 
                      ? 'border-accent bg-accent/10' 
                      : 'border-gray-700 hover:border-accent/50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="sr-only"
                      checked={paymentMethod === 'pix'}
                      onChange={() => setPaymentMethod('pix')}
                    />
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" className={`mr-3 ${paymentMethod === 'pix' ? 'text-accent' : 'text-gray-400'}`}>
                        <path fill="currentColor" d="M205.932 50.064c-19.276-19.301-50.527-19.301-69.803 0L102.932 83.17l12.625 12.636l33.197-33.106c12.034-12.038 31.508-12.038 43.542 0c12.033 12.038 12.033 31.502 0 43.542l-33.197 33.106l12.625 12.636l33.197-33.106c19.276-19.303 19.276-50.513.011-69.814zm-155.797 0c19.276-19.301 50.527-19.301 69.803 0L153.135 83.17l-12.625 12.636l-33.197-33.106c-12.034-12.038-31.508-12.038-43.542 0c-12.033 12.038-12.033 31.502 0 43.542l33.197 33.106l-12.625 12.636L51.147 119.88c-19.276-19.303-19.276-50.513-.011-69.815z"/>
                      </svg>
                      <span>PIX</span>
                    </div>
                  </label>
                  
                  <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'cash' 
                      ? 'border-accent bg-accent/10' 
                      : 'border-gray-700 hover:border-accent/50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="sr-only"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                    />
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mr-3 ${paymentMethod === 'cash' ? 'text-accent' : 'text-gray-400'}`}>
                        <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                        <circle cx="12" cy="12" r="2"></circle>
                        <path d="M6 12h.01M18 12h.01"></path>
                      </svg>
                      <span>Dinheiro</span>
                    </div>
                  </label>
                </div>
              </div>
              
              {/* Additional Notes */}
              <div className="card mb-6">
                <h2 className="text-xl font-semibold mb-4">Observações</h2>
                
                <div>
                  <textarea
                    id="notes"
                    rows={4}
                    className="input w-full"
                    placeholder="Instruções especiais para o pedido..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </form>
          </div>
          
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
              
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.quantity}x</span> {item.name}
                    </div>
                    <div>R$ {(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-700 pt-4 space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>R$ {totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    {deliveryMethod === 'delivery' ? 'Taxa de entrega' : 'Retirada'}
                  </span>
                  <span>
                    {deliveryMethod === 'delivery' 
                      ? `R$ ${deliveryFee.toFixed(2)}` 
                      : 'Grátis'}
                  </span>
                </div>
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-accent">R$ {total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={handleSubmit}
                  className="btn btn-primary w-full flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Processando...
                    </>
                  ) : (
                    'Confirmar Pedido'
                  )}
                </button>
                
                <div className="text-center text-sm text-gray-400">
                  <div className="flex items-center justify-center mb-2">
                    <MapPin size={14} className="mr-1" />
                    <span>Tempo estimado: 30-40 minutos</span>
                  </div>
                  <p>
                    Ao confirmar seu pedido, você receberá atualizações via WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;