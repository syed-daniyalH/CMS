// ** MUI Imports
import Box from '@mui/material/Box'
import TreeView from '@mui/lab/TreeView'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import TreeItem, { TreeItemProps } from '@mui/lab/TreeItem'

// ** Custom Icon Import
import Icon from 'src/@core/components/icon'

interface Props {
  direction: 'ltr' | 'rtl'
}

type StyledTreeItemProps = TreeItemProps & {
  labelText: string
  labelIcon?: string
  labelInfo?: string
}

// Styled TreeItem component
const StyledTreeItemRoot = styled(TreeItem)<TreeItemProps>(({ theme }) => ({
  '&:hover > .MuiTreeItem-content:not(.Mui-selected)': {
    backgroundColor: theme.palette.action.hover
  },
  '& .MuiTreeItem-content': {
    paddingRight: theme.spacing(3),
    borderTopRightRadius: theme.spacing(4),
    borderBottomRightRadius: theme.spacing(4),
    fontWeight: theme.typography.fontWeightMedium
  },
  '& .MuiTreeItem-label': {
    fontWeight: 'inherit',
    paddingRight: theme.spacing(3)
  },
  '& .MuiTreeItem-group': {
    marginLeft: 0,
    '& .MuiTreeItem-content': {
      paddingLeft: theme.spacing(4),
      fontWeight: theme.typography.fontWeightRegular
    }
  }
}))

const StyledTreeItem = (props: StyledTreeItemProps) => {
  // ** Props
  const { labelText, labelIcon, labelInfo, ...other } = props

  return (
    <StyledTreeItemRoot
      {...other}
      label={
        <Box sx={{ py: 2, display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
          {
            !!labelIcon &&
            <Icon icon={labelIcon} color='inherit'/>
          }
          <Typography variant='body1' sx={{ flexGrow: 1, fontWeight: 'inherit' }}>
            {labelText}
          </Typography>
          {labelInfo ? (
            <Typography variant='caption' color='inherit'>
              {labelInfo}
            </Typography>
          ) : null}
        </Box>
      }
    />
  )
}

const TreeViewGmailClone = ({ direction }: Props) => {
  const ExpandIcon = <Icon icon={direction === 'rtl' ? 'tabler:chevron-left' : 'tabler:chevron-right'} />

  return (
    <TreeView
      sx={{ minHeight: 240 }}
      defaultExpanded={['1']}
      defaultExpandIcon={ExpandIcon}
      defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
    >
      <StyledTreeItem nodeId='1' labelText='All Mail' icon={<img src={'/images/icons/file-icons/folder.png'} alt={''} style={{width: '12pt', marginRight: '3px'}} />}  />
      <StyledTreeItem nodeId='2' labelText='Trash' icon={<img src={'/images/icons/file-icons/folder.png'} alt={''} style={{width: '12pt', marginRight: '3px'}} />} />
      <StyledTreeItem nodeId='3' labelText='Categories' icon={<img src={'/images/icons/file-icons/folder.png'} alt={''} style={{width: '12pt', marginRight: '3px'}} />}>
        <StyledTreeItem nodeId='5' labelInfo='90' labelText='Social' icon={<img src={'/images/icons/file-icons/folder.png'} alt={''} style={{width: '12pt', marginRight: '3px'}} />} />
        <StyledTreeItem nodeId='6' labelInfo='2,294' labelText='Updates' icon={<img src={'/images/icons/file-icons/folder.png'} alt={''} style={{width: '12pt', marginRight: '3px'}} />} />
        <StyledTreeItem nodeId='7' labelInfo='3,566' labelText='Forums' icon={<img src={'/images/icons/file-icons/folder.png'} alt={''} style={{width: '12pt', marginRight: '3px'}} />} />
        <StyledTreeItem nodeId='8' labelInfo='733' labelText='Promotions' icon={<img src={'/images/icons/file-icons/folder.png'} alt={''} style={{width: '12pt', marginRight: '3px'}} />} />
      </StyledTreeItem>
      <StyledTreeItem nodeId='4' labelText='History' icon={<img src={'/images/icons/file-icons/folder.png'} alt={''} style={{width: '12pt', marginRight: '3px'}} />} />
    </TreeView>
  )
}

export default TreeViewGmailClone
