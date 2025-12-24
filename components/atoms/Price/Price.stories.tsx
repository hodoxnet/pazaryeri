import type { Meta, StoryObj } from "@storybook/react";
import { Price } from "./Price";

const meta: Meta<typeof Price> = {
  title: "Atoms/Price",
  component: Price,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    showDiscount: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    price: 1299.99,
  },
};

export const WithDiscount: Story = {
  args: {
    price: 999.99,
    originalPrice: 1499.99,
    showDiscount: true,
  },
};

export const Small: Story = {
  args: {
    price: 599.99,
    originalPrice: 799.99,
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    price: 2499.99,
    originalPrice: 2999.99,
    size: "lg",
  },
};

export const NoDiscountBadge: Story = {
  args: {
    price: 799.99,
    originalPrice: 999.99,
    showDiscount: false,
  },
};
