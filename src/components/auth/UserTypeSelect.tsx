import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Briefcase } from "lucide-react";
type UserType = "accountant" | "business" | null;
interface UserTypeSelectProps {
  onSelect: (type: UserType) => void;
}
export function UserTypeSelect({ onSelect }: UserTypeSelectProps) {
  const [selectedType, setSelectedType] = useState<UserType>(null);
  const handleSelect = (type: UserType) => {
    setSelectedType(type);
  };
  const handleContinue = () => {
    if (selectedType) {
      onSelect(selectedType);
    }
  };
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-ledger-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-ledger-text-primary">
            Select Account Type
          </CardTitle>
          <CardDescription>
            Choose the account type that best describes you
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          <Button
            variant="outline"
            className={`h-auto flex flex-col items-center justify-center p-6 gap-4 rounded-lg border-2 hover:bg-muted/25 ${
              selectedType === "accountant"
                ? "border-purple-light bg-accent"
                : "border-ledger-border"
            }`}
            onClick={() => handleSelect("accountant")}
          >
            <Briefcase className="w-16 h-16 mb-2 text-purple" />
            <div className="text-center">
              <h3 className="font-semibold text-xl mb-1">Accounting Firm</h3>
            </div>
          </Button>

          <Button
            variant="outline"
            className={`h-auto flex flex-col items-center justify-center p-6 gap-4 rounded-lg border-2 hover:bg-muted/25 ${
              selectedType === "business"
                ? "border-purple-light bg-accent"
                : "border-ledger-border"
            }`}
            onClick={() => handleSelect("business")}
          >
            <Building2 className="w-16 h-16 mb-2 text-purple" />
            <div className="text-center">
              <h3 className="font-semibold text-xl mb-1">Business Owner</h3>
            </div>
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center pb-6 pt-2">
          <Button
            className="w-full max-w-xs bg-purple hover:bg-purple-dark"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
