
import { Client, Configuration } from 'bugsnag-react-native';
import * as constants from './Constants';

export function runBugsNag() {
    const configuration = new Configuration();
    configuration.apiKey = constants.BUGSNAG_KEY;
    configuration.releaseStage = constants.RELEASE_STAGE;
    const bugsnag = new Client(configuration);
    return bugsnag;
}