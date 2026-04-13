import { Separator } from "@/components/ui/separator";
import PolicyCard from "@/components/PolicyCard";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen px-4 py-8 md:px-8 bg-muted/40">
      <div className="mx-auto">
        <PolicyCard title="Refund Policy" version="Version 1.0">
          <div className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Policy Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                This policy outlines the terms for cancellations and refunds of products/services purchased through our platform.
              </p>
            </section>

            <Separator />

            <section className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Key Provisions</h3>
              <ol className="list-decimal pl-6 space-y-6">
                <li className="space-y-2">
                  <h4 className="font-medium">Order Cancellations</h4>
                  <p className="text-muted-foreground">
                    Cancellation requests must be made within <strong>48 hours</strong> of purchase. Requests may be denied if:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Merchant has initiated shipping process</li>
                    <li>Product is already out for delivery</li>
                  </ul>
                </li>
                <li className="space-y-2">
                  <h4 className="font-medium">Damaged/Defective Products</h4>
                  <p className="text-muted-foreground">
                    Report issues within <strong>48 hours</strong> of delivery. Our team will initiate investigation within 24 business hours.
                  </p>
                </li>
                <li className="space-y-2">
                  <h4 className="font-medium">Product Expectations</h4>
                  <p className="text-muted-foreground">
                    Discrepancies must be reported within <strong>48 hours</strong> of receipt. Resolution options include replacement or store credit.
                  </p>
                </li>
                <li className="space-y-2">
                  <h4 className="font-medium">Manufacturer Warranties</h4>
                  <p className="text-muted-foreground">
                    Warrantied products should be addressed directly with manufacturers. We provide <strong>assisted RMA processing</strong>.
                  </p>
                </li>
                <li className="space-y-2">
                  <h4 className="font-medium">Refund Processing</h4>
                  <p className="text-muted-foreground">
                    Approved refunds are processed in <strong>1-2 business days</strong> via original payment method. Allow <strong>7-10 business days</strong> for bank processing.
                  </p>
                  <p className="font-bold mt-2">Refund Timeframes:</p>
                  <ul className="list-disc pl-6">
                    <li><strong>Approval:</strong> Upon receiving your return and inspecting the condition of the item, we will process your refund.</li>
                    <li><strong>Refund Processing:</strong> Allow us 1-2 business days to process your refund.</li>
                    <li><strong>Refund Credit:</strong> The Refunds will be credited to your original payment method within 7-10 business days.</li>
                  </ul>
                </li>
              </ol>
            </section>

            <Separator />

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Contact Support</h3>
              <p className="text-muted-foreground">
                For urgent queries:<br />
                <a href="mailto:support@yosai.org" className="text-primary underline">support@yosai.org</a>
                <span className="mx-2">•</span>
                24/7 Chat Support
              </p>
            </section>
          </div>
        </PolicyCard>
      </div>
    </div>
  );
}
