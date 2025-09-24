/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";

interface User {
  id: string;
  full_name: string | null;
  company_name: string | null;
  is_authorized: boolean;
  created_at: string | null;
}

interface AdminUserTableProps {
  searchQuery: string;
}

export function AdminUserTable({ searchQuery }: AdminUserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        let q = query(
          collection(db, "profiles"),
          orderBy("created_at", "desc")
        );

        // If search query exists, filter by full_name or company_name
        if (searchQuery) {
          q = query(
            collection(db, "profiles"),
            orderBy("created_at", "desc"),
            where("full_name", ">=", searchQuery),
            where("full_name", "<=", searchQuery + "\uf8ff")
          );
          // Note: Firestore doesn't allow OR queries directly, so you might need multiple queries or a cloud function
        }

        const snapshot = await getDocs(q);
        const fetchedUsers: User[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Omit<User, "id">;
          return {
            id: docSnap.id,
            full_name: data.full_name ?? null,
            company_name: data.company_name ?? null,
            is_authorized: data.is_authorized ?? false,
            created_at: data.created_at ?? null,
          };
        });

        setUsers(fetchedUsers);
      } catch (error: any) {
        toast({
          title: "Error fetching users",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [searchQuery, toast]);

  const handleAuthorize = async (userId: string, currentStatus: boolean) => {
    try {
      const userRef = doc(db, "profiles", userId);
      await updateDoc(userRef, { is_authorized: !currentStatus });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, is_authorized: !currentStatus } : user
        )
      );

      toast({
        title: "Success",
        description: `User ${
          !currentStatus ? "authorized" : "unauthorized"
        } successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating user",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name || "N/A"}</TableCell>
                <TableCell>{user.company_name || "N/A"}</TableCell>
                <TableCell>
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.is_authorized
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.is_authorized ? "Authorized" : "Unauthorized"}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant={user.is_authorized ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleAuthorize(user.id, user.is_authorized)}
                  >
                    {user.is_authorized ? "Revoke Access" : "Authorize"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
