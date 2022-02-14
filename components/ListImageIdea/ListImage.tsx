import { TrashIcon } from '@heroicons/react/outline';
import produce from 'immer';
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { ImageThumbProps, ListImage } from '../../interface/idea';
import PrivateIdeaImage from '../PrivateIdeaImage';

const LayerList = ({
  listImages,
  setListImages,
}: {
  listImages: ListImage[];
  setListImages: React.Dispatch<React.SetStateAction<ListImage[]>>;
}) => {
  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination || destination.index === source.index) {
      return;
    }
    renderPosition(destination, source);
  };

  const renderPosition = (
    destination: DraggableLocation,
    source: DraggableLocation,
  ) => {
    const nextState = produce(listImages, (draftState) => {
      const [removed] = draftState.splice(source.index, 1);
      draftState.splice(destination.index, 0, removed);
    });
    setListImages(nextState);
  };

  const deleteImage = (idx: number) => {
    const nextState = produce(listImages, (draftState) => {
      draftState.splice(idx, 1);
    });
    setListImages(nextState);
  };

  return (
    <div className="layer-list px-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {listImages.map((item, idx) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id.toString()}
                  index={idx}
                >
                  {(provided, snapshot) => (
                    <div
                      className={`p-2 -mx-2`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ImageLayerItem
                        item={item}
                        position={idx}
                        deleteImage={deleteImage}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

const ImageLayerItem = ({
  item,
  position,
  deleteImage,
}: {
  item: ImageThumbProps;
  position: number;
  deleteImage: (idx: number) => void;
}) => {
  return (
    <div className="relative flex justify-start items-center w-20 h-20 border-[1px] border-gray-200">
      <PrivateIdeaImage
        url={item.thumb_url}
        width={70}
        height={70}
        className={'object-contain'}
        layout="fill"
      ></PrivateIdeaImage>
      <TrashIcon
        className="w-5 h-5 cursor-pointer absolute top-0 left-0"
        onClick={() => deleteImage(position)}
        type="button"
      />
    </div>
  );
};

export default LayerList;
