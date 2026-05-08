import { useState } from 'react'
import { Box, Button, Card, CardHeader } from '@mui/material'
import Icon from 'src/core/components/icon'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import axiosInstance from 'src/core/utils/axiosInstence'
import SectionTable from 'src/views/crm/section/SectionTable'
import SectionFormDrawer from 'src/views/crm/section/SectionFormDrawer'
import { AppDispatch, RootState } from 'src/store'
import { getData } from 'src/store/crm/sections'

const SectionPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.sections)

  const [openForm, setOpenForm] = useState(false)
  const [selectedRow, setSelectedRow] = useState<any | null>(null)

  const refresh = () => {
    dispatch(getData(store?.params ?? { page: 1, limit: 10, search: '' }))
  }

  const handleDelete = async (row: any) => {
    try {
      await axiosInstance.delete(`/api/sections/${row?._id}`)
      toast.success('Section deleted successfully.')
      refresh()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to delete section.')
    }
  }

  return (
    <Card>
      <CardHeader
        title='Sections'
        action={
          <Button variant='contained' startIcon={<Icon icon='tabler:plus' />} onClick={() => { setSelectedRow(null); setOpenForm(true) }}>
            Add Section
          </Button>
        }
      />

      <Box sx={{ px: 2, pb: 2 }}>
        <SectionTable
          onEdit={row => {
            setSelectedRow(row)
            setOpenForm(true)
          }}
          onDelete={handleDelete}
        />
      </Box>

      <SectionFormDrawer
        open={openForm}
        data={selectedRow}
        toggle={() => setOpenForm(false)}
        onSuccess={refresh}
      />
    </Card>
  )
}

export default SectionPage
