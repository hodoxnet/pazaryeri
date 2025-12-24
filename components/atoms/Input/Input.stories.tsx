import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";
import { Search, Mail } from "lucide-react";

const meta: Meta<typeof Input> = {
  title: "Atoms/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Email",
    placeholder: "your@email.com",
    type: "email",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    placeholder: "your@email.com",
    error: "Please enter a valid email address",
  },
};

export const WithLeftIcon: Story = {
  args: {
    placeholder: "Search...",
    leftIcon: <Search className="h-4 w-4" />,
  },
};

export const WithRightIcon: Story = {
  args: {
    placeholder: "Email",
    rightIcon: <Mail className="h-4 w-4" />,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};
