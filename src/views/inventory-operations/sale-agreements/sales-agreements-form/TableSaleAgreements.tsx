// ** React imports
import React, { useMemo } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  useGridApiRef,
  GridFooterContainer,
  GridRowModel
} from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'
import { Divider, Typography, Tooltip, Checkbox } from '@mui/material'

// ** Data Import
import { GridStartRowEditModeParams } from '@mui/x-data-grid/models/api/gridEditingApi'

// ** Custom Imports
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomEmptyState from 'src/custom-components/form-table-add-button'
import DateViewFormat from 'src/@core/components/date-view'
import InstallmentTypeSelector from 'src/@core/dropdown-selectors/InstallmentTypeSelector'
import CustomDatePicker from 'src/@core/components/custom-date-picker'

// ** Utils / i18n
import { useTranslation } from 'react-i18next'
import { cvalue, formatCurrency, getLastEnableColumn, globalSendDateFormat } from 'src/@core/utils/format'

//@ts-ignore
import dateFormat from 'dateformat'
import { saleAgreementInstallment } from '../context/types'
import { useSaleAgreements } from '../context/useSaleAgreements'
import Button from '@mui/material/Button'

// ---------- Props ----------
interface Props {
  handleInstallmentDetailData: (data: Partial<saleAgreementInstallment>, recno: number) => void,
  removeInstallmentDetail: (recno: number) => void,
  addInstallmentDetail: () => void,
  details: saleAgreementInstallment[],
  originalPrice: number,
}

// ---------- Helpers ----------
const round2 = (n: number) => Math.round((Number(n) + Number.EPSILON) * 100) / 100

