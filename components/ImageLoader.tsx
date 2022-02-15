import Image from "next/image";

const cloudflareLoader = ({ src, width, quality }) => {
  return `https://image-loader.layersverse.workers.dev/?width=${width}&quality=${
    quality ? quality : 75
  }&image=${src}`;
};

export const ImageLoader = ({
  className,
  src,
  alt,
  width,
  height,
  layout,
}: ImageLoaderProps) => {
  return layout ? (
    <Image
      className={className}
      loader={cloudflareLoader}
      src={src}
      alt={alt}
      layout={layout}
    />
  ) : (
    <Image
      className={className}
      loader={cloudflareLoader}
      src={src}
      alt={alt}
      width={width}
      height={height}
    />
  );
};
