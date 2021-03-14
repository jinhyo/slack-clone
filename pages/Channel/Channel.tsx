import React from "react";
import { Container, Header } from "@pages/Channel/styles";

const Channel = () => {
  return (
    <Container>
      <Header>
        <span>#ccc{/* {channel} */}</span>
        <div className="header-right">
          <span>{/* {channelMembersData?.length} */}</span>
          <button
            // onClick={onClickInviteChannel}
            className="c-button-unstyled p-ia__view_header__button"
            aria-label="Add people to #react-native"
            data-sk="tooltip_parent"
            type="button"
          >
            <i
              className="c-icon p-ia__view_header__button_icon c-icon--add-user"
              aria-hidden="true"
            />
          </button>
        </div>
      </Header>
      {/* <ChatList
        chatSections={chatSections}
        scrollRef={scrollbarRef}
        setSize={setSize}
        isReachingEnd={isReachingEnd}
      />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      /> */}
    </Container>
  );
};

export default Channel;
