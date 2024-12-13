'use client'
import Button from '@/components/ui/button'
import SectionLayout from '@/layouts/sectionLayout'
import { ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const Page = () => {
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState({ email: "", phone: "", name: "", message: '', subject: '' })
  const contactUs = async () => {
    setLoading(true)
    try {
      const resp = await fetch('/api/mail/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query)
      })
      const data = await resp.json()
      if (data.success)
        toast.success(data.message)
      else
        toast.error(data.message)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQuery({ ...query, [e.target.name]: e.target.value })
  }
  return (
    <SectionLayout className="relative px-8 py-8">
      <div className="absolute left-8 top-4 inline-flex items-center gap-1 align-baseline lg:hidden">
        <ChevronLeft stroke="#605F5F" className="h-3 w-3" />
        <p className="font-inter text-sm font-medium text-[#605F5F]">back</p>
      </div>
      <div className="space-y-6 pb-12 lg:space-y-4">
        <h1 className="text-center font-poppins text-[40px] font-medium text-[#141718]">
          Contact Us
        </h1>
        {/* className="h-10 w-full rounded-md  font-medium border border-[#6C7275] px-4  text-sm  text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]" */}
        <section className="text-gray-600 body-font relative">
          <div className="container px-5 py-12 mx-auto flex sm:flex-nowrap flex-wrap">
            <div className="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
              <iframe width="100%" height="100%" className="absolute inset-0" frameBorder="0" title="map" scrolling="no" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3565.4873635890185!2d67.99525211030311!3d26.66489127060118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x394a8faae807207d%3A0x86661e02e59434b6!2sAl%20Sadiq%20Colony%2C%20Moro%2C%20Naushahro%20Feroze%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1734073439483!5m2!1sen!2s" style={{ filter: 'grayscale(1) contrast(1.2) opacity(0.4)' }}></iframe>
              <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md">
                <div className="lg:w-1/2 px-6">
                  <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">ADDRESS</h2>
                  <p className="mt-1">Al Sadiq Colony, Moro, Sindh, Pakistan </p>
                </div>
                <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                  <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">EMAIL</h2>
                  <a href='mailto:info.sjsmartz@gmail.com' className="text-blue-950 font-medium leading-relaxed">info.sjsmartz@gmail.com</a>
                  <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">PHONE</h2>
                  <a href='tel:+923191112018' className="leading-relaxed text-blue-950 font-medium ">+92 319-1112018</a>
                </div>
              </div>
            </div>
            <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
              <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Contact Us</h2>
              <p className="leading-relaxed mb-5 text-gray-600">Feel free to contact us and We are open to Suggestion </p>
              <div className="relative mb-4">
                <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
                <input type="text" id="name" name="name" value={query.name} onChange={handleChange} className="h-10 w-full rounded-md  font-medium border border-[#6C7275] px-4  text-sm  text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]" />
              </div>
              <div className="relative mb-4">
                <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                <input type="email" id="email" name="email" value={query.email} onChange={handleChange} className="h-10 w-full rounded-md  font-medium border border-[#6C7275] px-4  text-sm  text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]" />
              </div>
              <div className="relative mb-4">
                <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone</label>
                <input type="tel" id="phone" value={query.phone} onChange={handleChange} name="phone" className="h-10 w-full rounded-md  font-medium border border-[#6C7275] px-4  text-sm  text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]" />
              </div>
              <div className="relative mb-4">
                <label htmlFor="subject" className="leading-7 text-sm text-gray-600">Subject</label>
                <input type="tel" id="subject" value={query.subject} onChange={handleChange} name="subject" className="h-10 w-full rounded-md  font-medium border border-[#6C7275] px-4  text-sm  text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]" />
              </div>
              <div className="relative mb-4">
                <label htmlFor="message" className="leading-7 text-sm text-gray-600">Message</label>
                <textarea id="message" value={query.message} onChange={handleChange} name="message" rows={4} className="resize-none w-full rounded-md  font-medium border border-[#6C7275] px-2 py-2  text-sm  text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]">
                </textarea>
              </div>
              {/* <button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button> */}
              <Button disabled={loading} onClick={contactUs} width="full" type="submit" className="py-2.5 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70">

                {loading ? <span className='flex gap-2'>
                  Submitting
                  <Loader2 className='animate-spin' />
                </span>
                  : 'Submit'}
              </Button>
              <p className="text-xs text-gray-500 mt-3">We typically respond in few hours</p>
            </div>
          </div>
        </section>
      </div>
    </SectionLayout>
  )
}

export default Page