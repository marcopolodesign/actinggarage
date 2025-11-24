import { useState, useEffect, useMemo } from 'react';
import { getMembers } from '../api/getMembers';
import type { MemberData } from '../api/types';

interface Insights {
  totalLeads: number;
  organicLeadsThisWeek: number;
  paidCampaignLeadsThisWeek: number;
  totalOrganicLeads: number;
  totalPaidLeads: number;
  leadsByInterest: Record<string, number>;
  averageAge: number;
  topCampaign: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  leads: MemberData[];
}

const LeadsModal = ({ isOpen, onClose, title, leads }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{leads.length}</span> leads
              </p>
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interests</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opt-in Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                        No leads found
                      </td>
                    </tr>
                  ) : (
                    leads.map((member, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member['Email Address']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {member['First Name']} {member['Last Name']}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member['Phone Number']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.Age}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{member.Interests}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            member.Source === 'organic' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {member.Source}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member['UTM Campaign'] || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {member.OPTIN_TIME ? new Date(member.OPTIN_TIME).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterInterest, setFilterInterest] = useState<string>('all');
  const [filterCampaign, setFilterCampaign] = useState<string>('all');
  const [filterDatePreset, setFilterDatePreset] = useState<string>('all');
  const [customDateStart, setCustomDateStart] = useState<string>('');
  const [customDateEnd, setCustomDateEnd] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLeads, setModalLeads] = useState<MemberData[]>([]);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMembers({ count: 1000 });
        console.log('Dashboard API response:', response);
        if (response.success && response.members) {
          setMembers(response.members);
        } else {
          const errorMsg = response.message || 'Failed to fetch members';
          const errorDetails = response.error ? JSON.stringify(response.error) : '';
          setError(`${errorMsg}${errorDetails ? `: ${errorDetails}` : ''}`);
          console.error('Dashboard API error:', response);
        }
      } catch (err: any) {
        const errorMsg = err?.response?.data?.message || err?.message || 'An error occurred while fetching data';
        setError(errorMsg);
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Calculate insights
  const insights: Insights = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const organicLeads = members.filter(m => m.Source === 'organic');
    const paidLeads = members.filter(m => m.Source === 'email_campaign');

    // Filter by week
    const organicThisWeek = organicLeads.filter(m => {
      if (!m.OPTIN_TIME) return false;
      const optinDate = new Date(m.OPTIN_TIME);
      return optinDate >= oneWeekAgo;
    });

    const paidThisWeek = paidLeads.filter(m => {
      if (!m.OPTIN_TIME) return false;
      const optinDate = new Date(m.OPTIN_TIME);
      return optinDate >= oneWeekAgo;
    });

    // Calculate leads by interest
    const leadsByInterest: Record<string, number> = {};
    members.forEach(m => {
      const interests = m.Interests.split(',').map(i => i.trim()).filter(Boolean);
      interests.forEach(interest => {
        leadsByInterest[interest] = (leadsByInterest[interest] || 0) + 1;
      });
    });

    // Calculate average age
    const ages = members
      .map(m => parseInt(m.Age))
      .filter(age => !isNaN(age) && age > 0);
    const averageAge = ages.length > 0 
      ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length)
      : 0;

    // Find top campaign
    const campaignCounts: Record<string, number> = {};
    paidLeads.forEach(m => {
      const campaign = m['UTM Campaign'] || 'Untracked';
      campaignCounts[campaign] = (campaignCounts[campaign] || 0) + 1;
    });
    const topCampaign = Object.entries(campaignCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

    return {
      totalLeads: members.length,
      organicLeadsThisWeek: organicThisWeek.length,
      paidCampaignLeadsThisWeek: paidThisWeek.length,
      totalOrganicLeads: organicLeads.length,
      totalPaidLeads: paidLeads.length,
      leadsByInterest,
      averageAge,
      topCampaign
    };
  }, [members]);

  // Date filter helper
  const getDateRange = () => {
    const now = new Date();
    now.setHours(23, 59, 59, 999); // End of today
    
    if (filterDatePreset === 'custom') {
      if (!customDateStart || !customDateEnd) return null;
      const start = new Date(customDateStart);
      start.setHours(0, 0, 0, 0);
      const end = new Date(customDateEnd);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    switch (filterDatePreset) {
      case 'today':
        return { start, end: now };
      case '2days':
        start.setDate(start.getDate() - 1);
        return { start, end: now };
      case '5days':
        start.setDate(start.getDate() - 4);
        return { start, end: now };
      case '7days':
        start.setDate(start.getDate() - 6);
        return { start, end: now };
      case '14days':
        start.setDate(start.getDate() - 13);
        return { start, end: now };
      case '30days':
        start.setDate(start.getDate() - 29);
        return { start, end: now };
      default:
        return null;
    }
  };

  // Filter members
  const filteredMembers = useMemo(() => {
    const dateRange = getDateRange();
    
    return members.filter(m => {
      // Handle "paid" filter (email_campaign)
      if (filterSource === 'paid' && m.Source !== 'email_campaign') return false;
      if (filterSource !== 'all' && filterSource !== 'paid' && m.Source !== filterSource) return false;
      if (filterInterest !== 'all' && !m.Interests.includes(filterInterest)) return false;
      if (filterCampaign !== 'all') {
        if (filterCampaign === 'none' && m['UTM Campaign']) return false;
        if (filterCampaign !== 'none' && m['UTM Campaign'] !== filterCampaign) return false;
      }
      
      // Date filter
      if (dateRange && m.OPTIN_TIME) {
        const optinDate = new Date(m.OPTIN_TIME);
        if (optinDate < dateRange.start || optinDate > dateRange.end) return false;
      } else if (dateRange && !m.OPTIN_TIME) {
        // If date filter is active but member has no opt-in time, exclude
        return false;
      }
      
      return true;
    });
  }, [members, filterSource, filterInterest, filterCampaign, filterDatePreset, customDateStart, customDateEnd]);

  // Get filtered leads for insights
  const getFilteredLeads = (filterType: string) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    switch (filterType) {
      case 'total':
        return members;
      case 'organic-this-week':
        return members.filter(m => {
          if (m.Source !== 'organic') return false;
          if (!m.OPTIN_TIME) return false;
          const optinDate = new Date(m.OPTIN_TIME);
          return optinDate >= oneWeekAgo;
        });
      case 'paid-this-week':
        return members.filter(m => {
          if (m.Source !== 'email_campaign') return false;
          if (!m.OPTIN_TIME) return false;
          const optinDate = new Date(m.OPTIN_TIME);
          return optinDate >= oneWeekAgo;
        });
      case 'organic-total':
        return members.filter(m => m.Source === 'organic');
      case 'paid-total':
        return members.filter(m => m.Source === 'email_campaign');
      default:
        return [];
    }
  };

  const handleInsightClick = (filterType: string, title: string) => {
    const filtered = getFilteredLeads(filterType);
    setModalLeads(filtered);
    setModalTitle(title);
    setModalOpen(true);
  };

  // Get unique values for filters
  const uniqueSources = useMemo(() => {
    const sources = Array.from(new Set(members.map(m => m.Source))).filter(Boolean);
    // Add "paid" option if email_campaign exists
    if (sources.includes('email_campaign')) {
      return ['paid', ...sources];
    }
    return sources;
  }, [members]);

  const uniqueInterests = useMemo(() => {
    const interests = new Set<string>();
    members.forEach(m => {
      m.Interests.split(',').forEach(i => {
        const trimmed = i.trim();
        if (trimmed) interests.add(trimmed);
      });
    });
    return Array.from(interests);
  }, [members]);

  const uniqueCampaigns = useMemo(() => {
    return Array.from(new Set(members.map(m => m['UTM Campaign']).filter(Boolean)));
  }, [members]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <p className="text-red-600 text-lg font-semibold mb-2">Error Loading Dashboard</p>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
          <p className="text-gray-500 text-xs mt-4">
            Check browser console for more details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mailchimp Dashboard</h1>

        {/* Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleInsightClick('total', 'All Leads')}
          >
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Leads</h3>
            <p className="text-3xl font-bold text-gray-900">{insights.totalLeads}</p>
            <p className="text-xs text-gray-400 mt-2">Click to view details</p>
          </div>

          <div 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleInsightClick('organic-this-week', 'Organic Leads (This Week)')}
          >
            <h3 className="text-sm font-medium text-gray-500 mb-2">Organic Leads (This Week)</h3>
            <p className="text-3xl font-bold text-green-600">{insights.organicLeadsThisWeek}</p>
            <p className="text-sm text-gray-500 mt-1">Total: {insights.totalOrganicLeads}</p>
            <p className="text-xs text-gray-400 mt-2">Click to view details</p>
          </div>

          <div 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleInsightClick('paid-this-week', 'Paid Campaign Leads (This Week)')}
          >
            <h3 className="text-sm font-medium text-gray-500 mb-2">Paid Campaign Leads (This Week)</h3>
            <p className="text-3xl font-bold text-blue-600">{insights.paidCampaignLeadsThisWeek}</p>
            <p className="text-sm text-gray-500 mt-1">Total: {insights.totalPaidLeads}</p>
            <p className="text-xs text-gray-400 mt-2">Click to view details</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Average Age</h3>
            <p className="text-3xl font-bold text-gray-900">{insights.averageAge}</p>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Leads by Interest</h3>
            <div className="space-y-2">
              {Object.entries(insights.leadsByInterest)
                .sort(([, a], [, b]) => b - a)
                .map(([interest, count]) => (
                  <div key={interest} className="flex justify-between items-center">
                    <span className="text-gray-700 capitalize">{interest}</span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Top Campaign</h3>
            <p className="text-2xl font-bold text-gray-900">{insights.topCampaign}</p>
            <p className="text-sm text-gray-500 mt-2">
              {insights.topCampaign !== 'N/A' 
                ? `${members.filter(m => m.Source === 'email_campaign' && m['UTM Campaign'] === insights.topCampaign).length} leads`
                : 'No campaign data available'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Sources</option>
                <option value="paid">Paid</option>
                {uniqueSources.filter(s => s !== 'paid').map(source => (
                  <option key={source} value={source}>{source === 'email_campaign' ? 'Email Campaign' : source}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest</label>
              <select
                value={filterInterest}
                onChange={(e) => setFilterInterest(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Interests</option>
                {uniqueInterests.map(interest => (
                  <option key={interest} value={interest}>{interest}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Campaign</label>
              <select
                value={filterCampaign}
                onChange={(e) => setFilterCampaign(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Campaigns</option>
                <option value="none">No Campaign</option>
                {uniqueCampaigns.map(campaign => (
                  <option key={campaign} value={campaign}>{campaign}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={filterDatePreset}
                onChange={(e) => setFilterDatePreset(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="2days">Last 2 Days</option>
                <option value="5days">Last 5 Days</option>
                <option value="7days">Last 7 Days</option>
                <option value="14days">Last 14 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>

          {/* Custom Date Range Inputs */}
          {filterDatePreset === 'custom' && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={customDateStart}
                  onChange={(e) => setCustomDateStart(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={customDateEnd}
                  onChange={(e) => setCustomDateEnd(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredMembers.length}</span> of <span className="font-semibold">{members.length}</span> leads
            </p>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opt-in Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member['Email Address']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member['First Name']} {member['Last Name']}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member['Phone Number']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.Age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{member.Interests}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.Source === 'organic' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {member.Source}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member['UTM Campaign'] || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.OPTIN_TIME ? new Date(member.OPTIN_TIME).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Leads Modal */}
      <LeadsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        leads={modalLeads}
      />
    </div>
  );
};

export default Dashboard;

