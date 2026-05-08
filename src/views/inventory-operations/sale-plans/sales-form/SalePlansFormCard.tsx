// ** MUI Imports
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'

// ** Custom Component Imports
import CustomTextField from 'src/core/components/mui/text-field'
import { useTranslation } from 'react-i18next'
import Icon from 'src/core/components/icon'
import TypoLabel from 'src/components/inputs/TypoLabel'
import { useSalePlans } from '../context/useSalePlans'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubSalePlanObj } from '../context/types'
import InstallmentTypeSelector from '../../../../core/dropdown-selectors/InstallmentTypeSelector'
import toast from 'react-hot-toast'
import { formatCurrency } from '../../../../core/utils/format'
import { useAuth } from '../../../../hooks/useAuth'
import CustomChip from '../../../../core/components/mui/chip'

// -----------------------------
// Helpers
// -----------------------------
const toNum = (v: any) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}
const toNullableNum = (v: any) => {
  const s = String(v ?? '').trim()
  if (s === '') return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}
const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100

type SalePlanLike = { defSalePrice?: number | null }
type SubDetailLike = {
  percentage?: number | null
  instAmount?: number | null
  noOfInst?: number | null
  totalInstAmount?: number | null
}
type SourceKey = 'percentage' | 'instAmount' | 'noOfInst' | 'totalInstAmount' | 'defSalePrice'

function recalcFrom(source: SourceKey, sub: any, sale: any): any {
  const salePrice = toNum(sale.defSalePrice ?? 0)

  const next: SubDetailLike = {
    percentage: sub.percentage ?? null,
    instAmount: sub.instAmount ?? null,
    noOfInst: sub.noOfInst ?? null,
    totalInstAmount: sub.totalInstAmount ?? null
  }

  if (next.noOfInst != null) {
    const n = Math.max(0, Math.floor(toNum(next.noOfInst)))
    next.noOfInst = Number.isFinite(n) ? n : null
  }

  const pctFromTotal = (total: number) => (salePrice > 0 ? round2((total / salePrice) * 100) : 0)
  const totalFromPct = (pct: number) => round2((salePrice * pct) / 100)

  switch (source) {
    case 'percentage': {
      const pct = toNum(next.percentage ?? 0)
      const total = totalFromPct(pct)
      const n = next.noOfInst && next.noOfInst > 0 ? next.noOfInst : 1
      next.noOfInst = n
      next.totalInstAmount = total
      next.instAmount = round2(total / n)
      break
    }
    case 'instAmount': {
      const per = toNum(next.instAmount ?? 0)
      const n = next.noOfInst && next.noOfInst > 0 ? next.noOfInst : 1
      next.noOfInst = n
      const total = round2(per * n)
      next.totalInstAmount = total
      next.percentage = pctFromTotal(total)
      break
    }
    case 'noOfInst': {
      const n = toNum(next.noOfInst ?? 0)
      if (n > 0) {
        if (next.totalInstAmount != null) {
          const total = toNum(next.totalInstAmount)
          next.instAmount = round2(total / n)
          next.percentage = pctFromTotal(total)
        } else if (next.percentage != null) {
          const total = totalFromPct(toNum(next.percentage))
          next.totalInstAmount = total
          next.instAmount = round2(total / n)
        } else if (next.instAmount != null) {
          const per = toNum(next.instAmount)
          const total = round2(per * n)
          next.totalInstAmount = total
          next.percentage = pctFromTotal(total)
        }
      } else {
        next.instAmount = null
      }
      break
    }
    case 'totalInstAmount': {
      const total = toNum(next.totalInstAmount ?? 0)
      let n = toNum(next.noOfInst ?? 0)
      if (n <= 0) n = 1
      next.noOfInst = n
      next.instAmount = round2(total / n)
      next.percentage = pctFromTotal(total)
      break
    }
    case 'defSalePrice': {
      let n = toNum(next.noOfInst ?? 0)
      if (n <= 0) n = 1
      next.noOfInst = n

      if (next.percentage != null) {
        const total = totalFromPct(toNum(next.percentage))
        next.totalInstAmount = total
        next.instAmount = round2(total / n)
      } else if (next.totalInstAmount != null) {
        const total = toNum(next.totalInstAmount)
        next.instAmount = round2(total / n)
        next.percentage = pctFromTotal(total)
      } else if (next.instAmount != null) {
        const per = toNum(next.instAmount)
        const total = round2(per * n)
        next.totalInstAmount = total
        next.percentage = pctFromTotal(total)
      }
      break
    }
  }

  return next
}

