import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function PolicyCard({ children, title, version }) {
  return (
    <div>
      <div className="flex md:flex-row flex-col-reverse justify-between md:items-center gap-4 px-8">
        <div className="md:text-3xl text-2xl font-bold tracking-tight">
          {title || "Policy Page"}
        </div>
        <div>
          <Badge variant="outline" className="text-nowrap text-lg px-4 py-2">
            {version || "Version 1.0"}
          </Badge>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="px-6 py-8">
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Important Notice</AlertTitle>
          <AlertDescription className="text-blue-700">
            Please read this policy carefully before making any purchases.
          </AlertDescription>
        </Alert>
        {children}
      </div>
    </div>
  );
}
