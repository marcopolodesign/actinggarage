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

const Dashboard = () => {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterInterest, setFilterInterest] = useState<string>('all');
  const [filterCampaign, setFilterCampaign] = useState<string>('all');

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

  // Filter members
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      if (filterSource !== 'all' && m.Source !== filterSource) return false;
      if (filterInterest !== 'all' && !m.Interests.includes(filterInterest)) return false;
      if (filterCampaign !== 'all') {
        if (filterCampaign === 'none' && m['UTM Campaign']) return false;
        if (filterCampaign !== 'none' && m['UTM Campaign'] !== filterCampaign) return false;
      }
      return true;
    });
  }, [members, filterSource, filterInterest, filterCampaign]);

  // Get unique values for filters
  const uniqueSources = useMemo(() => {
    return Array.from(new Set(members.map(m => m.Source))).filter(Boolean);
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
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Leads</h3>
            <p className="text-3xl font-bold text-gray-900">{insights.totalLeads}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Organic Leads (This Week)</h3>
            <p className="text-3xl font-bold text-green-600">{insights.organicLeadsThisWeek}</p>
            <p className="text-sm text-gray-500 mt-1">Total: {insights.totalOrganicLeads}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Paid Campaign Leads (This Week)</h3>
            <p className="text-3xl font-bold text-blue-600">{insights.paidCampaignLeadsThisWeek}</p>
            <p className="text-sm text-gray-500 mt-1">Total: {insights.totalPaidLeads}</p>
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
                ? `${insights.leadsByInterest[insights.topCampaign] || 0} leads`
                : 'No campaign data available'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Sources</option>
                {uniqueSources.map(source => (
                  <option key={source} value={source}>{source}</option>
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
          </div>
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
    </div>
  );
};

export default Dashboard;

