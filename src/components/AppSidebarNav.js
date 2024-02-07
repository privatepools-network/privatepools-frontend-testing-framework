import { defineComponent, h, onMounted, ref, resolveComponent } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import {
  CBadge,
  CSidebarNav,
  CNavItem,
  CNavGroup,
  CNavTitle,
} from '@coreui/vue'
import nav from '@/_nav.js'

const normalizePath = (path) =>
  decodeURI(path)
    .replace(/#.*$/, '')
    .replace(/(index)?\.(html)$/, '')

const isActiveLink = (route, link) => {
  if (link === undefined) {
    return false
  }

  if (route.hash === link) {
    return true
  }

  const currentPath = normalizePath(route.path)
  const targetPath = normalizePath(link)

  return currentPath === targetPath
}

const isActiveItem = (route, item) => {
  if (isActiveLink(route, item.to)) {
    return true
  }

  if (item.items) {
    return item.items.some((child) => isActiveItem(route, child))
  }

  return false
}

const AppSidebarNav = defineComponent({
  name: 'AppSidebarNav',
  components: {
    CNavItem,
    CNavGroup,
    CNavTitle,
  },
  
  setup() {
    const route = useRoute()
    const firstRender = ref(true)
    onMounted(() => {
      firstRender.value = false
    })

    const renderItem = (item) => {
      if (item.items) {
        return h(
          CNavGroup,
          {
            visible: firstRender.value || isActiveItem(route, item), // Set `visible` to `true` if it's the first render or the item is active
          },
          {
            togglerContent: () => [
              h(
                'div',
                {
                  // This is the container for the icon
                  class: 'nav-symbol',
                  // style: { paddingLeft: '18px' },
                },
                [
                  h(resolveComponent('CIcon'), {
                    // The icon itself
                    // customClassName: 'nav-icon',
                    name: item.icon,
                  }),
                ],
              ),
              item.name,
            ],

            default: () => item.items.map((child) => renderItem(child)),
            class: 'nav-item',
          },
        )
      }

      return item.to
        ? h(
            RouterLink,
            {
              to: item.to,
              custom: true,
            },
            {
              default: (props) =>
                h(
                  resolveComponent(item.component),
                  {
                    active: props.isActive,
                    href: props.href,
                    onClick: () => props.navigate(),
                  },
                  {
                    default: () => [
                      item.icon &&
                        h(
                          'div',
                          {
                            // This is the container for the icon
                            class: 'nav-symbol',
                            // style: { paddingLeft: '17px' },
                          },
                          [
                            h(resolveComponent('CIcon'), {
                              // customClassName: 'nav-icon',
                              name: item.icon,
                            }),
                          ],
                        ),
                      item.name,
                      item.badge &&
                        h(
                          CBadge,
                          {
                            class: 'ms-auto',
                            color: item.badge.color,
                          },
                          {
                            default: () => item.badge.text,
                          },
                        ),
                    ],
                  },
                ),
            },
          )
        : h(
            resolveComponent(item.component),
            {},
            {
              default: () => item.name,
            },
          )
    }

    return () =>
      h(
        CSidebarNav,
        {},
        {
          default: () => nav.map((item) => renderItem(item)),
          class: 'sidebar',
        },
      )
  },
})

export { AppSidebarNav }
