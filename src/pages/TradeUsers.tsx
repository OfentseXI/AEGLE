import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Globe, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TradeUser {
  id: string;
  full_name: string;
  company_name: string;
  country: string;
  trade_type: string;
  trade_count: number;
  total_value: string;
  last_trade_date: string;
  status: string;
}

const TradeUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const tradeUsers: TradeUser[] = [
    {
      id: "1",
      full_name: "Sarah Chen",
      company_name: "Global Imports Ltd",
      country: "China",
      trade_type: "Import",
      trade_count: 15,
      total_value: "$450,000",
      last_trade_date: "2025-10-10",
      status: "active",
    },
    {
      id: "2",
      full_name: "James Rodriguez",
      company_name: "Pacific Trade Corp",
      country: "Brazil",
      trade_type: "Export",
      trade_count: 8,
      total_value: "$280,000",
      last_trade_date: "2025-10-12",
      status: "active",
    },
    {
      id: "3",
      full_name: "Amara Okonkwo",
      company_name: "African Exports Inc",
      country: "South Africa",
      trade_type: "Export",
      trade_count: 22,
      total_value: "$890,000",
      last_trade_date: "2025-10-13",
      status: "active",
    },
    {
      id: "4",
      full_name: "Li Wei",
      company_name: "China Trade Solutions",
      country: "China",
      trade_type: "Import",
      trade_count: 5,
      total_value: "$175,000",
      last_trade_date: "2025-10-08",
      status: "pending",
    },
    {
      id: "5",
      full_name: "Maria Silva",
      company_name: "Brazil Trading Co",
      country: "Brazil",
      trade_type: "Export",
      trade_count: 31,
      total_value: "$1,240,000",
      last_trade_date: "2025-10-14",
      status: "active",
    },
    {
      id: "6",
      full_name: "Rajesh Kumar",
      company_name: "India Global Traders",
      country: "India",
      trade_type: "Import",
      trade_count: 12,
      total_value: "$420,000",
      last_trade_date: "2025-10-11",
      status: "active",
    },
    {
      id: "7",
      full_name: "Elena Volkov",
      company_name: "Russian Import Export",
      country: "Russia",
      trade_type: "Import",
      trade_count: 9,
      total_value: "$330,000",
      last_trade_date: "2025-10-09",
      status: "active",
    },
    {
      id: "8",
      full_name: "Ahmed Al-Hassan",
      company_name: "Middle East Shipping",
      country: "UAE",
      trade_type: "Re-export",
      trade_count: 3,
      total_value: "$95,000",
      last_trade_date: "2025-10-05",
      status: "pending",
    },
    {
      id: "9",
      full_name: "Sophie Dubois",
      company_name: "European Logistics SA",
      country: "France",
      trade_type: "Import",
      trade_count: 18,
      total_value: "$670,000",
      last_trade_date: "2025-10-13",
      status: "active",
    },
    {
      id: "10",
      full_name: "Carlos Mendoza",
      company_name: "Latin Trade Networks",
      country: "Mexico",
      trade_type: "Export",
      trade_count: 27,
      total_value: "$980,000",
      last_trade_date: "2025-10-12",
      status: "active",
    },
    {
      id: "11",
      full_name: "Yuki Tanaka",
      company_name: "Japan Import Co",
      country: "Japan",
      trade_type: "Import",
      trade_count: 14,
      total_value: "$520,000",
      last_trade_date: "2025-10-10",
      status: "active",
    },
    {
      id: "12",
      full_name: "David Kim",
      company_name: "Korea Trade Alliance",
      country: "South Korea",
      trade_type: "Export",
      trade_count: 6,
      total_value: "$210,000",
      last_trade_date: "2025-10-07",
      status: "pending",
    },
    {
      id: "13",
      full_name: "Isabella Ferrari",
      company_name: "Mediterranean Traders",
      country: "Italy",
      trade_type: "Import",
      trade_count: 11,
      total_value: "$385,000",
      last_trade_date: "2025-10-11",
      status: "active",
    },
    {
      id: "14",
      full_name: "Omar Hassan",
      company_name: "Gulf Commerce Ltd",
      country: "Saudi Arabia",
      trade_type: "Import",
      trade_count: 20,
      total_value: "$750,000",
      last_trade_date: "2025-10-14",
      status: "active",
    },
    {
      id: "15",
      full_name: "Anna Kowalski",
      company_name: "Polish Export Services",
      country: "Poland",
      trade_type: "Export",
      trade_count: 7,
      total_value: "$245,000",
      last_trade_date: "2025-10-08",
      status: "active",
    },
    {
      id: "16",
      full_name: "Nguyen Pham",
      company_name: "Vietnam Trade Hub",
      country: "Vietnam",
      trade_type: "Export",
      trade_count: 4,
      total_value: "$130,000",
      last_trade_date: "2025-10-06",
      status: "pending",
    },
    {
      id: "17",
      full_name: "Marcus Johnson",
      company_name: "US Global Imports",
      country: "USA",
      trade_type: "Import",
      trade_count: 25,
      total_value: "$1,100,000",
      last_trade_date: "2025-10-13",
      status: "active",
    },
    {
      id: "18",
      full_name: "Fatima Al-Sayed",
      company_name: "Cairo Trading Group",
      country: "Egypt",
      trade_type: "Export",
      trade_count: 16,
      total_value: "$590,000",
      last_trade_date: "2025-10-12",
      status: "active",
    },
    {
      id: "19",
      full_name: "Hans Mueller",
      company_name: "German Import Solutions",
      country: "Germany",
      trade_type: "Import",
      trade_count: 13,
      total_value: "$480,000",
      last_trade_date: "2025-10-11",
      status: "active",
    },
    {
      id: "20",
      full_name: "Priya Sharma",
      company_name: "Mumbai Logistics Co",
      country: "India",
      trade_type: "Export",
      trade_count: 8,
      total_value: "$290,000",
      last_trade_date: "2025-10-09",
      status: "active",
    },
    {
      id: "21",
      full_name: "Jean-Pierre Martin",
      company_name: "France Trade International",
      country: "France",
      trade_type: "Import",
      trade_count: 19,
      total_value: "$720,000",
      last_trade_date: "2025-10-14",
      status: "active",
    },
    {
      id: "22",
      full_name: "Olga Petrov",
      company_name: "Moscow Export Partners",
      country: "Russia",
      trade_type: "Export",
      trade_count: 10,
      total_value: "$360,000",
      last_trade_date: "2025-10-10",
      status: "active",
    },
    {
      id: "23",
      full_name: "Roberto Santos",
      company_name: "Brazilian Commodities",
      country: "Brazil",
      trade_type: "Export",
      trade_count: 24,
      total_value: "$850,000",
      last_trade_date: "2025-10-13",
      status: "active",
    },
    {
      id: "24",
      full_name: "Mei Lin",
      company_name: "Shanghai Trading Ltd",
      country: "China",
      trade_type: "Import",
      trade_count: 17,
      total_value: "$630,000",
      last_trade_date: "2025-10-12",
      status: "active",
    },
    {
      id: "25",
      full_name: "Thomas Anderson",
      company_name: "Nordic Imports AB",
      country: "Sweden",
      trade_type: "Import",
      trade_count: 9,
      total_value: "$310,000",
      last_trade_date: "2025-10-11",
      status: "active",
    },
    {
      id: "26",
      full_name: "Zara Khan",
      company_name: "Pakistan Trade Group",
      country: "Pakistan",
      trade_type: "Export",
      trade_count: 5,
      total_value: "$165,000",
      last_trade_date: "2025-10-08",
      status: "pending",
    },
    {
      id: "27",
      full_name: "Miguel Torres",
      company_name: "Spanish Export Co",
      country: "Spain",
      trade_type: "Export",
      trade_count: 21,
      total_value: "$780,000",
      last_trade_date: "2025-10-14",
      status: "active",
    },
    {
      id: "28",
      full_name: "Leila Abadi",
      company_name: "Tehran International",
      country: "Iran",
      trade_type: "Export",
      trade_count: 6,
      total_value: "$195,000",
      last_trade_date: "2025-10-09",
      status: "pending",
    },
    {
      id: "29",
      full_name: "John Smith",
      company_name: "UK Global Trade",
      country: "United Kingdom",
      trade_type: "Import",
      trade_count: 28,
      total_value: "$1,050,000",
      last_trade_date: "2025-10-13",
      status: "active",
    },
    {
      id: "30",
      full_name: "Kim Soo-Jin",
      company_name: "Seoul Export Hub",
      country: "South Korea",
      trade_type: "Export",
      trade_count: 15,
      total_value: "$550,000",
      last_trade_date: "2025-10-12",
      status: "active",
    },
    {
      id: "31",
      full_name: "Antonio Rossi",
      company_name: "Italian Trade Network",
      country: "Italy",
      trade_type: "Export",
      trade_count: 11,
      total_value: "$395,000",
      last_trade_date: "2025-10-10",
      status: "active",
    },
    {
      id: "32",
      full_name: "Aisha Mohammed",
      company_name: "Nigerian Exports Ltd",
      country: "Nigeria",
      trade_type: "Export",
      trade_count: 7,
      total_value: "$240,000",
      last_trade_date: "2025-10-11",
      status: "active",
    },
    {
      id: "33",
      full_name: "Lars Eriksson",
      company_name: "Scandinavian Trading",
      country: "Norway",
      trade_type: "Import",
      trade_count: 12,
      total_value: "$445,000",
      last_trade_date: "2025-10-14",
      status: "active",
    },
  ];

  const filteredUsers = searchQuery
    ? tradeUsers.filter(
        (user) =>
          user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tradeUsers;

  const totalTrades = tradeUsers.reduce(
    (sum, user) => sum + user.trade_count,
    0
  );
  const activeUsers = tradeUsers.filter(
    (user) => user.status === "active"
  ).length;

  return (
      <div className="container mx-auto py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tradeUsers.length}</div>
              <p className="text-xs text-muted-foreground">
                International traders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers}</div>
              <p className="text-xs text-muted-foreground">Currently trading</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Trades
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTrades}</div>
              <p className="text-xs text-muted-foreground">
                Completed transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>International Trade Users</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, company, or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Trade Type</TableHead>
                    <TableHead>Trades</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Last Trade</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.full_name}
                        </TableCell>
                        <TableCell>{user.company_name}</TableCell>
                        <TableCell>{user.country}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.trade_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-mono">
                            {user.trade_count}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {user.total_value}
                        </TableCell>
                        <TableCell>
                          {new Date(user.last_trade_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "active" ? "default" : "secondary"
                            }
                            className={
                              user.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default TradeUsers;
