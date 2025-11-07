export const BUTTON_COLORS = {
  GREEN: "green",
  WHITE: "white",
} as const;

export type ButtonColor = (typeof BUTTON_COLORS)[keyof typeof BUTTON_COLORS];

export type IconName = "delete";

export interface DeleteUserButtonProps {
  userId: string;
  userCode: string;
  buttonColor?: ButtonColor;
  iconName?: IconName;
  successMessage?: string;
  errorMessage?: string;
  onUserDeleted?: () => void;
}