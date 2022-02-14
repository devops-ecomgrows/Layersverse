import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';
import { RootState } from 'reduxstore';
import SupabaseLib, { LIMIT_IDEA } from 'libs/supabase';
import { merror, msuccess } from 'libs/message';
import StatusIdea from 'components/StatusIdea';
import { IdeaStatus, STATUS_IDEA_ETSY } from 'constants/idea';
import { USER_ROLE } from 'constants/auth';
import FilterIdeas from './FilterIdeas';
import Table from 'components/Table/Table';
import Badge from 'components/Badge';
import { publish } from 'services/etsy';
import { Button } from 'components/Button/Button';
import Src from '../../public/icon/etsy.png';
import { IQueryIdea } from 'containers/ListIdeas';
import { Session } from '@supabase/supabase-js';
import ImageIdeaUser from 'components/ImageIdea/ImageIdeaUser';
import { IdeasApproveResponse } from 'interface/idea';
import { CheckIcon } from '@heroicons/react/solid';
import Pagination from 'components/Pagination';

const Approve = ({
  queryStatus,
  session,
}: {
  queryStatus: () => IQueryIdea;
  session: Session;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ideaStores, setIdeaStores] = useState<IdeasApproveResponse[]>([]);
  const role = useSelector((state: RootState) => state.user);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const query = queryStatus();
      const { data, count } = await SupabaseLib.getIdeaStoreApprove(query);
      if (!data) throw new Error('Get list ideas approve fail');
      setIdeaStores(data);
      setTotal(count || 0);
    } catch (error) {
      merror(error.message);
    }
    setLoading(false);
  };

  const columns = [
    'no',
    'Image',
    'title',
    'created by',
    'store',
    'status',
    'active',
    'activity',
  ];

  const dataSource = useMemo(() => {
    return ideaStores.map((ideaStore, idx) => {
      return [
        <p key={idx} className="text-center">
          {(Number(router.query.page) - 1 || 0) * LIMIT_IDEA + (idx + 1)}
        </p>,
        <ImageIdeaUser idIdea={ideaStore.idea_id} key={idx} />,
        <Link href={`ideas/${ideaStore.idea_id}`} key={idx}>
          <a key={idx} className="text-indigo-600 hover:text-indigo-900">
            {ideaStore.title}
          </a>
        </Link>,
        <p key={idx} className="truncate max-w-[100px]">
          {ideaStore.created_email}
        </p>,
        <div key={idx} className="min-h-[40px] flex items-center gap-4">
          <Image src={Src} width={15} height={15} alt="ETSY" />
          <p>{ideaStore.store_name}</p>
        </div>,
        <StatusIdea key={idx} status={ideaStore.status}></StatusIdea>,
        <CheckIcon
          key={idx}
          className={`w-6 h-6 ${
            ideaStore.idea_store_active === STATUS_IDEA_ETSY.ACTIVE
              ? 'text-green-500'
              : 'text-gray-600'
          }`}
        ></CheckIcon>,
        <ButtonAction
          key={idx}
          store={ideaStore.store_id}
          idIdea={ideaStore.idea_id}
          status={ideaStore.status}
          active={ideaStore.idea_store_active}
          idIdeaStore={ideaStore.idea_store_id}
          fetchData={fetchData}
        ></ButtonAction>,
      ];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ideaStores]);

  useEffect(() => {
    if (role !== USER_ROLE.ADMIN) {
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, role]);

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

const ButtonAction = ({
  idIdeaStore,
  store,
  idIdea,
  status,
  active,
  fetchData,
}: {
  idIdeaStore: number;
  store: number;
  idIdea: number;
  status: IdeaStatus;
  active: STATUS_IDEA_ETSY;
  fetchData: () => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const approvePublish = async (
    idIdeaStore: number,
    idIdea: number,
    idStore: number,
    statusActive: STATUS_IDEA_ETSY,
  ) => {
    setLoading(true);
    try {
      await publish({
        idIdea: idIdea,
        idStore: idStore,
        status: statusActive,
      });
      await SupabaseLib.updateIdeaStore(idIdeaStore, IdeaStatus.APPROVED);
      msuccess('Approve Idea Publish Sucessfully');
      fetchData();
    } catch (error) {
      merror(error.message);
    }
    setLoading(false);
  };

  const rejectIdea = async (idIdeaStore: number) => {
    setLoadingReject(true);
    try {
      await SupabaseLib.updateIdeaStore(idIdeaStore, IdeaStatus.REJECTED);
      msuccess('Rejected idea sucessfully');
      fetchData();
    } catch (error) {
      merror(error.message);
    }
    setLoadingReject(false);
  };
  return status === IdeaStatus.PENDING ? (
    <div className="flex">
      <Button
        type="primary"
        label={'Approve'}
        size="small"
        onClick={() => approvePublish(idIdeaStore, idIdea, store, active)}
        loading={loading}
      ></Button>
      <Button
        type={'danger'}
        label={'Reject'}
        size="small"
        className="ml-2"
        onClick={() => rejectIdea(idIdeaStore)}
        loading={loadingReject}
      ></Button>
    </div>
  ) : (
    <Button disabled label="No Action" size="small"></Button>
  );
};

export default Approve;
