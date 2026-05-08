// ** React Imports
import React from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from 'src/core/components/icon'

type Props = {
    dialog: { show: boolean, title: string, subtitle: string }
    setDialog: (updatedDialog: { show: boolean, title: string | null, subtitle: string | null}) => void
}

const ConfirmationDialog = (props: Props) => {
    // ** Props
    const { dialog, setDialog } = props

    const handleClose = () => setDialog({show: false, title: '', subtitle: ''})

    return (
        <>
            <Dialog fullWidth open={dialog.show} onClose={handleClose} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
                <DialogContent
                    sx={{
                        pb: theme => `${theme.spacing(5)} !important`,
                        // px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                        pt: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(7)} !important`]
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            textAlign: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            '& svg': { mb: 6, color: 'success.main' }
                        }}
                    >
                        <Icon icon='tabler:circle-check' fontSize='6.5rem' />
                        <Typography fontSize='1.5rem'>{dialog.title}</Typography>
                        <Typography fontSize='1.1rem' sx={{mt:3}}>{dialog.subtitle}</Typography>
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{
                        justifyContent: 'center',
                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                        pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(5)} !important`]
                    }}
                >
                    <Button variant='contained' color='primary' onClick={() => props.setDialog({show: false, title: '', subtitle: ''})}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ConfirmationDialog