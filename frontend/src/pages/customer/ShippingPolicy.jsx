import PolicyCard from "@/components/PolicyCard";

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen px-4 py-8 md:px-8 bg-muted/40">
      <div className="mx-auto">
        <PolicyCard title="Shipping Policy" version="Version 1.0">
          <div className="prose max-w-none">
            <p className="font-medium mb-4">
              This policy outlines the terms for shipping and delivery of products purchased through our platform.
            </p>
            <ol className="pl-6 list-decimal space-y-6">
              <li className="space-y-2">
                <p>The orders for the user are shipped through registered domestic courier companies and/or speed post only.</p>
              </li>
              <li className="space-y-2">
                <p>
                  All orders are processed within <strong>1-2 business days</strong> after payment confirmation. Please note
                  that in some cases the orders are not processed or shipped on weekends or public holidays by our shipping partner.
                </p>
              </li>
              <li className="space-y-2">
                <p>
                  The Orders will be shipped within <strong>7 working days</strong> from <strong>the date of the order or payment</strong>{" "}
                  and delivering of the shipment, subject to courier company / post office norms.
                </p>
              </li>
              <li className="space-y-2">
                <div>
                  <p>
                    We strive to ensure timely delivery of your orders. Our shipping process is handled by trusted third-party
                    logistics partners like Shiprocket and Shadowfax, ensuring a smooth and reliable experience.
                  </p>
                  <p className="font-bold mt-2">Estimated Delivery Timeframes:</p>
                  <ul className="list-disc pl-6">
                    <li><strong>Standard Delivery:</strong> 4-7 business days (depending on location)</li>
                    <li><strong>Express Delivery:</strong> 1-3 business days (available for selected locations)</li>
                    <li><strong>Remote Areas:</strong> May take up to 15 business days</li>
                  </ul>
                  <p className="font-bold mt-2">Additional Information:</p>
                  <ul className="list-disc pl-6">
                    <li>Delivery times may vary due to unforeseen factors such as weather conditions, strikes, or high-demand periods.</li>
                    <li>Once your order is shipped, you will receive a tracking ID via email/SMS to monitor your delivery status.</li>
                    <li>If you experience any delays or issues, please contact our support team at{" "}
                      <a className="text-blue-600 underline" href="mailto:support@yosai.org">support@yosai.org</a>
                    </li>
                  </ul>
                  We appreciate your patience and trust in us!
                </div>
              </li>
              <li className="space-y-2">
                <p>Platform Owner shall not be liable for any delay in delivery by the courier company / postal authority.</p>
              </li>
              <li className="space-y-2">
                <p>Delivery of all orders will be made to the address provided by the buyer at the time of purchase.</p>
              </li>
              <li className="space-y-2">
                <p>Delivery of our services will be confirmed on your email ID as specified at the time of registration.</p>
              </li>
              <li className="space-y-2">
                <p>
                  If there are any shipping cost(s) levied by the seller or the Platform Owner (as the case be), the same
                  is not refundable.
                </p>
              </li>
            </ol>
          </div>
        </PolicyCard>
      </div>
    </div>
  );
}
