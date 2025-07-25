import React, { useState, useEffect, memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, FileText, Bell, MessageCircle, Search, Download, Award, AlertTriangle, CheckCircle, Clock, Users, Building, Zap, ChevronDown, ChevronUp, Send, Moon, Sun, Menu, X, IndianRupee } from 'lucide-react';

// --- Theme Provider Context ---
const ThemeContext = React.createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('bizboost-theme') || 'light';
    setTheme(savedTheme);
    
    // Apply theme to document immediately
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bizboost-theme', theme);
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// --- Typing Animation Component ---
const TypingAnimation = ({ text, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return (
    <span>
      {displayedText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

// --- User Dropdown Component ---
const UserDropdown = ({ currentScenario, setCurrentScenario, scenarios }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentBusiness = scenarios[currentScenario];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
      >
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
          {currentBusiness.name.charAt(0)}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="py-1">
              {Object.entries(scenarios).map(([key, business]) => (
                <button
                  key={key}
                  onClick={() => {
                    setCurrentScenario(key);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    currentScenario === key 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {business.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{business.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{business.type}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// --- Enhanced ChatbotWidget Component ---
const ChatbotWidget = memo(({
    showChatbot,
    setShowChatbot,
    chatMessages,
    chatInput,
    setChatInput,
    isTyping,
    handleSendMessage
}) => {
  const { theme } = useTheme();
  
  return (
    <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 transition-all duration-500 ease-out z-50 ${
      showChatbot ? 'w-full sm:w-80 h-[80vh] sm:h-96 max-w-sm' : 'w-14 h-14 sm:w-16 sm:h-16'
    }`}>
      {showChatbot ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-full backdrop-blur-xl">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl sm:rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4" />
              </div>
              <h4 className="font-semibold">AI Business Advisor</h4>
            </div>
            <button
              onClick={() => setShowChatbot(false)}
              className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            <div className="space-y-3">
              {chatMessages.map((message) => (
                <div key={message.id} className={`${
                  message.isBot 
                    ? 'bg-gray-100 dark:bg-gray-800 mr-8' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white ml-8'
                } rounded-2xl p-3 shadow-sm`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              ))}
              {isTyping && (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-3 mr-8">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask me anything..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isTyping}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowChatbot(true)}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-105"
        >
          <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8" />
        </button>
      )}
    </div>
  );
});

// --- Enhanced DashboardView Component ---
const DashboardView = memo(({
    currentBusiness,
    currentScenario,
    scenarios,
    setCurrentScenario,
    scenarioResults,
    scenarioName,
    setScenarioResults
}) => {
  const { theme } = useTheme();
  
  const getWelcomeMessage = () => {
    const businessName = currentBusiness.name.split("'s")[0];
    return `Welcome back, ${businessName}! Your ${currentBusiness.type.toLowerCase()} business is looking strong today.`;
  };
  
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-sm p-6 text-white">
        <div className="flex items-center gap-3">
            <div className="hidden sm:flex w-12 h-12 bg-blue-200 rounded-xl items-center justify-center">
            <span className="text-xl font-bold text-blue-600">
                {currentBusiness.name.charAt(0)}
            </span>
            </div>
          <div className="text-lg font-medium">
            <TypingAnimation text={getWelcomeMessage()} speed={30} />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            title: "Current Cash",
            value: `₹${currentBusiness.currentCash.toLocaleString()}`,
            icon: IndianRupee,
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
            iconColor: "text-blue-600 dark:text-blue-400",
            change: "+5.2% from last month",
            positive: true
          },
          {
            title: "Monthly Revenue",
            value: `₹${currentBusiness.monthlyRevenue.toLocaleString()}`,
            icon: TrendingUp,
            bgColor: "bg-green-100 dark:bg-green-900/30",
            iconColor: "text-green-600 dark:text-green-400",
            change: "-2.1% from last month",
            positive: false
          },
          {
            title: "Employees",
            value: currentBusiness.employees,
            icon: Users,
            bgColor: "bg-purple-100 dark:bg-purple-900/30",
            iconColor: "text-purple-600 dark:text-purple-400",
            change: "Stable workforce",
            positive: null
          },
          {
            title: "Business Type",
            value: currentBusiness.type,
            icon: Building,
            bgColor: "bg-orange-100 dark:bg-orange-900/30",
            iconColor: "text-orange-600 dark:text-orange-400",
            change: "Growing sector",
            positive: null
          }
        ].map((metric, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-all duration-300 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{metric.value}</p>
              </div>
              <div className={`h-10 w-10 sm:h-12 sm:w-12 ${metric.bgColor} rounded-xl flex items-center justify-center`}>
                <metric.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${metric.iconColor}`} />
              </div>
            </div>
            <p className={`text-xs mt-2 ${
              metric.positive === true ? 'text-green-600 dark:text-green-400' :
              metric.positive === false ? 'text-red-600 dark:text-red-400' :
              'text-gray-600 dark:text-gray-400'
            }`}>
              {metric.positive === true && '↗ '}
              {metric.positive === false && '↘ '}
              {metric.change}
            </p>
          </div>
        ))}
      </div>

      {/* Scenario Results */}
      {scenarioResults && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">"What-If" Scenario: {scenarioName}</h3>
            <button
              onClick={() => setScenarioResults(null)}
              className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
            >
              Clear Scenario
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800">
              <h4 className="font-semibold text-md mb-2 text-gray-900 dark:text-white">Current Business</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">Monthly Revenue: <span className="font-medium">${currentBusiness.monthlyRevenue.toLocaleString()}</span></p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Employees: <span className="font-medium">{currentBusiness.employees}</span></p>
            </div>
            <div className="border border-blue-200 dark:border-blue-700 rounded-xl p-4 bg-blue-50 dark:bg-blue-900/20">
              <h4 className="font-semibold text-md mb-2 text-gray-900 dark:text-white">Simulated Business</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">Monthly Revenue: <span className="font-medium text-blue-700 dark:text-blue-400">${scenarioResults.monthlyRevenue.toLocaleString()}</span></p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Employees: <span className="font-medium text-blue-700 dark:text-blue-400">{scenarioResults.employees}</span></p>
            </div>
          </div>

          <h4 className="font-semibold text-md mb-4 text-gray-900 dark:text-white">Simulated 90-Day Cash Flow Prediction</h4>
          <div className="h-64 sm:h-80 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scenarioResults.cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="month" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: theme === 'dark' ? '#ffffff' : '#000000'
                  }}
                  formatter={(value, name) => [
                    `$${value?.toLocaleString()}`,
                    name === 'Actual' ? 'Actual Cash Flow' : 'AI Predicted Cash Flow'
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Actual (Scenario)"
                  dot={{ fill: '#3b82f6', strokeWidth: 1, r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#10b981"
                  strokeWidth={3}
                  strokeDasharray="8 4"
                  name="AI Predicted (Scenario)"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Original Cash Flow Prediction */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">90-Day Cash Flow Prediction</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Zap className="h-4 w-4" />
            AI Powered
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-blue-500"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Actual Cash Flow</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">(Historical Data)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-500 border-dashed border-t-2 border-green-500"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Predicted</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">(Future Forecast)</span>
          </div>
        </div>

        <div className="h-64 sm:h-80 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentBusiness.cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="month" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: theme === 'dark' ? '#ffffff' : '#000000'
                }}
                formatter={(value, name) => [
                  `$${value?.toLocaleString()}`,
                  name === 'Actual' ? 'Actual Cash Flow' : 'AI Predicted Cash Flow'
                ]}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Actual"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#10b981"
                strokeWidth={3}
                strokeDasharray="8 4"
                name="AI Predicted"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <span className="font-medium text-yellow-800 dark:text-yellow-400">AI Insight:</span>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            {currentScenario === 'sarah' && "Cash flow dip predicted for September (-37%). Consider reducing inventory orders and exploring short-term financing options."}
            {currentScenario === 'mike' && "Strong growth trajectory predicted. Consider scaling operations and investing in additional development resources."}
            {currentScenario === 'lisa' && "Holiday season boost expected. Plan inventory increases for November-December peak period."}
          </p>
        </div>
      </div>

      {/* Industry Benchmarks & Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 backdrop-blur-xl">
          <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Industry Benchmarks</h3>
          <div className="space-y-4">
            {currentBusiness.benchmarkData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{item.metric}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Industry avg: {item.benchmark}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 dark:text-white">{item.value}</span>
                  {item.status === 'good' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 backdrop-blur-xl">
          <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Expense Breakdown</h3>
          <div className="h-48 sm:h-64 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentBusiness.expenseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {currentBusiness.expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: theme === 'dark' ? '#ffffff' : '#000000'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            {currentBusiness.expenseData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

// --- Enhanced AlertsView Component ---
const AlertsView = memo(({ activeAlerts, criticalAlerts, warningAlerts, dismissAlert, takeAction, isActionTaken }) => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[
          {
            title: "Critical Alerts",
            value: criticalAlerts,
            icon: AlertTriangle,
            bgColor: "bg-red-100 dark:bg-red-900/30",
            iconColor: "text-red-600 dark:text-red-400",
            textColor: "text-red-600 dark:text-red-400",
            description: "Requires immediate action"
          },
          {
            title: "Warning Alerts",
            value: warningAlerts,
            icon: Clock,
            bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
            iconColor: "text-yellow-600 dark:text-yellow-400",
            textColor: "text-yellow-600 dark:text-yellow-400",
            description: "Action needed soon"
          },
          {
            title: "Opportunities",
            value: activeAlerts.filter(a => a.type === 'info').length,
            icon: TrendingUp,
            bgColor: "bg-green-100 dark:bg-green-900/30",
            iconColor: "text-green-600 dark:text-green-400",
            textColor: "text-green-600 dark:text-green-400",
            description: "Growth opportunities identified"
          }
        ].map((alert, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-all duration-300 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{alert.title}</p>
                <p className={`text-2xl font-bold ${alert.textColor}`}>{alert.value}</p>
              </div>
              <div className={`h-10 w-10 sm:h-12 sm:w-12 ${alert.bgColor} rounded-xl flex items-center justify-center`}>
                <alert.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${alert.iconColor}`} />
              </div>
            </div>
            <p className={`text-xs ${alert.textColor} mt-2`}>{alert.description}</p>
          </div>
        ))}
      </div>

      {/* Active Alerts */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 backdrop-blur-xl">
        <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Active Alerts & Recommendations</h3>

        {activeAlerts.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">All Clear!</h4>
            <p className="text-gray-600 dark:text-gray-400">No active alerts for your business right now.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeAlerts.map((alert) => (
              <div key={alert.id} className={`border-2 rounded-2xl p-4 sm:p-6 transition-all duration-300 ${
                alert.type === 'critical' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' :
                alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20' :
                'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
              }`}>
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-xl ${
                        alert.type === 'critical' ? 'bg-red-100 dark:bg-red-900/30' :
                        alert.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                        'bg-green-100 dark:bg-green-900/30'
                      }`}>
                        {alert.type === 'critical' ? (
                          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        )}
                      </div>
                      <div>
                        <h4 className={`font-semibold ${
                          alert.type === 'critical' ? 'text-red-800 dark:text-red-400' :
                          'text-yellow-800 dark:text-yellow-400'
                        }`}>{alert.title}</h4>
                        <p className={`text-sm ${
                          alert.type === 'critical' ? 'text-red-700 dark:text-red-300' :
                          'text-yellow-700 dark:text-yellow-300'
                        }`}>{alert.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Impact Level</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{alert.impact}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Action Deadline</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{alert.deadline}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Category</p>
                        <p className="font-semibold capitalize text-gray-900 dark:text-white">{alert.category.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Recommended Actions:</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {alert.actions.map((action) => (
                        <button
                        key={action.id}
                        onClick={() => takeAction(alert.id, action.id)}
                        disabled={isActionTaken(alert.id, action.id)}
                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                            isActionTaken(alert.id, action.id)
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        >
                        {isActionTaken(alert.id, action.id) ? (
                            <span className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Completed
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                            {action.urgent && <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />}
                            {action.label}
                            </span>
                        )}
                        </button>
                    ))}
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

// --- Enhanced FundingView Component ---
const FundingView = memo(({ fundingOpportunities, loading, appliedOpportunities, expandedOpportunity, shuffleFunding, handleApply, toggleDetails }) => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Grant Matching Engine</h3>
          <button
            onClick={shuffleFunding}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            {loading ? 'Scanning...' : 'Scan for New Opportunities'}
          </button>
        </div>

        {loading && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-blue-800 dark:text-blue-400">AI is scanning federal and state databases for new funding opportunities...</span>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {fundingOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-6 hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{opportunity.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex ${
                        appliedOpportunities.has(opportunity.id) ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                        opportunity.status === 'eligible' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                        opportunity.status === 'applying' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                        'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                      }`}>
                        {appliedOpportunities.has(opportunity.id) ? 'Applied' :
                        opportunity.status === 'eligible' ? 'Eligible' :
                        opportunity.status === 'applying' ? 'In Progress' : 'Under Review'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Deadline</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{opportunity.deadline}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Match Score</p>
                        <p className="font-semibold text-blue-600 dark:text-blue-400">{opportunity.match}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{opportunity.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                        <p className="font-semibold text-green-600 dark:text-green-400">{opportunity.amount}</p>
                      </div>
                    </div>
                  </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                {opportunity.status === 'eligible' && !appliedOpportunities.has(opportunity.id) && (
                  <button
                    onClick={() => handleApply(opportunity.id)}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    Auto-Apply Now
                  </button>
                )}
                {appliedOpportunities.has(opportunity.id) && (
                  <button className="px-6 py-3 bg-gray-500 text-white rounded-xl cursor-not-allowed opacity-75">
                    Applied ✓
                  </button>
                )}
                <button
                  onClick={() => toggleDetails(opportunity.id)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  View Details
                  {expandedOpportunity === opportunity.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>

              {expandedOpportunity === opportunity.id && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div className="space-y-4">
                    {[
                      { title: "Description", content: opportunity.details.description },
                      { title: "Requirements", content: opportunity.details.requirements },
                      { title: "Timeline", content: opportunity.details.timeline },
                      { title: "Contact", content: opportunity.details.contact }
                    ].map((detail, index) => (
                      <div key={index}>
                        <h5 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">{detail.title}</h5>
                        <p className={`text-sm ${detail.title === 'Contact' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                          {detail.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// --- Enhanced ReportsView Component ---
const ReportsView = memo(({ loading, showSummary, generatePDFReport, generateSummary, currentBusiness, currentScenario, fundingOpportunities }) => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 backdrop-blur-xl">
        <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">One-Click Financial Reports</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            {
              icon: FileText,
              title: "Investor-Ready Report",
              description: "Comprehensive financial overview for investors",
              features: ["Revenue projections", "Cash flow analysis", "Growth metrics", "Risk assessment"],
              action: generatePDFReport,
              buttonText: loading ? "Generating..." : "Generate Report",
              bgColor: "bg-blue-100 dark:bg-blue-900/30",
              iconColor: "text-blue-600 dark:text-blue-400",
              buttonClass: "bg-blue-600 hover:bg-blue-700 text-white"
            },
            {
              icon: Target,
              title: "Monthly Summary",
              description: "Quick monthly performance overview",
              features: ["Key metrics summary", "Expense breakdown", "Goal progress", "Recommendations"],
              action: generateSummary,
              buttonText: "Generate Summary",
              bgColor: "bg-green-100 dark:bg-green-900/30",
              iconColor: "text-green-600 dark:text-green-400",
              buttonClass: "bg-green-600 hover:bg-green-700 text-white"
            }
          ].map((report, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-12 w-12 ${report.bgColor} rounded-xl flex items-center justify-center`}>
                  <report.icon className={`h-6 w-6 ${report.iconColor}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{report.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{report.description}</p>
                </div>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                {report.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={report.action}
                disabled={loading && index === 0}
                className={`w-full py-3 ${report.buttonClass} rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-md`}
              >
                {report.buttonText}
              </button>
            </div>
          ))}
        </div>

        {loading && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-blue-800 dark:text-blue-400">AI is analyzing your financial data and generating your report...</span>
            </div>
          </div>
        )}

        {showSummary && (
          <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-800 dark:text-green-400 mb-4">Monthly Financial Summary - {currentBusiness.name}</h4>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2">Key Highlights</h5>
                  <ul className="text-green-600 dark:text-green-400 space-y-1">
                    <li>• Current cash position: ${currentBusiness.currentCash.toLocaleString()}</li>
                    <li>• Monthly revenue: ${currentBusiness.monthlyRevenue.toLocaleString()}</li>
                    <li>• Team size: {currentBusiness.employees} employees</li>
                    <li>• Business sector: {currentBusiness.type}</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2">Performance vs Industry</h5>
                  <ul className="text-green-600 dark:text-green-400 space-y-1">
                    {currentBusiness.benchmarkData.map((metric, index) => (
                      <li key={index}>• {metric.metric}: {metric.status === 'good' ? '✓ Above' : '⚠ Below'} average</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2">AI Recommendations</h5>
                <ul className="text-green-600 dark:text-green-400 space-y-1">
                  {currentScenario === 'sarah' && (
                    <>
                      <li>• Prepare for September cash flow dip by securing short-term financing</li>
                      <li>• Optimize food cost management to improve margins</li>
                      <li>• Consider catering services to diversify revenue streams</li>
                    </>
                  )}
                  {currentScenario === 'mike' && (
                    <>
                      <li>• Capitalize on strong growth by expanding development team</li>
                      <li>• Invest in marketing to accelerate customer acquisition</li>
                      <li>• Consider seeking Series A funding for scaling</li>
                    </>
                  )}
                  {currentScenario === 'lisa' && (
                    <>
                      <li>• Prepare inventory for holiday season surge</li>
                      <li>• Focus on high-margin products to improve profitability</li>
                      <li>• Explore e-commerce opportunities for growth</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// --- Main BizBoostHub Component ---
const BizBoostHub = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showChatbot, setShowChatbot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentScenario, setCurrentScenario] = useState('sarah');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [expandedOpportunity, setExpandedOpportunity] = useState(null);
  const [appliedOpportunities, setAppliedOpportunities] = useState(new Set());
  const [showSummary, setShowSummary] = useState(false);
  const [fundingOpportunities, setFundingOpportunities] = useState([]);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());
  const [actionTaken, setActionTaken] = useState(new Set());
  const [scenarioResults, setScenarioResults] = useState(null);
  const [scenarioName, setScenarioName] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';

  const scenarios = {
    sarah: {
      name: "Sarah's Restaurant", type: "Restaurant", currentCash: 45000, monthlyRevenue: 32000, employees: 12,
      cashFlowData: [
        { month: 'Jul', actual: 45000, predicted: 45000 }, { month: 'Aug', actual: 38000, predicted: 42000 },
        { month: 'Sep', actual: null, predicted: 28000 }, { month: 'Oct', actual: null, predicted: 35000 },
        { month: 'Nov', actual: null, predicted: 52000 }, { month: 'Dec', actual: null, predicted: 68000 }
      ],
      benchmarkData: [
        { metric: 'Cash Flow Ratio', value: 1.2, benchmark: 1.5, status: 'warning' },
        { metric: 'Revenue Growth', value: 8.5, benchmark: 7.2, status: 'good' },
        { metric: 'Expense Ratio', value: 0.78, benchmark: 0.72, status: 'warning' },
        { metric: 'Profit Margin', value: 12.3, benchmark: 15.1, status: 'warning' }
      ],
      expenseData: [
        { name: 'Staff', value: 45, color: '#3b82f6' }, { name: 'Food Costs', value: 25, color: '#10b981' },
        { name: 'Rent', value: 15, color: '#f59e0b' }, { name: 'Utilities', value: 8, color: '#ef4444' },
        { name: 'Other', value: 7, color: '#8b5cf6' }
      ]
    },
    mike: {
      name: "Mike's Tech Startup", type: "Technology", currentCash: 85000, monthlyRevenue: 55000, employees: 8,
      cashFlowData: [
        { month: 'Jul', actual: 85000, predicted: 85000 }, { month: 'Aug', actual: 92000, predicted: 88000 },
        { month: 'Sep', actual: null, predicted: 95000 }, { month: 'Oct', actual: null, predicted: 102000 },
        { month: 'Nov', actual: null, predicted: 115000 }, { month: 'Dec', actual: null, predicted: 125000 }
      ],
      benchmarkData: [
        { metric: 'Cash Flow Ratio', value: 2.1, benchmark: 1.8, status: 'good' },
        { metric: 'Revenue Growth', value: 24.5, benchmark: 18.2, status: 'good' },
        { metric: 'Expense Ratio', value: 0.65, benchmark: 0.72, status: 'good' },
        { metric: 'Profit Margin', value: 22.8, benchmark: 15.1, status: 'good' }
      ],
      expenseData: [
        { name: 'Salaries', value: 55, color: '#3b82f6' }, { name: 'Development', value: 20, color: '#10b981' },
        { name: 'Marketing', value: 12, color: '#f59e0b' }, { name: 'Office', value: 8, color: '#ef4444' },
        { name: 'Other', value: 5, color: '#8b5cf6' }
      ]
    },
    lisa: {
      name: "Lisa's Retail Store", type: "Retail", currentCash: 25000, monthlyRevenue: 28000, employees: 6,
      cashFlowData: [
        { month: 'Jul', actual: 25000, predicted: 25000 }, { month: 'Aug', actual: 31000, predicted: 29000 },
        { month: 'Sep', actual: null, predicted: 35000 }, { month: 'Oct', actual: null, predicted: 42000 },
        { month: 'Nov', actual: null, predicted: 58000 }, { month: 'Dec', actual: null, predicted: 75000 }
      ],
      benchmarkData: [
        { metric: 'Cash Flow Ratio', value: 1.4, benchmark: 1.3, status: 'good' },
        { metric: 'Revenue Growth', value: 12.1, benchmark: 9.8, status: 'good' },
        { metric: 'Expense Ratio', value: 0.85, benchmark: 0.82, status: 'warning' },
        { metric: 'Profit Margin', value: 8.9, benchmark: 12.5, status: 'warning' }
      ],
      expenseData: [
        { name: 'Inventory', value: 40, color: '#3b82f6' }, { name: 'Staff', value: 30, color: '#10b981' },
        { name: 'Rent', value: 18, color: '#f59e0b' }, { name: 'Utilities', value: 7, color: '#ef4444' },
        { name: 'Other', value: 5, color: '#8b5cf6' }
      ]
    }
  };

  const currentBusiness = scenarios[currentScenario];

  const riskAlertsData = {
    sarah: [
      { id: 1, type: 'critical', title: 'Cash Flow Crisis Predicted', description: 'September cash flow projected to drop 37% below operational needs', impact: 'High', deadline: '15 days', actions: [{ id: 'credit', label: 'Apply for Credit Line', urgent: true }, { id: 'bank', label: 'Schedule Bank Meeting', urgent: false }, { id: 'expenses', label: 'Review Emergency Expenses', urgent: true }], category: 'cash_flow' },
      { id: 2, type: 'warning', title: 'Food Cost Spike Detected', description: 'Food costs increased 12% above industry benchmark this month', impact: 'Medium', deadline: '7 days', actions: [{ id: 'suppliers', label: 'Negotiate with Suppliers', urgent: true }, { id: 'menu', label: 'Optimize Menu Pricing', urgent: false }, { id: 'waste', label: 'Audit Food Waste', urgent: true }], category: 'expenses' }
    ],
    mike: [{ id: 4, type: 'warning', title: 'Runway Optimization Needed', description: 'Current burn rate gives you 14 months runway - consider acceleration', impact: 'Medium', deadline: '60 days', actions: [{ id: 'funding', label: 'Prepare Series A Deck', urgent: false }, { id: 'costs', label: 'Optimize Development Costs', urgent: true }], category: 'growth' }],
    lisa: [{ id: 6, type: 'warning', title: 'Inventory Imbalance', description: 'Inventory turnover 23% below retail industry standard', impact: 'Medium', deadline: '14 days', actions: [{ id: 'clearance', label: 'Run Clearance Sale', urgent: true }, { id: 'analytics', label: 'Implement Inventory Analytics', urgent: true }], category: 'inventory' }]
  };

  const currentAlerts = riskAlertsData[currentScenario] || [];
  const activeAlerts = currentAlerts.filter(alert => !dismissedAlerts.has(alert.id));
  const criticalAlerts = activeAlerts.filter(alert => alert.type === 'critical').length;
  const warningAlerts = activeAlerts.filter(alert => alert.type === 'warning').length;

  const allFundingOpportunities = [
    { id: 1, title: "Small Business Recovery Grant", amount: "$15,000", deadline: "Aug 15, 2025", match: "92%", type: "Grant", status: "eligible", details: { description: "Federal grant program designed to help small businesses recover from economic challenges and invest in growth opportunities.", requirements: "Must have been in business for at least 2 years, demonstrate financial need, employ fewer than 50 people.", timeline: "Application review takes 4-6 weeks, funds disbursed within 2 weeks of approval.", contact: "grants@sba.gov" } },
    { id: 2, title: "Restaurant Modernization Fund", amount: "$25,000", deadline: "Sep 30, 2025", match: "87%", type: "Grant", status: "applying", details: { description: "Supports restaurant upgrades including kitchen equipment, technology improvements, and customer experience enhancements.", requirements: "Licensed restaurant operation, commitment to maintain employment levels, detailed modernization plan required.", timeline: "Rolling applications, 6-8 week review process, equipment purchases must be completed within 6 months.", contact: "restaurant.fund@commerce.gov" } },
    { id: 3, title: "Green Business Initiative", amount: "$10,000", deadline: "Oct 10, 2025", match: "78%", type: "Grant", status: "review", details: { description: "Funding for businesses implementing sustainable practices and energy-efficient technologies.", requirements: "Submit sustainability plan, demonstrate environmental impact, provide energy audit results.", timeline: "Quarterly review cycles, implementation period of 12 months, progress reports required.", contact: "green.business@energy.gov" } },
    { id: 4, title: "Women-Owned Business Accelerator", amount: "$20,000", deadline: "Nov 20, 2025", match: "89%", type: "Grant", status: "eligible", details: { description: "Supports women entrepreneurs with funding and mentorship opportunities for business growth and expansion.", requirements: "Business must be 51% women-owned, operational for minimum 1 year, growth plan submission required.", timeline: "Monthly application cycles, 3-week review process, includes 6-month mentorship program.", contact: "women.business@mentor.org" } },
    { id: 5, title: "Technology Innovation Fund", amount: "$35,000", deadline: "Dec 5, 2025", match: "94%", type: "Grant", status: "eligible", details: { description: "Supports technology startups and businesses implementing innovative digital solutions.", requirements: "Technology-focused business, IP documentation, scalability demonstration, detailed technical roadmap.", timeline: "Bi-annual review, 8-week evaluation process, milestone-based fund disbursement over 18 months.", contact: "tech.innovation@nist.gov" } },
    { id: 6, title: "Community Development Loan", amount: "$40,000", deadline: "Jan 15, 2026", match: "85%", type: "Loan", status: "eligible", details: { description: "Low-interest loans for businesses that create jobs and serve underrepresented communities.", requirements: "Community impact demonstration, job creation plan, collateral requirements, credit review.", timeline: "4-week application process, 2-week approval, flexible repayment terms up to 7 years.", contact: "community.loans@cdfi.gov" } },
    { id: 7, title: "Export Development Grant", amount: "$18,000", deadline: "Feb 28, 2026", match: "76%", type: "Grant", status: "eligible", details: { description: "Helps businesses develop international markets and expand export capabilities.", requirements: "Export readiness assessment, international market research, compliance with trade regulations.", timeline: "Continuous applications, 5-week review, 12-month implementation period with quarterly check-ins.", contact: "export.development@trade.gov" } },
    { id: 8, title: "Rural Business Development Fund", amount: "$22,000", deadline: "Mar 30, 2026", match: "83%", type: "Grant", status: "eligible", details: { description: "Supports businesses in rural areas with funding for equipment, infrastructure, and workforce development.", requirements: "Located in qualified rural area, demonstrate economic impact, workforce development component required.", timeline: "Semi-annual cycles, 6-week review process, multi-year funding possible for qualified projects.", contact: "rural.development@usda.gov" } }
  ];

  useEffect(() => {
    const businessName = currentBusiness.name.split("'s")[0];
    const initialMessage = {
      id: Date.now(),
      text: `Hi ${businessName}! I'm your AI business advisor. I've analyzed your ${currentBusiness.type.toLowerCase()} business. How can I help you today?`,
      isBot: true,
      timestamp: new Date()
    };
    setChatMessages([initialMessage]);
    setDismissedAlerts(new Set());
    setActionTaken(new Set());
  }, [currentScenario]);

  const shuffleFunding = () => {
    setLoading(true);
    setTimeout(() => {
      const shuffled = [...allFundingOpportunities].sort(() => 0.5 - Math.random());
      setFundingOpportunities(shuffled.slice(0, 3));
      setLoading(false);
    }, 1500);
  };

  const handleApply = (opportunityId) => {
    setAppliedOpportunities(prev => new Set([...prev, opportunityId]));
  };

  const toggleDetails = (opportunityId) => {
    setExpandedOpportunity(expandedOpportunity === opportunityId ? null : opportunityId);
  };

  const parseWhatIfCommand = (command) => {
    let type = null;
    let value = 0;
    let isPercentage = false;

    if (command.includes('revenue increase by') || command.includes('revenue up by')) {
      type = 'revenue';
      const match = command.match(/(\d+(\.\d+)?)\s*(%?)/);
      if (match) { value = parseFloat(match[1]); isPercentage = match[3] === '%'; }
    } else if (command.includes('revenue decrease by') || command.includes('revenue down by')) {
      type = 'revenue';
      const match = command.match(/(\d+(\.\d+)?)\s*(%?)/);
      if (match) { value = -parseFloat(match[1]); isPercentage = match[3] === '%'; }
    } else if (command.includes('hire') && command.includes('employee')) {
      type = 'employees';
      const match = command.match(/hire (\d+)/);
      if (match) value = parseInt(match[1]);
    } else if (command.includes('reduce') && command.includes('employee')) {
      type = 'employees';
      const match = command.match(/reduce (\d+)/);
      if (match) value = -parseInt(match[1]);
    } else if ((command.includes('reduce') || command.includes('cut')) && command.includes('cost')) {
      type = 'expense';
      const match = command.match(/(staff|food|rent|utilities|marketing|development|office|inventory) cost by (\d+(\.\d+)?)\s*(%?)/);
      if (match) {
        const expenseType = match[1].toLowerCase(); value = -parseFloat(match[2]); isPercentage = match[4] === '%';
        return { type: 'expense', expenseType, value, isPercentage };
      }
    } else if ((command.includes('increase') || command.includes('add')) && command.includes('cost')) {
      type = 'expense';
      const match = command.match(/(staff|food|rent|utilities|marketing|development|office|inventory) cost by (\d+(\.\d+)?)\s*(%?)/);
      if (match) {
        const expenseType = match[1].toLowerCase(); value = parseFloat(match[2]); isPercentage = match[4] === '%';
        return { type: 'expense', expenseType, value, isPercentage };
      }
    }
    return { type, value, isPercentage };
  };

  const sendToGemini = async (message, isScenario = false, simulatedBusiness = null) => {
    // if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') { return getMockResponse(message, isScenario, simulatedBusiness); }
        // let promptText;
        // if (isScenario && simulatedBusiness) {
        //     promptText = `Analyze this business scenario: ${simulatedBusiness.name}, a ${simulatedBusiness.type} business with ${simulatedBusiness.employees} employees, $${simulatedBusiness.currentCash.toLocaleString()} current cash, and predicted future monthly revenue: ${simulatedBusiness.cashFlowData.map(d => `${d.month}: $${d.predicted}`).join(', ')}. Compare this to their original state (Current Cash: $${currentBusiness.currentCash.toLocaleString()}, Monthly Revenue: $${currentBusiness.monthlyRevenue.toLocaleString()}, Employees: ${currentBusiness.employees}). Provide an updated 90-day cash flow prediction and specific, actionable financial advice based on this new scenario.`;
        // } else {
        //     promptText = `You are a financial advisor for ${currentBusiness.name}, a ${currentBusiness.type} business with ${currentBusiness.employees} employees, $${currentBusiness.currentCash.toLocaleString()} current cash, and $${currentBusiness.monthlyRevenue.toLocaleString()} monthly revenue. Provide specific, actionable financial advice. User question: ${message}`;
        // }
       try {
      console.log("LOG Sending message")
      const response = await fetch(`http://127.0.0.1:8000/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              business:currentScenario,
              profile: `You are a financial advisor for ${currentBusiness.name}, a ${currentBusiness.type} business with ${currentBusiness.employees} employees, $${currentBusiness.currentCash.toLocaleString()} current cash, and $${currentBusiness.monthlyRevenue.toLocaleString()} monthly revenue. Provide specific, actionable financial advice.`,
              query:`User question: ${message}`
            }]
          }]
        })
      });
      const data = await response.json();
      console.log("LOG Gemini response", data['answer']['text']);
      return data['answer']['text']
    } catch (error) {
      console.log("Log ",error)
      console.error('Gemini API error:', error);
      return getMockResponse(message);
    }
    };


  const getMockResponse = (message, isScenario = false, simulatedBusiness = null) => {
    const businessName = currentBusiness.name.split("'s")[0];
    if (isScenario && simulatedBusiness) {
      let scenarioSummary = `Okay, let's analyze the scenario for ${simulatedBusiness.name}. With the changes you proposed, here's a simulated outlook:\n\n`;
      scenarioSummary += `**Simulated Monthly Revenue:** ${simulatedBusiness.monthlyRevenue.toLocaleString()}\n`;
      scenarioSummary += `**Simulated Employees:** ${simulatedBusiness.employees}\n`;
      scenarioSummary += `**Simulated Cash Flow Trend (next 3 months):** ${simulatedBusiness.cashFlowData.slice(3, 6).map(d => `${d.month}: ${d.predicted?.toLocaleString()}`).join(', ')}\n\n`;
      scenarioSummary += `**AI Insight:** These changes lead to a ${simulatedBusiness.monthlyRevenue > currentBusiness.monthlyRevenue ? 'positive' : 'negative'} impact. Focus on ${simulatedBusiness.monthlyRevenue > currentBusiness.monthlyRevenue ? 'scaling efficiently' : 'cost control and revenue generation'}.`;
      return scenarioSummary;
    } else {
      const responses = [
        `Based on your ${currentBusiness.type.toLowerCase()} business data, I recommend focusing on cash flow optimization. Consider negotiating better payment terms with suppliers.`,
        `${businessName}, your current cash position of ${currentBusiness.currentCash.toLocaleString()} is reasonable, but I suggest building a 3-month emergency fund of approximately ${(currentBusiness.monthlyRevenue * 0.8 * 3).toLocaleString()}.`,
        `For your ${currentBusiness.type.toLowerCase()} business, I see opportunities to improve profit margins. Have you considered analyzing your highest-margin products/services?`,
        `Looking at your monthly revenue of ${currentBusiness.monthlyRevenue.toLocaleString()}, there's potential for growth. I recommend exploring digital marketing strategies to increase customer acquisition.`,
        `Given your strong profit growth and international expansion, **focus on strategically investing in key tech talent** to enhance your generative AI dashboard. Simultaneously, **scale your international sales and marketing efforts** in targeted regions, and **implement basic currency hedging strategies** to protect your growing foreign revenue from exchange rate fluctuations.`
      ];

      const selected = responses[Math.floor(Math.random() * responses.length)];
      const toReturn = selected
        .replace(/\*/g, '')                      // Remove asterisks
        .split('.')                              // Split on periods
        .map(s => s.trim())                      // Trim each part
        .filter(s => s.length > 0)               // Remove empty strings
        .map(s => s + '.')                       // Re-add the period
        .join('\n');                             // Join with newline

        return toReturn;
    }  
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMessage = { id: Date.now(), text: chatInput, isBot: false, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);
    const whatIf = parseWhatIfCommand(userMessage.text.toLowerCase());
    let botResponseText;
    let simulatedBusiness = null;
    if (whatIf.type) {
      simulatedBusiness = { ...currentBusiness };
      let initialRevenue = currentBusiness.monthlyRevenue;
      let initialEmployees = currentBusiness.employees;
      if (whatIf.type === 'revenue') {
        if (whatIf.isPercentage) { simulatedBusiness.monthlyRevenue = initialRevenue * (1 + whatIf.value / 100); } else { simulatedBusiness.monthlyRevenue = initialRevenue + whatIf.value; }
      } else if (whatIf.type === 'employees') {
        simulatedBusiness.employees = initialEmployees + whatIf.value;
        const costPerEmployee = 4000;
        const employeeExpenseIncrease = whatIf.value * costPerEmployee;
        simulatedBusiness.expenseData = simulatedBusiness.expenseData.map(exp => {
          if (exp.name === 'Staff' || exp.name === 'Salaries') { return { ...exp, value: exp.value + (employeeExpenseIncrease / simulatedBusiness.monthlyRevenue * 100) }; }
          return exp;
        });
      } else if (whatIf.type === 'expense') {
        simulatedBusiness.expenseData = simulatedBusiness.expenseData.map(exp => {
          if (exp.name.toLowerCase() === whatIf.expenseType) {
            let newValue;
            if (whatIf.isPercentage) { newValue = exp.value + whatIf.value; } else { newValue = exp.value + (whatIf.value / currentBusiness.monthlyRevenue * 100); }
            return { ...exp, value: Math.max(0, newValue) };
          }
          return exp;
        });
      }
      simulatedBusiness.cashFlowData = currentBusiness.cashFlowData.map((data, index) => {
        if (index < 3) return data;
        const totalExpensePercentage = simulatedBusiness.expenseData.reduce((sum, exp) => sum + exp.value, 0);
        const predictedCash = simulatedBusiness.monthlyRevenue * (1 - totalExpensePercentage / 100);
        return { ...data, predicted: Math.round(predictedCash) };
      });
      setScenarioName(userMessage.text);
      botResponseText = await sendToGemini(userMessage.text, true, simulatedBusiness);
    } else {
      simulatedBusiness = null;
      setScenarioName('');
      botResponseText = await sendToGemini(userMessage.text);
    }
    try {
      setTimeout(() => {
        const botMessage = { id: Date.now() + 1, text: botResponseText, isBot: true, timestamp: new Date() };
        setChatMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        if (simulatedBusiness) { setScenarioResults(simulatedBusiness); } else { setScenarioResults(null); }
      }, 1000);
    } catch (error) {
      setIsTyping(false);
      const errorMessage = { id: Date.now() + 1, text: "I'm sorry, I'm having trouble processing that scenario right now. Please try again later.", isBot: true, timestamp: new Date() };
      setChatMessages(prev => [...prev, errorMessage]);
      setScenarioResults(null);
    }
  };

  const generatePDFReport = () => {
    setLoading(true);
    setTimeout(() => {
      const reportContent = `
BIZBOOST HUB - FINANCIAL REPORT
${currentBusiness.name}
Generated on: ${new Date().toLocaleDateString()}

=================================
EXECUTIVE SUMMARY
=================================
Business Type: ${currentBusiness.type}
Current Cash Position: ${currentBusiness.currentCash.toLocaleString()}
Monthly Revenue: ${currentBusiness.monthlyRevenue.toLocaleString()}
Employees: ${currentBusiness.employees}

=================================
KEY METRICS
=================================
${currentBusiness.benchmarkData.map(metric =>
        `${metric.metric}: ${metric.value} (Industry Avg: ${metric.benchmark})`
      ).join('\n')}

=================================
CASH FLOW PROJECTION (90 DAYS)
=================================
${currentBusiness.cashFlowData.filter(d => d.predicted).map(d =>
        `${d.month}: ${d.predicted?.toLocaleString() || 'N/A'}`
      ).join('\n')}

=================================
EXPENSE BREAKDOWN
=================================
${currentBusiness.expenseData.map(expense =>
        `${expense.name}: ${expense.value}%`
      ).join('\n')}

=================================
RECOMMENDATIONS
=================================
1. Monitor cash flow closely during predicted dip periods
2. Consider diversifying revenue streams
3. Optimize high-expense categories
4. Explore available funding opportunities
5. Implement performance tracking systems

=================================
FUNDING OPPORTUNITIES
=================================
${fundingOpportunities.map(opp =>
        `${opp.title}: ${opp.amount} (Match: ${opp.match})`
      ).join('\n')}

This report was generated by BizBoost Hub AI Financial Toolkit.
For questions, contact: support@bizboosthub.com
      `;
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentBusiness.name.replace(/[^a-zA-Z0-9]/g, '_')}_Financial_Report_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setLoading(false);
    }, 2000);
  };

  const generateSummary = () => {
    setShowSummary(true);
  };

  const dismissAlert = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const takeAction = (alertId, actionId) => {
    const actionKey = `${alertId}-${actionId}`;
    setActionTaken(prev => new Set([...prev, actionKey]));
  };

  const isActionTaken = (alertId, actionId) => {
    return actionTaken.has(`${alertId}-${actionId}`);
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: criticalAlerts + warningAlerts },
    { id: 'funding', label: 'Funding', icon: Award },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">BizBoost Hub</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {(criticalAlerts > 0 || warningAlerts > 0) && (
                <div className="flex items-center gap-2">
                  {criticalAlerts > 0 && (
                    <div className="relative">
                      <Bell className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">{criticalAlerts}</span>
                      </div>
                    </div>
                  )}
                  {warningAlerts > 0 && criticalAlerts === 0 && (
                    <div className="relative">
                      <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">{warningAlerts}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              
              <UserDropdown 
                currentScenario={currentScenario} 
                setCurrentScenario={setCurrentScenario} 
                scenarios={scenarios} 
              />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              <UserDropdown 
                currentScenario={currentScenario} 
                setCurrentScenario={setCurrentScenario} 
                scenarios={scenarios} 
              />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map(({ id, label, icon: Icon, badge }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-colors relative ${
                    activeTab === id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                  {badge > 0 && (
                    <div className="ml-auto h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{badge}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navigationItems.map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-3 py-4 border-b-2 font-medium text-sm transition-all duration-300 relative ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {badge > 0 && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{badge}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            currentBusiness={currentBusiness}
            currentScenario={currentScenario}
            scenarios={scenarios}
            setCurrentScenario={setCurrentScenario}
            scenarioResults={scenarioResults}
            scenarioName={scenarioName}
            setScenarioResults={setScenarioResults}
          />
        )}
        {activeTab === 'alerts' && (
          <AlertsView
            activeAlerts={activeAlerts}
            criticalAlerts={criticalAlerts}
            warningAlerts={warningAlerts}
            dismissAlert={dismissAlert}
            takeAction={takeAction}
            isActionTaken={isActionTaken}
          />
        )}
        {activeTab === 'funding' && (
          <FundingView
            fundingOpportunities={fundingOpportunities}
            loading={loading}
            appliedOpportunities={appliedOpportunities}
            expandedOpportunity={expandedOpportunity}
            shuffleFunding={shuffleFunding}
            handleApply={handleApply}
            toggleDetails={toggleDetails}
          />
        )}
        {activeTab === 'reports' && (
          <ReportsView
            loading={loading}
            showSummary={showSummary}
            generatePDFReport={generatePDFReport}
            generateSummary={generateSummary}
            currentBusiness={currentBusiness}
            currentScenario={currentScenario}
            fundingOpportunities={fundingOpportunities}
          />
        )}
      </main>

      {/* Chatbot Widget */}
      <ChatbotWidget
        showChatbot={showChatbot}
        setShowChatbot={setShowChatbot}
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        isTyping={isTyping}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
};

// --- App Component with Theme Provider ---
const App = () => {
  return (
    <ThemeProvider>
      <BizBoostHub />
    </ThemeProvider>
  );
};

export default App;