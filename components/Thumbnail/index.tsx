import { PhotographIcon } from '@heroicons/react/solid';
import Image from 'next/image';

const Thumbnail = ({ src }: { src: string }) => {
  return (
    <div className=" h-20 w-20 border flex justify-center items-center rounded-sm">
      {src ? (
        <Image className={`h-full object-contain`} src={src} alt="thumbnail" />
      ) : (
        <PhotographIcon className="h-6 w-6" />
      )}
    </div>
  );
};

export default Thumbnail;
