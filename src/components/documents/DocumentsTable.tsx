import { useState, useEffect, useCallback } from "react";
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
  Trash2,
  Receipt,
  FileSpreadsheet,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { db, storage } from "@/integrations/firebase/client";
import { collection, getDocs, deleteDoc, doc, query } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

interface Receipt {
  id: string;
  name: string;
  date: string;
  amount: number;
  category: string;
  status: string;
  filePath?: string; // Firebase Storage path
}

interface Statement {
  id: string;
  name: string;
  date: string;
  transactionCount: number;
  status: string;
  filePath?: string; // Firebase Storage path
}

export function DocumentsTable({
  userType,
}: {
  userType: "accountant" | "business";
}) {
  const [activeTab, setActiveTab] = useState<"receipts" | "statements">(
    "receipts"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    try {
      const col = collection(db, "receipts");
      const snapshot = await getDocs(col);
      const data: Receipt[] = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Receipt)
      );
      setReceipts(data);
    } catch (err) {
      console.error("Failed to fetch receipts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatements = useCallback(async () => {
    setLoading(true);
    try {
      const col = collection(db, "statements");
      const snapshot = await getDocs(col);
      const data: Statement[] = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Statement)
      );
      setStatements(data);
    } catch (err) {
      console.error("Failed to fetch statements:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch only the active tab's data
  useEffect(() => {
    if (activeTab === "receipts") {
      fetchReceipts();
    } else {
      fetchStatements();
    }
  }, [activeTab, fetchReceipts, fetchStatements]);

  const handleDelete = async (id: string, type: "receipt" | "statement") => {
    try {
      await deleteDoc(
        doc(db, type === "receipt" ? "receipts" : "statements", id)
      );
      if (type === "receipt") fetchReceipts();
      else fetchStatements();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleDownload = async (filePath?: string) => {
    if (!filePath) return;
    try {
      const fileRef = ref(storage, filePath);
      const url = await getDownloadURL(fileRef);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const getCategoryBadge = (category: string) => {
    const classes = {
      food: "bg-receipt-food text-green-800",
      transport: "bg-receipt-transport text-blue-800",
      asset: "bg-receipt-asset text-red-800",
      communication: "bg-receipt-communication text-orange-800",
      other: "bg-receipt-other text-purple-800",
    };
    return (
      <Badge
        className={classes[category as keyof typeof classes] || classes.other}
      >
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
    return (
      <Badge
        variant="outline"
        className={classes[status as keyof typeof classes]}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredReceipts = receipts.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStatements = statements.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading documents...</div>;

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
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value: "receipts" | "statements") =>
              setActiveTab(value)
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="receipts">Receipts</TabsTrigger>
              <TabsTrigger value="statements">Bank Statements</TabsTrigger>
            </TabsList>

            {/* RECEIPTS TAB */}
            <TabsContent value="receipts">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReceipts.length ? (
                    filteredReceipts.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.id}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <Receipt className="h-4 w-4 text-muted-foreground" />
                          {r.name}
                        </TableCell>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>${r.amount.toFixed(2)}</TableCell>
                        <TableCell>{getCategoryBadge(r.category)}</TableCell>
                        <TableCell>{getStatusBadge(r.status)}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Receipt Details</DialogTitle>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  onClick={() => handleDownload(r.filePath)}
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleDelete(r.id, "receipt")}
                                className="text-red-600"
                              >
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

            {/* STATEMENTS TAB */}
            <TabsContent value="statements">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStatements.length ? (
                    filteredStatements.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.id}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                          {s.name}
                        </TableCell>
                        <TableCell>{s.date}</TableCell>
                        <TableCell>{s.transactionCount}</TableCell>
                        <TableCell>{getStatusBadge(s.status)}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Statement Details</DialogTitle>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  onClick={() => handleDownload(s.filePath)}
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleDelete(s.id, "statement")}
                                className="text-red-600"
                              >
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
