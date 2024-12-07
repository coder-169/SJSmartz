import SectionLayout from '@/layouts/sectionLayout'
import React from 'react'
const termsOfService = [
    {
        title: "General Terms",
        details: [
            "By placing an order, you agree to provide accurate and complete information.",
            "All product prices, descriptions, and availability are subject to change without notice."
        ],
    },
    {
        title: "Payment and Delivery",
        details: [
            "Payments must be completed through our secure checkout process.",
            "We deliver products to the address provided during checkout. Delivery times may vary based on location."
        ],
    },
    {
        title: "Returns and Refunds",
        details: [
            "Products can be returned within 7 Days of delivery if they meet our return policy criteria.",
            "Refer to Privacy Policy for details."
        ],
    },
    {
        title: "Intellectual Property",
        details: [
            "All content, trademarks, and logos on this site are the property of SJ Smartz.",
            "Unauthorized use is prohibited."
        ],
    },
    {
        title: "Limitation of Liability",
        details: [
            "SJ Smartz is not liable for any indirect or consequential damages resulting from the use of our products or services."
        ],
    },
    {
        title: "Contact Us",
        details: [
            "For any queries or concerns, reach out to us at info.sjsmartz@gmail.com."
        ],
    },
];


const Page = () => {
    return (
        <SectionLayout>
            <div className="min-h-screen bg-gray-100 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Terms of Service</h1>

                    <p className="my-8 w-full md:w-1/2 mx-auto text-center">
                        Welcome to  SJ Smartz, By using our website and services, you agree to the following terms and conditions.
                    </p>
                    {termsOfService.map((term, index) => (
                        <div
                            key={index}
                            className="group relative bg-white rounded-lg shadow-lg p-6 mb-6 transform transition-transform duration-300 hover:-translate-y-2"
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                                {term.title}
                            </h2>
                            <ul className="text-gray-600 list-disc pl-5 space-y-2">
                                {term.details.map((detail, idx) => (
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