// ---------- Columns ----------
const makeColumns = (
  apiRef: any,
  onClickDelete: (recno: number) => void,
  handleInstallmentDetailData: Props['handleInstallmentDetailData'],
  t: any,
  saleAgreements: any,
  recalcFrom: any
): GridColDef[] => {
  // helper: push a whole-row patch into the grid’s EDIT state instantly
  const applyRowPatch = (params: GridRenderCellParams, recno: number, patch: Partial<saleAgreementInstallment>) => {
    const id = params.id;
    // update every dependent field that's present in the patch
    ([
      'instPercentage',
      'noOfInstallment',
      'installmentAmount',
      'totalInstallmentAmount',
      'installmentStartDate',
      'instTypeId',
      'isCharged',
      'monthGap'
    ] as const).forEach((field) => {
      if (field in patch) {
        // @ts-ignore
        params.api.setEditCellValue({ id, field, value: (patch as any)[field] })
      }
    })
    // persist to your context (source of truth)
    handleInstallmentDetailData(patch, recno)
  }

  return [
    // Action
    {
      flex: 0.08,
      field: 'Action',
      minWidth: 50,
      maxWidth: 60,
      headerName: '',
      sortable: false,
      filterable: false,
      disableColumnMenu: false,
      hideable: false,
      renderHeader: (params) => params.field && (
        <Tooltip title={'Columns Customization'}>
          <IconButton disableFocusRipple onClick={() => apiRef.current.showColumnMenu('Action')}>
            <Icon icon={'tabler:columns'} />
          </IconButton>
        </Tooltip>
      ),
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as saleAgreementInstallment
        if (params.hasFocus) params.api.setCellFocus(params.id, 'instTypeId')
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <IconButton
              onBlur={(_) => params.api.setCellFocus(params.id, 'instTypeId')}
              onClick={(_) => onClickDelete(row?.recno ?? 0)}
              sx={{ color: theme => theme.palette.error.main }}
            >
              <Icon icon="tabler:trash" fontSize={'1.025rem'} />
            </IconButton>
          </Box>
        )
      }
    },

    // Start Date
    {
      flex: 0.16,
      minWidth: 80,
      maxWidth: 140,
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      field: 'installmentStartDate',
      headerName: 'Installment Start Date',
      renderEditCell: (params: GridRenderCellParams) => {
        const row = params.row as saleAgreementInstallment
        const dateVal = row?.installmentStartDate ? new Date(row.installmentStartDate as any) : undefined
        return (
          <CustomDatePicker
            portalId={"date-picker-warpper"}
            date={dateVal}
            onChange={(date: Date) => {
              const formatted = dateFormat(new Date(date), globalSendDateFormat)
              applyRowPatch(params, row?.recno ?? 0, { installmentStartDate: formatted })
            }}
            label={null}
            noBorder

          />
        )
      },
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as saleAgreementInstallment
        return <DateViewFormat date={row?.installmentStartDate ?? ''} />
      }
    },

    // Type
    {
      flex: 0.16,
      minWidth: 160,
      maxWidth: 280,
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      field: 'instTypeId',
      headerName: 'Type',
      renderEditCell: (params: GridRenderCellParams) => {
        const row = params.row as saleAgreementInstallment
        return (
          <Box style={{ width: '100%' }}>
            <InstallmentTypeSelector
              selected_value={row?.instTypeId ?? null}
              handleChange={(value: any) => {
                if (value) {
                  applyRowPatch(params, row?.recno ?? 0, { instTypeId: value.value as number })
                }
              }}
              props={{ label: null, sx: { mb: 0 }, autoFocus: params.hasFocus, focused: params.hasFocus }}
              noBorder
            />
          </Box>
        )
      },
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as saleAgreementInstallment
        return (
          <InstallmentTypeSelector
            selected_value={row?.instTypeId}
            handleChange={() => console.log('noop')}
            preview
            props={{ label: null, sx: { mb: 0 }, autoFocus: params.hasFocus, focused: params.hasFocus }}
            noBorder
          />
        )
      }
    },

    // Included?
    {
      flex: 0.12,
      minWidth: 120,
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      field: 'isCharged',
      headerName: 'Included',
      align: 'center',

      // Editor component that keeps local state and updates the grid immediately
      renderEditCell: (params: GridRenderCellParams) => {
        const row = params.row as saleAgreementInstallment

        // small inline component (keeps the editor isolated)
        const CheckboxEditor: React.FC = () => {
          // visualChecked is what the user sees (we want visual = !isCharged)
          const [visualChecked, setVisualChecked] = React.useState<boolean>(!row.isCharged)

          // keep editor in sync if underlying row value changes externally
          React.useEffect(() => {
            setVisualChecked(!params.row.isCharged)
          }, [params.row.isCharged])

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newVisual = e.target.checked
            setVisualChecked(newVisual)

            const newIsCharged = !newVisual

            applyRowPatch(params, row?.recno ?? 0, { isCharged: newIsCharged })
            params.api.updateRows([{ id: params.id, ...params.row, isCharged: newIsCharged }])
          }

          return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Checkbox
                checked={visualChecked}
                onChange={handleChange}
                // stop propagation so DataGrid doesn't accidentally close edit mode
                onClick={(e) => e.stopPropagation()}
              />
            </Box>
          )
        }

        return <CheckboxEditor />
      },

      // Display (read-only) cell shows real stored value
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Checkbox checked={!(params.row as saleAgreementInstallment).isCharged} disabled />
          </Box>
        )
      }
    },
    // Month Gap
    {
      flex: 0.12,
      minWidth: 120,
      field: 'monthGap',
      type: 'number',
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      headerName: 'Month Gap',
      align: 'right',
      renderEditCell: (params: GridRenderCellParams) => {
        const row = params.row as saleAgreementInstallment
        const value = (row?.monthGap ?? 0) > 0 ? row.monthGap : ''
        return (
          <CustomTextField
            fullWidth
            type="number"
            variant="outlined"
            focused={params.hasFocus}
            autoFocus={params.hasFocus}
            placeholder={t('Months') as string}
            value={value as any}
            onChange={(e) => {
              const v = cvalue(e.target.value)
              applyRowPatch(params, row?.recno ?? 0, { monthGap: v })
            }}
            noBorder
          />
        )
      },
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as saleAgreementInstallment
        return <Typography>{row?.monthGap ?? ''}</Typography>
      }
    },

    // Installment %
    {
      flex: 0.14,
      minWidth: 140,
      field: 'instPercentage',
      type: 'number',
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      headerName: 'Installment %',
      align: 'right',
      hideable: false,
      renderEditCell: (params: GridRenderCellParams) => {
        const row = params.row as saleAgreementInstallment
        const value = (row?.instPercentage ?? 0) > 0 ? row.instPercentage : ''
        return (
          <CustomTextField
            fullWidth
            type="number"
            variant="outlined"
            focused={params.hasFocus}
            autoFocus={params.hasFocus}
            placeholder={t('Percentage') as string}
            value={value as any}
            onChange={(e) => {
              const val = e.target.value === '' ? null : Number(e.target.value)
              const updated = recalcFrom('percentage', {
                ...row,
                instPercentage: val
              }, { orgPrice: saleAgreements?.soldPrice })

              // push ALL dependent fields instantly
              applyRowPatch(params, row?.recno ?? 0, {
                instPercentage: updated.instPercentage,
                noOfInstallment: updated.noOfInstallment,
                installmentAmount: updated.installmentAmount,
                totalInstallmentAmount: updated.totalInstallmentAmount
              })
            }}
            noBorder
          />
        )
      },
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as saleAgreementInstallment
        return <Typography>{(row?.instPercentage ?? 0) > 0 ? `${row.instPercentage}%` : ''}</Typography>
      }
    },

    // No. of Installments
    {
      flex: 0.14,
      minWidth: 140,
      field: 'noOfInstallment',
      type: 'number',
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      headerName: 'No. of Installments',
      align: 'right',
      renderEditCell: (params: GridRenderCellParams) => {
        const row = params.row as saleAgreementInstallment
        const value = (row?.noOfInstallment ?? 0) > 0 ? row.noOfInstallment : ''
        return (
          <CustomTextField
            fullWidth
            type="number"
            variant="outlined"
            focused={params.hasFocus}
            autoFocus={params.hasFocus}
            placeholder={t('Count') as string}
            value={value as any}
            onChange={(e) => {
              const val = e.target.value === '' ? null : Math.max(0, Math.floor(Number(e.target.value)))
              const updated = recalcFrom('noOfInstallment', {
                ...row,
                noOfInstallment: val
              }, { orgPrice: saleAgreements?.soldPrice })

              applyRowPatch(params, row?.recno ?? 0, {
                noOfInstallment: updated.noOfInstallment,
                instPercentage: updated.instPercentage,
                installmentAmount: updated.installmentAmount,
                totalInstallmentAmount: updated.totalInstallmentAmount
              })
            }}
            noBorder
          />
        )
      },
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as saleAgreementInstallment
        return <Typography>{row?.noOfInstallment ?? ''}</Typography>
      }
    },

    // Installment Amount
    {
      flex: 0.16,
      minWidth: 160,
      field: 'installmentAmount',
      type: 'number',
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      headerName: 'Installment Amount',
      align: 'right',
      hideable: false,
      renderEditCell: (params: GridRenderCellParams) => {
        const row = params.row as saleAgreementInstallment
        const value = (row?.installmentAmount ?? 0) > 0 ? row.installmentAmount : ''
        return (
          <CustomTextField
            fullWidth
            type="number"
            variant="outlined"
            focused={params.hasFocus}
            autoFocus={params.hasFocus}
            placeholder={t('Amount') as string}
            value={value as any}
            onChange={(e) => {
              const val = e.target.value === '' ? null : Number(e.target.value)
              const updated = recalcFrom('installmentAmount', {
                ...row,
                installmentAmount: val
              }, { orgPrice: saleAgreements?.soldPrice })

              applyRowPatch(params, row?.recno ?? 0, {
                installmentAmount: updated.installmentAmount,
                totalInstallmentAmount: updated.totalInstallmentAmount,
                instPercentage: updated.instPercentage,
                noOfInstallment: updated.noOfInstallment
              })
            }}
            noBorder
          />
        )
      },
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as saleAgreementInstallment
        return <p>{(row.installmentAmount ?? 0) > 0 ? formatCurrency(row.installmentAmount, null) : ''}</p>
      }
    },

    // Total Installment Amount
    {
      flex: 0.16,
      minWidth: 160,
      field: 'totalInstallmentAmount',
      type: 'number',
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      headerName: 'Total Installment Amount',
      align: 'right',
      hideable: false,
      renderEditCell: (params: GridRenderCellParams) => {
        const row = params.row as saleAgreementInstallment
        const value = (row?.totalInstallmentAmount ?? 0) > 0 ? row.totalInstallmentAmount : ''
        return (
          <CustomTextField
            fullWidth
            type="number"
            variant="outlined"
            focused={params.hasFocus}
            autoFocus={params.hasFocus}
            placeholder={t('Amount') as string}
            value={value as any}
            onChange={(e) => {
              const val = e.target.value === '' ? null : Number(e.target.value)
              const updated = recalcFrom('totalInstallmentAmount', {
                ...row,
                totalInstallmentAmount: val
              }, { orgPrice: saleAgreements?.soldPrice })

              applyRowPatch(params, row?.recno ?? 0, {
                totalInstallmentAmount: updated.totalInstallmentAmount,
                installmentAmount: updated.installmentAmount,
                instPercentage: updated.instPercentage,
                noOfInstallment: updated.noOfInstallment
              })
            }}
            noBorder
          />
        )
      },
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as saleAgreementInstallment
        const explicitTotal = Number(row.totalInstallmentAmount ?? 0)
        const fallback = Number(row.installmentAmount ?? 0) * Number(row.noOfInstallment ?? 0)
        const total = explicitTotal > 0 ? explicitTotal : round2(fallback)
        return <Typography>{total > 0 ? formatCurrency(total, null) : '0.00'}</Typography>
      }
    }
  ]
}

