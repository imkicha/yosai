import { Link } from "react-router-dom";
import PolicyCard from "@/components/PolicyCard";

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen px-4 py-8 md:px-8 bg-muted/40">
      <div className="mx-auto">
        <PolicyCard title="Return Policy" version="Version 1.0">
          <div className="prose max-w-none space-y-4">
            <p>
              We offer refund / exchange within first 3 days from the date of your purchase. If 3 days have passed
              since your purchase, you will not be offered a return, exchange or refund of any kind. For more details
              about Refund kindly refer our{" "}
              <Link className="text-blue-600 underline" to="/refund-policy">Refund Policy</Link> Page.
            </p>
            <p>In order to become eligible for a return or an exchange:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>The purchased item should be unused and in the same condition as you received it</li>
              <li>The item must have original packaging</li>
              <li>If the item that you purchased on a sale, then the item may not be eligible for a return / exchange</li>
            </ol>
            <p>
              Further, only such items are replaced by us (based on an exchange request), if such items are found
              defective or damaged.
            </p>
            <p>
              You agree that there may be a certain category of products / items that are exempted from returns or
              refunds. Such categories of the products would be identified to you at the item of purchase.
            </p>
            <p>
              For exchange / return accepted request(s) (as applicable), once your returned product / item is received
              and inspected by us, we will send you an email to notify you about receipt of the returned / exchanged product.
              Further, if the same has been approved after the quality check at our end, your request (i.e. return / exchange)
              will be processed in accordance with our policies.
            </p>
          </div>
        </PolicyCard>
      </div>
    </div>
  );
}
