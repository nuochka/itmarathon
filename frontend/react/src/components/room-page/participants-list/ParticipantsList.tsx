import { useState } from "react";
import { useParams } from "react-router";
import ParticipantCard from "@components/common/participant-card/ParticipantCard";
import ParticipantDetailsModal from "@components/common/modals/participant-details-modal/ParticipantDetailsModal";
import type { Participant } from "@types/api";
import {
  MAX_PARTICIPANTS_NUMBER,
  generateParticipantLink,
} from "@utils/general";
import { type ParticipantsListProps, type PersonalInformation } from "./types";
import "./ParticipantsList.scss";

const ParticipantsList = ({
  participants,
  roomId,
}: ParticipantsListProps & { roomId: string }) => {
  const { userCode } = useParams();
  const [participantList, setParticipantList] = useState(participants);
  const [selectedParticipant, setSelectedParticipant] =
    useState<PersonalInformation | null>(null);

  const admin = participantList?.find((participant) => participant?.isAdmin);
  const restParticipants = participantList?.filter(
    (participant) => !participant?.isAdmin
  );

  const isParticipantsMoreThanTen = participantList.length > 10;

  const handleInfoButtonClick = (participant: Participant) => {
    const personalInfoData: PersonalInformation = {
      firstName: participant.firstName,
      lastName: participant.lastName,
      phone: participant.phone,
      deliveryInfo: participant.deliveryInfo,
      email: participant.email,
      link: generateParticipantLink(participant.userCode),
    };
    setSelectedParticipant(personalInfoData);
  };

  const handleModalClose = () => setSelectedParticipant(null);

  const handleUserDeleted = (deletedUserId: string) => {
    setParticipantList((prevList) =>
      prevList.filter((p) => p.id.toString() !== deletedUserId)
    );
  };

  return (
    <div
      className={`participant-list ${
        isParticipantsMoreThanTen ? "participant-list--shift-bg-image" : ""
      }`}
    >
      <div
        className={`participant-list__content ${
          isParticipantsMoreThanTen
            ? "participant-list__content--extra-padding"
            : ""
        }`}
      >
        <div className="participant-list-header">
          <h3 className="participant-list-header__title">Who’s Playing?</h3>

          <span className="participant-list-counter__current">
            {participantList?.length ?? 0}/
          </span>

          <span className="participant-list-counter__max">
            {MAX_PARTICIPANTS_NUMBER}
          </span>
        </div>

        <div className="participant-list__cards">
          {admin && (
            <ParticipantCard
              key={admin.id.toString()}
              firstName={admin.firstName}
              lastName={admin.lastName}
              isCurrentUser={userCode === admin.userCode}
              isAdmin={admin.isAdmin}
              isCurrentUserAdmin={userCode === admin.userCode}
              adminInfo={`${admin.phone}${
                admin.email ? `\n${admin.email}` : ""
              }`}
              participantLink={generateParticipantLink(admin.userCode)}
              userId={admin.id.toString()}
              roomId={roomId}
              userCode={admin.userCode!}
              onUserDeleted={() => handleUserDeleted(admin.id.toString())}
            />
          )}

          {restParticipants?.map((user) => (
            <ParticipantCard
              key={user.id.toString()}
              firstName={user.firstName}
              lastName={user.lastName}
              isCurrentUser={userCode === user.userCode}
              isCurrentUserAdmin={userCode === admin?.userCode}
              participantLink={generateParticipantLink(user.userCode)}
              onInfoButtonClick={
                userCode === admin?.userCode && userCode !== user.userCode
                  ? () => handleInfoButtonClick(user)
                  : undefined
              }
              userId={user.id.toString()}
              roomId={roomId}
              userCode={userCode!}
              onUserDeleted={() => handleUserDeleted(user.id.toString())}
            />
          ))}
        </div>

        {selectedParticipant && (
          <ParticipantDetailsModal
            isOpen={!!selectedParticipant}
            onClose={handleModalClose}
            personalInfoData={selectedParticipant}
          />
        )}
      </div>
    </div>
  );
};

export default ParticipantsList;
