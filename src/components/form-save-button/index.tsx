// ** React Imports
import {useRef, useState, Fragment, SyntheticEvent, MouseEvent} from 'react'

// ** MUI Imports
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import ButtonGroup from '@mui/material/ButtonGroup'
import ClickAwayListener from '@mui/material/ClickAwayListener'

// ** Icon Imports
import Icon from 'src/core/components/icon'
import {useTranslation} from "react-i18next";

interface Props {
  color?: "primary" | "inherit" | "secondary" | "error" | "info" | "success" | "warning"
  icon?: string,
  noIcon?: boolean | null,
  fullWidth?: boolean,
  disabled?: boolean,
  options: string[],
  onClick: (value: number, event: any) => void,
}

const FormSaveButton = ({options, onClick, color = 'success', icon = 'device-floppy', noIcon = false, fullWidth = true, disabled = false}: Props) => {
  // ** States
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  // ** Ref
  const anchorRef = useRef<HTMLDivElement | null>(null)

  const handleClick = (event: MouseEvent) => {
    onClick(selectedIndex, event)
  }

  const handleMenuItemClick = (event: SyntheticEvent, index: number) => {
    if(icon !== 'plus') {
      setSelectedIndex(index)
    }
    setOpen(false)
    onClick(index, event)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Fragment>
      <ButtonGroup fullWidth={fullWidth} variant='contained' color={color} size={'small'} ref={anchorRef} aria-label='split button'>
        <Button disabled={disabled} size={'small'} fullWidth onClick={handleClick} startIcon={!noIcon ? <Icon fontSize='1.125rem' icon={`tabler:${icon}`} /> : null}>
          {t(options[selectedIndex])}
        </Button>
        {
          options.length > 1 &&
          <Button
            size={'small'}
            sx={{px: '0', width: '30%'}}
            aria-haspopup='menu'
            onClick={handleToggle}
            disabled={disabled}
            aria-label='select merge strategy'
            aria-expanded={open ? 'true' : undefined}
            aria-controls={open ? 'split-button-menu' : undefined}
          >
            <Icon icon='tabler:chevron-down'/>
          </Button>
        }
      </ButtonGroup>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal style={{ zIndex: 1300 }}>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id='split-button-menu'>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={event => handleMenuItemClick(event, index)}
                    >
                      {t(option)}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Fragment>
  )
}

export default FormSaveButton
