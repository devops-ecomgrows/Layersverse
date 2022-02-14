import { Menu } from '@headlessui/react';
import { BellIcon, CheckIcon } from '@heroicons/react/outline';
import Dropdown from 'components/Dropdown';
import { NotificationProps } from 'interface/notification';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reduxstore';
import {
  bulkAddNoti,
  initNotiList,
  markNoti,
  updateNotiStatus,
} from 'reduxstore/reducers/notifications';
import { supabase } from 'utils/supabaseClient';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import req from 'utils/req';
import { NOTIFICATION_STATUS, NOTIFICATION_TYPE } from 'constants/notification';
import { useRouter } from 'next/router';
import Loading from 'components/Loading';
import EmptyState from 'components/EmptyState';
import { Button } from 'components/Button/Button';
import { merror, msuccess } from 'libs/message';
import useNotification from 'hooks/useNotification';
import { Session } from '@supabase/supabase-js';
import { store } from 'pages/_app';
import SupabaseLib from 'libs/supabase';
import { IdeaStatus } from 'constants/idea';
import { PrivateAvatar } from 'components/PrivateAvatar';
import StatusIdea from 'components/StatusIdea';
import defaultAvatar from '../../public/icon/avatar.png';
import Image from 'next/image';
import { publish } from 'services/etsy';

dayjs.extend(relativeTime);

interface NotificationComponentProps {
  className: string;
}

interface NotificationPaginator {
  offset: number;
  total: number | null;
}

const NOTIFICATION_LIMIT = 6;

