import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Ship,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  Globe,
  Package,
  Shield,
  TrendingUp,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

const InternationalTrade = () => {
  const { t } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const countries = [
    { code: "brazil", name: t("trade.brazil") },
    { code: "russia", name: t("trade.russia") },
    { code: "india", name: t("trade.india") },
    { code: "china", name: t("trade.china") },
    { code: "southAfrica", name: t("trade.southAfrica") },
  ];

  const getCountryDocuments = (country: string) => {
    switch (country) {
      case "brazil":
        return [
          t("trade.commercialInvoice"),
          t("trade.billOfLading"),
          t("trade.certificateOfOrigin"),
          t("trade.packingList"),
          t("trade.importDeclaration"),
          t("trade.importerRegistration"),
          t("trade.taxId"),
          t("trade.proformaInvoice"),
          t("trade.specialLicense"),
          t("trade.notarization"),
          t("trade.translation"),
        ];
      case "russia":
        return [
          t("trade.customsFreightDeclaration"),
          t("trade.commercialInvoice"),
          t("trade.packingList"),
          t("trade.transportDocument"),
          t("trade.certificateOfOrigin"),
          t("trade.importLicense"),
          t("trade.technicalCertificates"),
          t("trade.sanitaryCertificates"),
        ];
      case "india":
        return [
          t("trade.iecRegistration"),
          t("trade.billOfEntry"),
          t("trade.commercialInvoice"),
          t("trade.packingList"),
          t("trade.transportDocument"),
          t("trade.certificateOfOrigin"),
          t("trade.importLicense"),
          t("trade.bankDetails"),
          t("trade.healthCertificate"),
          t("trade.bisRegistration"),
          t("trade.gstCalculation"),
        ];
      case "china":
        return [
          t("trade.commercialInvoice"),
          t("trade.billOfLading"),
          t("trade.packingList"),
          t("trade.certificateOfOrigin"),
          t("trade.customsDeclarationForm"),
          t("trade.importLicense"),
          t("trade.inspectionCertificates"),
          t("trade.insuranceCertificate"),
          t("trade.cccMark"),
          t("trade.ciqInspection"),
        ];
      case "southAfrica":
        return [
          t("trade.commercialInvoice"),
          t("trade.billOfLading"),
          t("trade.packingList"),
          t("trade.certificateOfOrigin"),
          t("trade.importPermits"),
          t("trade.importerCode"),
          t("trade.sadForm"),
          t("trade.insuranceCertificate"),
        ];
      default:
        return [];
    }
  };

  const tradeStages = [
    {
      id: 1,
      title: t("trade.preTradePreparation"),
      description: t("trade.preTradePreparationDesc"),
      icon: FileText,
      status: "completed",
      documents: [
        t("trade.proformaInvoice"),
        t("trade.hsCodeValidation"),
        t("trade.incotermsValidation"),
        t("trade.permitChecks"),
      ],
      color: "bg-green-500",
    },
    {
      id: 2,
      title: t("trade.productionCompleted"),
      description: t("trade.productionCompletedDesc"),
      icon: Package,
      status: "in-progress",
      documents: [
        t("trade.commercialInvoice"),
        t("trade.packingList"),
        t("trade.sad500Draft"),
        t("trade.digitalTradePack"),
      ],
      color: "bg-blue-500",
    },
    {
      id: 3,
      title: t("trade.carrierShipping"),
      description: t("trade.carrierShippingDesc"),
      icon: Ship,
      status: "pending",
      documents: [
        t("trade.billOfLading"),
        t("trade.containerDetails"),
        t("trade.weightVerification"),
        t("trade.consigneeDetails"),
      ],
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: t("trade.customsPreArrival"),
      description: t("trade.customsPreArrivalDesc"),
      icon: Shield,
      status: "pending",
      documents: [
        t("trade.customsDeclaration"),
        t("trade.cusresMonitoring"),
        t("trade.riskAssessment"),
        t("trade.complianceCheck"),
      ],
      color: "bg-orange-500",
    },
    {
      id: 5,
      title: t("trade.durbanPortArrival"),
      description: t("trade.durbanPortArrivalDesc"),
      icon: Globe,
      status: "pending",
      documents: [
        t("trade.releaseStatus"),
        t("trade.inspectionResults"),
        t("trade.permitValidation"),
        t("trade.ispmCompliance"),
      ],
      color: "bg-red-500",
    },
    {
      id: 6,
      title: t("trade.postRelease"),
      description: t("trade.postReleaseDesc"),
      icon: TrendingUp,
      status: "pending",
      documents: [
        t("trade.acquittals"),
        t("trade.demurrageTracking"),
        t("trade.accountingReconciliation"),
        t("trade.finalClosure"),
      ],
      color: "bg-gray-500",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800">
            {t("common.completed")}
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            {t("common.inProgress")}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            {t("common.pending")}
          </Badge>
        );
    }
  };

  return (
    <DashboardLayout
      userType="business"
      userName="Trade Manager"
      companyName="Global Trade Co."
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {t("trade.internationalTrade")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("trade.makeTradeEasy")}
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                // Navigate to trade initiation flow or show dialog
                console.log("Starting new trade...");
              }}
            >
              {t("trade.startNewTrade")}
            </Button>
            <Button variant="outline">{t("trade.viewActiveShipments")}</Button>
          </div>
        </div>

        {/* Country Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-6 w-6" />
              {t("trade.selectCountry")}
            </CardTitle>
            <CardDescription>{t("trade.selectCountryDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select a country..." />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCountry && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">
                  {t("trade.documentationRequirements")} -{" "}
                  {countries.find((c) => c.code === selectedCountry)?.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {getCountryDocuments(selectedCountry).map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border"
                    >
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trade Process Flow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="h-6 w-6" />
              {t("trade.tradeProcessFlow")}
            </CardTitle>
            <CardDescription>{t("trade.endToEndTradeFlow")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {tradeStages.map((stage, index) => (
                <div key={stage.id} className="relative">
                  <div className="flex items-start gap-4">
                    {/* Stage Icon */}
                    <div
                      className={`p-3 rounded-full ${stage.color} flex-shrink-0`}
                    >
                      <stage.icon className="h-6 w-6 text-white" />
                    </div>

                    {/* Stage Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{stage.title}</h3>
                        {getStatusIcon(stage.status)}
                        {getStatusBadge(stage.status)}
                      </div>

                      <p className="text-muted-foreground mb-4">
                        {stage.description}
                      </p>

                      {/* Documents Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {stage.documents.map((doc, docIndex) => (
                          <div
                            key={docIndex}
                            className="flex items-center gap-2 p-2 bg-muted/50 rounded-md text-sm"
                          >
                            <FileText className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate">{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Connecting Arrow */}
                  {index < tradeStages.length - 1 && (
                    <div className="flex justify-center mt-4 mb-2">
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                {t("trade.autoValidation")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t("trade.autoValidationDesc")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                {t("trade.complianceTracking")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t("trade.complianceTrackingDesc")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                {t("trade.realTimeTracking")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t("trade.realTimeTrackingDesc")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InternationalTrade;
