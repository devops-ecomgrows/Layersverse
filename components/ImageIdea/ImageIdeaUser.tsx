import { useEffect, useState } from 'react';
import { ImageThumbProps } from '../../interface/idea';
import SupabaseLib from '../../libs/supabase';
import PrivateIdeaImage from '../PrivateIdeaImage';

const ImageIdeaUser = ({ idIdea }: { idIdea: number }) => {
  const [loading, setLoading] = useState(false);
  const [storage, setStorage] = useState<ImageThumbProps>();
  const fetchImage = async () => {
    setLoading(true);
    const data = await SupabaseLib.getImageIdeaUser(idIdea);
    if (data) {
      setStorage(data.storage);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (idIdea) fetchImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idIdea]);

  return loading ? (
    <PrivateIdeaImage width={50} height={50}></PrivateIdeaImage>
  ) : (
    <PrivateIdeaImage
      url={storage ? storage.thumb_url : undefined}
      width={50}
      height={50}
    />
  );
};
export default ImageIdeaUser;
