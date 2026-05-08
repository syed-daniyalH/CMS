// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'
// ** Reducers


//** lists

import dashboard from "./dashboard"

//** definitions

import sectionType from "./crm/section-type"
import sections from './crm/sections'
import cmsPages from './crm/pages'
import blogCategory from './blogs/category'
import blogSubCategory from './blogs/sub-category'
import blogs from './blogs/blog'
import caseStudies from './case-study'
import caseStudyCategory from './case-study/category'
import caseStudySubCategory from './case-study/sub-category'
import menuTypes from './settings/menu-types'
import menuNodes from './settings/menu-nodes'
import tags from './settings/tags'
import authors from './settings/authors'
import technologyHeads from './settings/technology-heads'
import cmsDropdowns from './dropdowns/cms'

export const store = configureStore({
  reducer: {

    sectionType,
    sections,
    cmsPages,
    blogCategory,
    blogSubCategory,
    blogs,
    caseStudies,
    caseStudyCategory,
    caseStudySubCategory,
    menuTypes,
    menuNodes,
    tags,
    authors,
    technologyHeads,
    cmsDropdowns
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState> & Record<string, any>
