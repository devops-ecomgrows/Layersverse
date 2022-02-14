import { Button } from 'components/Button/Button';
import Pagination from 'components/Pagination';
import PrivateIdeaImage from 'components/PrivateIdeaImage';
import Table from 'components/Table/Table';
import { IdeaStatus, STATUS_IDEA_ETSY } from 'constants/idea';
import { IQueryIdea } from 'containers/ListIdeas';
import dayjs from 'dayjs';
import useModal from 'hooks/useModal';
import { IdeasResponse } from 'interface/idea';
import { merror, msuccess } from 'libs/message';
import SupabaseLib, { LIMIT_IDEA } from 'libs/supabase';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import ConfirmStatusPublish from './ConfirmStatusPublish';
import FilterIdeas from './FilterIdeas';

const OriginIdeas = ({
  queryGet,
  refetch,
}: {
  queryGet: () => IQueryIdea;
  refetch: number;
}) => {
  const [ideas, setIdeas] = useState<IdeasResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPublish, setLoadingPublish] = useState(false);
  const [loadingPublishDraft, setLoadingPublishDraft] = useState(false);
  const [open, onOpenModal, onCancelModal] = useModal();
  const [idIdeaPublish, setIdIdeaPublish] = useState<number | undefined>();
  const [disabled, setDisabled] = useState(false);
  const [total, setTotal] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (router.isReady || refetch) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, refetch]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const query = queryGet();
      const { data, count } = await SupabaseLib.getOriginIdeas(query);
      setIdeas(data);
      setTotal(count || 0);
    } catch (error) {
      merror(error.message);
    }
    setLoading(false);
  };

  const publishIdea = async (
    idIdea: number | undefined,
    status: STATUS_IDEA_ETSY,
  ) => {
    if (status === STATUS_IDEA_ETSY.DRAFT) {
      setLoadingPublishDraft(true);
    } else {
      setLoadingPublish(true);
    }
    setDisabled(true);

    const storeSlt = localStorage.getItem('storeSelected');
    if (!storeSlt) {
      merror('You need select store');
      return;
    }
    if (!idIdea) {
      merror('You need select idea');
      return;
    }

    const idStore = Number(storeSlt);

    try {
      await SupabaseLib.createIdeaStore(
        IdeaStatus.PENDING,
        status,
        idStore,
        idIdea,
      );

      msuccess('Publish to external store request sent successfully');
    } catch (error) {
      merror('Publish request send failed');
    }
    onCancelModal();
    setDisabled(false);
    setLoadingPublishDraft(false);
    setLoadingPublish(false);
  };

  const dataSoure = useMemo(() => {
    return ideas.map((idea, idx) => {
      return [
        <p key={idx} className="text-center">
          {(Number(router.query.page) - 1 || 0) * LIMIT_IDEA + (idx + 1)}
        </p>,
        <PrivateIdeaImage
          url={
            idea.images_idea.length
              ? idea.images_idea[0].storage.thumb_url
              : undefined
          }
          key={idx}
          width={50}
          height={50}
        ></PrivateIdeaImage>,
        <div key={idx} className="min-w-[400px] truncate">
          <Link href={`ideas/${idea.id}`}>
            <a className="text-indigo-600 hover:text-indigo-900">
              {idea.title}
            </a>
          </Link>
        </div>,
        <p key={idx}>
          {dayjs(idea.created_at.toString()).format('DD-MM-YYYY')}
        </p>,
        <Button
          key={idx}
          label="Publish"
          type={'primary'}
          size="small"
          onClick={() => {
            onOpenModal();
            setIdIdeaPublish(idea.id);
          }}
        />,
      ];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ideas]);

  const columns = ['no', 'Image', 'title', 'created at', 'aciton'];

  const onChangePage = (page: number) => {
    const query = router.query;
    router.push(
      {
        pathname: '/ideas',
        query: {
          ...query,
          page: page,
        },
      },
      undefined,
      {
        shallow: true,
      },
    );
  };

  return (
    <div className="pt-4">
      <FilterIdeas />
      <ConfirmStatusPublish
        disabled={disabled}
        loadingPublishDraft={loadingPublishDraft}
        loadingPublish={loadingPublish}
        idIdeaPublish={idIdeaPublish}
        open={open}
        onCancelModal={onCancelModal}
        publishIdea={publishIdea}
      />
      <div className="mt-2">
        <Table
          loading={loading}
          columns={columns}
          dataSource={dataSoure}
          className="mt-5 -mx-6"
        ></Table>
      </div>
      <div>
        <Pagination
          current={router.query.page ? Number(router.query.page) || 1 : 1}
          pageSize={LIMIT_IDEA}
          total={total}
          onChange={onChangePage}
        ></Pagination>
      </div>
    </div>
  );
};

export default OriginIdeas;
