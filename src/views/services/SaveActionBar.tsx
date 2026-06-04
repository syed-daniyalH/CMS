import { Button, Paper, Stack } from '@mui/material'

type SaveActionBarProps = {
  onBack: () => void
  onSave: () => void
  saveLabel: string
  loading?: boolean
}

const SaveActionBar = ({ onBack, onSave, saveLabel, loading = false }: SaveActionBarProps) => {
  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        right: { xs: 16, md: 24 },
        bottom: { xs: 16, md: 24 },
        zIndex: theme => theme.zIndex.drawer + 20,
        p: 1,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: theme => theme.shadows[10],
        width: { xs: 'calc(100vw - 32px)', sm: 'auto' }
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <Button fullWidth={true} variant='outlined' onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button fullWidth={true} variant='contained' onClick={onSave} disabled={loading}>
          {saveLabel}
        </Button>
      </Stack>
    </Paper>
  )
}

export default SaveActionBar
