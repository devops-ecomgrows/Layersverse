import { PhotographIcon } from "@heroicons/react/solid";
import Image from "next/image";
const Thumbnail = ({
  src,
  className,
  width,
  height,
}: {
  src: string | undefined;
  className?: string;
  width: number;
  height: number;
}) => {
  return (
    <div
      className={`h-20 w-20 border flex justify-center items-center rounded ${className}`}
    >
      {src ? (
        <Image
          className={`h-full  object-contain`}
          src={src}
          alt="thumbnail"
          width={width}
          height={height}
        />
      ) : (
        <PhotographIcon className="h-6 w-6" />
      )}
    </div>
  );
};

export default Thumbnail;
