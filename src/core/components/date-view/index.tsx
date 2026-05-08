import {useAuth} from "src/hooks/useAuth";
//@ts-ignore
import dateFormat from 'dateformat';
import {globalDateFormat} from "src/core/utils/format";


const DateViewFormat = ({date}: {date: string | Date | null | undefined}) => {

  const { user } = useAuth();

  return (
    <>
      { date ? dateFormat(new Date(date), (user?.dateFormat??globalDateFormat).toLowerCase()) : "" }
    </>
  )
}

export default DateViewFormat;
