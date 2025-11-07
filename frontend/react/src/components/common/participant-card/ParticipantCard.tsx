import CopyButton from "../copy-button/CopyButton";
import InfoButton from "../info-button/InfoButton";
import DeleteUserButton from "../delete-button/DeleteButton";
import ItemCard from "../item-card/ItemCard";
import type { ParticipantCardProps } from "./types";
import "./ParticipantCard.scss";

const ParticipantCard = ({
  firstName,
  lastName,
  isCurrentUser = false,
  isAdmin = false,
  isCurrentUserAdmin = false,
  adminInfo = "",
  participantLink = "",
  onInfoButtonClick,
  userId,
  userCode,
  onUserDeleted,
}: ParticipantCardProps) => {
  return (
    <ItemCard title={`${firstName} ${lastName}`} isFocusable>
      <div className="participant-card-info-container">
        {isCurrentUser && <p className="participant-card-role">You</p>}

        {!isCurrentUser && isAdmin && (
          <p className="participant-card-role">Admin</p>
        )}

        {isCurrentUserAdmin && (
          <CopyButton
            textToCopy={participantLink}
            iconName="link"
            successMessage="Personal Link is copied!"
            errorMessage="Personal Link was not copied. Try again."
          />
        )}

        {isCurrentUserAdmin && !isAdmin && !isCurrentUser && (
          <>
            <InfoButton withoutToaster onClick={onInfoButtonClick} />
            <DeleteUserButton
              userId={userId}
              userCode={userCode}
              buttonColor="green"
              iconName="delete"
              onUserDeleted={onUserDeleted}
            />
          </>
        )}
        {!isCurrentUser && isAdmin && <InfoButton infoMessage={adminInfo} />}
      </div>
    </ItemCard>
  );
};

export default ParticipantCard;
