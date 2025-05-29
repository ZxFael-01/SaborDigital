import { useState, useEffect } from 'react';
import MenuItem from '../ui/MenuItem';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Search } from 'lucide-react';

// Sample data (would come from Supabase in a real implementation)
const SAMPLE_MENU_ITEMS = [
  {
    id: '1',
    name: 'Baião de Dois',
    description: 'Prato tradicional nordestino com arroz, feijão de corda, queijo coalho e carne seca.',
    price: 39.90,
    image: 'https://i.ytimg.com/vi/9TVEmlFxZGA/maxresdefault.jpg',
    category: 'Pratos Principais',
    is_available: true
  },
  {
    id: '2',
    name: 'Acarajé',
    description: 'Bolinho de feijão fradinho frito em azeite de dendê, recheado com vatapá, camarão e vinagrete.',
    price: 25.90,
    image: 'https://truffle-assets.tastemadecontent.net/14bd9e85-acaraje_l_thumb.jpg',
    category: 'Petiscos',
    is_available: true
  },
  {
    id: '3',
    name: 'Carne de Sol com Macaxeira',
    description: 'Carne de sol grelhada, acompanhada de macaxeira frita e manteiga de garrafa.',
    price: 45.90,
    image: 'https://espetinhodesucesso.com/wp-content/uploads/2024/10/Carne-de-sol-com-mandioca-na-panela-de-pressao.jpg',
    category: 'Pratos Principais',
    is_available: true
  },
  {
    id: '4',
    name: 'Cartola',
    description: 'Sobremesa típica com banana frita, queijo coalho e canela.',
    price: 18.90,
    image: '',
    category: 'Sobremesas',
    is_available: true
  },
  {
    id: '5',
    name: 'Caldinho de Feijão',
    description: 'Caldo cremoso de feijão, temperado com bacon, calabresa e temperos nordestinos.',
    price: 15.90,
    image: 'https://images.pexels.com/photos/6726447/pexels-photo-6726447.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    category: 'Petiscos',
    is_available: true
  },
  {
    id: '6',
    name: 'Tapioca Recheada',
    description: 'Tapioca recheada com carne de sol, queijo coalho e banana.',
    price: 22.90,
    image: 'https://images.pexels.com/photos/5946431/pexels-photo-5946431.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    category: 'Lanches',
    is_available: true
  }
];

const categories = [
  'Todos',
  'Pratos Principais',
  'Petiscos',
  'Lanches',
  'Sobremesas'
];

const MenuSection = () => {
  const [menuItems, setMenuItems] = useState(SAMPLE_MENU_ITEMS);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would fetch from Supabase
        // For now, we'll simulate a delay and use sample data
        setTimeout(() => {
          setMenuItems(SAMPLE_MENU_ITEMS);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setLoading(false);
      }
    };
    
    fetchMenuItems();
  }, []);
  
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'Todos' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  return (
    <section className="section">
      <div className="container-custom">
        <h2 className="title text-center">Nosso Cardápio</h2>
        
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="relative w-full md:w-64 mb-4 md:mb-0">
              <input
                type="text"
                placeholder="Buscar..."
                className="input w-full pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category 
                      ? 'bg-accent text-secondary' 
                      : 'bg-primary-light text-white hover:bg-primary'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {loading ? (
          <LoadingSpinner />
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <MenuItem
                key={item.id}
                id={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                category={item.category}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg">Nenhum item encontrado.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;