import { useState } from 'react'
import { Box, Button, Card, CardHeader } from '@mui/material'
import Icon from 'src/core/components/icon'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import axiosInstance from 'src/core/utils/axiosInstence'
import { AppDispatch, RootState } from 'src/store'
import { getData } from 'src/store/crm/pages'
import PageTable from 'src/views/crm/pages/PageTable'
import PageFormDrawer from 'src/views/crm/pages/PageFormDrawer'

const PagesPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.cmsPages)
  const [openForm, setOpenForm] = useState(false)
  const [selectedRow, setSelectedRow] = useState<any | null>(null)

  const refresh = () => {
    dispatch(getData(store?.params ?? { page: 1, limit: 10, search: '' }))
  }

  const handleDelete = async (row: any) => {
    try {
      await axiosInstance.delete(`/api/pages/${row?._id}`)
      toast.success('Page deleted successfully.')
      refresh()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to delete page.')
    }
  }

  return (
    <Card>
      <CardHeader
        title='Pages'
        action={
          <Button variant='contained' startIcon={<Icon icon='tabler:plus' />} onClick={() => { setSelectedRow(null); setOpenForm(true) }}>
            Add Page
          </Button>
        }
      />

      <Box sx={{ px: 2, pb: 2 }}>
        <PageTable
          onEdit={row => {
            setSelectedRow(row)
            setOpenForm(true)
          }}
          onDelete={handleDelete}
        />
      </Box>

      <PageFormDrawer open={openForm} data={selectedRow} toggle={() => setOpenForm(false)} onSuccess={refresh} />
    </Card>
  )
}

export default PagesPage
