export interface ParticipantCardProps {
  firstName: string;
  lastName: string;
  isCurrentUser?: boolean;
  isAdmin?: boolean;
  isCurrentUserAdmin?: boolean;
  adminInfo?: string;
  participantLink?: string;
  onInfoButtonClick?: () => void;
  userId: string;
  roomId: string;
  userCode: string;
  onUserDeleted?: () => void;
}
