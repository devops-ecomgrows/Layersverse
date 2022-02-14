import DatePicker from 'components/DatePicker/DatePicker';
import Input from 'components/Input';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import FilterByActiveIdea from './FilterByActiveIdea';
import FilterByStoreType from './FilterByStoreTyoe';
import FilterFrame from './FilterFrame';
import FilterStatusIdeas from './FilterStatusIdeas';

export enum TABS_IDEAS {
  APPROVE = 'approve',
  IDEAS_STORE = 'ideasStore',
  ORIGIN = 'origin',
}

const FilterIdeas = () => {
  const [expandedStatus, setExpandedStatus] = useState(false);
  const [expandedStore, setExpandedStore] = useState(false);
  const [expandedActive, setExpandedActive] = useState(false);
  const router = useRouter();

  const onSearch = (value: string) => {
    const query = router.query;
    router.push(
      {
        pathname: '/ideas',
        query: {
          ...query,
          searchText: value,
        },
      },
      undefined,
      {
        shallow: false,
      },
    );
  };

  const handleDate = (date: Date | null) => {
    const query = router.query;
    if (!date) {
      delete query.startDate;
      router.push(
        {
          pathname: '/ideas',
          query: query,
        },
        undefined,
        {
          shallow: true,
        },
      );
      return;
    }
    const dateTime = dayjs(date.toString()).format('YYYY-MM-DD');

    router.push(
      {
        pathname: '/ideas',
        query: {
          ...query,
          startDate: dateTime,
        },
      },
      undefined,
      {
        shallow: true,
      },
    );
  };

  const handleDateEnd = (date: Date | null) => {
    const query = router.query;
    if (!date) {
      delete query.endDate;
      router.push(
        {
          pathname: '/ideas',
          query: query,
        },
        undefined,
        {
          shallow: true,
        },
      );
      return;
    }
    const dateTime = dayjs(date.toString()).format('YYYY-MM-DD');

    router.push(
      {
        pathname: '/ideas',
        query: {
          ...query,
          endDate: dateTime,
        },
      },
      undefined,
      {
        shallow: true,
      },
    );
  };

  const FilterStoreIdea = useMemo(() => {
    return router.query.tabs === TABS_IDEAS.APPROVE ||
      router.query.tabs === TABS_IDEAS.IDEAS_STORE ? (
      <FilterFrame
        label={'Store'}
        expanded={expandedStore}
        setExpanded={setExpandedStore}
      >
        <FilterByStoreType></FilterByStoreType>
      </FilterFrame>
    ) : (
      <></>
    );
  }, [expandedStore, router.query]);

  const FilterByStatus = useMemo(() => {
    return router.query.tabs === TABS_IDEAS.APPROVE ||
      router.query.tabs === TABS_IDEAS.IDEAS_STORE ? (
      <FilterFrame
        label={'Status'}
        expanded={expandedStatus}
        setExpanded={setExpandedStatus}
      >
        <FilterStatusIdeas></FilterStatusIdeas>
      </FilterFrame>
    ) : (
      <></>
    );
  }, [router.query, expandedStatus]);

  const FilterActiveIdea = useMemo(() => {
    return router.query.tabs === TABS_IDEAS.APPROVE ||
      router.query.tabs === TABS_IDEAS.IDEAS_STORE ? (
      <>
        <FilterFrame
          label={'Status'}
          expanded={expandedStatus}
          setExpanded={setExpandedStatus}
        >
          <FilterStatusIdeas></FilterStatusIdeas>
        </FilterFrame>
        <FilterFrame
          label={'Store'}
          expanded={expandedStore}
          setExpanded={setExpandedStore}
        >
          <FilterByStoreType></FilterByStoreType>
        </FilterFrame>
        <FilterFrame
          label={'Active Idea'}
          expanded={expandedActive}
          setExpanded={setExpandedActive}
        >
          <FilterByActiveIdea></FilterByActiveIdea>
        </FilterFrame>
      </>
    ) : (
      <></>
    );
  }, [expandedActive, expandedStatus, expandedStore, router.query]);

  return (
    <div className="flex gap-4">
      <Input
        className="min-w-[200px]"
        type={'text'}
        onChange={(e) => onSearch(e.target.value)}
        placeHolder={'Search idea . . .'}
        value={
          router.query.searchText ? router.query.searchText.toString() : ''
        }
      />
      <div className="flex gap-4">
        <div className="col-span-4">
          <DatePicker
            name="Start"
            onChange={handleDate}
            selected={
              router.query.startDate
                ? new Date(router.query.startDate.toString())
                : null
            }
            placeHolder="From"
          ></DatePicker>
        </div>
        <div className="col-span-4">
          <DatePicker
            onChange={handleDateEnd}
            selected={
              router.query.endDate
                ? new Date(router.query.endDate.toString())
                : null
            }
            placeHolder="To"
          ></DatePicker>
        </div>
      </div>
      {FilterActiveIdea}
    </div>
  );
};

export default FilterIdeas;
