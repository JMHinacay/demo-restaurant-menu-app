import { RenderOptions } from "@/hooks/useEditableDataSource";
import { ReactNode } from "react";

export type MenuItem = {
  name: string;
  category: string;
  options: Option[];
  price: number;
  cost: number;
  qty: number;
  id: string | null;
  isEditable?: boolean;
};

export type Option = {
  name: string;
  additionalCost: number;
  id: string;
  menuItemId: string;
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
  renderOptions: RenderOptions<Type>;
};
