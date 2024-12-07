import SectionLayout from '@/layouts/sectionLayout'
import React from 'react'
const privacyPolicy = [
    {
        title: "Information We Collect",
        details: [
            "Personal Details: Name, email address, phone number, and shipping address.",
            "Payment Information: Secured details processed by trusted third-party gateways.",
            "Usage Data: Analytics such as website visits, browsing behavior, and device details."
        ],
    },
    {
        title: "How We Use Your Information",
        details: [
            "To process orders and deliver products.",
            "To enhance your shopping experience with personalized recommendations.",
            "To communicate promotions, updates, and customer support."
        ],
    },
    {
        title: "Data Protection",
        details: [
            "We use industry-standard encryption and security measures to safeguard your information.",
            "Sensitive data is handled securely and shared only with trusted partners necessary for processing your orders."
        ],
    },
    {
        title: "Third-Party Services",
        details: [
            "We may share data with third parties such as payment processors or logistics providers solely for order fulfillment purposes."
        ],
    },
    {
        title: "Your Rights",
        details: [
            "You can request access, correction, or deletion of your personal information by contacting us at info.sjsmartz@gmail.com."
        ],
    },
    {
        title: "Updates to Policy",
        details: [
            "This Privacy Policy may be updated periodically. Please review it to stay informed of any changes."
        ],
    },
];


const Page = () => {
    return (
        <SectionLayout>
            <div className="min-h-screen bg-gray-100 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Privacy Policy</h1>
                    <p className="my-8 w-full md:w-1/2 mx-auto text-center">
                        At SJ Smartz, protecting your privacy is our top priority. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our services.
                    </p>
                    {privacyPolicy.map((section, index) => (
                        <div
                            key={index}
                            className="group relative bg-white rounded-lg shadow-lg p-6 mb-6 transform transition-transform duration-300 hover:-translate-y-2"
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                                {section.title}
                            </h2>
                            <ul className="text-gray-600 list-disc pl-5 space-y-2">
                                {section.details.map((detail, idx) => (
                                    <li key={idx}>{detail}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </SectionLayout>
    )
}

export default Page