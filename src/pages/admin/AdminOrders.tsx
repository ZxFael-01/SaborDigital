import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, Search, Filter, Download, RefreshCw,
  Eye, CheckCircle, XCircle, Clock, Calendar, ArrowRight, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ExcelJS from 'exceljs';

// Sample data (would come from Supabase in a real implementation)
const SAMPLE_ORDERS = [
  {
    id: '1',
    customer: 'João Silva',
    email: 'joao@example.com',
    phone: '(83) 98765-4321',
    total: 78.90,
    status: 'completed',
    payment_method: 'credit_card',
    is_delivery: true,
    address: 'Rua das Flores, 123',
    created_at: '2023-06-15T14:30:00Z',
    items: [
      { id: '1', name: 'Baião de Dois', quantity: 1, price: 39.90 },
      { id: '2', name: 'Acarajé', quantity: 1, price: 25.90 },
      { id: '5', name: 'Caldinho de Feijão', quantity: 1, price: 15.90 }
    ]
  },
  {
    id: '2',
    customer: 'Maria Oliveira',
    email: 'maria@example.com',
    phone: '(83) 98765-1234',
    total: 45.50,
    status: 'processing',
    payment_method: 'pix',
    is_delivery: false,
    address: '',
    created_at: '2023-06-15T15:20:00Z',
    items: [
      { id: '3', name: 'Carne de Sol com Macaxeira', quantity: 1, price: 45.90 }
    ]
  },
  {
    id: '3',
    customer: 'Pedro Santos',
    email: 'pedro@example.com',
    phone: '(83) 99876-5432',
    total: 120.75,
    status: 'pending',
    payment_method: 'cash',
    is_delivery: true,
    address: 'Av. Principal, 456',
    created_at: '2023-06-15T16:10:00Z',
    items: [
      { id: '1', name: 'Baião de Dois', quantity: 2, price: 39.90 },
      { id: '3', name: 'Carne de Sol com Macaxeira', quantity: 1, price: 45.90 }
    ]
  },
  {
    id: '4',
    customer: 'Ana Costa',
    email: 'ana@example.com',
    phone: '(83) 98712-3456',
    total: 35.90,
    status: 'completed',
    payment_method: 'debit_card',
    is_delivery: false,
    address: '',
    created_at: '2023-06-15T12:45:00Z',
    items: [
      { id: '6', name: 'Tapioca Recheada', quantity: 1, price: 22.90 },
      { id: '5', name: 'Caldinho de Feijão', quantity: 1, price: 15.90 }
    ]
  },
  {
    id: '5',
    customer: 'Carlos Ferreira',
    email: 'carlos@example.com',
    phone: '(83) 99812-3456',
    total: 92.30,
    status: 'completed',
    payment_method: 'credit_card',
    is_delivery: true,
    address: 'Rua do Comércio, 789',
    created_at: '2023-06-15T11:15:00Z',
    items: [
      { id: '3', name: 'Carne de Sol com Macaxeira', quantity: 2, price: 45.90 }
    ]
  }
];

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment_method: string;
  is_delivery: boolean;
  address: string;
  created_at: string;
  items: OrderItem[];
}

const statusLabels = {
  pending: 'Pendente',
  processing: 'Em Preparo',
  completed: 'Concluído',
  cancelled: 'Cancelado'
};

const statusIcons = {
  pending: <Clock className="text-white" />,
  processing: <RefreshCw className="text-warning" />,
  completed: <CheckCircle className="text-success" />,
  cancelled: <XCircle className="text-error" />
};

const statusColors = {
  pending: 'bg-primary-light',
  processing: 'bg-warning/20 text-warning',
  completed: 'bg-success/20 text-success',
  cancelled: 'bg-error/20 text-error'
};

const paymentLabels = {
  credit_card: 'Cartão de Crédito',
  debit_card: 'Cartão de Débito',
  pix: 'PIX',
  cash: 'Dinheiro'
};