// ---------- Total Footer
const TotalFooter = ({
                       columns,
                       totalPerc,
                       totalCount,
                       totalInstAmount,
                       totalAmount
                     }: {
  columns: GridColDef[];
  totalPerc: number;
  totalCount: number;
  totalInstAmount: number;
  totalAmount: number;
}) => {
  const firstN = 4
  const leftCols = columns.slice(0, firstN)
  const rightCols = columns.slice(firstN)

  const flexOf = (c: GridColDef) => (typeof c.flex === 'number' ? c.flex : 0.1)
  const leftFlex = leftCols.reduce((s, c) => s + flexOf(c), 0)

  return (
    <GridFooterContainer sx={{ px: 0 }}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          borderTop: theme => `1px solid ${theme.palette.divider}`,
          bgcolor: theme => theme.palette.action.hover,
          height: 56
        }}
      >
        <Box sx={{ flexGrow: leftFlex, flexBasis: 0, px: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 800 }}>TOTAL</Typography>
        </Box>

        {rightCols.map((col) => {
          let content: React.ReactNode = <span />
          if (col.field === 'instPercentage') {
            content =
              <Typography sx={{ fontWeight: 600, textAlign: 'right', width: '100%' }}>{round2(totalPerc)}%</Typography>
          } else if (col.field === 'noOfInstallment') {
            content = <Typography sx={{ fontWeight: 600, textAlign: 'right', width: '100%' }}>{totalCount}</Typography>
          } else if (col.field === 'installmentAmount') {
            content = <Typography sx={{
              fontWeight: 700,
              textAlign: 'right',
              width: '100%'
            }}>{formatCurrency(round2(totalInstAmount), null)}</Typography>
          } else if (col.field === 'totalInstallmentAmount') {
            content = <Typography sx={{
              fontWeight: 800,
              textAlign: 'right',
              width: '100%'
            }}>{formatCurrency(round2(totalAmount), null)}</Typography>
          }
          return (
            <Box
              key={col.field}
              sx={{
                flexGrow: flexOf(col),
                flexBasis: 0,
                px: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start'
              }}
            >
              {content}
            </Box>
          )
        })}
      </Box>
    </GridFooterContainer>
  )
}

