import React from "react";
import { Text } from "react-native";
import { Footer, FooterTab, Button, Icon } from "native-base";
//  (!ticketDetails.checkupResult || ticketDetails.diagnosis == '') 
const TicketDetailsFooter = ({ ticketState, showTicketActionPopUpModal, saveFeedback,isFeedbackPresent, onSaveClick }) => {
  return (
    <Footer>
      <FooterTab style={{ backgroundColor: '#ffffff' }}>
        {saveFeedback?
          <Button onPress={onSaveClick}>
            <Icon style={{ fontSize: 30, color: "green" }} name="md-checkmark" />
            <Text>Save</Text>
          </Button>
          :
          (isFeedbackPresent) ?
          <Button onPress={showTicketActionPopUpModal}>
          <Icon name='md-lock' style={{ fontSize: 35, color: "black" }} />{
            (ticketState == "OPEN" || ticketState == "REOPENED") ?
              <Text>Close</Text>
              :
              <Text>Reopen</Text>}
         </Button>:
         (ticketState !== "CLOSED")?
          <Button>
            <Icon name='md-lock' style={{ fontSize: 35, color: "black" }} />
            <Text>Provide Feedback</Text>
          </Button> :null
        }
      </FooterTab>
    </Footer>
  );
}

export default TicketDetailsFooter;
