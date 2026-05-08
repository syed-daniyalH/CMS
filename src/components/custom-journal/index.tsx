import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import FallbackSpinner from "../../core/components/spinner";
import Typography from "@mui/material/Typography";

const CustomJournal = ({ recno, code }: any) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    if (isActive && recno) {
      setLoading(false)
      axios
        .get(`Defaults/GetDocumentJournalLedger/${recno}/${code}`)
        .then((response) => {
          if (response.data.succeeded) {
            const retrievedData = response.data.data.list;
            setData(retrievedData);
          }
        })
        .catch((error) => {
          toast.error(error.message || "Error fetching data");
        })
        .finally(() => setLoading(false));
    }
    return () => {
      isActive = false;
    };
  }, [recno, code]);

  // Calculate Totals
  const totalDebit = data.reduce((acc: number, row: any) => acc + row.dr, 0);
  const totalCredit = data.reduce((acc: number, row: any) => acc + row.cr, 0);

  // Add Total Row
  const totalRow = {
    rowId: "total-row",
    COA_Name: "Total",
    description: "",
    formatedDr: totalDebit.toFixed(2),
    formatedCr: totalCredit.toFixed(2),
  };

  const updatedRows = data.length > 0 ? [...data, totalRow] : data;

  return (
    <>
      <CardHeader title="Journal" />
      <Box sx={{ height: 600, overflowY: 'auto' }}>
        <TableContainer component={Paper} sx={{ height: `calc(100vh - 200px)` }}>
          <Table stickyHeader size='small' aria-label='journal table'>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 250, fontWeight: 'bold' }}>{t("Account")}</TableCell>
                <TableCell sx={{ minWidth: 250, fontWeight: 'bold' }}>{t("Description")}</TableCell>
                <TableCell align="right" sx={{ minWidth: 140, fontWeight: 'bold' }}>{t("DEBIT")}</TableCell>
                <TableCell align="right" sx={{ minWidth: 140, fontWeight: 'bold' }}>{t("CREDIT")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                loading &&
                <FallbackSpinner />
              }
              {updatedRows.map((row: any, index: number) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{ fontWeight: row.rowId === 'total-row' ? 'bold' : 'normal' }}
                  >
                    {row.COA_Name}
                  </TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: row.rowId === 'total-row' ? 'bold' : 'normal' }}>
                    {row.formatedDr}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: row.rowId === 'total-row' ? 'bold' : 'normal' }}>
                    {row.formatedCr}
                  </TableCell>
                </TableRow>
              ))}

              {
                (updatedRows??[]).length <= 0 &&
                <TableRow>
                  <TableCell
                    colSpan={4}
                  >
                    <Typography variant={'body2'} sx={{mt: 2, textAlign: "center"}}>
                      {t("No journal data available!")}
                    </Typography>
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default CustomJournal;