const Notification = ({ className }: NotificationComponentProps) => {
  const notifications = useSelector((state: RootState) => state.notifications);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notiPaginator, setNotiPaginator] = useState<NotificationPaginator>({
    offset: 0,
    total: null,
  });

  /** Use Notification hook */
  useNotification(session, store);
  const dispatch = useDispatch();
  const router = useRouter();

  const unseenMessageCount = useMemo(() => {
    const totalNotificationsCount = notifications.filter(
      (item) => !item.notification_status.length,
    ).length;

    if (!totalNotificationsCount) {
      return null;
    }
    return totalNotificationsCount > 99
      ? '99+'
      : String(totalNotificationsCount);
  }, [notifications]);

  useEffect(() => {
    /** Run on the first initiation of the page */
    if (notiPaginator.total === null) {
      fetchNoti();
      fetchTotalNotiCount();

      /** Init notification */
      setSession(supabase.auth.session());
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      /** Only run if user click load more */
    } else if (notiPaginator.offset > 0) {
      fetchNoti(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notiPaginator]);

  const fetchTotalNotiCount = async () => {
    const { count } = await supabase
      .from('notification')
      .select('*', { count: 'exact' });

    setNotiPaginator((prevState) => {
      return {
        ...prevState,
        total: count,
      };
    });
  };

  /**
   * @name fetchNoti
   * @desc fetch data from supabase table using anon key
   * @param loadmore define if the action is fetching initial notifications or fetch more notifications
   */
  const fetchNoti = async (loadMore?: boolean) => {
    try {
      !loadMore && setIsLoading(true);

      const response = await supabase

        .from<NotificationProps>('notification')

        .select(
          'id, type, message, actions, created_at, link, notification_status (read_at, seen_at), profiles:created_by(avatar_url)',
        )
        .order('created_at', { ascending: false })
        .range(
          notiPaginator.offset,
          notiPaginator.offset + NOTIFICATION_LIMIT - 1,
        );

      if (response.data) {
        /** Only run on the first render */
        if (!loadMore) {
          dispatch(initNotiList(response.data));
        } else {
          dispatch(bulkAddNoti(response.data));
        }
      }
    } catch (error) {
      console.log(error);
    }
    !loadMore && setIsLoading(false);
  };

  const fetchMoreNotifications = () => {
    setNotiPaginator((prevState) => {
      return {
        ...prevState,
        offset: notiPaginator.offset + NOTIFICATION_LIMIT,
      };
    });
  };

  const onSelectNoti = async (item: NotificationProps) => {
    const { notification_status } = item;
    // mark noti as read
    if (!notification_status.length || !notification_status[0].read_at) {
      const data = [{ id: item.id, type: NOTIFICATION_STATUS.READ }];
      dispatch(markNoti(data));

      await req.post('/api/noti/mark', {
        noti: data,
      });
    }

    // redirect to noti link
    if (item.link) {
      router.push(item.link);
    }
  };

  const markAsSeen = async () => {
    // filter unseen noti ids
    const unseenNoti = notifications.reduce((prev: number[], next) => {
      const { notification_status } = next;
      if (!notification_status.length) {
        return [...prev, next.id];
      }
      return [...prev];
    }, []);

    if (unseenNoti.length) {
      const data = unseenNoti.map((item) => ({
        id: item,
        type: NOTIFICATION_STATUS.SEEN,
      }));

      dispatch(markNoti(data));

      // call api to update mark status in DB
      await req.post('/api/noti/mark', {
        noti: data,
      });
    }
  };

  const markAsRead = async () => {
    // filter unread noti ids
    const unreadNoti = notifications.reduce((prev: number[], next) => {
      const { notification_status } = next;
      if (!notification_status.length || !notification_status[0].read_at) {
        return [...prev, next.id];
      }
      return [...prev];
    }, []);

    if (unreadNoti.length) {
      const data = unreadNoti.map((item) => ({
        id: item,
        type: NOTIFICATION_STATUS.READ,
      }));

      dispatch(markNoti(data));

      // call api to update mark status in DB
      await req.post('/api/noti/mark', {
        noti: data,
      });
    }
  };

  const handleApprove = (
    e: React.MouseEvent<HTMLElement, globalThis.MouseEvent> | undefined,
    item: NotificationProps,
  ) => {
    e?.stopPropagation();

    if (!item.actions?.length) {
      return;
    }

    const approveIdea = async (params: any) => {
      const { ideadId, status, storeId, ideaStoreId } = params;

      try {
        await publish({
          idIdea: ideadId,
          idStore: Number(storeId),
          status: status,
        });
        await SupabaseLib.updateIdeaStore(ideaStoreId, IdeaStatus.APPROVED);
        await SupabaseLib.updateNotificationStatus(
          item.id,
          IdeaStatus.APPROVED,
        );

        dispatch(
          updateNotiStatus({ id: item.id, status: IdeaStatus.APPROVED }),
        );

        msuccess('Idea published successful');
      } catch (err) {
        merror(err);
      }
    };

    switch (item.type) {
      case NOTIFICATION_TYPE.NEW_PENDING_IDEA:
        approveIdea(item.actions[0].params);
        break;
      case NOTIFICATION_TYPE.NEW_APPROVED_IDEA:
        msuccess('Idea has been approved');
        break;
      default:
        break;
    }
  };

  const handleReject = (
    e: React.MouseEvent<HTMLElement, globalThis.MouseEvent> | undefined,
    item: NotificationProps,
  ) => {
    e?.stopPropagation();

    if (!item.actions?.length) {
      return;
    }

    const rejectIdea = async (params: any) => {
      const { ideaStoreId } = params;
      try {
        await SupabaseLib.updateIdeaStore(ideaStoreId, IdeaStatus.REJECTED);
        await SupabaseLib.updateNotificationStatus(
          item.id,
          IdeaStatus.REJECTED,
        );

        dispatch(
          updateNotiStatus({ id: item.id, status: IdeaStatus.REJECTED }),
        );

        msuccess('Idea rejected successful');
      } catch (err) {
        merror(err);
      }
    };

    switch (item.type) {
      case NOTIFICATION_TYPE.NEW_PENDING_IDEA:
        rejectIdea(item.actions[0].params);
        break;
      case NOTIFICATION_TYPE.NEW_APPROVED_IDEA:
        msuccess('Idea has been rejected');
        break;
      default:
        break;
    }
  };

  const notificationLabel = (
    <div className="group flex px-4 py-2 gap-2 justify-between items-center">
      <span className="text-base font-medium">Notifications</span>
      <span role="button" title="Mark all as read" onClick={markAsRead}>
        <CheckIcon className="w-5 h-5 hover:text-indigo-500" />
      </span>
    </div>
  );

  const loadMoreButton =
    Number(notiPaginator.total) > notiPaginator.offset &&
    notiPaginator.total !== 0 ? (
      <Button
        label="Load more"
        className="load-more-button"
        onClick={() => fetchMoreNotifications()}
      ></Button>
    ) : null;

  const menus = useMemo(() => {
    if (isLoading) {
      return (
        <div className="px-4 py-8">
          <Loading />
        </div>
      );
    }

    if (!notifications.length) {
      return (
        <div className="px-4 py-2">
          <EmptyState title="" />
        </div>
      );
    }

    return notifications.map((item) => (
      <Menu.Item onClick={() => onSelectNoti(item)} key={item.id}>
        {({ active }) => (
          <div
            className={[
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
              'group grid grid-cols-5 items-center px-4 py-4 text-sm cursor-pointer',
            ].join(' ')}
          >
            <div className="notification-avatar-container col-span-1 mt-2">
              <div className="w-10 h-10 relative">
                {item.profiles?.avatar_url ? (
                  <PrivateAvatar
                    url={item.profiles?.avatar_url}
                    width={40}
                    height={40}
                  ></PrivateAvatar>
                ) : (
                  <Image
                    src={defaultAvatar}
                    width={40}
                    height={40}
                    alt="Avatar"
                  ></Image>
                )}

                {(!item.notification_status.length ||
                  !item.notification_status[0].read_at) && (
                  <svg
                    className="h-4 w-4 text-indigo-500 absolute -bottom-1 -right-0.5"
                    fill="currentColor"
                    viewBox="0 0 8 8"
                  >
                    <circle cx={4} cy={4} r={3} />
                  </svg>
                )}
              </div>
            </div>
            <div className="notification-info col-span-4">
              <div className="relative w-full h-full">
                <p
                  className={`text-base text-black ${
                    !item.notification_status.length ||
                    !item.notification_status[0].read_at
                      ? 'font-semibold'
                      : ''
                  }`}
                >
                  {item.message}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {dayjs(item.created_at).fromNow()}
                </p>
              </div>

              {item.actions &&
                item.actions.length &&
                (!item.actions[0].status ? (
                  <div className="w-full mt-2 flex justify-end items-center">
                    <Button
                      label="Approve"
                      type="primary"
                      className="mr-3"
                      size="small"
                      onClick={(e) => handleApprove(e, item)}
                    />
                    <Button
                      label="Reject"
                      size="small"
                      onClick={(e) => handleReject(e, item)}
                    />
                  </div>
                ) : (
                  <div className="w-full mt-2 flex justify-end items-center">
                    <StatusIdea status={item.actions[0].status}></StatusIdea>,
                  </div>
                ))}
            </div>
          </div>
        )}
      </Menu.Item>
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications, notifications.length, isLoading]);

  return (
    <Fragment>
      <Dropdown
        menus={[notificationLabel, [menus], [loadMoreButton]]}
        position="right"
        className="noti-dropdown"
        menuBtn={
          <Menu.Button className={className}>
            <span className="sr-only">View notifications</span>
            <div className="relative">
              {unseenMessageCount && (
                <div className="h-3.5 w-3.5 rounded-full bg-indigo-500 absolute -top-0.5 -right-0.5">
                  <p className="text-white text-[10px]">{unseenMessageCount}</p>
                </div>
              )}
              <BellIcon
                className="h-7 w-7"
                aria-hidden="true"
                onClick={markAsSeen}
              />
            </div>
          </Menu.Button>
        }
      />
    </Fragment>
  );
};

export default Notification;
