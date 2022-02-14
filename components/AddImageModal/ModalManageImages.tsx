import Pagination from 'components/Pagination';
import { useEffect, useMemo, useState } from 'react';
import { ImageThumbProps, ListImage } from '../../interface/idea';
import { merror } from '../../libs/message';
import SupabaseLib, { LIMIT_IMAGE } from '../../libs/supabase';
import { Button } from '../Button/Button';
import CustomDropzone from '../DropZone';
import Modal from '../Modal/Modal';
import PrivateIdeaImage from '../PrivateIdeaImage';

interface ModalManageImagesProps {
  isVisible: boolean;
  onCancel: () => void;
  imageThumb: ImageThumbProps[];
  setImageThumb: React.Dispatch<React.SetStateAction<ImageThumbProps[]>>;
  currentSelect?: number;
}

interface ISelectableImageGridProps {
  imagesIdea: ImageThumbProps[];
  imageThumb: ImageThumbProps[];
  setImageThumb: React.Dispatch<React.SetStateAction<ImageThumbProps[]>>;
  currentSelect?: number;
}

const ModalManageImages = ({
  isVisible,
  onCancel,
  imageThumb,
  setImageThumb,
  currentSelect,
}: ModalManageImagesProps): JSX.Element => {
  const validImageTypes = 'image/png, image/jpeg';
  const [imagesIdea, setImagesIdea] = useState<ImageThumbProps[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchImages = async (): Promise<void> => {
    setLoading(true);
    try {
      const { data, count } = await SupabaseLib.getListImagesIdea(page);
      if (!data) {
        setLoading(false);
        return;
      }
      setTotal(count);
      setImagesIdea(data);
    } catch (error) {
      merror(error.message);
    }
    setLoading(false);
  };

  const uploadImage = async (file: File) => {
    try {
      // Upload Original Image
      const original = await SupabaseLib.uploadImage(file);

      // Upload Thumbnail
      const thumbs = await SupabaseLib.uploadImage(file);

      //Insert record into Storage table
      const resStorage = await SupabaseLib.createStorageImage({
        url: original.key,
        thumb_url: original.key,
        width: original.width,
        height: original.height,
        thumb_width: original.width,
        thumb_height: original.height,
      });
      return {
        originalUrl: original.key,
        thumbnail: thumbs.key,
        storageId: resStorage[0].id,
        width: original.width,
        height: original.height,
      };
    } catch (error) {
      merror(error);
      return null;
    }
  };

  const upLoadImages = async (files: File[]) => {
    await Promise.all(
      files.map(async (file: File) => {
        await uploadImage(file);
      }),
    );
    fetchImages();
  };

  const handlePage = (page: number) => {
    setPage(page);
  };

  return (
    <Modal
      visible={isVisible}
      title="My images"
      onCancel={onCancel}
      hideCancelBtn={true}
      hideOkBtn={true}
      className="update-thumbnail-modal-container"
    >
      <CustomDropzone
        onChange={(files) => upLoadImages(files)}
        label=""
        acceptType={validImageTypes}
      />

      <legend className="text-base font-medium text-gray-900 my-4">
        From my library
      </legend>

      <SelectableImageGrid
        imagesIdea={imagesIdea}
        imageThumb={imageThumb}
        setImageThumb={setImageThumb}
        currentSelect={currentSelect}
      />
      <div className="mt-4 -mb-6">
        <Pagination
          current={page}
          pageSize={LIMIT_IMAGE}
          total={total}
          onChange={handlePage}
        ></Pagination>
      </div>
    </Modal>
  );
};

const SelectableImageGrid = ({
  imagesIdea,
  imageThumb,
  setImageThumb,
  currentSelect,
}: ISelectableImageGridProps): JSX.Element => {
  /** Handle select image */
  const onSelectImage = (image: ListImage): void => {
    image.ideaNo = currentSelect;
    setImageThumb([...imageThumb, image]);
  };

  const list = useMemo(() => {
    return imagesIdea;
  }, [imagesIdea]);

  return (
    <ul
      role="list"
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
    >
      {list.length &&
        list.map((image, idx) => (
          <li key={idx} className="relative">
            <div
              className={`group block w-full aspect-w-1 aspect-h-1 bg-gray-100 overflow-hidden`}
            >
              <Button
                className="button-select-image absolute inset-0 focus:outline-none"
                onClick={() => onSelectImage(image)}
                disabled={imageThumb.some((item: ListImage) =>
                  currentSelect
                    ? item.ideaNo === currentSelect && item.id === image.id
                    : item.id === image.id,
                )}
              >
                <PrivateIdeaImage
                  layout="fill"
                  url={image.thumb_url}
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </Button>
            </div>
            <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
              {image.thumb_url
                ? image.thumb_url.replace('ideagrows-images/', '')
                : ''}
            </p>
          </li>
        ))}
    </ul>
  );
};

export default ModalManageImages;
