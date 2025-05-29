import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';

type MenuItemProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

const MenuItem = ({ id, name, description, price, image, category }: MenuItemProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart({
      menuItemId: id,
      name,
      price,
      quantity,
      image
    });
    setQuantity(1);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="card hover:shadow-xl overflow-hidden"
    >
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-accent text-secondary px-2 py-1 text-xs font-semibold rounded">
          {category}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{name}</h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-accent font-bold">R$ {price.toFixed(2)}</span>
          
          <div className="flex items-center">
            <div className="flex border border-gray-700 rounded-lg mr-2">
              <button 
                onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                className="px-2 py-1 text-gray-400 hover:text-accent"
              >
                -
              </button>
              <span className="px-2 py-1">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="px-2 py-1 text-gray-400 hover:text-accent"
              >
                +
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="btn btn-primary flex items-center"
            >
              <Plus size={16} className="mr-1" /> 
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItem;