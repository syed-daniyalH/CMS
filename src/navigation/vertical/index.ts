// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboards',
      icon: 'tabler:smart-home',
      action: 'view',
      subject: 'DashboardMain',
      children: [
        {
          title: 'Home',
          path: '/dashboards',
          action: 'view',
          subject: 'DashboardMain'
        }
      ]
    },
    {
      sectionTitle: 'CRM',
      action: 'view',
      subject: 'Customer'
    },

       {
      title: 'Section Types',
      path: '/crm/section-type',
      action: 'view',
      subject: 'mange',
      icon: 'tabler:file-typography',
    } ,
     {
      title: 'Sections',
      path: '/crm/section',
      action: 'view',
      subject: 'mange',
      icon: 'tabler:box-multiple',
    } ,
 
    {
      title: 'Pages',
      path: '/crm/pages',
      action: 'view',
      subject: 'receipts',
      icon: 'tabler:html',
    } ,
  
    {
      title: 'Blogs',
      icon: 'tabler:smart-home',
      action: 'view',
      subject: 'PropertyTransfer',
      children: [
        {
          title: 'Blogs List',
          path: '/blogs/list',
          action: 'view',
          subject: 'PropertyTransfer'
        },
        {
          title: 'Add Blogs',
          path: '/blogs/add-blog',
          action: 'view',
          subject: 'PropertyTransfer'
        },
        {
          title: 'Category',
          path: '/blogs/category',
          action: 'view',
          subject: 'PropertyTransfer'
        },
        {
          title: 'Sub Category',
          path: '/blogs/sub-category',
          action: 'view',
          subject: 'PropertyTransfer'
        }
      ]
    },
       {
      title: 'Services',
      icon: 'tabler:server-2',
      action: 'view',
      subject: 'PropertyTransfer',
      children: [
        {
          title: 'Services List',
          path: '/services/list',
          action: 'view',
          subject: 'PropertyTransfer'
        },
        {
          title: 'Add Service',
          path: '/services/add-service',
          action: 'view',
          subject: 'PropertyTransfer'
        },
   
        {
          title: 'Sub Services',
          path: '/services/sub-services-list',
          action: 'view',
          subject: 'PropertyTransfer'
        },
        {
          title: 'Add Sub Service',
          path: '/services/add-sub-service',
          action: 'view',
          subject: 'PropertyTransfer'
        }
      ]
    },
    {
      title: 'Technologies',
      icon: 'tabler:code',
      action: 'view',
      subject: 'PropertyTransfer',
      children: [
        {
          title: 'Technology Heads',
          path: '/settings/technology-heads',
          action: 'view',
          subject: 'PropertyTransfer'
        },
        {
          title: 'Technologies List',
          path: '/technologies/list',
          action: 'view',
          subject: 'PropertyTransfer'
        },
        {
          title: 'Add Technology',
          path: '/technologies/add-technology',
          action: 'view',
          subject: 'PropertyTransfer'
        }
      ]
    },
    {
      title: 'Industries',
      icon: 'tabler:building',
      action: 'view',
      subject: 'PropertyTransfer',
      children: [
        {
          title: 'Add Industry',
          path: '/industries/add-industry',
          action: 'view',
          subject: 'PropertyTransfer'
        },
        {
          title: 'Industries List',
          path: '/industries/industries-list',
          action: 'view',
          subject: 'PropertyTransfer'
        }
      ]
    },
    {
      title: 'Career',
      icon: 'tabler:briefcase',
      action: 'view',
      subject: 'PropertyTransfer',
      children: [
        {
          title: 'Department List',
          path: '/careers/departments',
          action: 'view',
          subject: 'PropertyTransfer'
        },
        {
          title: 'Career Locations',
          path: '/careers/locations',
          action: 'view',
          subject: 'PropertyTransfer'
        },
        {
          title: 'Careers List',
          path: '/careers/list',
          action: 'view',
          subject: 'PropertyTransfer'
        },
        {
          title: 'Add Career',
          path: '/careers/add-career',
          action: 'view',
          subject: 'PropertyTransfer'
        },
        {
          title: 'Applications',
          path: '/careers/applications',
          action: 'view',
          subject: 'PropertyTransfer'
        }
      ]
    },
    {
      title: 'Hiring',
      icon: 'tabler:user-search',
      action: 'view',
      subject: 'PropertyTransfer',
      children: [
        {
          title: 'Hirings List',
          path: '/hirings/list',
          action: 'view',
          subject: 'PropertyTransfer'
        },
        {
          title: 'Add Hiring',
          path: '/hirings/add-hiring',
          action: 'view',
          subject: 'PropertyTransfer'
        },
        {
          title: 'Sub Hirings',
          path: '/hirings/sub-hirings-list',
          action: 'view',
          subject: 'PropertyTransfer'
        },
        {
          title: 'Add Sub Hiring',
          path: '/hirings/add-sub-hiring',
          action: 'view',
          subject: 'PropertyTransfer'
        }
      ]
    },
    {
      title: 'Clients',
      icon: 'tabler:users-group',
      action: 'view',
      subject: 'PropertyTransfer',
      children: [
        {
          title: 'Clients List',
          path: '/clients/list',
          action: 'view',
          subject: 'PropertyTransfer'
        },
        {
          title: 'Add Client',
          path: '/clients/add-client',
          action: 'view',
          subject: 'PropertyTransfer'
        }
      ]
    },
 {
      title: 'Case Study',
      icon: 'tabler:book',
      action: 'view',
      subject: 'PropertyTransfer',
      children: [
        {
          title: 'Case Study List',
          path: '/case-study/list',
          action: 'view',
          subject: 'PropertyTransfer'
        },
        {
          title: 'Add Case Study',
          path: '/case-study/add',
          action: 'view',
          subject: 'PropertyTransfer'
        },
        {
          title: 'Category',
          path: '/case-study/category',
          action: 'view',
          subject: 'PropertyTransfer'
        },
        {
          title: 'Sub Category',
          path: '/case-study/sub-category',
          action: 'view',
          subject: 'PropertyTransfer'
        }
      ]
    },
    {
      title: 'Tags',
      path: '/settings/tags',
      icon: 'tabler:tags',
      action: 'view',
      subject: 'PropertyTransfer',
    },
    {
      title: 'Author',
      path: '/settings/authors',
      icon: 'tabler:users',
      action: 'view',
      subject: 'PropertyTransfer',
    },
    {
      title: 'Settings',
      icon: 'tabler:settings-cog',
      action: 'view',
      subject: 'receipts',
      children: [
        {
          title: 'Settings List',
          path: '/settings',
          action: 'view',
          subject: 'receipts'
        },
        {
          title: 'Menu Setting',
          path: '/settings/menu-setting',
          action: 'view',
          subject: 'receipts'
        }
      ]
    },
  ]
}

export default navigation
