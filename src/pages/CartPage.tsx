import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart, CartItem } from '../contexts/CartContext';
import { motion } from 'framer-motion';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = 'Sabor Digital - Carrinho';
  }, []);
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="container-custom max-w-md text-center">
          <div className="bg-primary-light rounded-full p-6 inline-flex mx-auto mb-6">
            <ShoppingCart size={48} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
          <p className="text-gray-400 mb-8">
            Adicione itens ao seu carrinho para continuar com a compra.
          </p>
          <Link to="/" className="btn btn-primary inline-flex items-center">
            <ShoppingBag size={16} className="mr-2" />
            Ver Cardápio
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-20">
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-8">Seu Carrinho</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-4 px-2 text-left">Produto</th>
                      <th className="py-4 px-2 text-center">Quantidade</th>
                      <th className="py-4 px-2 text-right">Preço</th>
                      <th className="py-4 px-2 text-right">Subtotal</th>
                      <th className="py-4 px-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <CartItemRow 
                        key={item.id} 
                        item={item} 
                        updateQuantity={updateQuantity}
                        removeFromCart={removeFromCart}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-700">
                <button 
                  onClick={clearCart}
                  className="btn btn-outline flex items-center"
                >
                  <Trash2 size={16} className="mr-2" />
                  Limpar Carrinho
                </button>
                
                <Link to="/" className="btn btn-secondary">
                  Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Resumo do Pedido</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>R$ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Taxa de entrega</span>
                  <span>Calculado no checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Número de itens</span>
                  <span>{totalItems}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-accent">R$ {totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="btn btn-primary w-full flex items-center justify-center"
              >
                Finalizar Pedido
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CartItemRowProps {
  item: CartItem;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
}

const CartItemRow = ({ item, updateQuantity, removeFromCart }: CartItemRowProps) => {
  return (
    <motion.tr 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="border-b border-gray-700"
    >
      <td className="py-4 px-2">
        <div className="flex items-center">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-16 h-16 object-cover rounded-lg mr-4"
          />
          <div>
            <h3 className="font-medium">{item.name}</h3>
          </div>
        </div>
      </td>
      <td className="py-4 px-2">
        <div className="flex items-center justify-center">
          <button 
            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-light hover:bg-accent hover:text-secondary transition-colors"
          >
            -
          </button>
          <span className="w-10 text-center">{item.quantity}</span>
          <button 
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-light hover:bg-accent hover:text-secondary transition-colors"
          >
            +
          </button>
        </div>
      </td>
      <td className="py-4 px-2 text-right">
        R$ {item.price.toFixed(2)}
      </td>
      <td className="py-4 px-2 text-right font-medium">
        R$ {(item.price * item.quantity).toFixed(2)}
      </td>
      <td className="py-4 px-2 text-right">
        <button 
          onClick={() => removeFromCart(item.id)}
          className="text-gray-400 hover:text-error transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </motion.tr>
  );
};

export default CartPage;