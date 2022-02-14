import { ImageThumbProps } from '../../interface/idea';

import ModalManageImages from './ModalManageImages';

interface IProps {
  open: boolean;
  closeModal: () => void;
  imageThumb: ImageThumbProps[];
  setImageThumb: React.Dispatch<React.SetStateAction<ImageThumbProps[]>>;
  currentSelect?: number;
}

const AddImageModal = ({
  imageThumb,
  setImageThumb,
  open,
  closeModal,
  currentSelect,
}: IProps) => {
  return (
    <div className="add-image-modal mt-4">
      <ModalManageImages
        imageThumb={imageThumb}
        setImageThumb={setImageThumb}
        isVisible={open}
        onCancel={closeModal}
        currentSelect={currentSelect}
      />
    </div>
  );
};

export default AddImageModal;
