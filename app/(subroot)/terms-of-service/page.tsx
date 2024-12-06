import SectionLayout from '@/layouts/sectionLayout'
import React from 'react'

const Page = () => {
    return (
        <SectionLayout>
            <div className="min-h-screen bg-gray-100 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Terms of Service</h1>
                    <div className="flex flex-col gap-6">
                        <div className="group relative bg-white rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:-translate-y-2">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                                General Terms
                            </h2>
                            <p className="text-gray-600">
                                By using our website, you agree to provide accurate information for order processing and
                                follow the guidelines outlined in this policy.
                            </p>
                        </div>

                        <div className="group relative bg-white rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:-translate-y-2">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                                Payment and Delivery
                            </h2>
                            <p className="text-gray-600">
                                Payments are processed securely. We aim to deliver your order promptly, but shipping times
                                may vary based on location.
                            </p>
                        </div>

                        <div className="group relative bg-white rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:-translate-y-2">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                                Returns and Refunds
                            </h2>
                            <p className="text-gray-600">
                                Products can be returned within [Insert Days, e.g., 30 days] of delivery. Refunds are issued
                                after the product passes our quality checks.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </SectionLayout>
    )
}

export default Page