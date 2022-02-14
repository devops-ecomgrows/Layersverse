import { Fragment, useCallback, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import Image from 'next/image';
import ImageDefault from '../public/icon/avatar.png';

export const PrivateAvatar = ({
  url,
  width,
  height,
  className,
}: {
  url?: string;
  width: number;
  height: number;
  className?: string;
}) => {
  const [signedUrl, setUrl] = useState<StaticImageData | string>(ImageDefault);
  const [loading, setLoading] = useState(false);

  const getUrl = async (): Promise<void> => {
    setLoading(true);
    if (!url) {
      setLoading(false);
      return;
    }

    const { signedURL } = await supabase.storage
      .from('avatars')
      .createSignedUrl(url.replace('avatars/', ''), 60);

    if (signedURL) {
      setUrl(signedURL);
    }
    setLoading(false);
  };

  useEffect(() => {
    getUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return loading ? (
    <Fragment></Fragment>
  ) : (
    <Image
      src={signedUrl}
      width={width}
      height={height}
      className={`${className} rounded-full`}
      alt=""
    ></Image>
  );
};