// ---------- Component ----------
const InstallmentPlansEditTable = ({ details, originalPrice }: any) => {
  const { t } = useTranslation()
  const tableRef = useGridApiRef()
  const {
    saleAgreements,
    addInstallmentDetail,
    removeInstallmentDetail,
    handleInstallmentDetailData,
    recalcFrom
  } = useSaleAgreements()

  const rows = (details ?? []).map((r: any) => ({
    ...r,
    totalInstallmentAmount:
      (r.totalInstallmentAmount != null && r.totalInstallmentAmount > 0)
        ? round2(r.totalInstallmentAmount)
        : round2((r.installmentAmount ?? 0) * (r.noOfInstallment ?? 0)),
    installmentAmount: r.installmentAmount != null ? round2(r.installmentAmount) : r.installmentAmount
  }))

  const totals = rows.reduce(
    (acc: any, r: any) => {
      acc.perc += Number(r.instPercentage ?? 0)
      acc.count += Number(r.noOfInstallment ?? 0)
      acc.instAmount += Number(r.installmentAmount ?? 0)
      const amt =
        (r.totalInstallmentAmount != null && r.totalInstallmentAmount > 0)
          ? Number(r.totalInstallmentAmount)
          : Number(r.installmentAmount ?? 0) * Number(r.noOfInstallment ?? 0)
      acc.amount += amt
      return acc
    },
    { perc: 0, count: 0, instAmount: 0, amount: 0 }
  )

  const onClickDelete = (recno: number) => removeInstallmentDetail(recno)
  const CustomColumnMenuIcon = () => <p />

  const handleCellEditStart = (params: GridRowParams) => {
    handleInstallmentDetailData({ isEditing: true }, Number(params.id))
  }

  const handleCellEditCommit = (params: any, event: any) => {
    if (typeof params?.id === 'number') {
      handleInstallmentDetailData({ isEditing: false }, params.id)
    }
    if (event?.key === 'Tab' || event?.key === 'Enter') {
      event.stopPropagation()
      event.preventDefault()
      try {
        const currentIndex = rows.findIndex((r: any) => r.recno === params.id)
        const nextRow = rows[currentIndex + 1]
        if (params.field === getLastEnableColumn(tableRef, 'totalInstallmentAmount') && nextRow) {
          handleInstallmentDetailData({ isEditing: true }, nextRow.recno)
          tableRef.current.startRowEditMode({
            id: nextRow.recno,
            fieldToFocus: 'instTypeId'
          } as GridStartRowEditModeParams)
        }
      } catch (e) {
        console.log(e)
      }
    }
    return false
  }

  const processRowUpdate = (newRow: GridRowModel) => newRow

  const cols = useMemo(
    () => makeColumns(tableRef, onClickDelete, handleInstallmentDetailData, t, saleAgreements, recalcFrom),
    [saleAgreements]
  )

  return (
    <Box id ="date-picker-warpper">
      <Box>
        <DataGrid
          autoHeight
          apiRef={tableRef}
          hideFooter={false}
          columnHeaderHeight={35}
          getRowHeight={() => 56}
          getRowId={(row: saleAgreementInstallment) => row?.recno ?? 0}
          isCellEditable={(params) => {
            if (saleAgreements?.agreeId) return false
            return ((params.row as saleAgreementInstallment)?.recAmount ?? 0) <= 0
          }}
          slots={{
            noRowsOverlay: () => <CustomEmptyState onClickAdd={addInstallmentDetail} />,
            columnMenuIcon: CustomColumnMenuIcon,
            footer: () => (
              <TotalFooter
                columns={cols}
                totalPerc={totals.perc}
                totalCount={totals.count}
                totalInstAmount={totals.instAmount}
                totalAmount={totals.amount}
              />
            )
          }}
          onCellKeyDown={(_params, event) => {
            if (event.key === 'Enter') {
              event.stopPropagation()
              event.preventDefault()
            }
          }}
          sx={{
            '& .MuiDataGrid-cell': {
              border: theme => `0.05px solid ${theme.palette.secondary.light}`,
              '&:not(.MuiDataGrid-cellCheckbox)': {
                paddingLeft: 2,
                paddingRight: 2,
                '&:first-of-type': {
                  paddingLeft: 0,
                  paddingRight: 0,
                }
              }
            }
          }}
          onCellClick={(params) => {
            if (params.field !== 'Action') {
              const row = params.row as saleAgreementInstallment
              if (!row.isEditing) {
                handleInstallmentDetailData({ isEditing: true }, row.recno)
                tableRef.current.startRowEditMode({ id: params.id })
              }
            }
          }}
          columns={cols}
          rows={rows}
          onRowEditStop={handleCellEditCommit}
          onRowEditStart={handleCellEditStart}
          editMode="row"
          processRowUpdate={processRowUpdate as any}
        />
      </Box>

      {!saleAgreements?.agreeId && (
        <>
          <Divider sx={{ mt: 2 }} />
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="tonal" color="success" onClick={() => addInstallmentDetail()}>
              {t('+ Add New Row')}
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}

export default InstallmentPlansEditTable
