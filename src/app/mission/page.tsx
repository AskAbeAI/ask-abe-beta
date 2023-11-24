import Link from 'next/link';
import Image from 'next/image';

export default function MissionPage() {
  return (
    <div className="h-screen w-full bg-white flex justify-center items-center">
      <Image className="flex justify-center items-center" src="/construction.jpg" alt='Construction' width={700} height={700}></Image>
    </div>


  );
}
