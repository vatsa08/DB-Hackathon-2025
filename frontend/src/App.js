import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Target, FileText, Bell, MessageCircle, Search, Download, Award, AlertTriangle, CheckCircle, Clock, Users, Building, Zap, ChevronDown, ChevronUp, Send } from 'lucide-react';

const BizBoostHub = () => {
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

  // Add your Gemini API key here
  const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'; // Replace with your actual API key

  // Sample data for different business scenarios
  const scenarios = {
    sarah: {
      name: "Sarah's Restaurant",
      type: "Restaurant",
      currentCash: 45000,
      monthlyRevenue: 32000,
      employees: 12,
      cashFlowData: [
        { month: 'Jul', actual: 45000, predicted: 45000 },
        { month: 'Aug', actual: 38000, predicted: 42000 },
        { month: 'Sep', actual: null, predicted: 28000 },
        { month: 'Oct', actual: null, predicted: 35000 },
        { month: 'Nov', actual: null, predicted: 52000 },
        { month: 'Dec', actual: null, predicted: 68000 }
      ],
      benchmarkData: [
        { metric: 'Cash Flow Ratio', value: 1.2, benchmark: 1.5, status: 'warning' },
        { metric: 'Revenue Growth', value: 8.5, benchmark: 7.2, status: 'good' },
        { metric: 'Expense Ratio', value: 0.78, benchmark: 0.72, status: 'warning' },
        { metric: 'Profit Margin', value: 12.3, benchmark: 15.1, status: 'warning' }
      ],
      expenseData: [
        { name: 'Staff', value: 45, color: '#3b82f6' },
        { name: 'Food Costs', value: 25, color: '#10b981' },
        { name: 'Rent', value: 15, color: '#f59e0b' },
        { name: 'Utilities', value: 8, color: '#ef4444' },
        { name: 'Other', value: 7, color: '#8b5cf6' }
      ]
    },
    mike: {
      name: "Mike's Tech Startup",
      type: "Technology",
      currentCash: 85000,
      monthlyRevenue: 55000,
      employees: 8,
      cashFlowData: [
        { month: 'Jul', actual: 85000, predicted: 85000 },
        { month: 'Aug', actual: 92000, predicted: 88000 },
        { month: 'Sep', actual: null, predicted: 95000 },
        { month: 'Oct', actual: null, predicted: 102000 },
        { month: 'Nov', actual: null, predicted: 115000 },
        { month: 'Dec', actual: null, predicted: 125000 }
      ],
      benchmarkData: [
        { metric: 'Cash Flow Ratio', value: 2.1, benchmark: 1.8, status: 'good' },
        { metric: 'Revenue Growth', value: 24.5, benchmark: 18.2, status: 'good' },
        { metric: 'Expense Ratio', value: 0.65, benchmark: 0.72, status: 'good' },
        { metric: 'Profit Margin', value: 22.8, benchmark: 15.1, status: 'good' }
      ],
      expenseData: [
        { name: 'Salaries', value: 55, color: '#3b82f6' },
        { name: 'Development', value: 20, color: '#10b981' },
        { name: 'Marketing', value: 12, color: '#f59e0b' },
        { name: 'Office', value: 8, color: '#ef4444' },
        { name: 'Other', value: 5, color: '#8b5cf6' }
      ]
    },
    lisa: {
      name: "Lisa's Retail Store",
      type: "Retail",
      currentCash: 25000,
      monthlyRevenue: 28000,
      employees: 6,
      cashFlowData: [
        { month: 'Jul', actual: 25000, predicted: 25000 },
        { month: 'Aug', actual: 31000, predicted: 29000 },
        { month: 'Sep', actual: null, predicted: 35000 },
        { month: 'Oct', actual: null, predicted: 42000 },
        { month: 'Nov', actual: null, predicted: 58000 },
        { month: 'Dec', actual: null, predicted: 75000 }
      ],
      benchmarkData: [
        { metric: 'Cash Flow Ratio', value: 1.4, benchmark: 1.3, status: 'good' },
        { metric: 'Revenue Growth', value: 12.1, benchmark: 9.8, status: 'good' },
        { metric: 'Expense Ratio', value: 0.85, benchmark: 0.82, status: 'warning' },
        { metric: 'Profit Margin', value: 8.9, benchmark: 12.5, status: 'warning' }
      ],
      expenseData: [
        { name: 'Inventory', value: 40, color: '#3b82f6' },
        { name: 'Staff', value: 30, color: '#10b981' },
        { name: 'Rent', value: 18, color: '#f59e0b' },
        { name: 'Utilities', value: 7, color: '#ef4444' },
        { name: 'Other', value: 5, color: '#8b5cf6' }
      ]
    }
  };

  const currentBusiness = scenarios[currentScenario];

  // Risk alerts data for different businesses
  const riskAlertsData = {
    sarah: [
      {
        id: 1,
        type: 'critical',
        title: 'Cash Flow Crisis Predicted',
        description: 'September cash flow projected to drop 37% below operational needs',
        impact: 'High',
        deadline: '15 days',
        actions: [
          { id: 'credit', label: 'Apply for Credit Line', urgent: true },
          { id: 'bank', label: 'Schedule Bank Meeting', urgent: false },
          { id: 'expenses', label: 'Review Emergency Expenses', urgent: true }
        ],
        category: 'cash_flow'
      },
      {
        id: 2,
        type: 'warning',
        title: 'Food Cost Spike Detected',
        description: 'Food costs increased 12% above industry benchmark this month',
        impact: 'Medium',
        deadline: '7 days',
        actions: [
          { id: 'suppliers', label: 'Negotiate with Suppliers', urgent: true },
          { id: 'menu', label: 'Optimize Menu Pricing', urgent: false },
          { id: 'waste', label: 'Audit Food Waste', urgent: true }
        ],
        category: 'expenses'
      }
    ],
    mike: [
      {
        id: 4,
        type: 'warning',
        title: 'Runway Optimization Needed',
        description: 'Current burn rate gives you 14 months runway - consider acceleration',
        impact: 'Medium',
        deadline: '60 days',
        actions: [
          { id: 'funding', label: 'Prepare Series A Deck', urgent: false },
          { id: 'costs', label: 'Optimize Development Costs', urgent: true }
        ],
        category: 'growth'
      }
    ],
    lisa: [
      {
        id: 6,
        type: 'warning',
        title: 'Inventory Imbalance',
        description: 'Inventory turnover 23% below retail industry standard',
        impact: 'Medium',
        deadline: '14 days',
        actions: [
          { id: 'clearance', label: 'Run Clearance Sale', urgent: true },
          { id: 'analytics', label: 'Implement Inventory Analytics', urgent: true }
        ],
        category: 'inventory'
      }
    ]
  };

  const currentAlerts = riskAlertsData[currentScenario] || [];
  const activeAlerts = currentAlerts.filter(alert => !dismissedAlerts.has(alert.id));
  const criticalAlerts = activeAlerts.filter(alert => alert.type === 'critical').length;
  const warningAlerts = activeAlerts.filter(alert => alert.type === 'warning').length;

  // All available funding opportunities pool
  const allFundingOpportunities = [
    {
      id: 1,
      title: "Small Business Recovery Grant",
      amount: "$15,000",
      deadline: "Aug 15, 2025",
      match: "92%",
      type: "Grant",
      status: "eligible",
      details: {
        description: "Federal grant program designed to help small businesses recover from economic challenges and invest in growth opportunities.",
        requirements: "Must have been in business for at least 2 years, demonstrate financial need, employ fewer than 50 people.",
        timeline: "Application review takes 4-6 weeks, funds disbursed within 2 weeks of approval.",
        contact: "grants@sba.gov"
      }
    },
    {
      id: 2,
      title: "Restaurant Modernization Fund",
      amount: "$25,000",
      deadline: "Sep 30, 2025",
      match: "87%",
      type: "Grant",
      status: "applying",
      details: {
        description: "Supports restaurant upgrades including kitchen equipment, technology improvements, and customer experience enhancements.",
        requirements: "Licensed restaurant operation, commitment to maintain employment levels, detailed modernization plan required.",
        timeline: "Rolling applications, 6-8 week review process, equipment purchases must be completed within 6 months.",
        contact: "restaurant.fund@commerce.gov"
      }
    },
    {
      id: 3,
      title: "Green Business Initiative",
      amount: "$10,000",
      deadline: "Oct 10, 2025",
      match: "78%",
      type: "Grant",
      status: "review",
      details: {
        description: "Funding for businesses implementing sustainable practices and energy-efficient technologies.",
        requirements: "Submit sustainability plan, demonstrate environmental impact, provide energy audit results.",
        timeline: "Quarterly review cycles, implementation period of 12 months, progress reports required.",
        contact: "green.business@energy.gov"
      }
    },
    {
      id: 4,
      title: "Women-Owned Business Accelerator",
      amount: "$20,000",
      deadline: "Nov 20, 2025",
      match: "89%",
      type: "Grant",
      status: "eligible",
      details: {
        description: "Supports women entrepreneurs with funding and mentorship opportunities for business growth and expansion.",
        requirements: "Business must be 51% women-owned, operational for minimum 1 year, growth plan submission required.",
        timeline: "Monthly application cycles, 3-week review process, includes 6-month mentorship program.",
        contact: "women.business@mentor.org"
      }
    },
    {
      id: 5,
      title: "Technology Innovation Fund",
      amount: "$35,000",
      deadline: "Dec 5, 2025",
      match: "94%",
      type: "Grant",
      status: "eligible",
      details: {
        description: "Supports technology startups and businesses implementing innovative digital solutions.",
        requirements: "Technology-focused business, IP documentation, scalability demonstration, detailed technical roadmap.",
        timeline: "Bi-annual review, 8-week evaluation process, milestone-based fund disbursement over 18 months.",
        contact: "tech.innovation@nist.gov"
      }
    },
    {
      id: 6,
      title: "Community Development Loan",
      amount: "$40,000",
      deadline: "Jan 15, 2026",
      match: "85%",
      type: "Loan",
      status: "eligible",
      details: {
        description: "Low-interest loans for businesses that create jobs and serve underrepresented communities.",
        requirements: "Community impact demonstration, job creation plan, collateral requirements, credit review.",
        timeline: "4-week application process, 2-week approval, flexible repayment terms up to 7 years.",
        contact: "community.loans@cdfi.gov"
      }
    },
    {
      id: 7,
      title: "Export Development Grant",
      amount: "$18,000",
      deadline: "Feb 28, 2026",
      match: "76%",
      type: "Grant",
      status: "eligible",
      details: {
        description: "Helps businesses develop international markets and expand export capabilities.",
        requirements: "Export readiness assessment, international market research, compliance with trade regulations.",
        timeline: "Continuous applications, 5-week review, 12-month implementation period with quarterly check-ins.",
        contact: "export.development@trade.gov"
      }
    },
    {
      id: 8,
      title: "Rural Business Development Fund",
      amount: "$22,000",
      deadline: "Mar 30, 2026",
      match: "83%",
      type: "Grant",
      status: "eligible",
      details: {
        description: "Supports businesses in rural areas with funding for equipment, infrastructure, and workforce development.",
        requirements: "Located in qualified rural area, demonstrate economic impact, workforce development component required.",
        timeline: "Semi-annual cycles, 6-week review process, multi-year funding possible for qualified projects.",
        contact: "rural.development@usda.gov"
      }
    }
  ];

  // Initialize with first 3 opportunities
  useEffect(() => {
    setFundingOpportunities(allFundingOpportunities.slice(0, 3));
  }, []);

  // Initialize chat with business-specific greeting
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
      // Randomly select 3 opportunities
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

  // Gemini AI Integration
  const sendToGemini = async (message) => {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
      // Fallback to mock responses if no API key
      return getMockResponse(message);
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a financial advisor for ${currentBusiness.name}, a ${currentBusiness.type} business with ${currentBusiness.employees} employees, $${currentBusiness.currentCash.toLocaleString()} current cash, and $${currentBusiness.monthlyRevenue.toLocaleString()} monthly revenue. Provide specific, actionable financial advice. User question: ${message}`
            }]
          }]
        })
      });

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      return getMockResponse(message);
    }
  };

  const getMockResponse = (message) => {
    const businessName = currentBusiness.name.split("'s")[0];
    const responses = [
      `Based on your ${currentBusiness.type.toLowerCase()} business data, I recommend focusing on cash flow optimization. Consider negotiating better payment terms with suppliers.`,
      `${businessName}, your current cash position of $${currentBusiness.currentCash.toLocaleString()} is reasonable, but I suggest building a 3-month emergency fund of approximately $${(currentBusiness.monthlyRevenue * 0.8 * 3).toLocaleString()}.`,
      `For your ${currentBusiness.type.toLowerCase()} business, I see opportunities to improve profit margins. Have you considered analyzing your highest-margin products/services?`,
      `Looking at your monthly revenue of $${currentBusiness.monthlyRevenue.toLocaleString()}, there's potential for growth. I recommend exploring digital marketing strategies to increase customer acquisition.`,
      `${businessName}, with ${currentBusiness.employees} employees, consider implementing performance-based incentives to boost productivity and retention.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: chatInput,
      isBot: false,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await sendToGemini(chatInput);
      
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          text: response,
          isBot: true,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      setIsTyping(false);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        isBot: true,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    }
  };

  const generatePDFReport = () => {
    setLoading(true);
    setTimeout(() => {
      // Create PDF content
      const reportContent = `
BIZBOOST HUB - FINANCIAL REPORT
${currentBusiness.name}
Generated on: ${new Date().toLocaleDateString()}

=================================
EXECUTIVE SUMMARY
=================================
Business Type: ${currentBusiness.type}
Current Cash Position: $${currentBusiness.currentCash.toLocaleString()}
Monthly Revenue: $${currentBusiness.monthlyRevenue.toLocaleString()}
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
  `${d.month}: $${d.predicted?.toLocaleString() || 'N/A'}`
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

      // Create and download PDF
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

  const DashboardView = () => (
    <div className="space-y-6">
      {/* Business Selector */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Onboarded Businnesses</h3>
        <div className="flex gap-4">
          {Object.entries(scenarios).map(([key, business]) => (
            <button
              key={key}
              onClick={() => setCurrentScenario(key)}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentScenario === key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="text-sm font-medium">{business.name}</div>
              <div className="text-xs text-gray-600">{business.type}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Cash</p>
              <p className="text-2xl font-bold text-gray-900">${currentBusiness.currentCash.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">↗ +5.2% from last month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${currentBusiness.monthlyRevenue.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-red-600 mt-2">↘ -2.1% from last month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Employees</p>
              <p className="text-2xl font-bold text-gray-900">{currentBusiness.employees}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Stable workforce</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Business Type</p>
              <p className="text-lg font-bold text-gray-900">{currentBusiness.type}</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Building className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Growing sector</p>
        </div>
      </div>

      {/* Cash Flow Prediction */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">90-Day Cash Flow Prediction</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Zap className="h-4 w-4" />
            AI Powered
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-blue-500"></div>
            <span className="text-sm font-medium text-gray-700">Actual Cash Flow</span>
            <span className="text-xs text-gray-500">(Historical Data)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-500 border-dashed border-t-2 border-green-500"></div>
            <span className="text-sm font-medium text-gray-700">AI Predicted</span>
            <span className="text-xs text-gray-500">(Future Forecast)</span>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentBusiness.cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${value?.toLocaleString()}`, 
                  name === 'actual' ? 'Actual Cash Flow' : 'AI Predicted Cash Flow'
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
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span className="font-medium text-yellow-800">AI Insight:</span>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            {currentScenario === 'sarah' && "Cash flow dip predicted for September (-37%). Consider reducing inventory orders and exploring short-term financing options."}
            {currentScenario === 'mike' && "Strong growth trajectory predicted. Consider scaling operations and investing in additional development resources."}
            {currentScenario === 'lisa' && "Holiday season boost expected. Plan inventory increases for November-December peak period."}
          </p>
        </div>
      </div>

      {/* Industry Benchmarks & Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-6">Industry Benchmarks</h3>
          <div className="space-y-4">
            {currentBusiness.benchmarkData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="font-medium">{item.metric}</p>
                  <p className="text-sm text-gray-600">Industry avg: {item.benchmark}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{item.value}</span>
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

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-6">Expense Breakdown</h3>
          <div className="h-64">
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
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {currentBusiness.expenseData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const FundingView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">AI Grant Matching Engine</h3>
          <button 
            onClick={shuffleFunding}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Scanning...' : 'Scan for New Opportunities'}
          </button>
        </div>
        
        {loading && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-blue-800">AI is scanning federal and state databases for new funding opportunities...</span>
            </div>
          </div>
        )}
        
        <div className="grid gap-6">
          {fundingOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-lg">{opportunity.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appliedOpportunities.has(opportunity.id) ? 'bg-green-100 text-green-800' :
                      opportunity.status === 'eligible' ? 'bg-green-100 text-green-800' :
                      opportunity.status === 'applying' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appliedOpportunities.has(opportunity.id) ? 'Applied' :
                       opportunity.status === 'eligible' ? 'Eligible' :
                       opportunity.status === 'applying' ? 'In Progress' : 'Under Review'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Deadline</p>
                      <p className="font-semibold">{opportunity.deadline}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Match Score</p>
                      <p className="font-semibold text-blue-600">{opportunity.match}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-semibold">{opportunity.type}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                {opportunity.status === 'eligible' && !appliedOpportunities.has(opportunity.id) && (
                  <button 
                    onClick={() => handleApply(opportunity.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Auto-Apply Now
                  </button>
                )}
                {appliedOpportunities.has(opportunity.id) && (
                  <button className="px-4 py-2 bg-gray-500 text-white rounded-lg cursor-not-allowed">
                    Applied ✓
                  </button>
                )}
                <button 
                  onClick={() => toggleDetails(opportunity.id)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  View Details
                  {expandedOpportunity === opportunity.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>

              {expandedOpportunity === opportunity.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-semibold text-sm text-gray-700">Description</h5>
                      <p className="text-sm text-gray-600">{opportunity.details.description}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm text-gray-700">Requirements</h5>
                      <p className="text-sm text-gray-600">{opportunity.details.requirements}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm text-gray-700">Timeline</h5>
                      <p className="text-sm text-gray-600">{opportunity.details.timeline}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm text-gray-700">Contact</h5>
                      <p className="text-sm text-blue-600">{opportunity.details.contact}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ReportsView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-6">One-Click Financial Reports</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="font-semibold">Investor-Ready Report</h4>
                <p className="text-sm text-gray-600">Comprehensive financial overview for investors</p>
              </div>
            </div>
            <ul className="text-sm text-gray-600 mb-4 space-y-1">
              <li>• Revenue projections</li>
              <li>• Cash flow analysis</li>
              <li>• Growth metrics</li>
              <li>• Risk assessment</li>
            </ul>
            <button 
              onClick={generatePDFReport}
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>

          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-8 w-8 text-green-600" />
              <div>
                <h4 className="font-semibold">Monthly Summary</h4>
                <p className="text-sm text-gray-600">Quick monthly performance overview</p>
              </div>
            </div>
            <ul className="text-sm text-gray-600 mb-4 space-y-1">
              <li>• Key metrics summary</li>
              <li>• Expense breakdown</li>
              <li>• Goal progress</li>
              <li>• Recommendations</li>
            </ul>
            <button 
              onClick={generateSummary}
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Generate Summary
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-blue-800">AI is analyzing your financial data and generating your report...</span>
            </div>
          </div>
        )}

        {showSummary && (
          <div className="mt-6 p-6 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3">Monthly Financial Summary - {currentBusiness.name}</h4>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-green-700">Key Highlights</h5>
                  <ul className="text-green-600 space-y-1">
                    <li>• Current cash position: ${currentBusiness.currentCash.toLocaleString()}</li>
                    <li>• Monthly revenue: ${currentBusiness.monthlyRevenue.toLocaleString()}</li>
                    <li>• Team size: {currentBusiness.employees} employees</li>
                    <li>• Business sector: {currentBusiness.type}</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-green-700">Performance vs Industry</h5>
                  <ul className="text-green-600 space-y-1">
                    {currentBusiness.benchmarkData.map((metric, index) => (
                      <li key={index}>• {metric.metric}: {metric.status === 'good' ? '✓ Above' : '⚠ Below'} average</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-green-700">AI Recommendations</h5>
                <ul className="text-green-600 space-y-1">
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
  const AlertsView = () => (
    <div className="space-y-6">
      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-600">{criticalAlerts}</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-red-600 mt-2">Requires immediate action</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Warning Alerts</p>
              <p className="text-2xl font-bold text-yellow-600">{warningAlerts}</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-yellow-600 mt-2">Action needed soon</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Opportunities</p>
              <p className="text-2xl font-bold text-green-600">{activeAlerts.filter(a => a.type === 'info').length}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">Growth opportunities identified</p>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-6">Active Alerts & Recommendations</h3>
        
        {activeAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h4>
            <p className="text-gray-600">No active alerts for your business right now.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeAlerts.map((alert) => (
              <div key={alert.id} className={`border rounded-lg p-6 ${
                alert.type === 'critical' ? 'border-red-200 bg-red-50' :
                alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                'border-green-200 bg-green-50'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-full ${
                        alert.type === 'critical' ? 'bg-red-100' :
                        alert.type === 'warning' ? 'bg-yellow-100' :
                        'bg-green-100'
                      }`}>
                        {alert.type === 'critical' ? (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <h4 className={`font-semibold ${
                          alert.type === 'critical' ? 'text-red-800' :
                          'text-yellow-800'
                        }`}>{alert.title}</h4>
                        <p className={`text-sm ${
                          alert.type === 'critical' ? 'text-red-700' :
                          'text-yellow-700'
                        }`}>{alert.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-medium text-gray-600">Impact Level</p>
                        <p className="font-semibold">{alert.impact}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600">Action Deadline</p>
                        <p className="font-semibold">{alert.deadline}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600">Category</p>
                        <p className="font-semibold capitalize">{alert.category.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-600 ml-4"
                  >
                    ×
                  </button>
                </div>
                
                <div className="border-t pt-4">
                  <h5 className="font-semibold text-gray-800 mb-3">Recommended Actions:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {alert.actions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => takeAction(alert.id, action.id)}
                        disabled={isActionTaken(alert.id, action.id)}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                          isActionTaken(alert.id, action.id) 
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : action.urgent
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {isActionTaken(alert.id, action.id) ? (
                          <span className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Completed
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            {action.urgent && <Zap className="h-4 w-4" />}
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
  const ChatbotWidget = () => (
    <div className={`fixed bottom-6 right-6 transition-all duration-300 z-50 ${showChatbot ? 'w-80 h-96' : 'w-16 h-16'}`}>
      {showChatbot ? (
        <div className="bg-white rounded-lg shadow-2xl border flex flex-col h-full">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <h4 className="font-semibold">AI Business Advisor</h4>
            <button 
              onClick={() => setShowChatbot(false)}
              className="text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              {chatMessages.map((message) => (
                <div key={message.id} className={`${message.isBot ? 'bg-gray-100' : 'bg-blue-100 ml-8'} rounded-lg p-3`}>
                  <p className="text-sm">{message.text}</p>
                </div>
              ))}
              {isTyping && (
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ask me anything..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isTyping}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowChatbot(true)}
          className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <MessageCircle className="h-8 w-8" />
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">BizBoost Hub</h1>
            </div>
            <div className="flex items-center gap-4">
              {(criticalAlerts > 0 || warningAlerts > 0) && (
                <div className="flex items-center gap-2">
                  {criticalAlerts > 0 && (
                    <div className="relative">
                      <Bell className="h-5 w-5 text-red-600" />
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">{criticalAlerts}</span>
                      </div>
                    </div>
                  )}
                  {warningAlerts > 0 && criticalAlerts === 0 && (
                    <div className="relative">
                      <Bell className="h-5 w-5 text-yellow-600" />
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">{warningAlerts}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {(criticalAlerts === 0 && warningAlerts === 0) && (
                <Bell className="h-5 w-5 text-gray-600" />
              )}
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {currentBusiness.name.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'alerts', label: 'Alerts', icon: Bell, badge: criticalAlerts + warningAlerts },
              { id: 'funding', label: 'Funding', icon: Award },
              { id: 'reports', label: 'Reports', icon: FileText }
            ].map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-3 py-4 border-b-2 font-medium text-sm transition-colors relative ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'alerts' && <AlertsView />}
        {activeTab === 'funding' && <FundingView />}
        {activeTab === 'reports' && <ReportsView />}
      </main>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
};

export default BizBoostHub;