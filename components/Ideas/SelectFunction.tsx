import { Session } from '@supabase/supabase-js';
import { Button } from 'components/Button/Button';
import { IQueryIdea } from 'containers/ListIdeas';
import ModalImportFile from 'containers/ImportFile/ModalImportFile';
import { IdeaResponseProps } from 'interface/idea';
import { merror } from 'libs/message';
import SupabaseLib from 'libs/supabase';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import { createXlsxFile } from 'services/idea';
import Utils from 'utils/utils';
import XLSX from 'xlsx';
const SelectFunction = ({
  condition,
  session,
  refetch,
  setRefetch,
}: {
  condition: () => IQueryIdea;
  session: Session;
  refetch: number;
  setRefetch: Dispatch<SetStateAction<number>>;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  //Get Export Ideas
  const getIdeas = async (query: IQueryIdea) => {
    let data;
    setLoading(true);
    try {
      switch (router.query.tabs) {
        case 'approve':
          data = (await SupabaseLib.getIdeaStoreApprove(query)).data;
          break;
        case 'ideasStore':
          data = (await SupabaseLib.getIdeaStore(query, session.user)).data;
          break;
        default:
          data = (await SupabaseLib.getOriginIdeas(query)).data;
          data.map((item) => {
            item.created_email = item.accounts.email;
            item.idea_id = item.id;
            return item;
          });
          break;
      }

      setLoading(false);
      return data as IdeaResponseProps[];
    } catch (error) {
      setLoading(false);
      merror(error.message);
      throw Error('Something wrong!');
    }
  };

  //Get Exported File
  const getExportData = async () => {
    try {
      const query = condition();
      if (!query.selectedStore) {
        merror('Please select store !');
        return;
      }
      const data = await getIdeas(query);
      if (!data) {
        throw Error('Something wrong!');
      }

      //Create excel data
      const res = await createXlsxFile(data);
      const currentDate = new Date();

      //Download file xlsx
      XLSX.writeFile(res.data, `report_${Utils.getDateOnly(currentDate)}.xlsx`);
    } catch (error) {
      merror(error);
    }
  };

  const importIdeas = () => {
    setIsVisible(true);
  };

  return (
    <div className="absolute top-4 right-8">
      <div className="flex gap-4 ">
        <div className="relative overflow-hidden inline-block">
          <Button key={2} className="py-1 " onClick={importIdeas}>
            Import
          </Button>

          <ModalImportFile
            refetch={refetch}
            visible={isVisible}
            setVisible={setIsVisible}
            setRefetch={setRefetch}
          />
        </div>

        <Button
          key={2}
          className="py-1"
          loading={loading}
          onClick={getExportData}
        >
          Export
        </Button>
        <Button
          label="Create Idea"
          type={'primary'}
          onClick={() => {
            router.push('/create');
          }}
        ></Button>
        <Button
          label="Setting"
          type={'primary'}
          onClick={() => {
            router.push('/setting-image');
          }}
        ></Button>
      </div>
    </div>
  );
};

export default SelectFunction;
