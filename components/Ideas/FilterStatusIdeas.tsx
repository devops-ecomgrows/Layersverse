import CheckBox from 'components/CheckBox';
import { IdeaStatus } from 'constants/idea';
import { useRouter } from 'next/router';

const FilterStatusIdeas = () => {
  const router = useRouter();
  const optionsStatus = [
    {
      name: 'Pending',
      status: IdeaStatus.PENDING,
    },
    {
      name: 'Approved',
      status: IdeaStatus.APPROVED,
    },
    {
      name: 'Rejected',
      status: IdeaStatus.REJECTED,
    },
  ];

  const onChange = (status: IdeaStatus | null) => {
    const query = router.query;
    router.push(
      {
        pathname: '/ideas',
        query: {
          ...query,
          status: status ? status : null,
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
      {optionsStatus.map((optionStatus, index) => {
        return (
          <CheckBox
            key={index}
            className="flex items-center mb-4"
            label={optionStatus.name}
            checked={optionStatus.status === router.query.status}
            onChange={() =>
              onChange(
                router.query.status === optionStatus.status
                  ? null
                  : optionStatus.status,
              )
            }
          />
        );
      })}
    </div>
  );
};

export default FilterStatusIdeas;
