import { useState, useEffect, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, Search, Plus, Edit, Trash2, ArrowLeft, Save, X,
  Eye, Image, DollarSign, Tag
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Sample data (would come from Supabase in a real implementation)
const SAMPLE_MENU_ITEMS = [
  {
    id: '1',
    name: 'Baião de Dois',
    description: 'Prato tradicional nordestino com arroz, feijão de corda, queijo coalho e carne seca.',
    price: 39.90,
    image_url: 'https://images.pexels.com/photos/5836649/pexels-photo-5836649.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    category: 'Pratos Principais',
    is_available: true
  },
  {
    id: '2',
    name: 'Acarajé',
    description: 'Bolinho de feijão fradinho frito em azeite de dendê, recheado com vatapá, camarão e vinagrete.',
    price: 25.90,
    image_url: 'https://images.pexels.com/photos/5865511/pexels-photo-5865511.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    category: 'Petiscos',
    is_available: true
  },
  {
    id: '3',
    name: 'Carne de Sol com Macaxeira',
    description: 'Carne de sol grelhada, acompanhada de macaxeira frita e manteiga de garrafa.',
    price: 45.90,
    image_url: 'https://images.pexels.com/photos/6697469/pexels-photo-6697469.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    category: 'Pratos Principais',
    is_available: true
  },
  {
    id: '4',
    name: 'Cartola',
    description: 'Sobremesa típica com banana frita, queijo coalho e canela.',
    price: 18.90,
    image_url: 'https://images.pexels.com/photos/6483421/pexels-photo-6483421.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    category: 'Sobremesas',
    is_available: true
  },
  {
    id: '5',
    name: 'Caldinho de Feijão',
    description: 'Caldo cremoso de feijão, temperado com bacon, calabresa e temperos nordestinos.',
    price: 15.90,
    image_url: 'https://images.pexels.com/photos/6726447/pexels-photo-6726447.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    category: 'Petiscos',
    is_available: true
  },
  {
    id: '6',
    name: 'Tapioca Recheada',
    description: 'Tapioca recheada com carne de sol, queijo coalho e banana.',
    price: 22.90,
    image_url: 'https://images.pexels.com/photos/5946431/pexels-photo-5946431.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    category: 'Lanches',
    is_available: true
  }
];

const categories = [
  'Pratos Principais',
  'Petiscos',
  'Lanches',
  'Sobremesas',
  'Bebidas'
];

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_available: boolean;
}

