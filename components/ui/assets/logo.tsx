import Text from "@/ui/text";
import Image from "next/image";

export default function Logo({ classes }: { classes?: string }) {
  return (
    <Image src={"/images/sj-black.png"} width={500} height={600} alt="Sj Smartz" className={`w-16 h-auto ${classes}`}/>
  );
}
