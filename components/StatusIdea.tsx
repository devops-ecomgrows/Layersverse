import { IdeaStatus } from '../constants/idea';
import Badge from './Badge';

const StatusIdea = ({ status }: { status: IdeaStatus }): JSX.Element => {
  switch (status) {
    case IdeaStatus.PENDING:
      return (
        <Badge
          label={'Pending'}
          className="bg-yellow-100 text-yellow-800"
        ></Badge>
      );
    case IdeaStatus.REJECTED:
      return (
        <Badge label={'Rejected'} className="bg-red-300 text-red-800"></Badge>
      );
    case IdeaStatus.APPROVED:
      return (
        <Badge
          label={'Approved'}
          className="bg-green-300 text-green-800"
        ></Badge>
      );
    case IdeaStatus.DRAFT:
      return (
        <Badge label={'Draft'} className="bg-blue-300 text-blue-800"></Badge>
      );
    default:
      return (
        <Badge label={'Draft'} className="bg-blue-300 text-blue-800"></Badge>
      );
  }
};

export default StatusIdea;
