// ** React Imports
import { ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Button from "@mui/material/Button";

// ** Icon Imports
import Icon from 'src/@core/components/icon'

//** Translation
import {useTranslation} from "react-i18next";
import Link from "next/link";
import {GridRowSelectionModel} from "@mui/x-data-grid";
import {encodeParameters} from "src/@core/utils/encrypted-params";
import {useSelector} from "react-redux";
import {RootState} from "src/store";

interface Props {
  value: string
  clearSearch: () => void
  selectionModel: GridRowSelectionModel,
  onChange: (e: ChangeEvent) => void
  onCancel: (e: any) => void
  markInActive: (ids: number[]) => void
  markActive: (ids: number[]) => void
}

const SalePlansTableActions = (props: Props) => {
  const {t} = useTranslation();

  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: theme => theme.spacing(2, 5, 4, 5)
      }}
    >
      <Box sx={{display: 'flex', alignItems: 'center'}}>

        {
          props.selectionModel?.length === 1 &&
          <Link href={`//inventory-operations/sale-plans/edit-sales/${encodeParameters({recno: props.selectionModel[0]})}`}>
            <Button sx={{mr: 2}} variant='contained' size='small' startIcon={<Icon icon='tabler:edit'/>}>
              {t("Edit")}
            </Button>
          </Link>
        }

      </Box>
      <IconButton onClick={(e) => props.onCancel(e)}>
        <Icon icon={'tabler:x'} />
      </IconButton>
    </Box>
  )
}

export default SalePlansTableActions
