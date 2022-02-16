interface IProps {
  label: string;
  className: string;
}

const Badge = ({ label, className }: IProps): JSX.Element => {
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${className}`}
    >
      {label}
    </span>
  );
};
export default Badge;
