import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {useTranslation} from "react-i18next";
import Icon from 'src/@core/components/icon';
import {useState} from "react";
import A4Preview from "./pdf-view/A4Preview";
import {singleReceiptDataType} from "./type";

import {useAuth} from "src/hooks/useAuth";
import jsPDF from 'jspdf';
import {SingleReceiptHtml} from "src/@core/utils/document-html/receipt/SingleReceiptDetailHtml";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppDefaults } from '../../../../../hooks/useAppDefaults'


const DocumentPreview = ({loading, item}: {
  loading: boolean
  item: singleReceiptDataType | null
}) => {

  const {t} = useTranslation();

  const {user} = useAuth();
  const { defaultTanent } = useAppDefaults();
  //** States
  const [loadingPrint, setLoadingPrint] = useState<boolean>(false);
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);

  return (
    <Box sx={{display: 'flex', flexDirection: 'column'}}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
        px: 2,
        border: theme => `1px solid ${theme.palette.divider}`,
        borderRadius: '8px',
        backgroundColor: theme => theme.palette.customColors.tableHeaderBg
      }}>

        <Tooltip title={t("Download")}>
          {
            loadingDownload ?
              <CircularProgress size={20} color={'secondary'} sx={{mx: 2}}/>
              :
              <IconButton sx={{borderRadius: '5px'}} onClick={async () => {
                setLoadingDownload(true);
                const doc = new jsPDF();
                // Assuming A4PayslipHtml returns an HTML string
                const htmlString = SingleReceiptHtml(JSON.stringify(item), user, ``,defaultTanent);

                // Create a temporary container to hold the HTML content
                const tempContainer = document.createElement('div');
                tempContainer.innerHTML = htmlString;

                // Append the temporary container to the body (but hidden)
                tempContainer.style.width = '210mm';
                document.body.appendChild(tempContainer);

                try {
                  // Now pass the DOM element to jsPDF
                  doc.html(tempContainer, {
                    margin: [20 * 0.1667 + 5, 0, 20 * 0.1667 +5, 0],
                    callback: function (doc) {
                      doc.save(`Receipt-${item?.rno??""}.pdf`);
                      // Remove the temporary container after saving the PDF
                      document.body.removeChild(tempContainer);
                      setLoadingDownload(false);
                    },
                    x: 5,
                    y: 0,
                    width: 200, // Adjust as needed
                    windowWidth: tempContainer.scrollWidth
                  });
                }
                catch (e: any) {
                  setLoadingDownload(false);
                  document.body.removeChild(tempContainer);
                }
              }}>
                <Icon icon={'tabler:download'} fontSize={'1.15rem'}/>

                <Typography variant={'body2'} sx={{ml: 1}}>
                  {t("Download")}
                </Typography>

              </IconButton>
          }
        </Tooltip>
        <Divider orientation={'vertical'} sx={{height: '15px'}}/>
        <Tooltip title={t("Print")}>
          {
            loadingPrint ?
              <CircularProgress size={20} color={'secondary'} sx={{mx: 2}}/>
              :
              <IconButton sx={{borderRadius: '5px'}} onClick={() => {
                setLoadingPrint(true);

                const doc = new jsPDF();

                // Assuming A4PayslipHtml returns an HTML string
                const htmlString = SingleReceiptHtml(JSON.stringify(item), user, ``,defaultTanent);

                // Create a temporary container to hold the HTML content
                const tempContainer = document.createElement('div');
                tempContainer.innerHTML = htmlString;

                // Append the temporary container to the body (but hidden)
                tempContainer.style.width = '210mm';
                document.body.appendChild(tempContainer);

                try {
                  // Now pass the DOM element to jsPDF
                  doc.html(tempContainer, {
                    callback: function (doc) {
                      // doc.save('item.pdf');
                      const pdfBlob = doc.output('blob');

                      // Create a URL for the Blob
                      const pdfUrl = URL.createObjectURL(pdfBlob);

                      // Open the PDF in a new window
                      let printWindow = window.open(pdfUrl, '_blank');

                      if (printWindow) {
                        // Wait for the new window to fully load
                        printWindow.onload = () => {
                          printWindow?.print(); // Open the print dialog
                        };
                      } else {
                        console.error('Failed to open new window.');
                      }
                      // Remove the temporary container after saving the PDF
                      document.body.removeChild(tempContainer);
                      setLoadingPrint(false);
                    },
                    x: 5,
                    y: 0,
                    width: 200, // Adjust as needed
                    windowWidth: tempContainer.scrollWidth
                  });
                } catch (e: any) {
                  setLoadingPrint(false);
                }
              }}>
                <Icon icon={'tabler:printer'} fontSize={'1.15rem'}/>
                <Typography variant={'body2'} sx={{ml: 1}}>
                  {t("Print")}
                </Typography>
              </IconButton>
          }
        </Tooltip>
      </Box>
      {
        !loading && item &&
        <A4Preview item={item} />
      }

    </Box>
  );
}

export default DocumentPreview;
