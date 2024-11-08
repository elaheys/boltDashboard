import { useEffect, useState } from 'react';
import { DateTimeFilters } from '../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../utils/export';
import { Dropdown } from '../components/ui/Dropdown';

interface UserDetails {
  lastLogin: string;
  activityCount: number;
  videoRequests: number;
  simulationRuns: number;
}

interface User {
  id: number;
  name: string;
  company: string;
  details: UserDetails;
}

const MOCK_USERS: User[] = [
  { 
    id: 1, 
    name: 'John Doe', 
    company: 'Railway Corp',
    details: {
      lastLogin: '2024-03-15T10:30:00',
      activityCount: 156,
      videoRequests: 23,
      simulationRuns: 12
    }
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    company: 'Metro Systems',
    details: {
      lastLogin: '2024-03-14T15:45:00',
      activityCount: 98,
      videoRequests: 15,
      simulationRuns: 8
    }
  },
  { 
    id: 3, 
    name: 'Mike Johnson', 
    company: 'Tram Operations',
    details: {
      lastLogin: '2024-03-13T09:15:00',
      activityCount: 67,
      videoRequests: 10,
      simulationRuns: 5
    }
  }
];

const AVAILABLE_COMPANIES = [
  'Railway Corp',
  'Metro Systems',
  'Tram Operations',
  'Bus Transit',
  'Urban Transport',
];

const COLUMNS = ['User', 'Company', 'Details'];

export function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(MOCK_USERS);

  useEffect(() => {
    handleSearch();
  }, [selectedUser, selectedCompany]);

  const handleSearch = () => {
    let filtered = MOCK_USERS;

    if (selectedUser) {
      filtered = filtered.filter(user => user.name === selectedUser);
    }

    if (selectedCompany) {
      filtered = filtered.filter(user => user.company === selectedCompany);
    }

    setFilteredUsers(filtered);
  };

  const handleExportPDF = () => {
    const exportData = filteredUsers.map(user => ({
      name: user.name,
      company: user.company,
      lastLogin: new Date(user.details.lastLogin).toLocaleString(),
      activityCount: user.details.activityCount,
      videoRequests: user.details.videoRequests,
      simulationRuns: user.details.simulationRuns
    }));

    exportToPDF('User Activity Report', exportData, ['name', 'company', 'lastLogin', 'activityCount', 'videoRequests', 'simulationRuns']);
  };

  const handleExportExcel = () => {
    const exportData = filteredUsers.map(user => ({
      name: user.name,
      company: user.company,
      lastLogin: new Date(user.details.lastLogin).toLocaleString(),
      activityCount: user.details.activityCount,
      videoRequests: user.details.videoRequests,
      simulationRuns: user.details.simulationRuns
    }));

    exportToExcel('User Activity Report', exportData, ['name', 'company', 'lastLogin', 'activityCount', 'videoRequests', 'simulationRuns']);
  };

  const uniqueUsers = Array.from(new Set(MOCK_USERS.map(user => user.name)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
      </div>
      
      <DateTimeFilters 
        onExport={handleExportPDF}
        onExportExcel={handleExportExcel}
        onSearch={handleSearch} 
      />
      
      <div className="bg-white shadow rounded-lg ">
        <div className="p-4 border-b border-gray-200 flex gap-4">
          <Dropdown
            value={selectedUser}
            onChange={setSelectedUser}
            options={uniqueUsers}
            placeholder="Select User"
            isOpen={isUserDropdownOpen}
            onToggle={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
          />
          <Dropdown
            value={selectedCompany}
            onChange={setSelectedCompany}
            options={AVAILABLE_COMPANIES}
            placeholder="Select Company"
            isOpen={isCompanyDropdownOpen}
            onToggle={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {COLUMNS.map((column) => (
                  <th
                    key={column}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {user.company}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-sm text-gray-500">
                      <p>Last Login: {new Date(user.details.lastLogin).toLocaleString()}</p>
                      <p>Activity Count: {user.details.activityCount}</p>
                      <p>Video Requests: {user.details.videoRequests}</p>
                      <p>Simulation Runs: {user.details.simulationRuns}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}