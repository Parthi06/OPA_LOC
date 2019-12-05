import React, { Component } from 'react';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { ProgressBarAndroid, View } from 'react-native';
import { Icon, Button, Text } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as appConstants from '../../Utils/AppConstants';
import Toast from 'react-native-simple-toast';
import RNProgressHud from '@zhigang1992/react-native-progress-display';
import moment from 'moment';


global.apiStartDate;
global.apiEndDate;
const FILE_DOWNLOAD_TIME_PERIOD_EXCEEDED_ALERT ="Please specify maximum of 90 days interval for data download";
const API_FILE_FORMAT = 'YYYY-MM-DD';
const UI_FILE_FORMAT = 'MM/DD/YYYY';
const DAYS = 'days';
const FROM_DATE = 'from';
const FILE_DOWNLOAD_TIME_PERIOD = 90;

export default class ReportDownload extends Component {
   
    constructor() {
        super();
        var curDate = new Date();
        var startDateInitialValue = curDate.getMonth() + 1 + "/" + "01" + "/" + curDate.getFullYear();
        var endDateInitialValue = curDate.getMonth() + 1 + "/" + curDate.getDate() + "/" + curDate.getFullYear();
        this.state = {
            isDateTimePickerVisible:false,
            startDate:startDateInitialValue,
            endDate:endDateInitialValue,
            pickerFor:'',
            defaultDate:'',
            minCalendarDate: '',
            maxCalendarDate: ''
        }
        apiStartDate = moment(startDateInitialValue).format(API_FILE_FORMAT);
        apiEndDate = moment(endDateInitialValue).format(API_FILE_FORMAT);
    }

    handleDatePicked = (date) => {
        if(this.state.pickerFor === FROM_DATE) 
        {
            this.setState({ startDate: moment(date).format(UI_FILE_FORMAT) });
            apiStartDate = moment(date).format(API_FILE_FORMAT)
        } 
        else 
        {
            this.setState({ endDate: moment(date).format(UI_FILE_FORMAT) });
            apiEndDate = moment(date).format(API_FILE_FORMAT)
        }
        this.hideDateTimePicker();
    }

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible:false })
    }

    showDateTimePicker = (input, defaultDate, minCalendarDate, maxCalendarDate) => {
        this.setState({ changeYear: true,isDateTimePickerVisible:true, pickerFor:input, defaultDate:defaultDate, minCalendarDate:minCalendarDate, maxCalendarDate:maxCalendarDate})
    }

    downloadReports = () => 
    {
        if(apiStartDate == "")
        {
            Toast.show("Please specify Start Date");
        }
        else if(apiEndDate == "")
        {
            Toast.show("Please specify End Date");
        }
        else if(moment(apiStartDate) > moment())
        {
            Toast.show("Start Date must be less than or equal to current date");
        } 
        else if(apiStartDate > apiEndDate)
        {
            Toast.show("Start Date must be less than or equal to End Date");
        } else  
//        else if(moment(apiEndDate) > moment())
//        {
//            Toast.show("End Date must be less than or equal to current date");
//        }
        {
            if( moment(apiEndDate).diff(moment(apiStartDate), DAYS) <= FILE_DOWNLOAD_TIME_PERIOD)
            {
                this.props.downloadReportAPI(apiStartDate, apiEndDate);
            }
            else
            {
                Toast.showWithGravity(FILE_DOWNLOAD_TIME_PERIOD_EXCEEDED_ALERT, Toast.LONG, Toast.CENTER);
            }
        }
    }

    render() {
        return (
         <Grid style={{ marginBottom:15 }}>                 
            <Row size={2} >
                <Col size={7}>
                    <Text style={{ fontWeight: "bold", paddingTop:10 }}>Start Date</Text>
                </Col>
                <Col size={7}>
                    <Button transparent 
                        onPress={()=>this.showDateTimePicker("from", new Date(this.state.startDate), 0, new Date(this.state.endDate))}>
                        <Text style={{ color:'grey' }}>{ this.state.startDate }</Text>
                        <Icon name = 'calendar' type = 'FontAwesome' style = {{ color: "grey", fontSize:20 }}/>
                    </Button>
                </Col>
            </Row>
            <Row size={2}>
                <Col size={7}>
                    <Text style={{ fontWeight: "bold", paddingTop:10 }}>End Date</Text>
                </Col>
                <Col size={7}>
                    <Button transparent 
                        onPress={()=>this.showDateTimePicker("to", new Date(this.state.endDate), new Date(this.state.startDate), new Date())}>
                        <Text style={{ color:'grey' }}>{ this.state.endDate }</Text>
                        <Icon name = 'calendar' type = 'FontAwesome' style = {{ color: "grey", fontSize:20 }}/>
                    </Button>
                </Col>
            </Row>
            <Row size={10}>
                <Col size={8}>
                    <Text style={{ fontWeight: "bold", paddingTop:10 }}>Download measurement data</Text>
                </Col>
                <Col size={6}>
                    <Button onPress={this.downloadReports} style = {{padding:5, backgroundColor:'#ffffff', elevation:0}}>
                        <Icon name = 'download' type = 'FontAwesome'//borderRadius:0
                            style = {{ color: "#0000b3", fontSize:20 }}/>
                    </Button>
                </Col>
                <Col size={1}>
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this.handleDatePicked}
                        onCancel={this.hideDateTimePicker}
                        date={this.state.defaultDate}
                        minimumDate={this.state.minCalendarDate} 
                        maximumDate = {this.state.maxCalendarDate}
                        mode = {'date'} /> 
                </Col>
            </Row>
         </Grid>
        );
    }
}