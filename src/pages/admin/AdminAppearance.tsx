import { useState, useEffect, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, Save, Eye, Image, Palette, 
  Layout, Type, X, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';

// Sample themes
const colorPresets = [
  { primary: '#1E1E1E', accent: '#FFD700', label: 'Padrão (Preto e Dourado)' },
  { primary: '#1A1A2E', accent: '#4FC3F7', label: 'Azul Noturno' },
  { primary: '#121212', accent: '#FF4081', label: 'Escuro e Rosa' },
  { primary: '#1E1E1E', accent: '#4CAF50', label: 'Escuro e Verde' },
  { primary: '#2C3E50', accent: '#F39C12', label: 'Azul Marinho e Laranja' }
];

const AdminAppearance = () => {
  const { signOut } = useAuth();
  const { theme, updateTheme } = useTheme();
  const [showSidebar, setShowSidebar] = useState(true);
  const [mobileView, setMobileView] = useState(false);
  
  // Theme state
  const [primaryColor, setPrimaryColor] = useState('#1E1E1E');
  const [accentColor, setAccentColor] = useState('#FFD700');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  
  useEffect(() => {
    document.title = 'Sabor Digital - Personalizar Aparência';
    
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
    
    // Initialize with current theme settings
    setPrimaryColor(theme.bgColor.replace('bg-[', '').replace(']', '') || '#1E1E1E');
    setAccentColor(theme.accentColor.replace('text-[', '').replace(']', '') || '#FFD700');
    setLogoUrl(theme.logoUrl);
    setBackgroundUrl(theme.backgroundImage);
    
    if (theme.logoUrl) {
      setLogoPreview(theme.logoUrl);
    }
    
    if (theme.backgroundImage) {
      setBackgroundPreview(theme.backgroundImage);
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [theme]);
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For demo purposes, we'll use a URL to simulate upload
      // In a real app, this would upload to Supabase storage
      const fakeUrl = URL.createObjectURL(file);
      setLogoPreview(fakeUrl);
    }
  };
  
  const handleBackgroundChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For demo purposes, we'll use a URL to simulate upload
      // In a real app, this would upload to Supabase storage
      const fakeUrl = URL.createObjectURL(file);
      setBackgroundPreview(fakeUrl);
    }
  };
  
  const handleSave = () => {
    // Update theme in context and database
    updateTheme({
      bgColor: `bg-[${primaryColor}]`,
      accentColor: `text-[${accentColor}]`,
      logoUrl: logoPreview || '',
      backgroundImage: backgroundPreview || ''
    });
    
    toast.success('Aparência atualizada com sucesso!');
  };
  
  const applyColorPreset = (primary: string, accent: string) => {
    setPrimaryColor(primary);
    setAccentColor(accent);
  };
  
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };
  
  const resetToDefaults = () => {
    setPrimaryColor('#1E1E1E');
    setAccentColor('#FFD700');
    setLogoPreview(null);
    setLogoUrl('');
    setBackgroundPreview(null);
    setBackgroundUrl('');
    
    toast.success('Configurações restauradas para os valores padrão');
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
                className="flex items-center px-4 py-3 text-white hover:bg-primary-light hover:text-accent transition-colors"
              >
                <Menu className="mr-3" size={18} />
                <span>Cardápios</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/appearance" 
                className="flex items-center px-4 py-3 bg-primary-light text-accent"
              >
                <Palette className="mr-3" size={18} />
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
            <h1 className="text-2xl font-bold">Personalizar Aparência</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={togglePreviewMode}
              className={`btn ${previewMode ? 'btn-primary' : 'btn-secondary'} flex items-center`}
            >
              <Eye size={18} className="mr-2" />
              {previewMode ? 'Editando' : 'Visualizar'}
            </button>
            
            <button 
              onClick={handleSave}
              className="btn btn-primary flex items-center"
            >
              <Save size={18} className="mr-2" />
              Salvar
            </button>
          </div>
        </div>
        
        {previewMode ? (
          // Preview Mode
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-0 overflow-hidden"
          >
            <div className="relative h-64 overflow-hidden">
              {backgroundPreview ? (
                <img 
                  src={backgroundPreview} 
                  alt="Background Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span className="text-white text-opacity-50">Sem imagem de fundo</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {logoPreview ? (
                      <img 
                        src={logoPreview} 
                        alt="Logo Preview" 
                        className="h-20 object-contain"
                      />
                    ) : (
                      <div className="flex items-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="40" 
                          height="40" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          style={{ color: accentColor }}
                          className="mr-2"
                        >
                          <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
                          <line x1="6" y1="17" x2="18" y2="17"></line>
                        </svg>
                        <span className="text-3xl font-bold text-white">Sabor Digital</span>
                      </div>
                    )}
                  </div>
                  
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Cardápios Digitais<br />
                    <span style={{ color: accentColor }}>Personalizáveis</span>
                  </h1>
                  
                  <button 
                    className="mt-4 px-6 py-2 rounded-lg font-medium"
                    style={{ backgroundColor: accentColor, color: primaryColor }}
                  >
                    Ver Cardápio
                  </button>
                </div>
              </div>
              
              <button 
                onClick={togglePreviewMode}
                className="absolute top-4 right-4 bg-primary-dark p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6" style={{ backgroundColor: primaryColor }}>
              <h2 className="text-xl font-semibold mb-4 text-white">Cardápio</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden" style={{ backgroundColor: primaryColor, borderColor: accentColor, borderWidth: '1px' }}>
                  <div className="h-32 bg-gray-700"></div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white">Nome do Prato</h3>
                    <p className="text-gray-400 text-sm mb-2">Descrição do prato aqui...</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold" style={{ color: accentColor }}>R$ 29,90</span>
                      <button 
                        className="px-3 py-1 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: accentColor, color: primaryColor }}
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg overflow-hidden" style={{ backgroundColor: primaryColor, borderColor: accentColor, borderWidth: '1px' }}>
                  <div className="h-32 bg-gray-700"></div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white">Nome do Prato</h3>
                    <p className="text-gray-400 text-sm mb-2">Descrição do prato aqui...</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold" style={{ color: accentColor }}>R$ 29,90</span>
                      <button 
                        className="px-3 py-1 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: accentColor, color: primaryColor }}
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={togglePreviewMode}
                className="mt-6 btn btn-secondary flex items-center mx-auto"
              >
                <X size={18} className="mr-2" />
                Sair da Visualização
              </button>
            </div>
          </motion.div>
        ) : (
          // Edit Mode
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Colors */}
            <div>
              <div className="card mb-6">
                <div className="flex items-center mb-4">
                  <Palette size={20} className="text-accent mr-2" />
                  <h2 className="text-xl font-semibold">Cores</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Cor Primária (Fundo)
                    </label>
                    <div className="flex">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-10 w-10 rounded-l-md cursor-pointer"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="input rounded-l-none w-full"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Cor de Destaque (Acentos)
                    </label>
                    <div className="flex">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="h-10 w-10 rounded-l-md cursor-pointer"
                      />
                      <input
                        type="text"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="input rounded-l-none w-full"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-300 mb-3">
                    Presets de Cores
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {colorPresets.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => applyColorPreset(preset.primary, preset.accent)}
                        className="p-3 rounded-lg border border-gray-700 hover:border-accent transition-colors"
                      >
                        <div className="flex space-x-2 mb-2">
                          <div 
                            className="w-6 h-6 rounded-full" 
                            style={{ backgroundColor: preset.primary }}
                          ></div>
                          <div 
                            className="w-6 h-6 rounded-full" 
                            style={{ backgroundColor: preset.accent }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400">{preset.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center mb-4">
                  <Type size={20} className="text-accent mr-2" />
                  <h2 className="text-xl font-semibold">Tipografia</h2>
                </div>
                
                <p className="text-gray-400 text-sm mb-4">
                  A fonte padrão do sistema é Inter, uma fonte moderna e legível para todos os dispositivos.
                </p>
                
                <div className="space-y-4">
                  <div className="border border-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Título Principal</p>
                    <h1 className="text-2xl font-bold">Sabor Digital</h1>
                  </div>
                  
                  <div className="border border-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Subtítulo</p>
                    <h2 className="text-xl font-semibold">Cardápio</h2>
                  </div>
                  
                  <div className="border border-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Texto Normal</p>
                    <p className="text-base">Este é um exemplo de texto normal.</p>
                  </div>
                  
                  <div className="border border-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Texto Pequeno</p>
                    <p className="text-sm text-gray-400">Este é um exemplo de texto pequeno.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Middle Column - Logo and Layout */}
            <div>
              <div className="card mb-6">
                <div className="flex items-center mb-4">
                  <Image size={20} className="text-accent mr-2" />
                  <h2 className="text-xl font-semibold">Logo</h2>
                </div>
                
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                  {logoPreview ? (
                    <div className="relative">
                      <img 
                        src={logoPreview} 
                        alt="Logo Preview" 
                        className="max-h-48 object-contain mx-auto mb-4"
                      />
                      <button
                        onClick={() => setLogoPreview(null)}
                        className="absolute top-2 right-2 bg-error rounded-full p-1"
                        type="button"
                      >
                        <X size={16} />
                      </button>
                      
                      <div className="flex justify-center">
                        <button
                          onClick={() => document.getElementById('logo-upload')?.click()}
                          className="btn btn-secondary flex items-center"
                          type="button"
                        >
                          <Image size={16} className="mr-2" />
                          Alterar Logo
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
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        className="btn btn-secondary flex items-center mx-auto"
                        type="button"
                      >
                        <Image size={16} className="mr-2" />
                        Upload de Logo
                      </button>
                    </div>
                  )}
                  
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Formatos suportados: JPG, PNG, SVG. Tamanho recomendado: 200 x 80px
                  </p>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Ou use uma URL de imagem
                  </label>
                  <input
                    type="url"
                    className="input w-full"
                    placeholder="https://exemplo.com/logo.png"
                    value={logoUrl}
                    onChange={(e) => {
                      setLogoUrl(e.target.value);
                      setLogoPreview(e.target.value);
                    }}
                  />
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center mb-4">
                  <Layout size={20} className="text-accent mr-2" />
                  <h2 className="text-xl font-semibold">Layout</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="border border-gray-700 rounded-lg p-3 flex items-center">
                    <input
                      type="radio"
                      id="layout_1"
                      name="layout"
                      className="mr-3"
                      checked
                    />
                    <div>
                      <label htmlFor="layout_1" className="font-medium">Layout Padrão</label>
                      <p className="text-sm text-gray-400">
                        Cabeçalho + Menu + Rodapé
                      </p>
                    </div>
                  </div>
                  
                  <div className="border border-gray-700 rounded-lg p-3 flex items-center opacity-50">
                    <input
                      type="radio"
                      id="layout_2"
                      name="layout"
                      className="mr-3"
                      disabled
                    />
                    <div>
                      <label htmlFor="layout_2" className="font-medium">Layout Minimalista</label>
                      <p className="text-sm text-gray-400">
                        Apenas Menu (em breve)
                      </p>
                    </div>
                  </div>
                  
                  <div className="border border-gray-700 rounded-lg p-3 flex items-center opacity-50">
                    <input
                      type="radio"
                      id="layout_3"
                      name="layout"
                      className="mr-3"
                      disabled
                    />
                    <div>
                      <label htmlFor="layout_3" className="font-medium">Layout de Página Única</label>
                      <p className="text-sm text-gray-400">
                        Tudo em uma página (em breve)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Background and Reset */}
            <div>
              <div className="card mb-6">
                <div className="flex items-center mb-4">
                  <Image size={20} className="text-accent mr-2" />
                  <h2 className="text-xl font-semibold">Imagem de Fundo</h2>
                </div>
                
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                  {backgroundPreview ? (
                    <div className="relative">
                      <img 
                        src={backgroundPreview} 
                        alt="Background Preview" 
                        className="h-48 w-full object-cover rounded-lg mb-4"
                      />
                      <button
                        onClick={() => setBackgroundPreview(null)}
                        className="absolute top-2 right-2 bg-error rounded-full p-1"
                        type="button"
                      >
                        <X size={16} />
                      </button>
                      
                      <div className="flex justify-center">
                        <button
                          onClick={() => document.getElementById('background-upload')?.click()}
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
                        onClick={() => document.getElementById('background-upload')?.click()}
                        className="btn btn-secondary flex items-center mx-auto"
                        type="button"
                      >
                        <Image size={16} className="mr-2" />
                        Upload de Imagem
                      </button>
                    </div>
                  )}
                  
                  <input
                    id="background-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBackgroundChange}
                  />
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Formatos suportados: JPG, PNG. Tamanho recomendado: 1920 x 1080px
                  </p>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Ou use uma URL de imagem
                  </label>
                  <input
                    type="url"
                    className="input w-full"
                    placeholder="https://exemplo.com/background.jpg"
                    value={backgroundUrl}
                    onChange={(e) => {
                      setBackgroundUrl(e.target.value);
                      setBackgroundPreview(e.target.value);
                    }}
                  />
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center mb-4">
                  <RefreshCw size={20} className="text-accent mr-2" />
                  <h2 className="text-xl font-semibold">Restaurar Padrões</h2>
                </div>
                
                <p className="text-gray-400 text-sm mb-6">
                  Se desejar, você pode restaurar todas as configurações de aparência para os valores padrão.
                </p>
                
                <button 
                  onClick={resetToDefaults}
                  className="btn btn-outline w-full flex items-center justify-center"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Restaurar Configurações Padrão
                </button>
                
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={togglePreviewMode}
                      className="btn btn-secondary flex items-center"
                    >
                      <Eye size={16} className="mr-2" />
                      Visualizar
                    </button>
                    
                    <button 
                      onClick={handleSave}
                      className="btn btn-primary flex items-center"
                    >
                      <Save size={16} className="mr-2" />
                      Salvar Alterações
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminAppearance;