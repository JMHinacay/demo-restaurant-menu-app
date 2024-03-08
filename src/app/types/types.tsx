import { ReactNode } from "react";

export type MenuItem = {
  name: string;
  category: string;
  options: string;
  price: number;
  cost: number;
  qty: number;
  id: string | null;
  isEditable?: boolean;
};
export type MenuItemKeys =
  | "name"
  | "category"
  | "options"
  | "price"
  | "cost"
  | "qty";

export type ColumnT<Type> = {
  dataIndex: string;
  title: string;
  width?: string | number;
  render: (value: string, record: Type) => ReactNode;
};
