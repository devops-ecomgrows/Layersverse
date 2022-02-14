import CheckBox from 'components/CheckBox';
import { STATUS_IDEA_ETSY } from 'constants/idea';
import { useRouter } from 'next/router';

const FilterByActiveIdea = () => {
  const router = useRouter();
  const optionsActive = [
    {
      name: 'Active',
      active: STATUS_IDEA_ETSY.ACTIVE,
    },
    {
      name: 'Draft',
      active: STATUS_IDEA_ETSY.DRAFT,
    },
  ];

  const onChange = (active: STATUS_IDEA_ETSY | null) => {
    const query = router.query;
    router.push(
      {
        pathname: '/ideas',
        query: {
          ...query,
          active: active ? active : null,
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
      {optionsActive.map((optionStatus, index) => {
        return (
          <CheckBox
            key={index}
            className="flex items-center mb-4"
            label={optionStatus.name}
            checked={optionStatus.active === router.query.active ? true : false}
            onChange={() =>
              onChange(
                router.query.active === optionStatus.active
                  ? null
                  : optionStatus.active,
              )
            }
          />
        );
      })}
    </div>
  );
};

export default FilterByActiveIdea;
