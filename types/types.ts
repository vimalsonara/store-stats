export interface Vendor {
  id: string;
  vendorName: string;
  userId: string;
  mobile: string;
}

export interface Product {
  product: string;
  userId: string;
  id: string;
}

export interface Items {
  itemName: string;
  price: string;
  quantity: string;
}

export interface Purchase {
  id: string;
  date: string;
  totalAmount: number;
  userId: string;
  vendorId: string;
  vendorName: string;
  items: Items[];
}
