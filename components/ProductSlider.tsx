import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import gsap from "gsap";
import Image from "next/image";

const ProductSlider = () => {
    const slides = [
        {
            title: "Premium Headphones",
            description: "Experience unmatched sound quality.",
            image: "/images/head.png",
        },
        {
            title: "Airpods Pro 2",
            description: "Compact design, big performance.",
            image: "/images/hero.png",
        },
        {
            title: "Smart Watches",
            description: "Track your fitness in style.",
            image: "/images/sm.png",
        },
    ];

    // Refs for animation targets
    const textRef = useRef<(HTMLDivElement | null)[]>([]);
    const imageRef = useRef<(HTMLDivElement | null)[]>([]);

    // GSAP Animation Hook
    useEffect(() => {
        const swiper = document.querySelector(".swiper-container");

        const handleSlideChange = (index: number) => {
            console.log(textRef.current); // Should log an array of elements
            console.log(imageRef.current);

            // Animate the text content
            gsap.fromTo(
                textRef.current[index],
                { x: -100, opacity: 0 },
                { x: 0, opacity: 1, duration: 1, ease: "power2.out" }
            );

            // Animate the image
            gsap.fromTo(
                imageRef.current[index],
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, duration: 1, ease: "power2.out" }
            );
        };

        // Trigger animation on each slide change
        const observer = new MutationObserver(() => {
            const activeSlide = document.querySelector(".swiper-slide-active")!;
            const activeIndex = Array.from(swiper?.children || []).indexOf(activeSlide);
            handleSlideChange(activeIndex);
        });

        if (swiper) {
            observer.observe(swiper, { attributes: true, subtree: true });
        }

        // Cleanup observer on component unmount
        return () => observer.disconnect();
    }, []);

    return (
        <div className="w-full h-screen flex items-center justify-center bg-white">
            <Swiper
                modules={[Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 10000,
                    disableOnInteraction: false,
                }}
                loop
                className="swiper-container w-full h-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="w-3/4 mx-auto flex flex-col md:flex-row h-full items-center justify-center b">
                            {/* Left Side: Text Content */}
                            <div
                                ref={(el) => {
                                    textRef.current[index] = el;
                                }}
                                className="w-full md:w-1/2 p-8 flex flex-col justify-center"
                            >
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                                    {slide.title}
                                </h2>
                                <p className="text-lg text-gray-600">{slide.description}</p>
                            </div>

                            {/* Right Side: Image */}
                            <div
                                ref={(el) => {
                                    imageRef.current[index] = el;
                                }}
                                className="w-full md:w-1/2 h-full flex items-center justify-center p-4"
                            >
                                <Image
                                    width={500}
                                    height={500}
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full max-w-md object-contain"
                                />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ProductSlider;
