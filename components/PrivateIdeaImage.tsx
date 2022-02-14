import { Fragment, useEffect, useMemo, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import ImageDefault from '../public/images.png';
import Image from 'next/image';

const PrivateIdeaImage = ({
  url,
  width,
  height,
  className,
  layout,
}: {
  url?: string;
  width: number;
  height: number;
  className?: string;
  layout?: 'fixed' | 'fill' | 'intrinsic' | 'responsive';
}) => {
  const [signedUrl, setUrl] = useState<StaticImageData | string>(ImageDefault);
  const [loading, setLoading] = useState(false);

  const getUrl = async (): Promise<void> => {
    setLoading(true);
    if (!url) {
      setLoading(false);
      return;
    }

    const urlImage = await supabase.storage
      .from('ideagrows-images')
      .createSignedUrl(url.replace('ideagrows-images/', ''), 60);

    if (urlImage.signedURL) {
      setUrl(urlImage.signedURL);
    }
    setLoading(false);
  };

  useEffect(() => {
    getUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return loading ? (
    <Fragment></Fragment>
  ) : layout ? (
    <Image
      layout={layout}
      src={signedUrl}
      width={width}
      height={height}
      className={className}
      alt="Image Idea"
    ></Image>
  ) : (
    <Image
      src={signedUrl}
      width={width}
      height={height}
      className={className}
      alt="Image Idea"
    ></Image>
  );
};

export default PrivateIdeaImage;
