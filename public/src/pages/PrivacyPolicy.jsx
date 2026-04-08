import React, { useState } from "react";

const sections = [
  {
    id: "background",
    title: "1. Background and Key Information",
    content: `This Privacy Policy applies to DDS Online (https://ddsonline.in/).

We are committed to protecting your personal data and ensuring transparency.

By using our platform, you consent to our data practices.`,
  },
  {
    id: "personal-data",
    title: "2. Personal Data We Collect",
    content: `We may collect:
• Name, email, phone number
• Device & browser data
• Usage activity
• Transaction details`,
  },
  {
    id: "usage",
    title: "3. How We Use Your Data",
    content: `We use your data to:
• Provide services
• Improve user experience
• Process payments
• Ensure security`,
  },
  {
    id: "cookies",
    title: "4. Cookies",
    content: `We use cookies to enhance your experience and analyze traffic.`,
  },
  {
    id: "rights",
    title: "5. Your Rights",
    content: `You can:
• Access your data
• Request correction
• Request deletion
Contact: support@ddsonline.in`,
  },
  {
    id: "gdpr",
    title: "6. GDPR Compliance (EU Users)",
    content: `If you are in the European Economic Area (EEA), you have rights under GDPR:

• Right to access
• Right to rectification
• Right to erasure (Right to be forgotten)
• Right to restrict processing
• Right to data portability
• Right to object

Legal basis: consent, contract, legal obligation, legitimate interest.`,
  },
  {
    id: "dpdp",
    title: "7. India DPDP Act Compliance",
    content: `Under the Digital Personal Data Protection Act, 2023:

• We process data lawfully and transparently
• We collect only necessary data
• You can withdraw consent anytime
• You can request correction or erasure

Grievance Officer Contact:
support@ddsonline.in`,
  },
  {
    id: "security",
    title: "8. Data Security",
    content: `We use encryption, secure servers, and best practices to protect your data.`,
  },
  {
    id: "retention",
    title: "9. Data Retention",
    content: `We retain data only as long as necessary for legal and service purposes.`,
  },
];

export default function PrivacyPolicy() {
  const [openSection, setOpenSection] = useState(null);
  const [search, setSearch] = useState("");

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  const highlightText = (text) => {
    if (!search) return text;

    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const filteredSections = sections.filter((sec) =>
    (sec.title + sec.content)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-2">
          Privacy Policy
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        {/* TRUST BADGES */}
        <div className="flex flex-wrap justify-center gap-3 mb-6 text-sm">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
            🔒 Secure Platform
          </span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            GDPR Compliant
          </span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
            DPDP Act Ready
          </span>
        </div>

        {/* Intro */}
        <p className="text-center text-gray-700 mb-6">
          Welcome to DDS Online (
          <a
            href="https://ddsonline.in/"
            className="text-indigo-600 underline"
            target="_blank"
          >
            https://ddsonline.in
          </a>
          ). Your privacy and trust are our top priorities.
        </p>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search in policy..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        {/* ACCORDION */}
        <div className="space-y-4">
          {filteredSections.map((sec) => (
            <div
              key={sec.id}
              className="border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleSection(sec.id)}
                className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 font-semibold flex justify-between items-center"
              >
                {sec.title}
                <span>{openSection === sec.id ? "−" : "+"}</span>
              </button>

              {openSection === sec.id && (
                <div className="p-4 text-gray-700 whitespace-pre-line leading-relaxed">
                  {highlightText(sec.content)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FOOTER TRUST */}
        <div className="mt-10 text-center text-sm text-gray-600">
          <p>
            We value your trust. If you have any concerns, contact us at{" "}
            <span className="font-medium text-indigo-600">
              support@ddsonline.in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}