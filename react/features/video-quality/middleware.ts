import { CONFERENCE_JOINED } from '../base/conference/actionTypes';
import { SET_CONFIG } from '../base/config/actionTypes';
import MiddlewareRegistry from '../base/redux/MiddlewareRegistry';

import { setPreferredVideoQuality } from './actions';
import logger from './logger';

import './subscriber';

/**
 * Implements the middleware of the feature video-quality.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(({ dispatch, getState }) => next => action => {
    const result = next(action);

    switch (action.type) {
    case CONFERENCE_JOINED: {
        if (navigator.product === 'ReactNative') {
            const resolution = 1080; //const { resolution } = getState()['features/base/config']; //ADDED

            if (typeof resolution !== 'undefined') {
                dispatch(setPreferredVideoQuality(Number.parseInt(`${resolution}`, 10)));
                logger.info(`Configured preferred receiver video frame height to: ${resolution}`);
            }
        }
        break;
    }
    case SET_CONFIG: {
        const state = getState();
        const { videoQuality = {} } = state['features/base/config'];
        const { persistedPrefferedVideoQuality } = state['features/video-quality-persistent-storage'];

        if (videoQuality.persist && typeof persistedPrefferedVideoQuality !== 'undefined') {
            const resolution = 1080; //const { resolution } = getState()['features/base/config']; //ADDED
            dispatch(setPreferredVideoQuality(resolution));
        }
        else { // ADDED
            // Enforce specific resolution settings on configuration set
            const resolution = 1080;
            dispatch(setPreferredVideoQuality(resolution));
            logger.info(`Configured preferred receiver video frame height to: ${resolution}`);
        }

        break;
    }
    }

    return result;
});