const initialSubDetail: SubSalePlanObj = {
  instAmount: 0,
  instTypeId: 0,
  isInclude: true,
  monthGap: 0,
  noOfInst: 0,
  percentage: 0,
  planId: 0,
  recno: 0,
  totalInstAmount: 0,
  // @ts-ignore
  inststName: ''
}

const SalePlansFormCard = ({ toggle }: any) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const theme = useTheme()
  const router = useRouter()


  const { salePlans, handleSalePlansData, removeSaleDetailPlans, addSaleDetailPlans ,setSalePlans} = useSalePlans()
  const [subDetail, setSubDetail] = useState<any>(initialSubDetail)
  const [editIndex, setEditIndex] = useState<number | null>(null)

  const handleSubDetail = (updated: Partial<any>) =>
    setSubDetail((prev: any) => ({ ...prev, ...updated }))

  const updateRowInSubSalePlan = (idx: number, patch: SubSalePlanObj) => {

    const current = salePlans?.subSalePlan ?? []
    const original = current[idx] ?? {}
    const updatedRow: SubSalePlanObj = {
      ...original,         // keep recno, planId, etc.
      ...patch
    }


    const next = current.map((r:any, i:any) => (i === idx ? updatedRow : r))



    setSalePlans((model:any) => ({
      ...model,
      subSalePlan: next
    }))
  }

  // ---------- totals ----------
  const subPlans = salePlans?.subSalePlan ?? []
  const totals = subPlans.reduce(
    (acc:any, s:any) => {
      const amt = Number(s?.totalInstAmount ?? 0)
      const pct = Number(s?.percentage ?? 0)
      if (s?.isInclude) {
        acc.includedAmount += amt
        acc.includedPct += pct
      } else {
        acc.excludedAmount += amt
      }
      acc.grand += amt
      return acc
    },
    { includedAmount: 0, includedPct: 0, excludedAmount: 0, grand: 0 }
  )

  const ms = toNum(user?.marlaSize ?? 0)
  const defSalePrice = toNum(salePlans?.salePlan?.defSalePrice ?? 0)
  const remainingIncludedPct = round2(100 - totals.includedPct)
  const remainingIncludedAmt = round2(defSalePrice - totals.includedAmount)

  const validateBeforeAdd = (): boolean => {
    if (!subDetail.instTypeId) return toast.error('Please select installment Type!'), false
    if (!subDetail.monthGap) return toast.error('Please enter month gap!'), false
    if (!subDetail.noOfInst) return toast.error('Please enter no of installments!'), false
    if (!subDetail.instAmount) return toast.error('Please enter installment amount or percentage/total to derive it!'), false

    if (subDetail.isInclude) {
      const addPct = toNum(subDetail.percentage ?? 0)
      const addAmt = toNum(subDetail.totalInstAmount ?? 0)

      if (defSalePrice <= 0) return toast.error('Please enter a valid Sales Price before adding included items'), false
      if (addPct <= 0) return toast.error('Included percentage must be greater than 0'), false
      if (addPct > 100) return toast.error('Single included percentage cannot exceed 100%'), false

      let currentIncludedPct = totals.includedPct
      let currentIncludedAmt = totals.includedAmount
      if (editIndex !== null) {
        const original = subPlans[editIndex]
        if (original?.isInclude) {
          currentIncludedPct = round2(currentIncludedPct - toNum(original.percentage ?? 0))
          currentIncludedAmt = round2(currentIncludedAmt - toNum(original.totalInstAmount ?? 0))
        }
      }

      const newPctTotal = round2(currentIncludedPct + addPct)
      if (newPctTotal > 100) {
        toast.error(`Included % cannot exceed 100. Remaining: ${round2(Math.max(0, 100 - currentIncludedPct))}%`)
        return false
      }

      if (addAmt > defSalePrice) return toast.error('Included amount cannot exceed the Sales Price'), false
      const newAmtTotal = round2(currentIncludedAmt + addAmt)
      if (newAmtTotal > defSalePrice) {
        toast.error(`Included amount cannot exceed Sales Price. Remaining: ${formatCurrency(Math.max(0, defSalePrice - currentIncludedAmt), null)}`)
        return false
      }
    }

    return true
  }

  const handleAddOrUpdate = () => {
    if (!validateBeforeAdd()) return

    if (editIndex === null) {
      // ADD
      addSaleDetailPlans(subDetail)
      const newIncludedPct = round2(totals.includedPct + (subDetail.isInclude ? toNum(subDetail.percentage ?? 0) : 0))
      // if (newIncludedPct !== 100) toast.error('Total Percentage must be equal to 100')
      toast.success('Added')
      setSubDetail(initialSubDetail)
    } else {
      // UPDATE in place (immutably)
      updateRowInSubSalePlan(editIndex, subDetail)
      setEditIndex(null)
      setSubDetail(initialSubDetail)
      toast.success('Updated')
    }
  }


  const startEdit = (index: number) => {
    const row = subPlans[index]
    if (!row) return
    setSubDetail({
      instAmount: toNum(row.instAmount),
      instTypeId: row.instTypeId ?? 0,
      isInclude: !!row.isInclude,
      monthGap: toNum(row.monthGap),
      noOfInst: toNum(row.noOfInst),
      percentage: toNum(row.percentage),
      planId: row.planId ?? 0,
      recno: row.recno ?? 0,
      totalInstAmount: toNum(row.totalInstAmount),
      // @ts-ignore
      inststName: row.inststName ?? ''
    })
    setEditIndex(index)
  }

  const cancelEdit = () => {
    setEditIndex(null)
    setSubDetail(initialSubDetail)
  }

  return (
    <Grid container spacing={3}>
      <Grid item xl={8} md={8} xs={12}>
        <Card>
          <CardContent sx={{ p: [`${theme.spacing(3)} !important`, `${theme.spacing(3)} !important`] }}>
            <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
              <IconButton onClick={() => (!!toggle ? toggle() : router.back())}>
                <Icon icon={'tabler:arrow-left'} />
              </IconButton>
              <Typography variant={'h5'}>
                {salePlans?.salePlan.planId ? t('Update Sale Plans') : t('New Sale Plans')}
              </Typography>
            </Box>
            <Divider />

            <Grid container sx={{ mt: 2, alignItems: 'center' }} spacing={2}>
              <Grid item md={6} xs={12}>
                <CustomTextField
                  fullWidth
                  autoFocus
                  label={<TypoLabel important name={'Plan Name'} />}
                  type='text'
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('Plan Name') as string}
                  value={salePlans?.salePlan?.description ?? ''}
                  onChange={e => handleSalePlansData({ description: e.target.value ?? '' })}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <CustomTextField
                  fullWidth
                  autoFocus
                  label={<TypoLabel important name={'Area/Marla'} />}
                  type='text'
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('Area/Marla') as string}
                  value={(salePlans?.salePlan?.areaMarla ?? 0) > 0 ? salePlans?.salePlan?.areaMarla : ''}
                  onChange={e => {
                    const marla = toNum(e.target.value)
                    handleSalePlansData({ areaMarla: marla, areaSqft: round2(marla * ms) })
                  }}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <CustomTextField
                  fullWidth
                  autoFocus
                  label={<TypoLabel important name={'Area Square Ft'} />}
                  type='text'
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('Area Square Ft') as string}
                  value={(salePlans?.salePlan?.areaSqft ?? 0) > 0 ? salePlans?.salePlan?.areaSqft : ''}
                  onChange={e => {
                    const sqft = toNum(e.target.value)
                    handleSalePlansData({ areaSqft: sqft, areaMarla: ms > 0 ? round2(sqft / ms) : 0 })
                  }}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <CustomTextField
                  fullWidth
                  autoFocus
                  label={<TypoLabel important name={'Sales Price'} />}
                  type='text'
                  sx={{ mb: 2 }}
                  variant='outlined'
                  placeholder={t('Sales Price') as string}
                  value={(salePlans?.salePlan?.defSalePrice ?? 0) > 0 ? salePlans?.salePlan?.defSalePrice : ''}
                  onChange={e => {
                    const newDefSalePrice = toNum(e.target.value)
                    handleSalePlansData({ defSalePrice: newDefSalePrice })
                    const updated = recalcFrom('defSalePrice', subDetail, { defSalePrice: newDefSalePrice })
                    handleSubDetail(updated as SubSalePlanObj)
                  }}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <Grid container spacing={2} alignItems={'center'}>
                  <Grid item xs={6} sm={6} lg={6}>
                    <Typography variant={'subtitle1'} sx={{ fontWeight: 400 }}>
                      {t('Make it default sale plan?')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={6} lg={6} sx={{ display: 'flex', justifyContent: 'end' }}>
                    <Checkbox
                      checked={salePlans?.salePlan?.isDefault ?? false}
                      onChange={() => handleSalePlansData({ isDefault: !(salePlans?.salePlan?.isDefault ?? false) })}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={12} xs={12}>
                <Divider />

                <Grid container spacing={4} sx={{ mt: 2, mb: 2 }}>
                  <Grid item md={6} xs={12}>
                    <InstallmentTypeSelector
                      selected_value={subDetail.instTypeId ?? null}
                      handleChange={(value:any) => handleSubDetail({ instTypeId: value?.value ?? null, inststName: value?.text??"" })}
                      props={{ label: <TypoLabel important name={'Installment Type'} /> }}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      fullWidth
                      autoFocus
                      label={<TypoLabel important name={'Month Gap'} />}
                      type='text'
                      sx={{ mb: 2 }}
                      variant='outlined'
                      placeholder={t('Month Gap') as string}
                      value={(subDetail?.monthGap ?? 0) > 0 ? subDetail?.monthGap : ''}
                      onChange={e => handleSubDetail({ monthGap: toNum(e.target.value) })}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      fullWidth
                      autoFocus
                      label={<TypoLabel important name={'Percentage'} />}
                      type='text'
                      sx={{ mb: 2 }}
                      variant='outlined'
                      placeholder={t('Percentage') as string}
                      value={(subDetail?.percentage ?? 0) > 0 ? subDetail?.percentage : ''}
                      onChange={e => {
                        const percentage = toNullableNum(e.target.value)
                        const updated = recalcFrom('percentage', { ...subDetail, percentage }, salePlans?.salePlan ?? {})
                        handleSubDetail(updated as SubSalePlanObj)
                      }}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      fullWidth
                      autoFocus
                      label={<TypoLabel important name={'No of Installments'} />}
                      type='text'
                      sx={{ mb: 2 }}
                      variant='outlined'
                      placeholder={t('No of Installments') as string}
                      value={(subDetail?.noOfInst ?? 0) > 0 ? subDetail?.noOfInst : ''}
                      onChange={e => {
                        const noOfInst = toNullableNum(e.target.value)
                        const updated = recalcFrom('noOfInst', { ...subDetail, noOfInst }, salePlans?.salePlan ?? {})
                        handleSubDetail(updated as SubSalePlanObj)
                      }}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      fullWidth
                      autoFocus
                      label={<TypoLabel important name={'Installment Amount'} />}
                      type='text'
                      sx={{ mb: 2 }}
                      variant='outlined'
                      placeholder={t('Installment Amount') as string}
                      value={(subDetail?.instAmount ?? 0) > 0 ? subDetail?.instAmount : ''}
                      onChange={e => {
                        const instAmount = toNullableNum(e.target.value)
                        const updated = recalcFrom('instAmount', { ...subDetail, instAmount }, salePlans?.salePlan ?? {})
                        handleSubDetail(updated as SubSalePlanObj)
                      }}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      fullWidth
                      autoFocus
                      label={<TypoLabel important name={'Total Installment Amount'} />}
                      type='text'
                      sx={{ mb: 2 }}
                      variant='outlined'
                      placeholder={t('Total Installment Amount') as string}
                      value={(subDetail?.totalInstAmount ?? 0) > 0 ? subDetail?.totalInstAmount : ''}
                      onChange={e => {
                        const totalInstAmount = toNullableNum(e.target.value)
                        const updated = recalcFrom('totalInstAmount', { ...subDetail, totalInstAmount }, salePlans?.salePlan ?? {})
                        handleSubDetail(updated as SubSalePlanObj)
                      }}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <Grid container spacing={2} alignItems={'center'}>
                      <Grid item xs={6} sm={6} lg={6}>
                        <Typography variant={'subtitle1'} sx={{ fontWeight: 400 }}>
                          {t('Is it included')}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={6} lg={6} sx={{ display: 'flex', justifyContent: 'end' }}>
                        <Checkbox
                          checked={subDetail?.isInclude ?? false}
                          onChange={() => handleSubDetail({ isInclude: !(subDetail?.isInclude ?? false) })}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, flexWrap: 'wrap', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <CustomChip
                      rounded
                      size='small'
                      skin='light'
                      color={remainingIncludedPct === 0 ? 'success' : 'warning'}
                      label={
                        remainingIncludedPct === 0
                          ? t('Included % complete: 100%')
                          : `${t('Remaining Included %')}: ${Math.max(0, remainingIncludedPct)}%`
                      }
                    />
                    <CustomChip
                      rounded
                      size='small'
                      skin='light'
                      color={remainingIncludedAmt <= 0 ? 'success' : 'warning'}
                      label={
                        remainingIncludedAmt <= 0
                          ? `${t('Included Amount complete')}: ${formatCurrency(defSalePrice, null)}`
                          : `${t('Remaining Included Amount')}: ${formatCurrency(Math.max(0, remainingIncludedAmt), null)}`
                      }
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {editIndex !== null && (
                      <Button variant='outlined' color='secondary' onClick={cancelEdit}>
                        {t('Cancel')}
                      </Button>
                    )}
                    <Button variant='tonal' color='success' onClick={handleAddOrUpdate}>
                      {editIndex === null ? t('Add') : t('Update')}
                    </Button>
                  </Box>
                </Box>

                <Divider />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item md={4} xs={12}>
        <Card>
          <Box sx={{ display: 'flex', p: 2, alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant={'h6'}>{t('Sub Plan Details')}</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <CustomChip rounded size='small' skin='light' color='success' label={t('Included')} />
              <CustomChip rounded size='small' skin='light' color='error' label={t('Excluded')} />
            </Box>
          </Box>
          <Divider />

          {(salePlans.subSalePlan ?? []).map((subPlanDetail:any, index: number) => {
            const isIncluded = !!subPlanDetail?.isInclude

            return (
              <Box sx={{ display: 'flex', flexDirection: 'column' }} key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant={'body2'} sx={{ fontWeight: 600 }}>
                      {t('Status')}:&nbsp;
                      <CustomChip
                        rounded
                        size='small'
                        skin='light'
                        color={isIncluded ? 'success' : 'error'}
                        label={isIncluded ? t('Included') : t('Excluded')}
                      />
                    </Typography>

                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {t('Installment Type')}:{" "}
                      <InstallmentTypeSelector
                        selected_value={subPlanDetail?.instTypeId ?? null}
                        preview={true}
                        handleChange={(value:any) =>
                          handleSubDetail({
                            instTypeId: value?.value ?? null,
                            inststName: value?.text ?? ""
                          })
                        }
                        props={{ label: null }}
                      />
                    </Typography>

                    <Typography variant={'body2'}>
                      {t('Total Amount')}: {subPlanDetail.noOfInst} x {formatCurrency(subPlanDetail.instAmount, null)} =&nbsp;
                      {formatCurrency(subPlanDetail.totalInstAmount ?? 0, null)}
                    </Typography>

                    <Typography variant={'body2'}>
                      {subPlanDetail.monthGap ?? ''} {t('month(s) Gap with')} {subPlanDetail.percentage ?? 0}%
                    </Typography>
                  </Box>

                  {/* buttons with spacing */}
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <IconButton
                      size='small'
                      onClick={() => startEdit(index)}
                      sx={{
                        p: '0.375rem',
                        borderRadius: 1,
                        color: 'common.white',
                        backgroundColor:theme => theme.palette.warning.main,
                        '&:hover': { backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)` }
                      }}
                      title={t('Edit') as string}
                    >
                      <Icon icon='tabler:pencil' fontSize='1rem' />
                    </IconButton>

                    <IconButton
                      size='small'
                      onClick={() => {
                        removeSaleDetailPlans(index)
                        if (editIndex === index) cancelEdit()
                      }}
                      sx={{
                        p: '0.375rem',
                        borderRadius: 1,
                        color: 'common.white',
                        backgroundColor: 'error.main',
                        '&:hover': { backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)` }
                      }}
                      title={t('Delete') as string}
                    >
                      <Icon icon='tabler:trash' fontSize='1rem' />
                    </IconButton>
                  </Box>
                </Box>

                {(((salePlans as any)?.subSalePlan ?? []).length !== index + 1) && <Divider />}

              </Box>
            )
          })}

          {((salePlans as any)?.subSalePlan ?? []).length > 0 && (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
              <Typography variant={'body2'}>{t('No sub sale detail found!')}</Typography>
            </Box>
          )}

          {((salePlans as any)?.subSalePlan ?? []).length > 0 &&(
            <>
              <Divider />
              <Box sx={{ p: 2 }}>
                <Typography variant='subtitle2' sx={{ mb: 1 }}>
                  {t('Summary')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                  <CustomChip
                    rounded
                    size='small'
                    skin='light'
                    color={totals.includedPct === 100 ? 'success' : 'error'}
                    label={
                      totals.includedPct === 100
                        ? t('Included %: 100 (OK)')
                        : `${t('Included %')}: ${round2(totals.includedPct)} — ${t('Total Percentage must be equal to 100')}`
                    }
                  />
                  <CustomChip
                    rounded
                    size='small'
                    skin='light'
                    color={totals.includedAmount <= defSalePrice ? 'success' : 'error'}
                    label={`${t('Included Amount')}: ${formatCurrency(totals.includedAmount, null)} / ${formatCurrency(defSalePrice, null)}`}
                  />
                  <CustomChip
                    rounded
                    size='small'
                    skin='light'
                    color='primary'
                    label={`${t('Grand Total')}: ${formatCurrency(totals.grand, null)}`}
                  />
                </Box>
              </Box>
            </>
          )}
        </Card>
      </Grid>
    </Grid>
  )
}

export default SalePlansFormCard
