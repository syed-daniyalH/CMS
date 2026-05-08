import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Card, CardContent, CardHeader, Grid, IconButton, MenuItem, Tab, Tabs, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import axiosInstance from 'src/@core/utils/axiosInstence'
import CustomChip from 'src/@core/components/mui/chip'

type TabValue = 'types' | 'subTypes' | 'categories' | 'subCategories' | 'mappingCategorySubCategory' | 'mappingTypeSubTypeCategory'

const slugify = (value: string) =>
  `${value ?? ''}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const MenuSettingManager = () => {
  const [tab, setTab] = useState<TabValue>('types')
  const [loading, setLoading] = useState(false)

  // master lists
  const [menuTypesByInt, setMenuTypesByInt] = useState<any[]>([]) // /api/menu-structure/types
  const [subTypes, setSubTypes] = useState<any[]>([]) // /api/menu-structure/sub-types
  const [categories, setCategories] = useState<any[]>([]) // /api/menu-structure/categories
  const [subCategories, setSubCategories] = useState<any[]>([]) // /api/menu-structure/sub-categories
  const [categorySubCategoryMappings, setCategorySubCategoryMappings] = useState<any[]>([]) // /api/menu-structure/category-subcategory-mappings
  const [typeSubTypeCategoryMappings, setTypeSubTypeCategoryMappings] = useState<any[]>([]) // /api/menu-structure/type-subtype-categories

  // forms
  const [typeForm, setTypeForm] = useState<any>({
    typeId: '',
    name: '',
    slug: '',
    description: '',
    icon: '',
    imageUrl: '',
    isActive: true,
    metaTitle: '',
    metaDescription: '',
    metaKeyWords: '',
    metaId: 0
  })
  const [typeSlugTouched, setTypeSlugTouched] = useState(false)

  const [subTypeForm, setSubTypeForm] = useState<any>({
    subTypeId: '',
    typeId: '',
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    isActive: true
  })
  const [subTypeSlugTouched, setSubTypeSlugTouched] = useState(false)

  const [categoryForm, setCategoryForm] = useState<any>({
    categoryId: '',
    name: '',
    slug: '',
    description: '',
    typeId: '',
    imageUrl: '',
    isActive: true
  })
  const [categorySlugTouched, setCategorySlugTouched] = useState(false)

  const [subCategoryForm, setSubCategoryForm] = useState<any>({
    subCategoryId: '',
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    isActive: true
  })
  const [subCategorySlugTouched, setSubCategorySlugTouched] = useState(false)

  const [categorySubCategoryMapForm, setCategorySubCategoryMapForm] = useState<any>({
    recno: '',
    categoryId: '',
    subCategoryId: '',
    description: '',
    isActive: true
  })

  const [typeSubTypeCategoryMapForm, setTypeSubTypeCategoryMapForm] = useState<any>({
    recno: '',
    typeId: '',
    subTypeId: '',
    categoryId: ''
  })

  const reloadAll = async () => {
    setLoading(true)
    try {
      const [typesIntRes, subTypesRes, categoriesRes, subCategoriesRes, mapRes, typeSubTypeMapRes] = await Promise.all([
        axiosInstance.get('/api/menu-structure/types'),
        axiosInstance.get('/api/menu-structure/sub-types'),
        axiosInstance.get('/api/menu-structure/categories'),
        axiosInstance.get('/api/menu-structure/sub-categories'),
        axiosInstance.get('/api/menu-structure/category-subcategory-mappings'),
        axiosInstance.get('/api/menu-structure/type-subtype-categories')
      ])
      setMenuTypesByInt(typesIntRes?.data?.data ?? [])
      setSubTypes(subTypesRes?.data?.data ?? [])
      setCategories(categoriesRes?.data?.data ?? [])
      setSubCategories(subCategoriesRes?.data?.data ?? [])
      setCategorySubCategoryMappings(mapRes?.data?.data ?? [])
      setTypeSubTypeCategoryMappings(typeSubTypeMapRes?.data?.data ?? [])
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to load menu settings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reloadAll().then(() => null)
  }, [])

  useEffect(() => {
    if (!typeSlugTouched) setTypeForm((prev: any) => ({ ...prev, slug: slugify(prev.name || '') }))
  }, [typeForm.name, typeSlugTouched])

  useEffect(() => {
    if (!categorySlugTouched) setCategoryForm((prev: any) => ({ ...prev, slug: slugify(prev.name || '') }))
  }, [categoryForm.name, categorySlugTouched])

  useEffect(() => {
    if (!subTypeSlugTouched) setSubTypeForm((prev: any) => ({ ...prev, slug: slugify(prev.name || '') }))
  }, [subTypeForm.name, subTypeSlugTouched])

  useEffect(() => {
    if (!subCategorySlugTouched) setSubCategoryForm((prev: any) => ({ ...prev, slug: slugify(prev.name || '') }))
  }, [subCategoryForm.name, subCategorySlugTouched])

  const typeLookup = useMemo(() => {
    const map = new Map<number, any>()
    menuTypesByInt.forEach((item: any) => map.set(item?.typeId, item))
    return map
  }, [menuTypesByInt])

  const categoryLookup = useMemo(() => {
    const map = new Map<number, any>()
    categories.forEach((item: any) => map.set(item?.categoryId, item))
    return map
  }, [categories])

  const subTypeLookup = useMemo(() => {
    const map = new Map<number, any>()
    subTypes.forEach((item: any) => map.set(item?.subTypeId, item))
    return map
  }, [subTypes])

  const subCategoryLookup = useMemo(() => {
    const map = new Map<number, any>()
    subCategories.forEach((item: any) => map.set(item?.subCategoryId, item))
    return map
  }, [subCategories])

  const typeColumns: GridColDef[] = [
    { field: 'typeId', headerName: 'Type ID', minWidth: 110, flex: 0.12 },
    { field: 'name', headerName: 'Name', minWidth: 170, flex: 0.22 },
    { field: 'slug', headerName: 'Slug', minWidth: 170, flex: 0.22 },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 220,
      flex: 0.26,
      renderCell: ({ row }: GridRenderCellParams) => <Typography variant='body2'>{`${row?.description ?? ''}`.slice(0, 90) || '-'}</Typography>
    },
    {
      field: 'isActive',
      headerName: 'Status',
      minWidth: 120,
      flex: 0.12,
      renderCell: ({ row }: GridRenderCellParams) => (
        <CustomChip rounded size='small' skin='light' color={row?.isActive ? 'success' : 'secondary'} label={row?.isActive ? 'Active' : 'Inactive'} />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 120,
      flex: 0.15,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: GridRenderCellParams) => (
        <Box>
          <IconButton
            onClick={() => {
              setTypeForm({
                typeId: row?.typeId ?? '',
                name: row?.name ?? '',
                slug: row?.slug ?? '',
                description: row?.description ?? '',
                icon: row?.icon ?? '',
                imageUrl: row?.imageUrl ?? '',
                isActive: row?.isActive ?? true,
                metaTitle: row?.metaTitle ?? '',
                metaDescription: row?.metaDescription ?? '',
                metaKeyWords: row?.metaKeyWords ?? '',
                metaId: row?.metaId ?? 0
              })
              setTypeSlugTouched(true)
            }}
          >
            <Icon icon='tabler:edit' />
          </IconButton>
          <IconButton
            color='error'
            onClick={async () => {
              try {
                await axiosInstance.delete(`/api/menu-structure/types/${row?.typeId}`)
                toast.success('Type deleted.')
                await reloadAll()
              } catch (error: any) {
                toast.error(error?.response?.data?.message || error?.message || 'Delete failed.')
              }
            }}
          >
            <Icon icon='tabler:trash' />
          </IconButton>
        </Box>
      )
    }
  ]

  const subTypeColumns: GridColDef[] = [
    { field: 'subTypeId', headerName: 'SubType ID', minWidth: 120, flex: 0.14 },
    {
      field: 'typeId',
      headerName: 'Type',
      minWidth: 160,
      flex: 0.2,
      renderCell: ({ row }: GridRenderCellParams) => <Typography variant='body2'>{typeLookup.get(row?.typeId)?.name || row?.typeId || '-'}</Typography>
    },
    { field: 'name', headerName: 'Name', minWidth: 170, flex: 0.2 },
    { field: 'slug', headerName: 'Slug', minWidth: 160, flex: 0.18 },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 220,
      flex: 0.24,
      renderCell: ({ row }: GridRenderCellParams) => <Typography variant='body2'>{`${row?.description ?? ''}`.slice(0, 90) || '-'}</Typography>
    },
    {
      field: 'isActive',
      headerName: 'Status',
      minWidth: 120,
      flex: 0.12,
      renderCell: ({ row }: GridRenderCellParams) => (
        <CustomChip rounded size='small' skin='light' color={row?.isActive ? 'success' : 'secondary'} label={row?.isActive ? 'Active' : 'Inactive'} />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 120,
      flex: 0.14,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: GridRenderCellParams) => (
        <Box>
          <IconButton
            onClick={() => {
              setSubTypeForm({
                subTypeId: row?.subTypeId ?? '',
                typeId: row?.typeId ?? '',
                name: row?.name ?? '',
                slug: row?.slug ?? '',
                description: row?.description ?? '',
                imageUrl: row?.imageUrl ?? '',
                isActive: row?.isActive ?? true
              })
              setSubTypeSlugTouched(true)
            }}
          >
            <Icon icon='tabler:edit' />
          </IconButton>
          <IconButton
            color='error'
            onClick={async () => {
              try {
                await axiosInstance.delete(`/api/menu-structure/sub-types/${row?.subTypeId}`)
                toast.success('Sub type deleted.')
                await reloadAll()
              } catch (error: any) {
                toast.error(error?.response?.data?.message || error?.message || 'Delete failed.')
              }
            }}
          >
            <Icon icon='tabler:trash' />
          </IconButton>
        </Box>
      )
    }
  ]

  const categoryColumns: GridColDef[] = [
    { field: 'categoryId', headerName: 'Category ID', minWidth: 120, flex: 0.14 },
    { field: 'name', headerName: 'Name', minWidth: 170, flex: 0.2 },
    { field: 'slug', headerName: 'Slug', minWidth: 160, flex: 0.18 },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 220,
      flex: 0.24,
      renderCell: ({ row }: GridRenderCellParams) => <Typography variant='body2'>{`${row?.description ?? ''}`.slice(0, 90) || '-'}</Typography>
    },
    {
      field: 'typeId',
      headerName: 'Type',
      minWidth: 160,
      flex: 0.18,
      renderCell: ({ row }: GridRenderCellParams) => <Typography variant='body2'>{row?.menuType?.name || '-'}</Typography>
    },
    {
      field: 'isActive',
      headerName: 'Status',
      minWidth: 120,
      flex: 0.12,
      renderCell: ({ row }: GridRenderCellParams) => (
        <CustomChip rounded size='small' skin='light' color={row?.isActive ? 'success' : 'secondary'} label={row?.isActive ? 'Active' : 'Inactive'} />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 120,
      flex: 0.14,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: GridRenderCellParams) => (
        <Box>
          <IconButton
            onClick={() => {
              setCategoryForm({
                categoryId: row?.categoryId ?? '',
                name: row?.name ?? '',
                slug: row?.slug ?? '',
                description: row?.description ?? '',
                typeId: row?.menuType?.typeId ?? '',
                imageUrl: row?.imageUrl ?? '',
                isActive: row?.isActive ?? true
              })
              setCategorySlugTouched(true)
            }}
          >
            <Icon icon='tabler:edit' />
          </IconButton>
          <IconButton
            color='error'
            onClick={async () => {
              try {
                await axiosInstance.delete(`/api/menu-structure/categories/${row?.categoryId}`)
                toast.success('Category deleted.')
                await reloadAll()
              } catch (error: any) {
                toast.error(error?.response?.data?.message || error?.message || 'Delete failed.')
              }
            }}
          >
            <Icon icon='tabler:trash' />
          </IconButton>
        </Box>
      )
    }
  ]

  const subCategoryColumns: GridColDef[] = [
    { field: 'subCategoryId', headerName: 'SubCat ID', minWidth: 120, flex: 0.14 },
    { field: 'name', headerName: 'Name', minWidth: 170, flex: 0.2 },
    { field: 'slug', headerName: 'Slug', minWidth: 160, flex: 0.18 },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 220,
      flex: 0.24,
      renderCell: ({ row }: GridRenderCellParams) => <Typography variant='body2'>{`${row?.description ?? ''}`.slice(0, 90) || '-'}</Typography>
    },
    {
      field: 'parentCategory',
      headerName: 'Parent Category',
      minWidth: 170,
      flex: 0.2,
      renderCell: ({ row }: GridRenderCellParams) => (
        <Typography variant='body2'>
          {categories.find((cat: any) => `${cat?._id}` === `${row?.parentCategory}`)?.name || '-'}
        </Typography>
      )
    },
    {
      field: 'isActive',
      headerName: 'Status',
      minWidth: 120,
      flex: 0.12,
      renderCell: ({ row }: GridRenderCellParams) => (
        <CustomChip rounded size='small' skin='light' color={row?.isActive ? 'success' : 'secondary'} label={row?.isActive ? 'Active' : 'Inactive'} />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 120,
      flex: 0.14,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: GridRenderCellParams) => (
        <Box>
          <IconButton
            onClick={() => {
              setSubCategoryForm({
                subCategoryId: row?.subCategoryId ?? '',
                name: row?.name ?? '',
                slug: row?.slug ?? '',
                description: row?.description ?? '',
                imageUrl: row?.imageUrl ?? '',
                isActive: row?.isActive ?? true
              })
              setSubCategorySlugTouched(true)
            }}
          >
            <Icon icon='tabler:edit' />
          </IconButton>
          <IconButton
            color='error'
            onClick={async () => {
              try {
                await axiosInstance.delete(`/api/menu-structure/sub-categories/${row?.subCategoryId}`)
                toast.success('Sub category deleted.')
                await reloadAll()
              } catch (error: any) {
                toast.error(error?.response?.data?.message || error?.message || 'Delete failed.')
              }
            }}
          >
            <Icon icon='tabler:trash' />
          </IconButton>
        </Box>
      )
    }
  ]

  const mappingColumns: GridColDef[] = [
    { field: 'recno', headerName: 'Rec No', minWidth: 90, flex: 0.1 },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 220,
      flex: 0.2,
      renderCell: ({ row }: GridRenderCellParams) => <Typography variant='body2'>{`${row?.description ?? ''}`.slice(0, 90) || '-'}</Typography>
    },
    {
      field: 'categoryId',
      headerName: 'Category',
      minWidth: 180,
      flex: 0.26,
      renderCell: ({ row }: GridRenderCellParams) => <Typography variant='body2'>{categoryLookup.get(row?.categoryId)?.name || row?.categoryId}</Typography>
    },
    {
      field: 'subCategoryId',
      headerName: 'Sub Category',
      minWidth: 180,
      flex: 0.26,
      renderCell: ({ row }: GridRenderCellParams) => <Typography variant='body2'>{subCategoryLookup.get(row?.subCategoryId)?.name || row?.subCategoryId}</Typography>
    },
    {
      field: 'isActive',
      headerName: 'Status',
      minWidth: 120,
      flex: 0.12,
      renderCell: ({ row }: GridRenderCellParams) => (
        <CustomChip rounded size='small' skin='light' color={row?.isActive ? 'success' : 'secondary'} label={row?.isActive ? 'Active' : 'Inactive'} />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 120,
      flex: 0.14,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: GridRenderCellParams) => (
        <Box>
          <IconButton
            onClick={() =>
              setCategorySubCategoryMapForm({
                recno: row?.recno ?? '',
                categoryId: row?.categoryId ?? '',
                subCategoryId: row?.subCategoryId ?? '',
                description: row?.description ?? '',
                isActive: row?.isActive ?? true
              })
            }
          >
            <Icon icon='tabler:edit' />
          </IconButton>
          <IconButton
            color='error'
            onClick={async () => {
              try {
                await axiosInstance.delete(`/api/menu-structure/category-subcategory-mappings/${row?.recno}`)
                toast.success('Mapping deleted.')
                await reloadAll()
              } catch (error: any) {
                toast.error(error?.response?.data?.message || error?.message || 'Delete failed.')
              }
            }}
          >
            <Icon icon='tabler:trash' />
          </IconButton>
        </Box>
      )
    }
  ]

  const typeSubTypeCategoryMappingColumns: GridColDef[] = [
    { field: 'recno', headerName: 'Rec No', minWidth: 90, flex: 0.1 },
    {
      field: 'typeId',
      headerName: 'Type',
      minWidth: 160,
      flex: 0.24,
      renderCell: ({ row }: GridRenderCellParams) => <Typography variant='body2'>{typeLookup.get(row?.typeId)?.name || row?.typeId || '-'}</Typography>
    },
    {
      field: 'subTypeId',
      headerName: 'Sub Type',
      minWidth: 170,
      flex: 0.26,
      renderCell: ({ row }: GridRenderCellParams) => <Typography variant='body2'>{subTypeLookup.get(row?.subTypeId)?.name || row?.subTypeId || '-'}</Typography>
    },
    {
      field: 'categoryId',
      headerName: 'Category',
      minWidth: 170,
      flex: 0.26,
      renderCell: ({ row }: GridRenderCellParams) => <Typography variant='body2'>{categoryLookup.get(row?.categoryId)?.name || row?.categoryId || '-'}</Typography>
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 120,
      flex: 0.14,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: GridRenderCellParams) => (
        <Box>
          <IconButton
            onClick={() =>
              setTypeSubTypeCategoryMapForm({
                recno: row?.recno ?? '',
                typeId: row?.typeId ?? '',
                subTypeId: row?.subTypeId ?? '',
                categoryId: row?.categoryId ?? ''
              })
            }
          >
            <Icon icon='tabler:edit' />
          </IconButton>
          <IconButton
            color='error'
            onClick={async () => {
              try {
                await axiosInstance.delete(`/api/menu-structure/type-subtype-categories/${row?.recno}`)
                toast.success('Type-subtype-category mapping deleted.')
                await reloadAll()
              } catch (error: any) {
                toast.error(error?.response?.data?.message || error?.message || 'Delete failed.')
              }
            }}
          >
            <Icon icon='tabler:trash' />
          </IconButton>
        </Box>
      )
    }
  ]

  const tabTitle = useMemo(() => {
    if (tab === 'types') return 'Step 1: Create Type (Level 1)'
    if (tab === 'subTypes') return 'Step 2: Create Sub Type (Level 2)'
    if (tab === 'categories') return 'Step 3: Create Category (Level 3 Parent)'
    if (tab === 'mappingTypeSubTypeCategory') return 'Step 4: Map Type ↔ Sub Type ↔ Category'
    if (tab === 'subCategories') return 'Step 5: Create Sub Category (Level 3 Child)'
    if (tab === 'mappingCategorySubCategory') return 'Step 6: Map Category ↔ Sub Category'
    return 'Menu Structure Settings'
  }, [tab])

  return (
    <Card>
      <CardHeader title='Menu Structure Settings (3-Level CMS)' subheader='Follow flow: Type -> Sub Type -> Category -> Type/SubType/Category Mapping -> Sub Category -> Category/SubCategory Mapping.' />
      <CardContent>
        <Tabs value={tab} onChange={(_, val) => setTab(val)}>
          <Tab value='types' label='1) Types' />
          <Tab value='subTypes' label='2) Sub Types' />
          <Tab value='categories' label='3) Categories' />
          <Tab value='mappingTypeSubTypeCategory' label='4) Type ↔ SubType ↔ Category' />
          <Tab value='subCategories' label='5) Sub Categories' />
          <Tab value='mappingCategorySubCategory' label='6) Cat ↔ SubCat Mapping' />
        </Tabs>

        <Box sx={{ mt: 4 }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            {tabTitle}
          </Typography>

          {tab === 'types' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card variant='outlined'>
                  <CardContent>
                    <Typography variant='subtitle1' sx={{ mb: 2 }}>
                      {typeForm.typeId ? 'Update Type' : 'Add Type'}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <CustomTextField fullWidth label='Name' value={typeForm.name} onChange={e => setTypeForm((p: any) => ({ ...p, name: e.target.value }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField
                          fullWidth
                          label='Slug'
                          value={typeForm.slug}
                          onChange={e => {
                            setTypeSlugTouched(true)
                            setTypeForm((p: any) => ({ ...p, slug: slugify(e.target.value) }))
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField fullWidth multiline rows={2} label='Description' value={typeForm.description} onChange={e => setTypeForm((p: any) => ({ ...p, description: e.target.value }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField fullWidth label='Icon' value={typeForm.icon} onChange={e => setTypeForm((p: any) => ({ ...p, icon: e.target.value }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField fullWidth label='Image URL' value={typeForm.imageUrl} onChange={e => setTypeForm((p: any) => ({ ...p, imageUrl: e.target.value }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField select fullWidth label='Status' value={typeForm.isActive ? 'active' : 'inactive'} onChange={e => setTypeForm((p: any) => ({ ...p, isActive: e.target.value === 'active' }))}>
                          <MenuItem value='active'>Active</MenuItem>
                          <MenuItem value='inactive'>Inactive</MenuItem>
                        </CustomTextField>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant='contained'
                          fullWidth
                          onClick={async () => {
                            if (!typeForm.name?.trim()) return toast.error('Type name is required.')
                            try {
                              const payload = {
                                name: typeForm.name?.trim(),
                                slug: typeForm.slug?.trim(),
                                description: typeForm.description?.trim(),
                                icon: typeForm.icon?.trim(),
                                imageUrl: typeForm.imageUrl?.trim(),
                                isActive: typeForm.isActive,
                                metaTitle: typeForm.metaTitle || '',
                                metaDescription: typeForm.metaDescription || '',
                                metaKeyWords: typeForm.metaKeyWords || '',
                                metaId: Number(typeForm.metaId || 0)
                              }
                              if (typeForm.typeId) await axiosInstance.put(`/api/menu-structure/types/${typeForm.typeId}`, payload)
                              else await axiosInstance.post('/api/menu-structure/types', payload)
                              toast.success(`Type ${typeForm.typeId ? 'updated' : 'created'} successfully.`)
                              setTypeForm({ typeId: '', name: '', slug: '', description: '', icon: '', imageUrl: '', isActive: true, metaTitle: '', metaDescription: '', metaKeyWords: '', metaId: 0 })
                              setTypeSlugTouched(false)
                              await reloadAll()
                            } catch (error: any) {
                              toast.error(error?.response?.data?.message || error?.message || 'Save failed.')
                            }
                          }}
                        >
                          {typeForm.typeId ? 'Update Type' : 'Create Type'}
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={8}>
                <DataGrid autoHeight rows={menuTypesByInt} getRowId={row => row?.typeId} columns={typeColumns} loading={loading} disableRowSelectionOnClick />
              </Grid>
            </Grid>
          )}

          {tab === 'subTypes' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card variant='outlined'>
                  <CardContent>
                    <Typography variant='subtitle1' sx={{ mb: 2 }}>
                      {subTypeForm.subTypeId ? 'Update Sub Type' : 'Add Sub Type'}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <CustomTextField
                          select
                          fullWidth
                          label='Type'
                          value={subTypeForm.typeId}
                          onChange={e => setSubTypeForm((p: any) => ({ ...p, typeId: Number(e.target.value) || '' }))}
                        >
                          {menuTypesByInt.map((item: any) => (
                            <MenuItem key={item?.typeId} value={item?.typeId}>
                              {item?.name}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField fullWidth label='Name' value={subTypeForm.name} onChange={e => setSubTypeForm((p: any) => ({ ...p, name: e.target.value }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField
                          fullWidth
                          label='Slug'
                          value={subTypeForm.slug}
                          onChange={e => {
                            setSubTypeSlugTouched(true)
                            setSubTypeForm((p: any) => ({ ...p, slug: slugify(e.target.value) }))
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField fullWidth multiline rows={2} label='Description' value={subTypeForm.description} onChange={e => setSubTypeForm((p: any) => ({ ...p, description: e.target.value }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField fullWidth label='Image URL' value={subTypeForm.imageUrl} onChange={e => setSubTypeForm((p: any) => ({ ...p, imageUrl: e.target.value }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField
                          select
                          fullWidth
                          label='Status'
                          value={subTypeForm.isActive ? 'active' : 'inactive'}
                          onChange={e => setSubTypeForm((p: any) => ({ ...p, isActive: e.target.value === 'active' }))}
                        >
                          <MenuItem value='active'>Active</MenuItem>
                          <MenuItem value='inactive'>Inactive</MenuItem>
                        </CustomTextField>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant='contained'
                          fullWidth
                          onClick={async () => {
                            if (!subTypeForm.typeId || !subTypeForm.name?.trim()) return toast.error('Type and sub type name are required.')
                            try {
                              const payload = {
                                typeId: Number(subTypeForm.typeId),
                                name: subTypeForm.name?.trim(),
                                slug: subTypeForm.slug?.trim(),
                                description: subTypeForm.description?.trim(),
                                imageUrl: subTypeForm.imageUrl?.trim(),
                                isActive: subTypeForm.isActive
                              }
                              if (subTypeForm.subTypeId) await axiosInstance.put(`/api/menu-structure/sub-types/${subTypeForm.subTypeId}`, payload)
                              else await axiosInstance.post('/api/menu-structure/sub-types', payload)
                              toast.success(`Sub type ${subTypeForm.subTypeId ? 'updated' : 'created'} successfully.`)
                              setSubTypeForm({ subTypeId: '', typeId: '', name: '', slug: '', description: '', imageUrl: '', isActive: true })
                              setSubTypeSlugTouched(false)
                              await reloadAll()
                            } catch (error: any) {
                              toast.error(error?.response?.data?.message || error?.message || 'Save failed.')
                            }
                          }}
                        >
                          {subTypeForm.subTypeId ? 'Update Sub Type' : 'Create Sub Type'}
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={8}>
                <DataGrid autoHeight rows={subTypes} getRowId={row => row?.subTypeId} columns={subTypeColumns} loading={loading} disableRowSelectionOnClick />
              </Grid>
            </Grid>
          )}

          {tab === 'categories' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card variant='outlined'>
                  <CardContent>
                    <Typography variant='subtitle1' sx={{ mb: 2 }}>
                      {categoryForm.categoryId ? 'Update Category' : 'Add Category'}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <CustomTextField fullWidth label='Name' value={categoryForm.name} onChange={e => setCategoryForm((p: any) => ({ ...p, name: e.target.value }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField
                          fullWidth
                          label='Slug'
                          value={categoryForm.slug}
                          onChange={e => {
                            setCategorySlugTouched(true)
                            setCategoryForm((p: any) => ({ ...p, slug: slugify(e.target.value) }))
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField fullWidth multiline rows={2} label='Description' value={categoryForm.description} onChange={e => setCategoryForm((p: any) => ({ ...p, description: e.target.value }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField select fullWidth label='Type (required)' value={categoryForm.typeId} onChange={e => setCategoryForm((p: any) => ({ ...p, typeId: e.target.value }))}>
                          {menuTypesByInt.map((item: any) => (
                            <MenuItem key={item?.typeId} value={item?.typeId}>
                              {item?.name}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField fullWidth label='Image URL' value={categoryForm.imageUrl} onChange={e => setCategoryForm((p: any) => ({ ...p, imageUrl: e.target.value }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField select fullWidth label='Status' value={categoryForm.isActive ? 'active' : 'inactive'} onChange={e => setCategoryForm((p: any) => ({ ...p, isActive: e.target.value === 'active' }))}>
                          <MenuItem value='active'>Active</MenuItem>
                          <MenuItem value='inactive'>Inactive</MenuItem>
                        </CustomTextField>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant='contained'
                          fullWidth
                          onClick={async () => {
                            if (!categoryForm.name?.trim() || !categoryForm.typeId) return toast.error('Type and category name are required.')
                            try {
                              const payload: any = {
                                typeId: Number(categoryForm.typeId),
                                name: categoryForm.name?.trim(),
                                slug: categoryForm.slug?.trim(),
                                description: categoryForm.description?.trim(),
                                imageUrl: categoryForm.imageUrl?.trim(),
                                isActive: categoryForm.isActive
                              }
                              if (categoryForm.categoryId) await axiosInstance.put(`/api/menu-structure/categories/${categoryForm.categoryId}`, payload)
                              else await axiosInstance.post('/api/menu-structure/categories', payload)
                              toast.success(`Category ${categoryForm.categoryId ? 'updated' : 'created'} successfully.`)
                              setCategoryForm({ categoryId: '', name: '', slug: '', description: '', typeId: '', imageUrl: '', isActive: true })
                              setCategorySlugTouched(false)
                              await reloadAll()
                            } catch (error: any) {
                              toast.error(error?.response?.data?.message || error?.message || 'Save failed.')
                            }
                          }}
                        >
                          {categoryForm.categoryId ? 'Update Category' : 'Create Category'}
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={8}>
                <DataGrid autoHeight rows={categories} getRowId={row => row?.categoryId} columns={categoryColumns} loading={loading} disableRowSelectionOnClick />
              </Grid>
            </Grid>
          )}

          {tab === 'subCategories' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card variant='outlined'>
                  <CardContent>
                    <Typography variant='subtitle1' sx={{ mb: 2 }}>
                      {subCategoryForm.subCategoryId ? 'Update Sub Category' : 'Add Sub Category'}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <CustomTextField fullWidth label='Name' value={subCategoryForm.name} onChange={e => setSubCategoryForm((p: any) => ({ ...p, name: e.target.value }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField
                          fullWidth
                          label='Slug'
                          value={subCategoryForm.slug}
                          onChange={e => {
                            setSubCategorySlugTouched(true)
                            setSubCategoryForm((p: any) => ({ ...p, slug: slugify(e.target.value) }))
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField fullWidth multiline rows={2} label='Description' value={subCategoryForm.description} onChange={e => setSubCategoryForm((p: any) => ({ ...p, description: e.target.value }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField fullWidth label='Image URL' value={subCategoryForm.imageUrl} onChange={e => setSubCategoryForm((p: any) => ({ ...p, imageUrl: e.target.value }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField select fullWidth label='Status' value={subCategoryForm.isActive ? 'active' : 'inactive'} onChange={e => setSubCategoryForm((p: any) => ({ ...p, isActive: e.target.value === 'active' }))}>
                          <MenuItem value='active'>Active</MenuItem>
                          <MenuItem value='inactive'>Inactive</MenuItem>
                        </CustomTextField>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant='contained'
                          fullWidth
                          onClick={async () => {
                            if (!subCategoryForm.name?.trim()) return toast.error('Sub category name is required.')
                            try {
                              const payload = {
                                name: subCategoryForm.name?.trim(),
                                slug: subCategoryForm.slug?.trim(),
                                description: subCategoryForm.description?.trim(),
                                imageUrl: subCategoryForm.imageUrl?.trim(),
                                isActive: subCategoryForm.isActive
                              }
                              if (subCategoryForm.subCategoryId) await axiosInstance.put(`/api/menu-structure/sub-categories/${subCategoryForm.subCategoryId}`, payload)
                              else await axiosInstance.post('/api/menu-structure/sub-categories', payload)
                              toast.success(`Sub category ${subCategoryForm.subCategoryId ? 'updated' : 'created'} successfully.`)
                              setSubCategoryForm({ subCategoryId: '', name: '', slug: '', description: '', imageUrl: '', isActive: true })
                              setSubCategorySlugTouched(false)
                              await reloadAll()
                            } catch (error: any) {
                              toast.error(error?.response?.data?.message || error?.message || 'Save failed.')
                            }
                          }}
                        >
                          {subCategoryForm.subCategoryId ? 'Update Sub Category' : 'Create Sub Category'}
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={8}>
                <DataGrid autoHeight rows={subCategories} getRowId={row => row?.subCategoryId} columns={subCategoryColumns} loading={loading} disableRowSelectionOnClick />
              </Grid>
            </Grid>
          )}

          {tab === 'mappingCategorySubCategory' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card variant='outlined'>
                  <CardContent>
                    <Typography variant='subtitle1' sx={{ mb: 2 }}>
                      {categorySubCategoryMapForm.recno ? 'Update Mapping' : 'Add Mapping'}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <CustomTextField select fullWidth label='Category' value={categorySubCategoryMapForm.categoryId} onChange={e => setCategorySubCategoryMapForm((p: any) => ({ ...p, categoryId: Number(e.target.value) || '' }))}>
                          {categories.map((item: any) => (
                            <MenuItem key={item?.categoryId} value={item?.categoryId}>
                              {item?.name}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField select fullWidth label='Sub Category' value={categorySubCategoryMapForm.subCategoryId} onChange={e => setCategorySubCategoryMapForm((p: any) => ({ ...p, subCategoryId: Number(e.target.value) || '' }))}>
                          {subCategories.map((item: any) => (
                            <MenuItem key={item?.subCategoryId} value={item?.subCategoryId}>
                              {item?.name}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField
                          fullWidth
                          multiline
                          rows={2}
                          label='Description'
                          value={categorySubCategoryMapForm.description}
                          onChange={e => setCategorySubCategoryMapForm((p: any) => ({ ...p, description: e.target.value }))}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField select fullWidth label='Status' value={categorySubCategoryMapForm.isActive ? 'active' : 'inactive'} onChange={e => setCategorySubCategoryMapForm((p: any) => ({ ...p, isActive: e.target.value === 'active' }))}>
                          <MenuItem value='active'>Active</MenuItem>
                          <MenuItem value='inactive'>Inactive</MenuItem>
                        </CustomTextField>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant='contained'
                          fullWidth
                          onClick={async () => {
                            if (!categorySubCategoryMapForm.categoryId || !categorySubCategoryMapForm.subCategoryId) {
                              return toast.error('Category and sub category are required.')
                            }
                            try {
                              const payload = {
                                categoryId: Number(categorySubCategoryMapForm.categoryId),
                                subCategoryId: Number(categorySubCategoryMapForm.subCategoryId),
                                description: categorySubCategoryMapForm.description?.trim(),
                                isActive: categorySubCategoryMapForm.isActive
                              }
                              if (categorySubCategoryMapForm.recno) {
                                await axiosInstance.put(`/api/menu-structure/category-subcategory-mappings/${categorySubCategoryMapForm.recno}`, payload)
                              } else {
                                await axiosInstance.post('/api/menu-structure/category-subcategory-mappings', payload)
                              }
                              toast.success(`Mapping ${categorySubCategoryMapForm.recno ? 'updated' : 'created'} successfully.`)
                              setCategorySubCategoryMapForm({ recno: '', categoryId: '', subCategoryId: '', description: '', isActive: true })
                              await reloadAll()
                            } catch (error: any) {
                              toast.error(error?.response?.data?.message || error?.message || 'Save failed.')
                            }
                          }}
                        >
                          {categorySubCategoryMapForm.recno ? 'Update Mapping' : 'Create Mapping'}
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={8}>
                <DataGrid autoHeight rows={categorySubCategoryMappings} getRowId={row => row?.recno} columns={mappingColumns} loading={loading} disableRowSelectionOnClick />
              </Grid>
            </Grid>
          )}

          {tab === 'mappingTypeSubTypeCategory' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card variant='outlined'>
                  <CardContent>
                    <Typography variant='subtitle1' sx={{ mb: 2 }}>
                      {typeSubTypeCategoryMapForm.recno ? 'Update Mapping' : 'Add Mapping'}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <CustomTextField
                          select
                          fullWidth
                          label='Type'
                          value={typeSubTypeCategoryMapForm.typeId}
                          onChange={e =>
                            setTypeSubTypeCategoryMapForm((p: any) => ({ ...p, typeId: Number(e.target.value) || '', subTypeId: '', categoryId: '' }))
                          }
                        >
                          {menuTypesByInt.map((item: any) => (
                            <MenuItem key={item?.typeId} value={item?.typeId}>
                              {item?.name}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField
                          select
                          fullWidth
                          label='Sub Type'
                          value={typeSubTypeCategoryMapForm.subTypeId}
                          onChange={e => setTypeSubTypeCategoryMapForm((p: any) => ({ ...p, subTypeId: Number(e.target.value) || '' }))}
                        >
                          {subTypes
                            .filter((item: any) =>
                              typeSubTypeCategoryMapForm.typeId ? Number(item?.typeId) === Number(typeSubTypeCategoryMapForm.typeId) : true
                            )
                            .map((item: any) => (
                              <MenuItem key={item?.subTypeId} value={item?.subTypeId}>
                                {item?.name}
                              </MenuItem>
                            ))}
                        </CustomTextField>
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField
                          select
                          fullWidth
                          label='Category'
                          value={typeSubTypeCategoryMapForm.categoryId}
                          onChange={e => setTypeSubTypeCategoryMapForm((p: any) => ({ ...p, categoryId: Number(e.target.value) || '' }))}
                        >
                          {categories
                            .filter((item: any) =>
                              typeSubTypeCategoryMapForm.typeId ? Number(item?.menuType?.typeId) === Number(typeSubTypeCategoryMapForm.typeId) : true
                            )
                            .map((item: any) => (
                              <MenuItem key={item?.categoryId} value={item?.categoryId}>
                                {item?.name}
                              </MenuItem>
                            ))}
                        </CustomTextField>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant='contained'
                          fullWidth
                          onClick={async () => {
                            if (!typeSubTypeCategoryMapForm.typeId || !typeSubTypeCategoryMapForm.subTypeId || !typeSubTypeCategoryMapForm.categoryId) {
                              return toast.error('Type, sub type and category are required.')
                            }
                            try {
                              const payload = {
                                typeId: Number(typeSubTypeCategoryMapForm.typeId),
                                subTypeId: Number(typeSubTypeCategoryMapForm.subTypeId),
                                categoryId: Number(typeSubTypeCategoryMapForm.categoryId)
                              }
                              if (typeSubTypeCategoryMapForm.recno) {
                                await axiosInstance.put(`/api/menu-structure/type-subtype-categories/${typeSubTypeCategoryMapForm.recno}`, payload)
                              } else {
                                await axiosInstance.post('/api/menu-structure/type-subtype-categories', payload)
                              }
                              toast.success(`Mapping ${typeSubTypeCategoryMapForm.recno ? 'updated' : 'created'} successfully.`)
                              setTypeSubTypeCategoryMapForm({ recno: '', typeId: '', subTypeId: '', categoryId: '' })
                              await reloadAll()
                            } catch (error: any) {
                              toast.error(error?.response?.data?.message || error?.message || 'Save failed.')
                            }
                          }}
                        >
                          {typeSubTypeCategoryMapForm.recno ? 'Update Mapping' : 'Create Mapping'}
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={8}>
                <DataGrid
                  autoHeight
                  rows={typeSubTypeCategoryMappings}
                  getRowId={row => row?.recno}
                  columns={typeSubTypeCategoryMappingColumns}
                  loading={loading}
                  disableRowSelectionOnClick
                />
              </Grid>
            </Grid>
          )}

        </Box>
      </CardContent>
    </Card>
  )
}

export default MenuSettingManager
