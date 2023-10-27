import { MainNavItem, SidebarNavItem } from "@/types/nav";

interface NavConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
}

export const navConfig: NavConfig = {
  mainNav: [
    {
      title: "Dashboard",
      href: "/",
    },
    {
      title: "Vendor",
      href: "/vendor/list",
    },
    {
      title: "Product",
      href: "/product/list",
    },
    {
      title: "Purchase",
      href: "/purchase/list",
    },
  ],
  sidebarNav: [
    {
      title: "Vendor",
      items: [
        {
          title: "Vendor List",
          href: "/vendor/list",
          items: [],
        },
        {
          title: "New Vendor",
          href: "/vendor/create",
          items: [],
        },
      ],
    },
    {
      title: "Product",
      items: [
        {
          title: "Product List",
          href: "/product/list",
          items: [],
        },
        {
          title: "New Product",
          href: "/product/create",
          items: [],
        },
      ],
    },
    {
      title: "Purchase",
      items: [
        {
          title: "Purchase List",
          href: "/purchase/list",
          items: [],
        },
        {
          title: "New Purchase",
          href: "/purchase/create",
          items: [],
        },
      ],
    },
  ],
};
