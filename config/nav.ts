import { MainNavItem, SidebarNavItem } from "@/types/nav";

interface NavConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
}

export const navConfig: NavConfig = {
  mainNav: [
    {
      title: "Vendor List",
      href: "/vendor/list",
    },
    {
      title: "New Vendor",
      href: "/vendor/create",
    },
    {
      title: "Product List",
      href: "/product/list",
    },
    {
      title: "New Product",
      href: "/product/create",
    },
    {
      title: "Purchase",
      href: "/purchase/list",
    },
    {
      title: "New Purchase",
      href: "/purchase/add",
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
          href: "/purchase/add",
          items: [],
        },
      ],
    },
  ],
};
