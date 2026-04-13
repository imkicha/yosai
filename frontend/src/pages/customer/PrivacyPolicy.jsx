import PolicyCard from "@/components/PolicyCard";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen px-4 py-8 md:px-8 bg-muted/40">
      <div className="mx-auto">
        <PolicyCard title="Privacy Policy" version="Version 1.0">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Introduction</h2>
            <p className="text-muted-foreground">
              This Privacy Policy describes how S Square International and its affiliates (collectively "S Square
              International, we, our, us") collect, use, share, protect or otherwise process your information/ personal
              data through our website https://yosai.in (hereinafter referred to as Platform). Please note that you
              may be able to browse certain sections of the Platform without registering with us. We do not offer any
              product/service under this Platform outside India and your personal data will primarily be stored and
              processed in India. By visiting this Platform, providing your information or availing any product/service
              offered on the Platform, you expressly agree to be bound by the terms and conditions of this Privacy
              Policy, the Terms of Use and the applicable service/product terms and conditions, and agree to be
              governed by the laws of India including but not limited to the laws applicable to data protection and
              privacy. If you do not agree please do not use or access our Platform.
            </p>
          </div>
          <ol className="list-decimal pl-6 space-y-6 mt-4">
            <li className="space-y-2">
              <h4 className="font-medium">Collection</h4>
              <p className="text-muted-foreground">
                We collect your personal data when you use our Platform, services or otherwise interact with us during
                the course of our relationship and related information provided from time to time. Some of the information
                that we may collect includes but is not limited to personal data / information provided to us during
                sign-up/registering or using our Platform such as name, date of birth, address, telephone/mobile number,
                email ID and/or any such information shared as proof of identity or address. Some of the sensitive personal
                data may be collected with your consent, such as your bank account or credit or debit card or other payment
                instrument information. You always have the option to not provide information, by choosing not to use a
                particular service or feature on the Platform.
              </p>
              <p className="text-muted-foreground">
                If you receive an email, a call from a person/association claiming to be S Square International seeking any
                personal data like debit/credit card PIN, net-banking or mobile banking password, we request you to never
                provide such information. If you have already revealed such information, report it immediately to an
                appropriate law enforcement agency.
              </p>
            </li>
            <li className="space-y-2">
              <h4 className="font-medium">Usage</h4>
              <p className="text-muted-foreground">
                We use personal data to provide the services you request. To the extent we use your personal data to market
                to you, we will provide you the ability to opt-out of such uses. We use your personal data to assist sellers
                and business partners in handling and fulfilling orders; enhancing customer experience; to resolve disputes;
                troubleshoot problems; inform you about online and offline offers, products, services, and updates; customise
                your experience; detect and protect us against error, fraud and other criminal activity; enforce our terms
                and conditions; conduct marketing research, analysis and surveys.
              </p>
            </li>
            <li className="space-y-2">
              <h4 className="font-medium">Sharing</h4>
              <p className="text-muted-foreground">
                We may share your personal data internally within our group entities, our other corporate entities, and
                affiliates to provide you access to the services and products offered by them. These entities and affiliates
                may market to you as a result of such sharing unless you explicitly opt-out. We may disclose personal data
                to third parties such as sellers, business partners, third party service providers including logistics partners,
                prepaid payment instrument issuers, third-party reward programs and other payment opted by you.
              </p>
            </li>
            <li className="space-y-2">
              <h4 className="font-medium">Security Precautions</h4>
              <p className="text-muted-foreground">
                To protect your personal data from unauthorised access or disclosure, loss or misuse we adopt reasonable
                security practices and procedures. Once your information is in our possession or whenever you access your
                account information, we adhere to our security guidelines to protect it against unauthorised access and offer
                the use of a secure server. However, the transmission of information is not completely secure for reasons
                beyond our control.
              </p>
            </li>
            <li className="space-y-2">
              <h4 className="font-medium">Data Deletion and Retention</h4>
              <p className="text-muted-foreground">
                You have an option to delete your account by visiting your profile and settings on our Platform, this action
                would result in you losing all information related to your account. You may also write to us at the contact
                information provided below to assist you with these requests. We retain your personal data information for a
                period no longer than is required for the purpose for which it was collected or as required under any applicable law.
              </p>
            </li>
            <li className="space-y-2">
              <h4 className="font-medium">Your Rights</h4>
              <p className="text-muted-foreground">
                You may access, rectify, and update your personal data directly through the functionalities provided on the Platform.
              </p>
            </li>
            <li className="space-y-2">
              <h4 className="font-medium">Consent</h4>
              <p className="text-muted-foreground">
                By visiting our Platform or by providing your information, you consent to the collection, use, storage,
                disclosure and otherwise processing of your information on the Platform in accordance with this Privacy Policy.
              </p>
            </li>
          </ol>
          <div className="space-y-2 mt-4">
            <h4 className="font-medium">Changes to this Privacy Policy</h4>
            <p className="text-muted-foreground">
              Please check our Privacy Policy periodically for changes. We may update this Privacy Policy to reflect changes
              to our information practices.
            </p>
            <h4 className="font-medium">Grievance Officer</h4>
            <p className="text-muted-foreground">
              Name of the Office: S Square International<br />
              Address: No 2, Rajagopalan Street, West Mambalam, Chennai, India.
            </p>
            <h4 className="font-medium">Contact us</h4>
            <p className="text-muted-foreground">
              Email: <a href="mailto:support@yosai.org" className="text-blue-700 underline">support@yosai.org</a><br />
              Time: Monday - Friday (9:00 - 18:00)
            </p>
          </div>
        </PolicyCard>
      </div>
    </div>
  );
}
