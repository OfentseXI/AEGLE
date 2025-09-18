import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EyeIcon,
  Download,
  MoreHorizontal,
  Edit,
  Trash2,
  FileText,
  Receipt,
  FileSpreadsheet,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const mockReceipts = [
  {
    id: "REC-001",
    name: "Office Supply Receipt",
    date: "2023-06-15",
    amount: 250.99,
    category: "asset",
    status: "processed",
  },
  {
    id: "REC-002",
    name: "Team Lunch Receipt",
    date: "2023-06-18",
    amount: 150.5,
    category: "food",
    status: "processed",
  },
  {
    id: "REC-003",
    name: "Fuel Receipt",
    date: "2023-06-20",
    amount: 75.25,
    category: "transport",
    status: "processed",
  },
  {
    id: "REC-004",
    name: "Internet Bill",
    date: "2023-06-25",
    amount: 89.99,
    category: "communication",
    status: "pending",
  },
  {
    id: "REC-005",
    name: "Conference Fee Receipt",
    date: "2023-06-30",
    amount: 499.0,
    category: "other",
    status: "pending",
  },
];

const mockStatements = [
  {
    id: "STMT-001",
    name: "June 2023 Bank Statement",
    date: "2023-06-30",
    transactionCount: 45,
    status: "processed",
  },
  {
    id: "STMT-002",
    name: "May 2023 Bank Statement",
    date: "2023-05-31",
    transactionCount: 38,
    status: "processed",
  },
  {
    id: "STMT-003",
    name: "April 2023 Bank Statement",
    date: "2023-04-30",
    transactionCount: 42,
    status: "archived",
  },
];

export function DocumentsTable({
  userType,
}: {
  userType: "accountant" | "business";
}) {
  const [activeTab, setActiveTab] = useState("receipts");
  const [searchQuery, setSearchQuery] = useState("");

  const getCategoryBadge = (category: string) => {
    const classes = {
      food: "bg-receipt-food text-green-800",
      transport: "bg-receipt-transport text-blue-800",
      asset: "bg-receipt-asset text-red-800",
      communication: "bg-receipt-communication text-orange-800",
      other: "bg-receipt-other text-purple-800",
    };

    const type = category as keyof typeof classes;

    return (
      <Badge className={classes[type] || classes.other}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const classes = {
      processed: "bg-green-100 text-green-800 hover:bg-green-100",
      pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      archived: "bg-gray-100 text-gray-800 hover:bg-gray-100",
      rejected: "bg-red-100 text-red-800 hover:bg-red-100",
    };

    const type = status as keyof typeof classes;

    return (
      <Badge variant="outline" className={classes[type]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredReceipts = mockReceipts.filter(
    (receipt) =>
      receipt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStatements = mockStatements.filter(
    (statement) =>
      statement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      statement.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Library</CardTitle>
        <CardDescription>
          View and manage all your uploaded documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="search-documents" className="sr-only">
                Search
              </Label>
              <Input
                id="search-documents"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          <Tabs
            defaultValue="receipts"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="receipts">Receipts</TabsTrigger>
              <TabsTrigger value="statements">Bank Statements</TabsTrigger>
            </TabsList>
            <TabsContent value="receipts" className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReceipts.length > 0 ? (
                    filteredReceipts.map((receipt) => (
                      <TableRow key={receipt.id}>
                        <TableCell>{receipt.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-muted-foreground" />
                            {receipt.name}
                          </div>
                        </TableCell>
                        <TableCell>{receipt.date}</TableCell>
                        <TableCell>${receipt.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          {getCategoryBadge(receipt.category)}
                        </TableCell>
                        <TableCell>{getStatusBadge(receipt.status)}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Receipt Details</DialogTitle>
                                <DialogDescription>
                                  View the extracted information from this
                                  receipt.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">ID</Label>
                                  <div className="col-span-3">{receipt.id}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Name</Label>
                                  <div className="col-span-3">
                                    {receipt.name}
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Date</Label>
                                  <div className="col-span-3">
                                    {receipt.date}
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Amount</Label>
                                  <div className="col-span-3">
                                    ${receipt.amount.toFixed(2)}
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Category</Label>
                                  <div className="col-span-3">
                                    {getCategoryBadge(receipt.category)}
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Status</Label>
                                  <div className="col-span-3">
                                    {getStatusBadge(receipt.status)}
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button className="bg-purple hover:bg-purple-dark">
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground"
                      >
                        No receipts found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="statements" className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Statement ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStatements.length > 0 ? (
                    filteredStatements.map((statement) => (
                      <TableRow key={statement.id}>
                        <TableCell>{statement.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                            {statement.name}
                          </div>
                        </TableCell>
                        <TableCell>{statement.date}</TableCell>
                        <TableCell>{statement.transactionCount}</TableCell>
                        <TableCell>
                          {getStatusBadge(statement.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>
                                  Bank Statement Details
                                </DialogTitle>
                                <DialogDescription>
                                  View the extracted information from this bank
                                  statement.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">ID</Label>
                                  <div className="col-span-3">
                                    {statement.id}
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Name</Label>
                                  <div className="col-span-3">
                                    {statement.name}
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Date</Label>
                                  <div className="col-span-3">
                                    {statement.date}
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">
                                    Transactions
                                  </Label>
                                  <div className="col-span-3">
                                    {statement.transactionCount}
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Status</Label>
                                  <div className="col-span-3">
                                    {getStatusBadge(statement.status)}
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button className="bg-purple hover:bg-purple-dark">
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground"
                      >
                        No statements found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
