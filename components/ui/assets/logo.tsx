import Text from "@/ui/text";
import Image from "next/image";

export default function Logo() {
  return (
    <Text family="poppins" weight={500} className="md:text-lg">
      <Image src={"/images/sj-blue.png"} width={50} height={60} alt="Sj Smartz" />{" "}
    </Text>
  );
}
