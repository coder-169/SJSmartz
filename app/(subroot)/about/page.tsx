'use client'
import { DropdownIcon } from '@/components/ui/assets/svg'
import Heading from '@/components/ui/head'
import Text from '@/components/ui/text'
import SectionLayout from '@/layouts/sectionLayout'
import React from 'react'

const About = () => {
    return (
        <SectionLayout>
            <div className="px-4 md:px-8 py-4">
                <div className="relative flex h-[300px] flex-col items-center justify-center gap-4 bg-[#F3F5F7] text-center">
                    <div className="flex items-center gap-4">
                        <Text
                            size="sm"
                            color="gray"
                            weight={500}
                            className="flex items-center gap-1"
                        >
                            About{" "}
                            <DropdownIcon stroke="#6C7275" className="h-3 w-3 -rotate-90" />
                        </Text>
                        <Text size="sm" weight={500}>
                            SJ Smartz
                        </Text>
                    </div>
                    <Heading as="h1" intent="shop-page">
                        About Us
                    </Heading>
                    <Text className="lg:text-lg">
                        We Are An Electronics Selling Brand at Very Affordable Price
                        <br />
                        Sj Smartz.
                    </Text>
                </div>
                <div className="my-32">
                    <p className=""></p>
                </div>
            </div>
            <div className="container mx-auto px-4 mb-8">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="group relative bg-white rounded-lg shadow-lg p-6 flex-1 transform transition-transform duration-300 hover:-translate-y-2">
                        <h2 className="text-xl font-medium text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                            Our Mission
                        </h2>
                        <p className="text-gray-600">
                            At SJ Smartz, we are passionate about providing the latest gadgets and electronics
                            to enhance your everyday life. From smart devices to accessories, we deliver only the best.
                        </p>
                     
                    </div>

                    <div className="group relative bg-white rounded-lg shadow-lg p-6 flex-1 transform transition-transform duration-300 hover:-translate-y-2">
                        <h2 className="text-xl font-medium text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                            Why Choose Us
                        </h2>
                        <p className="text-gray-600">
                            We pride ourselves on offering fast home delivery, competitive prices, and exceptional
                            customer service. Your satisfaction is our top priority.
                        </p>
                     
                    </div>

                    <div className="group relative bg-white rounded-lg shadow-lg p-6 flex-1 transform transition-transform duration-300 hover:-translate-y-2">
                        <h2 className="text-xl font-medium text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                            What We Offer
                        </h2>
                        <p className="text-gray-600">
                            Explore our curated selection of electronics, from earbuds to smartwatches, tailored to meet
                            your needs with cutting-edge technology.
                        </p>
                     
                    </div>
                </div>
            </div>
        </SectionLayout>
    )
}

export default About