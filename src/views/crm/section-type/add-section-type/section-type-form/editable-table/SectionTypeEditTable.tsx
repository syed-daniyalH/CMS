// ** React imports
import React, { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  useGridApiRef
} from '@mui/x-data-grid'
import IconButton from "@mui/material/IconButton"
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Custom Imports
import Icon from 'src/@core/components/icon'
import CustomTextField from "src/@core/components/mui/text-field"

// ** Translation
import { useTranslation } from "react-i18next"
import { CardHeader, Divider } from '@mui/material'
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import Button from '@mui/material/Button'

// ** Context
import { SectionTypeField, useSectionType } from '../../context/useSectionType'

// ** Types
interface FieldDataRow extends SectionTypeField {
  lineno: number
}

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'password', label: 'Password' },
  { value: 'tel', label: 'Phone' },
  { value: 'url', label: 'URL' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio' },
  { value: 'date', label: 'Date' },
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'array', label: 'Array' },
  { value: 'link', label: 'Link' },
  { value: 'richtext', label: 'Rich Text' },
  { value: 'file', label: 'File' },
  { value: 'color', label: 'Color' }
]

const tableColumns = (
  apiRef: any,
  onClickAdd: any,
  onClickDelete: any,
  handleSectionTypeFieldData: any,
  fields: FieldDataRow[],
  t: any
) => {
  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'Action',
      minWidth: 50,
      maxWidth: 50,
      headerName: '',
      sortable: false,
      filterable: false,
      disableColumnMenu: false,
      hideable: false,
      renderHeader: (params) => params.field && (
        <Tooltip title={'Columns Customization'}>
          <IconButton disableFocusRipple onClick={() => apiRef.current.showColumnMenu("Action")}>
            <Icon icon={'tabler:columns'} />
          </IconButton>
        </Tooltip>
      ),
      renderCell: (params: GridRenderCellParams) => {
        const isInEditMode = apiRef.current.getRowMode(params.id) === 'edit'

        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            {
              isInEditMode ?
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation()
                    onClickAdd(params)
                  }}
                >
                  <Icon icon='tabler:circle-plus-filled' color={'#043612'} fontSize={'1.525rem'} />
                </IconButton> :
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation()
                    onClickDelete(params.row.lineno)
                  }}
                  sx={{ color: theme => theme.palette.error.main }}
                >
                  <Icon icon='tabler:trash' fontSize={'1.025rem'} />
                </IconButton>
            }
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'key',
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      headerName: 'Field Key',
      hideable: false,
      renderEditCell: (params: GridRenderCellParams) => {
        const row: FieldDataRow = params.row
        const field = fields.find((element: FieldDataRow) => element.lineno === row.lineno)

        return params.hasFocus ? (
          <CustomTextField
            fullWidth
            variant='outlined'
            focused={params.hasFocus}
            autoFocus={params.hasFocus}
            placeholder={t('Field Key') as string}
            defaultValue={field?.key || ''}
            onChange={(e) => {
              const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_')
              handleSectionTypeFieldData({ key: val }, row.lineno - 1)
            }}
            noBorder
          />
        ) : <Typography>{field?.key || ''}</Typography>
      },
      renderCell: (params: GridRenderCellParams) => {
        const row: FieldDataRow = params.row
        const field = fields.find((element: FieldDataRow) => element.lineno === row.lineno)
        return <Typography>{field?.key || ''}</Typography>
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'label',
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      headerName: 'Label',
      hideable: false,
      renderEditCell: (params: GridRenderCellParams) => {
        const row: FieldDataRow = params.row
        const field = fields.find((element: FieldDataRow) => element.lineno === row.lineno)

        return params.hasFocus ? (
          <CustomTextField
            fullWidth
            variant='outlined'
            focused={params.hasFocus}
            autoFocus={params.hasFocus}
            placeholder={t('Label') as string}
            defaultValue={field?.label || ''}
            onChange={(e) => {
              const val = e.target.value
              const updates: any = { label: val }

              // Only auto-generate key if key is empty or default
              const currentField = fields.find((f: FieldDataRow) => f.lineno === row.lineno)
              if (!currentField?.key || currentField.key.startsWith('field_')) {
                updates.key = val
                  .toLowerCase()
                  .trim()
                  .replace(/[^a-z0-9_]/g, '_')
                  .replace(/_+/g, '_')
              }
              handleSectionTypeFieldData(updates, row.lineno - 1)
            }}
            noBorder
          />
        ) : <Typography>{field?.label || ''}</Typography>
      },
      renderCell: (params: GridRenderCellParams) => {
        const row: FieldDataRow = params.row
        const field = fields.find((element: FieldDataRow) => element.lineno === row.lineno)
        return <Typography>{field?.label || ''}</Typography>
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'type',
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      headerName: 'Type',
      hideable: false,
      renderEditCell: (params: GridRenderCellParams) => {
        const row: FieldDataRow = params.row
        const field = fields.find((element: FieldDataRow) => element.lineno === row.lineno)

        return params.hasFocus ? (
          <FormControl fullWidth>
            <Select
              value={field?.type || 'text'}
              onChange={(e) => handleSectionTypeFieldData({ type: e.target.value }, row.lineno - 1)}
              displayEmpty
              size="small"
              sx={{
                '& .MuiSelect-select': {
                  py: 1,
                  fontSize: '0.875rem'
                }
              }}
            >
              {fieldTypes.map((typeOption) => (
                <MenuItem key={typeOption.value} value={typeOption.value}>
                  {typeOption.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Typography>
            {fieldTypes.find(t => t.value === field?.type)?.label || field?.type || 'Text'}
          </Typography>
        )
      },
      renderCell: (params: GridRenderCellParams) => {
        const row: FieldDataRow = params.row
        const field = fields.find((element: FieldDataRow) => element.lineno === row.lineno)
        return (
          <Typography>
            {fieldTypes.find(t => t.value === field?.type)?.label || field?.type || 'Text'}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 80,
      field: 'required',
      type: 'boolean',
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      headerName: 'Required',
      align: 'center',
      hideable: false,
      renderEditCell: (params: GridRenderCellParams) => {
        const row: FieldDataRow = params.row
        const field = fields.find((element: FieldDataRow) => element.lineno === row.lineno)

        return params.hasFocus ? (
          <FormControlLabel
            control={
              <Checkbox
                checked={field?.required || false}
                onChange={(e) => handleSectionTypeFieldData({ required: e.target.checked }, row.lineno - 1)}
                size="small"
              />
            }
            label=""
            sx={{ m: 0, justifyContent: 'center' }}
          />
        ) : (
          <Checkbox
            checked={field?.required || false}
            disabled
            size="small"
            sx={{ p: 0 }}
          />
        )
      },
      renderCell: (params: GridRenderCellParams) => {
        const row: FieldDataRow = params.row
        const field = fields.find((element: FieldDataRow) => element.lineno === row.lineno)
        return (
          <Checkbox
            checked={field?.required || false}
            disabled
            size="small"
            sx={{ p: 0 }}
          />
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'placeholder',
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      headerName: 'Placeholder',
      hideable: false,
      renderEditCell: (params: GridRenderCellParams) => {
        const row: FieldDataRow = params.row
        const field = fields.find((element: FieldDataRow) => element.lineno === row.lineno)

        return params.hasFocus ? (
          <CustomTextField
            fullWidth
            variant='outlined'
            focused={params.hasFocus}
            autoFocus={params.hasFocus}
            placeholder={t('Placeholder') as string}
            defaultValue={field?.placeholder || ''}
            onChange={(e) => handleSectionTypeFieldData({ placeholder: e.target.value }, row.lineno - 1)}
            noBorder
          />
        ) : <Typography>{field?.placeholder || ''}</Typography>
      },
      renderCell: (params: GridRenderCellParams) => {
        const row: FieldDataRow = params.row
        const field = fields.find((element: FieldDataRow) => element.lineno === row.lineno)
        return <Typography>{field?.placeholder || ''}</Typography>
      }
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'defaultValue',
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      headerName: 'Default Value',
      hideable: false,
      renderEditCell: (params: GridRenderCellParams) => {
        const row: FieldDataRow = params.row
        const field = fields.find((element: FieldDataRow) => element.lineno === row.lineno)

        return params.hasFocus ? (
          <CustomTextField
            fullWidth
            variant='outlined'
            focused={params.hasFocus}
            autoFocus={params.hasFocus}
            placeholder={t('Default Value') as string}
            defaultValue={field?.defaultValue || ''}
            onChange={(e) => handleSectionTypeFieldData({ defaultValue: e.target.value }, row.lineno - 1)}
            noBorder
          />
        ) : <Typography>{field?.defaultValue || ''}</Typography>
      },
      renderCell: (params: GridRenderCellParams) => {
        const row: FieldDataRow = params.row
        const field = fields.find((element: FieldDataRow) => element.lineno === row.lineno)
        return <Typography>{field?.defaultValue || ''}</Typography>
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'options',
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      headerName: 'Options (comma separated)',
      hideable: false,
      renderEditCell: (params: GridRenderCellParams) => {
        const row: FieldDataRow = params.row
        const field = fields.find((element: FieldDataRow) => element.lineno === row.lineno)
        const options = field?.options || []

        return params.hasFocus ? (
          <CustomTextField
            fullWidth
            variant='outlined'
            focused={params.hasFocus}
            autoFocus={params.hasFocus}
            placeholder={t('Option1, Option2, ...') as string}
            defaultValue={Array.isArray(options) ? options.join(', ') : options}
            onChange={(e) => {
              const optionsArray = e.target.value.split(',').map((opt: string) => opt.trim()).filter(Boolean)
              handleSectionTypeFieldData({ options: optionsArray }, row.lineno - 1)
            }}
            noBorder
          />
        ) : (
          <Typography>
            {Array.isArray(options) ? options.join(', ') : options || ''}
          </Typography>
        )
      },
      renderCell: (params: GridRenderCellParams) => {
        const row: FieldDataRow = params.row
        const field = fields.find((element: FieldDataRow) => element.lineno === row.lineno)
        const options = field?.options || []
        return (
          <Typography>
            {Array.isArray(options) ? options.join(', ') : options || ''}
          </Typography>
        )
      }
    }
  ]

  return columns
}

const SectionTypeEditTable = () => {
  // ** States
  const { t } = useTranslation()
  const tableRef = useGridApiRef()
  const {
    sectionType,
    handleSectionTypeFieldData,
    removeSectionTypeField,
    addSectionTypeField,
    setFields,
    fields
  } = useSectionType()

  useEffect(() => {
    if (sectionType?.fields) {
      const fieldsWithLineNo = sectionType.fields.map((field, index) => ({
        ...field,
        lineno: index + 1
      }))
      setFields(fieldsWithLineNo)
    }
  }, [sectionType?.fields, setFields])

  const processRowUpdate = (newRow: FieldDataRow, oldRow: FieldDataRow) => {
    const index = fields.findIndex((row: any) => row.lineno === oldRow.lineno)
    if (index > -1) {
      handleSectionTypeFieldData(newRow, index)
    }
    return newRow
  }

  const onClickAdd = (params: any) => {
    const currentRowIndex = fields.findIndex((row: any) => row.lineno === params.row.lineno)
    addSectionTypeField(currentRowIndex + 1)
  }

  const onClickDelete = (lineno: number) => {
    const index = fields.findIndex((obj: FieldDataRow) => obj.lineno === lineno)
    if (index > -1) {
      removeSectionTypeField(index)
    }
  }

  const CustomColumnMenuIcon = () => (
    <p />
  )

  const CustomNoRowsOverlay = () => (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      py: 10
    }}>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
        No fields added yet
      </Typography>
      <Button
        variant='tonal'
        color='primary'
        onClick={() => addSectionTypeField()}
        startIcon={<Icon icon='tabler:plus' />}
      >
        {t("Add First Field")}
      </Button>
    </Box>
  )

  const [shouldEditLastRow, setShouldEditLastRow] = useState(false)

  // Start edit mode on the last row when it's added
  useEffect(() => {
    if (shouldEditLastRow && fields.length > 0) {
      const lastRowId = fields[fields.length - 1].lineno

      // We still use a small timeout to ensure the DataGrid internal state is synced
      // with the new rows before calling API methods
      const timeoutId = setTimeout(() => {
        try {
          if (tableRef.current.getRow(lastRowId)) {
            tableRef.current.startRowEditMode({ id: lastRowId, fieldToFocus: 'label' })
            setShouldEditLastRow(false)
          }
        } catch (error) {
          console.error('Failed to start edit mode:', error)
        }
      }, 50)

      return () => clearTimeout(timeoutId)
    }
  }, [fields.length, shouldEditLastRow, fields])

  const handleAddNewField = () => {
    setShouldEditLastRow(true)
    addSectionTypeField()
  }

  return (
    <Card>
      <CardHeader
        sx={{
          width: '100%',
          display: 'flex',
          p: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(3)} !important`]
        }}
        title="Section Type Fields"
        subheader="Define the fields for this section type"
      />
      <Box>
        <DataGrid
          autoHeight
          apiRef={tableRef}
          hideFooter
          columnHeaderHeight={45}
          getRowHeight={() => 60}
          getRowId={(row: FieldDataRow) => row.lineno}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            columnMenuIcon: CustomColumnMenuIcon
          }}
          onCellKeyDown={(_params, event) => {
            if (event.key === 'Enter') {
              event.stopPropagation()
              event.preventDefault()
            }
          }}
          sx={{
            '& .MuiDataGrid-cell': {
              border: theme => `0.05px solid ${theme.palette.divider}`,
              '&:not(.MuiDataGrid-cellCheckbox)': {
                paddingLeft: 2,
                paddingRight: 2,
                '&:first-of-type': {
                  paddingLeft: 0,
                  paddingRight: 0,
                }
              }
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme => theme.palette.action.hover,
              borderBottom: theme => `1px solid ${theme.palette.divider}`
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: theme => theme.palette.action.hover
            }
          }}
          onCellClick={(params) => {
            if (params.field !== "Action") {
              const isInEditMode = tableRef.current.getRowMode(params.id) === 'edit'
              if (!isInEditMode) {
                tableRef?.current?.startRowEditMode({ id: params?.id })
              }
            }
          }}
          columns={tableColumns(tableRef, onClickAdd, onClickDelete, handleSectionTypeFieldData, fields, t)}
          rows={fields}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => console.log(error)}
          editMode="row"
        />
      </Box>

      <Divider />

      <Box sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {fields?.length} field{fields?.length !== 1 ? 's' : ''} defined
        </Typography>
        <Button
          variant='tonal'
          color='primary'
          onClick={handleAddNewField}
          startIcon={<Icon icon='tabler:plus' />}
        >
          {t("+ Add New Field")}
        </Button>
      </Box>
    </Card>
  )
}

export default SectionTypeEditTable