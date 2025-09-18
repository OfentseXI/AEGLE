import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FileText, Clock, CheckCircle, XCircle, Calendar } from "lucide-react";
import { format } from "date-fns";

interface ManagementAccountRequest {
  id: string;
  clientName: string;
  companyName: string;
  periodStart: string;
  periodEnd: string;
  notes: string;
  urgency: "normal" | "urgent";
  status: "pending" | "approved" | "completed" | "rejected";
  requestDate: string;
  accountantId: string;
}

export function ManagementAccountRequests() {
  const [requests, setRequests] = useState<ManagementAccountRequest[]>([]);

  useEffect(() => {
    // Load requests from localStorage for demo
    const storedRequests = JSON.parse(
      localStorage.getItem("managementAccountRequests") || "[]"
    );
    setRequests(storedRequests);
  }, []);

  const updateRequestStatus = (
    requestId: string,
    newStatus: ManagementAccountRequest["status"]
  ) => {
    const updatedRequests = requests.map((request) =>
      request.id === requestId ? { ...request, status: newStatus } : request
    );
    setRequests(updatedRequests);
    localStorage.setItem(
      "managementAccountRequests",
      JSON.stringify(updatedRequests)
    );

    const statusMessages = {
      approved: "Request approved successfully",
      completed: "Management account marked as completed",
      rejected: "Request rejected",
    };

    toast.success(statusMessages[newStatus] || "Status updated");
  };

  const getStatusBadge = (status: string, urgency: string) => {
    const isUrgent = urgency === "urgent";

    switch (status) {
      case "pending":
        return (
          <Badge variant={isUrgent ? "destructive" : "secondary"}>
            {isUrgent ? "Urgent - Pending" : "Pending"}
          </Badge>
        );
      case "approved":
        return <Badge variant="default">Approved</Badge>;
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Management Account Requests
          </h3>
          <p className="text-gray-500">
            Client requests will appear here when submitted.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Management Account Requests</h2>
        <Badge variant="secondary">{requests.length} Total</Badge>
      </div>

      {requests.map((request) => (
        <Card key={request.id} className="border-l-4 border-l-purple-500">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{request.companyName}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Client: {request.clientName}
                </p>
              </div>
              {getStatusBadge(request.status, request.urgency)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>
                  Period:{" "}
                  {format(new Date(request.periodStart), "MMM dd, yyyy")} -{" "}
                  {format(new Date(request.periodEnd), "MMM dd, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>
                  Requested:{" "}
                  {format(new Date(request.requestDate), "MMM dd, yyyy")}
                </span>
              </div>
            </div>

            {request.notes && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                <p className="text-sm text-gray-600">{request.notes}</p>
              </div>
            )}

            {request.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => updateRequestStatus(request.id, "approved")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateRequestStatus(request.id, "rejected")}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            )}

            {request.status === "approved" && (
              <Button
                size="sm"
                onClick={() => updateRequestStatus(request.id, "completed")}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Completed
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