const AdminOrders = () => {
  const { signOut } = useAuth();
  const [showSidebar, setShowSidebar] = useState(true);
  const [mobileView, setMobileView] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  
  useEffect(() => {
    document.title = 'Sabor Digital - Gerenciar Pedidos';
    
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
    
    // Fetch orders (simulate loading from Supabase)
    setTimeout(() => {
      setOrders(SAMPLE_ORDERS);
      setIsLoading(false);
    }, 800);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Search term filter
    const matchesSearch = 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.includes(searchTerm);
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    // Date filter
    let matchesDate = true;
    const orderDate = new Date(order.created_at);
    const today = new Date();
    
    if (dateFilter === 'today') {
      matchesDate = 
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear();
    } else if (dateFilter === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      matchesDate = orderDate >= oneWeekAgo;
    } else if (dateFilter === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      matchesDate = orderDate >= oneMonthAgo;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  const getCurrentOrder = () => {
    return orders.find(order => order.id === currentOrderId) || null;
  };
  
  const handleStatusChange = (orderId: string, newStatus: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus } 
        : order
    );
    
    setOrders(updatedOrders);
    toast.success(`Pedido #${orderId} atualizado para ${statusLabels[newStatus]}`);
  };
  
  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Pedidos');
    
    // Add headers
    worksheet.addRow([
      'ID', 'Cliente', 'Email', 'Telefone', 'Total', 'Status', 
      'Forma de Pagamento', 'Entrega', 'Endereço', 'Data'
    ]);
    
    // Add data
    filteredOrders.forEach(order => {
      worksheet.addRow([
        order.id,
        order.customer,
        order.email,
        order.phone,
        order.total,
        statusLabels[order.status],
        paymentLabels[order.payment_method as keyof typeof paymentLabels],
        order.is_delivery ? 'Sim' : 'Não',
        order.address,
        new Date(order.created_at).toLocaleString('pt-BR')
      ]);
    });
    
    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    
    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 15;
    });
    
    // Generate and download the file
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pedidos.xlsx';
      a.click();
      URL.revokeObjectURL(url);
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
                className="flex items-center px-4 py-3 bg-primary-light text-accent"
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
            <h1 className="text-2xl font-bold">Gerenciar Pedidos</h1>
          </div>
          
          <div>
            <button 
              onClick={exportToExcel}
              className="btn btn-primary flex items-center"
            >
              <Download size={18} className="mr-2" />
              Exportar
            </button>
          </div>
        </div>
        
        {currentOrderId ? (
          // Order Details View
          <OrderDetails 
            order={getCurrentOrder()} 
            onBack={() => setCurrentOrderId(null)}
            onStatusChange={handleStatusChange}
          />
        ) : (
          // Orders List View
          <>
            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  className="input w-full pl-10"
                  placeholder="Buscar por cliente ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={16} className="text-gray-500" />
                </div>
                <select
                  className="input w-full pl-10 appearance-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos os Status</option>
                  <option value="pending">Pendente</option>
                  <option value="processing">Em Preparo</option>
                  <option value="completed">Concluído</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-500" />
                </div>
                <select
                  className="input w-full pl-10 appearance-none"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">Todo o Período</option>
                  <option value="today">Hoje</option>
                  <option value="week">Última Semana</option>
                  <option value="month">Último Mês</option>
                </select>
              </div>
            </div>
            
            {isLoading ? (
              // Loading State
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              // Empty State
              <div className="card text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mx-auto mb-4">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <h2 className="text-xl font-semibold mb-2">Nenhum pedido encontrado</h2>
                <p className="text-gray-400 mb-6">
                  {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                    ? 'Nenhum pedido corresponde aos filtros selecionados'
                    : 'Ainda não há pedidos registrados'}
                </p>
              </div>
            ) : (
              // Orders Table
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="py-3 px-4 text-left">ID</th>
                        <th className="py-3 px-4 text-left">Cliente</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Data</th>
                        <th className="py-3 px-4 text-right">Total</th>
                        <th className="py-3 px-4 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentOrders.map((order) => (
                        <motion.tr 
                          key={order.id} 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b border-gray-800"
                        >
                          <td className="py-3 px-4">#{order.id}</td>
                          <td className="py-3 px-4">{order.customer}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              statusColors[order.status]
                            }`}>
                              <span className="mr-1">{statusIcons[order.status]}</span>
                              {statusLabels[order.status]}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {new Date(order.created_at).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="py-3 px-4 text-right">R$ {order.total.toFixed(2)}</td>
                          <td className="py-3 px-4 text-center">
                            <button 
                              onClick={() => setCurrentOrderId(order.id)}
                              className="p-2 text-gray-400 hover:text-accent transition-colors"
                              title="Ver Detalhes"
                            >
                              <Eye size={18} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 flex justify-between items-center border-t border-gray-800">
                    <div className="text-gray-400 text-sm">
                      Mostrando {indexOfFirstOrder + 1} - {Math.min(indexOfLastOrder, filteredOrders.length)} de {filteredOrders.length} pedidos
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md ${
                          currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-accent hover:bg-primary-light'
                        }`}
                      >
                        <ArrowLeft size={16} />
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => paginate(i + 1)}
                          className={`w-8 h-8 rounded-md ${
                            currentPage === i + 1 
                              ? 'bg-accent text-secondary' 
                              : 'text-gray-400 hover:text-accent hover:bg-primary-light'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      <button 
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md ${
                          currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-accent hover:bg-primary-light'
                        }`}
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

interface OrderDetailsProps {
  order: Order | null;
  onBack: () => void;
  onStatusChange: (orderId: string, newStatus: 'pending' | 'processing' | 'completed' | 'cancelled') => void;
}

const OrderDetails = ({ order, onBack, onStatusChange }: OrderDetailsProps) => {
  if (!order) return null;
  
  const formatWhatsAppLink = () => {
    let message = `*Atualização do Pedido #${order.id}*\n\n`;
    message += `Olá ${order.customer},\n\n`;
    message += `O status do seu pedido foi atualizado para: *${statusLabels[order.status]}*.\n\n`;
    message += `Agradecemos a preferência!\n`;
    message += `Equipe Sabor Digital`;
    
    return `https://wa.me/${order.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-400 hover:text-white"
        >
          <ArrowLeft size={18} className="mr-2" />
          Voltar para Lista
        </button>
        
        <div className="flex space-x-3">
          <a 
            href={formatWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Enviar WhatsApp
          </a>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Info */}
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Detalhes do Pedido #{order.id}</h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                statusColors[order.status]
              }`}>
                <span className="mr-2">{statusIcons[order.status]}</span>
                {statusLabels[order.status]}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Data e Hora</h3>
                <p className="mb-4">
                  {new Date(order.created_at).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                
                <h3 className="text-sm font-medium text-gray-500 mb-1">Cliente</h3>
                <p className="mb-4">{order.customer}</p>
                
                <h3 className="text-sm font-medium text-gray-500 mb-1">Contato</h3>
                <p className="mb-1">Email: {order.email}</p>
                <p className="mb-4">Telefone: {order.phone}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Forma de Pagamento</h3>
                <p className="mb-4">
                  {paymentLabels[order.payment_method as keyof typeof paymentLabels]}
                </p>
                
                <h3 className="text-sm font-medium text-gray-500 mb-1">Entrega</h3>
                <p className="mb-1">{order.is_delivery ? 'Entrega' : 'Retirada'}</p>
                {order.is_delivery && order.address && (
                  <>
                    <h3 className="text-sm font-medium text-gray-500 mb-1 mt-4">Endereço</h3>
                    <p>{order.address}</p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Itens do Pedido</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-3 px-4 text-left">Item</th>
                    <th className="py-3 px-4 text-center">Quantidade</th>
                    <th className="py-3 px-4 text-right">Preço Unit.</th>
                    <th className="py-3 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-800">
                      <td className="py-3 px-4">{item.name}</td>
                      <td className="py-3 px-4 text-center">{item.quantity}</td>
                      <td className="py-3 px-4 text-right">R$ {item.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">R$ {(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-700">
                    <td colSpan={3} className="py-3 px-4 text-right font-semibold">Total do Pedido:</td>
                    <td className="py-3 px-4 text-right font-bold text-accent">R$ {order.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        
        {/* Right Column - Actions */}
        <div>
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-6">Atualizar Status</h2>
            
            <div className="space-y-3">
              <button 
                onClick={() => onStatusChange(order.id, 'pending')}
                className={`w-full py-3 px-4 rounded-lg flex items-center justify-between ${
                  order.status === 'pending' ? 'bg-primary-light' : 'bg-primary-dark hover:bg-primary-light'
                } transition-colors`}
              >
                <div className="flex items-center">
                  <Clock size={18} className="mr-3" />
                  <span>Pendente</span>
                </div>
                {order.status === 'pending' && (
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                )}
              </button>
              
              <button 
                onClick={() => onStatusChange(order.id, 'processing')}
                className={`w-full py-3 px-4 rounded-lg flex items-center justify-between ${
                  order.status === 'processing' ? 'bg-primary-light' : 'bg-primary-dark hover:bg-primary-light'
                } transition-colors`}
              >
                <div className="flex items-center">
                  <RefreshCw size={18} className="mr-3 text-warning" />
                  <span>Em Preparo</span>
                </div>
                {order.status === 'processing' && (
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                )}
              </button>
              
              <button 
                onClick={() => onStatusChange(order.id, 'completed')}
                className={`w-full py-3 px-4 rounded-lg flex items-center justify-between ${
                  order.status === 'completed' ? 'bg-primary-light' : 'bg-primary-dark hover:bg-primary-light'
                } transition-colors`}
              >
                <div className="flex items-center">
                  <CheckCircle size={18} className="mr-3 text-success" />
                  <span>Concluído</span>
                </div>
                {order.status === 'completed' && (
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                )}
              </button>
              
              <button 
                onClick={() => onStatusChange(order.id, 'cancelled')}
                className={`w-full py-3 px-4 rounded-lg flex items-center justify-between ${
                  order.status === 'cancelled' ? 'bg-primary-light' : 'bg-primary-dark hover:bg-primary-light'
                } transition-colors`}
              >
                <div className="flex items-center">
                  <XCircle size={18} className="mr-3 text-error" />
                  <span>Cancelado</span>
                </div>
                {order.status === 'cancelled' && (
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                )}
              </button>
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Ações</h2>
            
            <div className="space-y-3">
              <a 
                href={formatWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Notificar Cliente
              </a>
              
              <button 
                onClick={onBack}
                className="btn btn-secondary w-full"
              >
                Voltar para a Lista
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminOrders;