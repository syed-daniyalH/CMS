import Box from "@mui/material/Box";
import React from 'react';
import parse from 'html-react-parser';
import {InventoryPreviewDataType} from "../type";
import {useAuth} from "src/hooks/useAuth";
import {SaleAgreementHtml} from "src/@core/utils/document-html/sale-agreements/SaleAgreementHtml";
import { useAppDefaults } from 'src/hooks/useAppDefaults'

interface Props {
  item: InventoryPreviewDataType | null
}

const A4Preview = (({ item }: Props) => {

  const { user } = useAuth();
  const { defaultTanent } = useAppDefaults();

  return (
    <Box sx={{height: `calc(100vh - 100px)`, position: 'relative', overflow: 'auto', px: 2, py: 1, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: '8px'}}>
        {
          parse(SaleAgreementHtml(JSON.stringify(item), user, `${item?.recno}`,defaultTanent))
        }
    </Box>
  );
})

export default A4Preview;
