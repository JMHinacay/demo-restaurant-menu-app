import { ReactNode } from "react";

export type MenuItem = {
  name: string;
  category: string;
  options: object[];
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
  key?: string;
  colSpan?: number | undefined;
  dataIndex: string;
  title: string;
  width?: string | number;
  render?: (value: string, record: Type, boolean?: boolean) => ReactNode;
};
