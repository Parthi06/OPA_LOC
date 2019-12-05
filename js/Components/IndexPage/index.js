import React from "react";
import { Container, Content } from "native-base";
import Home from "../Home";
import FeedPageHeaderFilterButtons from "../Home/FeedPageHeaderFilterButtons";
import update from 'immutability-helper';

class IndexPage extends React.Component {
    constructor(props) {  
        super(props);
        this.onFilterButtonClick = this.onFilterButtonClick.bind(this);
        this.loadNewEvents = this.loadNewEvents.bind(this);
        this.state = {
            filterBtnStatus: { ticket: false, asset: false, user: false, follow: false },
            filterBtnDisabledStatus: { ticket: false, asset: false, user: false, follow: false },
            isNewEventsAvailable: false,
            countOfAE: 0,
            countOfUE: 0,
            countOfT: 0,
        };
    }

    onFilterButtonClick = (btnId) => {
        var newBtnState = null;
        let newDisabledState = null;
        this.setState({ feedContentHeight: 0 });
    
        switch (btnId) {
          case 1:
            // ticket is clicked && asset and user is not clicked
            //Ticket - filterBtnStatus true ie prevfilterbtn status -false,asset& User -filterBtnDisabledStatus -true
            if ((!this.state.filterBtnStatus.asset) && (!this.state.filterBtnStatus.user)) {
              newDisabledState = update(this.state.filterBtnDisabledStatus, { asset: { $set: !this.state.filterBtnStatus.ticket }, user: { $set: !this.state.filterBtnStatus.ticket } });
              this.setState({ feedPageTitle: (this.state.filterBtnStatus.follow) ? "Feed - Tickets Following" : "Feed - Tickets" })
            }
            newBtnState = update(this.state.filterBtnStatus, { ticket: { $set: !this.state.filterBtnStatus.ticket } });
            break;
          case 2:
            //1.When following is on, and asset is clicked, Ticket and user will be disabled and vice versa
            //2.When asset is clicked, disable user and vice versa
            newDisabledState = (this.state.filterBtnStatus.follow) ? update(this.state.filterBtnDisabledStatus, { ticket: { $set: (!this.state.filterBtnStatus.asset) }, user: { $set: (!this.state.filterBtnStatus.asset) } }) :
              update(this.state.filterBtnDisabledStatus, { user: { $set: (!this.state.filterBtnStatus.asset) } });
            newBtnState = update(this.state.filterBtnStatus, { asset: { $set: !this.state.filterBtnStatus.asset } });
            this.setState({ feedPageTitle: (this.state.filterBtnStatus.follow) ? "Feed - Assets Following" : "Feed - Assets" })
            break;
          case 3:
            //When user is clicked disable asset and ticket
            newDisabledState = update(this.state.filterBtnDisabledStatus, {
              ticket: { $set: (!this.state.filterBtnStatus.user) },
              asset: { $set: (!this.state.filterBtnStatus.user) }
            });
            newBtnState = update(this.state.filterBtnStatus, { user: { $set: !this.state.filterBtnStatus.user } });
            this.setState({ feedPageTitle: (this.state.filterBtnStatus.follow) ? "Feed - Users Following" : "Feed - Users" })
            break;
          case 4:
            //When asset is already clicked while clicking follow, disable ticket
            if (this.state.filterBtnStatus.asset) {
              newDisabledState = update(this.state.filterBtnDisabledStatus, { ticket: { $set: (!this.state.filterBtnStatus.follow) } });
            }
            newBtnState = update(this.state.filterBtnStatus, { follow: { $set: !this.state.filterBtnStatus.follow } });
            break;
        }
    
    
        let filterFlg = false;
        if (newBtnState != null) {
          filterFlg = (newBtnState.ticket || newBtnState.asset || newBtnState.user || newBtnState.follow);
          this.setState({ filterBtnStatus: newBtnState, isFilterOn: filterFlg });
        }
    
        if (newDisabledState != null)
          this.setState({ filterBtnDisabledStatus: newDisabledState });
    
        if ((this.state.countOfAE > 0 || this.state.countOfUE > 0 || this.state.countOfT > 0)) {
          // this.updateLatestEventTimestamp(btnId);
        }
      }

    loadNewEvents = (userEvent) => {
    }
    render() {
        return (
            <Container>
                <FeedPageHeaderFilterButtons onFilterButtonClick={this.onFilterButtonClick}
                    filterBtnStatus={this.state.filtertBnStatus} filterBtnDisabledStatus={this.state.filterBtnDisabledStatus}
                    loadNewEvents={this.loadNewEvents} isNewEventsAvail={this.state.isNewEventsAvailable} countOfAE={this.state.countOfAE}
                    countOfUE={this.state.countOfUE} countOfT={this.state.countOfT} />

                <Home onFilterButtonClick={this.onFilterButtonClick}  />
            </Container>
        );
    }
}

export default (IndexPage);
