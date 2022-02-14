import { Button } from 'components/Button/Button';
import Modal from 'components/Modal/Modal';
import { STATUS_IDEA_ETSY } from 'constants/idea';

const ConfirmStatusPublish = ({
  disabled,
  loadingPublishDraft,
  loadingPublish,
  idIdeaPublish,
  open,
  onCancelModal,
  publishIdea,
}: {
  disabled: boolean;
  loadingPublishDraft: boolean;
  loadingPublish: boolean;
  idIdeaPublish: number | undefined;
  open: boolean;
  onCancelModal: () => void;
  publishIdea: (idIdea: number | undefined, status: STATUS_IDEA_ETSY) => void;
}): JSX.Element => {
  return (
    <Modal
      visible={open}
      hideCancelBtn
      hideOkBtn
      title="Confirm Active Idea"
      onCancel={onCancelModal}
    >
      <div>
        <div className="text-center sm:mt-5">
          <div>
            <p className="text-sm text-gray-500">
              Do you want to publish to the store with the status of the idea
              active or draft?
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
        <Button
          label="Draft"
          onClick={() => publishIdea(idIdeaPublish, STATUS_IDEA_ETSY.DRAFT)}
          loading={loadingPublishDraft}
          disabled={disabled}
        ></Button>
        <Button
          label="Active"
          type={'primary'}
          onClick={() => publishIdea(idIdeaPublish, STATUS_IDEA_ETSY.ACTIVE)}
          disabled={disabled}
          loading={loadingPublish}
        ></Button>
      </div>
    </Modal>
  );
};

export default ConfirmStatusPublish;
