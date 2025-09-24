/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { FileText, Send } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export function RequestManagementAccount() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    periodStart: "",
    periodEnd: "",
    notes: "",
    urgency: "normal" as "normal" | "urgent",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const request = {
        clientName: "Alex Johnson",
        companyName: "Johnson Enterprises Ltd",
        periodStart: formData.periodStart,
        periodEnd: formData.periodEnd,
        notes: formData.notes,
        urgency: formData.urgency,
        status: "pending",
        requestDate: serverTimestamp(),
        accountantId: "sarah-taylor", // demo accountant
      };

      await addDoc(collection(db, "managementAccountRequests"), request);

      toast.success("Management account request sent to your accountant!");

      // Reset form
      setFormData({
        periodStart: "",
        periodEnd: "",
        notes: "",
        urgency: "normal",
      });
    } catch (error: any) {
      console.error("Error sending request:", error);
      toast.error("Failed to send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Request Management Account
        </CardTitle>
        <CardDescription>
          Request your accountant to prepare management accounts for a specific
          period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="periodStart">Period Start</Label>
              <Input
                id="periodStart"
                type="date"
                value={formData.periodStart}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    periodStart: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="periodEnd">Period End</Label>
              <Input
                id="periodEnd"
                type="date"
                value={formData.periodEnd}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    periodEnd: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency</Label>
            <select
              id="urgency"
              value={formData.urgency}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  urgency: e.target.value as "normal" | "urgent",
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Any specific requirements or notes for your accountant..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              "Sending Request..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Request to Accountant
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
