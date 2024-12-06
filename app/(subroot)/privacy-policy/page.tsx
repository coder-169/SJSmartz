import SectionLayout from '@/layouts/sectionLayout'
import React from 'react'

const Page = () => {
    return (
        <SectionLayout>
            <div className="min-h-screen bg-gray-100 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Privacy Policy</h1>
                    <p className="my-8 w-full md:w-1/2 mx-auto text-center">
                        At [Your Brand Name], protecting your privacy is our top priority. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our services.
                    </p>
                    <div className="flex flex-col gap-6">
                        <div className="group relative bg-white rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:-translate-y-2">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                                Information We Collect
                            </h2>
                            <p className="text-gray-600">
                                We collect personal information such as name, email address, shipping address, and payment
                                details to process your orders and improve your experience.
                            </p>
                        </div>

                        <div className="group relative bg-white rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:-translate-y-2">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                                How We Use Your Information
                            </h2>
                            <p className="text-gray-600">
                                Your data is used to fulfill orders, provide personalized recommendations, and communicate
                                updates and promotions securely.
                            </p>
                        </div>

                        <div className="group relative bg-white rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:-translate-y-2">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                                Your Rights
                            </h2>
                            <p className="text-gray-600">
                                You have the right to access, update, or delete your personal information. Reach out to us
                                at [Your Email Address] for assistance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </SectionLayout>
    )
}

export default Page