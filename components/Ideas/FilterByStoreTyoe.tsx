import CheckBox from 'components/CheckBox';
import { STORE_TYPES } from 'constants/index';
import { useRouter } from 'next/router';

const FilterByStoreType = () => {
  const router = useRouter();
  const optionsStore = [
    {
      name: 'Etsy',
      storeType: STORE_TYPES.ETSY,
    },
  ];

  const onChange = (storeType: STORE_TYPES | null) => {
    const query = router.query;
    router.push(
      {
        pathname: '/ideas',
        query: {
          ...query,
          store: storeType ? storeType : null,
        },
      },
      undefined,
      {
        shallow: true,
      },
    );
  };

  return (
    <div>
      {optionsStore.map((optionStatus, index) => {
        return (
          <CheckBox
            key={index}
            className="flex items-center mb-4"
            label={optionStatus.name}
            checked={optionStatus.storeType === router.query.store}
            onChange={() =>
              onChange(
                router.query.store === optionStatus.storeType
                  ? null
                  : optionStatus.storeType,
              )
            }
          />
        );
      })}
    </div>
  );
};

export default FilterByStoreType;
