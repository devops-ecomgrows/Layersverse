import Table from 'components/Table/Table';
import dayjs from 'dayjs';
import { merror } from 'libs/message';
import SupabaseLib, { LIMIT_IDEA } from 'libs/supabase';
import { useEffect, useMemo, useState } from 'react';
import FilterIdeas, { TABS_IDEAS } from './FilterIdeas';
import Src from '../../public/icon/etsy.png';
import Image from 'next/image';
import StatusIdea from 'components/StatusIdea';
import { STATUS_IDEA_ETSY } from 'constants/idea';
import { IQueryIdea } from 'containers/ListIdeas';
import { useRouter } from 'next/router';
import { Session } from '@supabase/supabase-js';
import { IdeaViewResponse } from 'interface/idea';
import ImageIdeaUser from 'components/ImageIdea/ImageIdeaUser';
import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/solid';
import Pagination from 'components/Pagination';

const IdeasByStore = ({
  queryGet,
  session,
}: {
  queryGet: () => IQueryIdea;
  session: Session;
}) => {
  const [loading, setLoading] = useState(false);
  const [ideaStores, setIdeaStores] = useState<IdeaViewResponse[]>([]);
  const router = useRouter();
  const [total, setTotal] = useState(0);

  const columns = [
    'no',
    'image',
    'title',
    'store',
    'status',
    'active',
    'publish at',
  ];

  useEffect(() => {
    if (router.isReady && router.query.tabs === TABS_IDEAS.IDEAS_STORE) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const query = queryGet();
      if (!query.selectedStore) {
        merror('You need select store');
        setLoading(false);
        return;
      }

      const { data, count } = await SupabaseLib.getIdeaStore(
        query,
        session.user,
      );

      setTotal(count);
      setIdeaStores(data);
    } catch (error) {
      merror(error);
    }
    setLoading(false);
  };

  const dataSource = useMemo(() => {
    return ideaStores.map((ideaStore, idx) => {
      return [
        <p key={idx} className="text-center">
          {(Number(router.query.page) - 1 || 0) * LIMIT_IDEA + (idx + 1)}
        </p>,
        <ImageIdeaUser idIdea={ideaStore.idea_id} key={idx} />,
        <div key={idx} className="max-w-[150px] truncate">
          <Link href={`ideas/${ideaStore.idea_id}`} key={idx}>
            <a className="text-indigo-600 hover:text-indigo-900">
              {ideaStore.title}
            </a>
          </Link>
        </div>,
        <div key={idx} className="min-h-[40px] flex items-center gap-4">
          <Image src={Src} width={15} height={15} alt="ETSY" />
          <p>{ideaStore.store_name}</p>
        </div>,
        <StatusIdea status={ideaStore.status} key={idx} />,
        <CheckIcon
          key={idx}
          className={`w-6 h-6 ${
            ideaStore.idea_store_active === STATUS_IDEA_ETSY.ACTIVE
              ? 'text-green-500'
              : 'text-gray-300'
          }`}
        ></CheckIcon>,
        <p key={idx}>
          {dayjs(ideaStore.created_at.toString()).format('DD-MM-YYYY')}
        </p>,
      ];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ideaStores]);

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
      <div className="mt-2">
        <Table
          loading={loading}
          columns={columns}
          dataSource={dataSource}
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

export default IdeasByStore;