const AdminMenus = () => {
  const { signOut } = useAuth();
  const [showSidebar, setShowSidebar] = useState(true);
  const [mobileView, setMobileView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  useEffect(() => {
    document.title = 'Sabor Digital - Gerenciar Cardápio';
    
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setShowSidebar(false);
        setMobileView(true);
      } else {
        setShowSidebar(true);
        setMobileView(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Fetch menu items (simulate loading from Supabase)
    setTimeout(() => {
      setMenuItems(SAMPLE_MENU_ITEMS);
      setIsLoading(false);
    }, 800);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleEditClick = (item: MenuItem) => {
    setEditItem(item);
    setImagePreview(item.image_url);
    setIsEditing(true);
  };
  
  const handleAddNew = () => {
    const newItem: MenuItem = {
      id: `temp_${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      image_url: '',
      category: categories[0],
      is_available: true
    };
    
    setEditItem(newItem);
    setImagePreview(null);
    setIsEditing(true);
  };
  
  const handleSave = () => {
    if (!editItem) return;
    
    if (!editItem.name || !editItem.description || !editItem.category || editItem.price <= 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    // Update image_url from preview if it exists
    if (imagePreview) {
      editItem.image_url = imagePreview;
    }
    
    // Check if it's a new item or existing one
    if (editItem.id.startsWith('temp_')) {
      // Add new item
      const newId = String(menuItems.length + 1);
      const newItem = { ...editItem, id: newId };
      setMenuItems([...menuItems, newItem]);
      toast.success('Item adicionado com sucesso!');
    } else {
      // Update existing item
      const updatedItems = menuItems.map(item => 
        item.id === editItem.id ? editItem : item
      );
      setMenuItems(updatedItems);
      toast.success('Item atualizado com sucesso!');
    }
    
    setIsEditing(false);
    setEditItem(null);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      setMenuItems(menuItems.filter(item => item.id !== id));
      toast.success('Item excluído com sucesso!');
    }
  };
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For demo purposes, we'll use a URL to simulate upload
      // In a real app, this would upload to Supabase storage
      const fakeUrl = URL.createObjectURL(file);
      setImagePreview(fakeUrl);
    }
  };
  
  const handleInputChange = (field: keyof MenuItem, value: string | number | boolean) => {
    if (!editItem) return;
    
    setEditItem({
      ...editItem,
      [field]: value
    });
  };
  
  return (
    <div className="min-h-screen bg-primary flex">
      {/* Sidebar */}
      <aside 
        className={`bg-secondary w-64 fixed h-full z-20 transition-all duration-300 ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } ${mobileView ? 'lg:translate-x-0' : ''}`}
      >
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-center">
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
            <span className="text-xl font-bold text-white">Admin</span>
          </div>
        </div>
        
        <nav className="py-6">
          <ul>
            <li>
              <Link 
                to="/admin" 
                className="flex items-center px-4 py-3 text-white hover:bg-primary-light hover:text-accent transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/orders" 
                className="flex items-center px-4 py-3 text-white hover:bg-primary-light hover:text-accent transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span>Pedidos</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/menus" 
                className="flex items-center px-4 py-3 bg-primary-light text-accent"
              >
                <Menu className="mr-3" size={18} />
                <span>Cardápios</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/appearance" 
                className="flex items-center px-4 py-3 text-white hover:bg-primary-light hover:text-accent transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span>Aparência</span>
              </Link>
            </li>
            <li>
              <button 
                onClick={signOut}
                className="w-full flex items-center px-4 py-3 text-white hover:bg-primary-light hover:text-accent transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Sair</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className={`flex-1 p-6 transition-all duration-300 ${showSidebar ? 'lg:ml-64' : ''}`}>
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md bg-primary-light"
          >
            <Menu />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold">Gerenciar Cardápio</h1>
          </div>
          
          <div>
            <button 
              onClick={handleAddNew}
              className="btn btn-primary flex items-center"
              disabled={isEditing}
            >
              <Plus size={18} className="mr-2" />
              Adicionar Item
            </button>
          </div>
        </div>
        
        {isEditing ? (
          // Edit Form
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditItem(null);
                }}
                className="flex items-center text-gray-400 hover:text-white"
              >
                <ArrowLeft size={18} className="mr-2" />
                Voltar
              </button>
              
              <h2 className="text-xl font-semibold">
                {editItem?.id.startsWith('temp_') ? 'Adicionar Novo Item' : 'Editar Item'}
              </h2>
              
              <button 
                onClick={handleSave}
                className="btn btn-primary flex items-center"
              >
                <Save size={18} className="mr-2" />
                Salvar
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Details */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nome*
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    value={editItem?.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Nome do item"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Descrição*
                  </label>
                  <textarea
                    className="input w-full resize-none"
                    rows={4}
                    value={editItem?.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Descreva o item com detalhes"
                    required
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Preço (R$)*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign size={16} className="text-gray-500" />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="input w-full pl-10"
                        value={editItem?.price || ''}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Categoria*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag size={16} className="text-gray-500" />
                      </div>
                      <select
                        className="input w-full pl-10"
                        value={editItem?.category || ''}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        required
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_available"
                    className="mr-2"
                    checked={editItem?.is_available || false}
                    onChange={(e) => handleInputChange('is_available', e.target.checked)}
                  />
                  <label htmlFor="is_available" className="text-sm text-gray-300">
                    Disponível para venda
                  </label>
                </div>
              </div>
              
              {/* Right Column - Image */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Imagem do Item
                </label>
                
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                      <button
                        onClick={() => setImagePreview(null)}
                        className="absolute top-2 right-2 bg-error rounded-full p-1"
                        type="button"
                      >
                        <X size={16} />
                      </button>
                      
                      <div className="flex justify-center">
                        <button
                          onClick={() => document.getElementById('image-upload')?.click()}
                          className="btn btn-secondary flex items-center"
                          type="button"
                        >
                          <Image size={16} className="mr-2" />
                          Alterar Imagem
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12">
                      <Image size={48} className="mx-auto text-gray-500 mb-4" />
                      <p className="text-gray-400 mb-4">
                        Arraste uma imagem ou clique para fazer upload
                      </p>
                      <button
                        onClick={() => document.getElementById('image-upload')?.click()}
                        className="btn btn-secondary flex items-center mx-auto"
                        type="button"
                      >
                        <Image size={16} className="mr-2" />
                        Upload de Imagem
                      </button>
                    </div>
                  )}
                  
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Formatos suportados: JPG, PNG. Tamanho máximo: 5MB
                  </p>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ou use uma URL de imagem
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link size={16} className="text-gray-500" />
                    </div>
                    <input
                      type="url"
                      className="input w-full pl-10"
                      placeholder="https://exemplo.com/imagem.jpg"
                      value={editItem?.image_url || ''}
                      onChange={(e) => {
                        handleInputChange('image_url', e.target.value);
                        setImagePreview(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          // Menu Items List
          <>
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  className="input w-full pl-10"
                  placeholder="Buscar itens..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              
              <div className="flex space-x-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                {categories.map((category) => (
                  <button
                    key={category}
                    className="px-3 py-1 whitespace-nowrap rounded-full text-sm bg-primary-light text-white hover:bg-primary"
                    onClick={() => setSearchTerm(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {isLoading ? (
              // Loading state
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
              </div>
            ) : filteredItems.length === 0 ? (
              // Empty state
              <div className="card text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mx-auto mb-4">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                <h2 className="text-xl font-semibold mb-2">Nenhum item encontrado</h2>
                <p className="text-gray-400 mb-6">
                  {searchTerm 
                    ? `Nenhum resultado para "${searchTerm}"`
                    : 'Ainda não há itens no cardápio'}
                </p>
                <button 
                  onClick={handleAddNew}
                  className="btn btn-primary flex items-center mx-auto"
                >
                  <Plus size={18} className="mr-2" />
                  Adicionar Primeiro Item
                </button>
              </div>
            ) : (
              // Menu items grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card group overflow-hidden"
                  >
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-accent text-secondary px-2 py-1 text-xs font-semibold rounded">
                        {item.category}
                      </div>
                      {!item.is_available && (
                        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                          <span className="bg-error text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Indisponível
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-accent font-bold">R$ {item.price.toFixed(2)}</span>
                        
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditClick(item)}
                            className="p-2 text-gray-400 hover:text-accent transition-colors"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-gray-400 hover:text-error transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                          <Link 
                            to="/"
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                            title="Visualizar no cardápio"
                          >
                            <Eye size={18} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminMenus;