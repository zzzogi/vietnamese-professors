export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-8">Last updated: December 5, 2025</p>

        <div className="bg-white rounded-lg p-8 shadow-sm prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-0 mb-4">
            1. Information We Collect
          </h2>
          <p className="text-gray-700 mb-6">
            We collect information you provide directly to us, including:
          </p>
          <ul className="text-gray-700 space-y-2 mb-6">
            <li>
              <strong>Account Information:</strong> Name, email address, and
              password when you create an account
            </li>
            <li>
              <strong>Profile Data:</strong> Research interests, academic
              background, and preferences
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you interact
              with our platform, including searches, bookmarks, and generated
              emails
            </li>
            <li>
              <strong>Payment Information:</strong> Payment details processed
              securely through our payment provider (for PRO subscriptions)
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-4">
            We use the information we collect to:
          </p>
          <ul className="text-gray-700 space-y-2 mb-6">
            <li>Provide, maintain, and improve our services</li>
            <li>Generate AI-powered email suggestions</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Analyze usage patterns to improve user experience</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            3. Information Sharing
          </h2>
          <p className="text-gray-700 mb-4">
            We do not sell, trade, or rent your personal information to third
            parties. We may share information in the following circumstances:
          </p>
          <ul className="text-gray-700 space-y-2 mb-6">
            <li>
              <strong>With your consent:</strong> When you authorize us to share
              information
            </li>
            <li>
              <strong>Service providers:</strong> With third-party vendors who
              help us operate our platform (e.g., hosting, analytics)
            </li>
            <li>
              <strong>Legal requirements:</strong> When required by law or to
              protect our rights
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            4. Data Security
          </h2>
          <p className="text-gray-700 mb-6">
            We implement appropriate technical and organizational measures to
            protect your personal information. However, no method of
            transmission over the Internet is 100% secure, and we cannot
            guarantee absolute security.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            5. Your Rights
          </h2>
          <p className="text-gray-700 mb-4">You have the right to:</p>
          <ul className="text-gray-700 space-y-2 mb-6">
            <li>Access and receive a copy of your personal data</li>
            <li>Correct inaccurate or incomplete information</li>
            <li>Request deletion of your account and data</li>
            <li>Object to or restrict certain processing of your data</li>
            <li>Export your data in a portable format</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            6. Cookies and Tracking
          </h2>
          <p className="text-gray-700 mb-6">
            We use cookies and similar tracking technologies to collect
            information about your browsing activities. You can control cookies
            through your browser settings.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            7. Children&apos;s Privacy
          </h2>
          <p className="text-gray-700 mb-6">
            Our services are not intended for children under 13 years of age. We
            do not knowingly collect personal information from children under
            13.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            8. Changes to This Policy
          </h2>
          <p className="text-gray-700 mb-6">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new policy on this page and
            updating the &quot;Last updated&quot; date.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            9. Contact Us
          </h2>
          <p className="text-gray-700">
            If you have questions about this Privacy Policy, please contact us
            at:{" "}
            <a
              href="mailto:privacy@vietnameseprofessors.com"
              className="text-purple-600 hover:underline"
            >
              privacy@vietnameseprofessors.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
