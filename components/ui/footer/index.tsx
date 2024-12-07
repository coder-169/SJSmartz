// package
import Link from "next/link";

// layouts
import SectionLayout from "@/layouts/sectionLayout";

// ui
import Text from "@/ui/text";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/ui/assets/svg";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa6";

const Footer = () => {
  return (
    <SectionLayout bg="bg-[#141718]">
      <div className="space-y-10 px-8 py-12 lg:space-y-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-0">
            <h3 className="font-poppins text-2xl font-medium text-white lg:border-r lg:border-[#6C7275] lg:pr-8">
              Sj Smartz<span className="text-[#6C7275]">.</span>
            </h3>
            <span className="h-[1px] w-8 rounded-full bg-[#6C7275] lg:hidden"></span>
            <Text size="sm" color="white/900" className="lg:pl-8">
              Electronics Store
            </Text>
          </div>

        </div>

        <div className="flex flex-col gap-8 border-t border-[#6C7275] py-6 lg:flex-row lg:justify-between lg:gap-0 lg:py-4">
          <div className="flex items-center justify-center gap-6 lg:order-2">
            <Link href={'https://www.instagram.com/heaphones.sjsmartz/'}>
              <FaInstagram

                className="text-white h-6 w-6"
              />
            </Link>
            <Link href={'https://web.facebook.com/profile.php?id=61565837793883&sk=followers&notif_ids[0]=100075696775827&notif_ids[1]=100029224238315&notif_ids[2]=100070408065566&notif_ids[3]=100023305154001&notif_id=1733489273657322&notif_t=follow_profile&ref=notif'}>
              <FaFacebook className="text-white h-5 w-5" />
            </Link>
            <Link href='https://wa.me/923191112018'>
              <FaWhatsapp className="text-white h-6 w-6" />
            </Link>
          </div>

          <div className="flex flex-col gap-7 lg:order-1 lg:flex-row">
            <div className="flex justify-center gap-7 lg:order-2">
              <Link href='/privacy-policy'>
                <Text size="xs" weight={600} family="poppins" color="white/900">

                  Privacy Policy
                </Text>
              </Link>
              <Link href="/terms-of-service">
                <Text size="xs" weight={600} family="poppins" color="white/900">
                  Term of Use
                </Text>
              </Link>
            </div>

            <Text
              family="poppins"
              size="xs"
              color="white/800"
              className="text-center lg:order-1 lg:text-left"
            >
              Copyright © 2024 Sj Smartz All rights reserved
            </Text>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
};

export default Footer;
