import { ReactNode } from 'react';
import EmptyState from '../EmptyState/EmptyState';
import Loading from '../Loading/Loading';
interface TableProps {
  /**
   * Columns of table
   */
  columns: (ReactNode | string)[];
  /**
   * Data record array to be displayed
   */
  dataSource: (ReactNode | string)[][];
  /**
   * The class name of the container of the table
   */
  className?: string;
  /**
   * The class name of the container of the table
   */
  rowClassName?: string;
  /**
   * The loading state of the table
   */
  loading?: boolean;
  /**
   * The loading state of the table
   */
  loadingTitle?: string | ReactNode;
}

const Table = ({
  dataSource,
  columns,
  className,
  rowClassName = '',
  loading,
  loadingTitle = 'Ideasgrows',
}: TableProps) => {
  return (
    <div className={`pg-table-wrapper flex flex-col ${className || ''}`}>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="relative">
            {loading && (
              <div className="printgrows-table-loading">
                <div className="absolute w-full h-full top-0 left-0 bg-white opacity-80"></div>
                <div className="flex justify-center items-center absolute w-full h-full top-0 left-0">
                  <div className="flex flex-col gap-2">
                    <span className="text-xl font-medium">{loadingTitle}</span>
                    <Loading />
                  </div>
                </div>
              </div>
            )}
            <table className="pg-table min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column, idx) => (
                    <th
                      key={idx}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataSource.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`${rowClassName} ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    {row.map((item, index) => (
                      <td
                        key={index}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {item}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {!dataSource.length && !loading && <EmptyState />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
