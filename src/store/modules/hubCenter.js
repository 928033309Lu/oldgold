
import { getHubCenterByClickFan, getHubCenterByClickMast, getTowerInfoWinPos } from '../mutations';
const moduleModalPages = {
    state: {
        hubCenter: {},
        mastHubCenter: {},
        towerHubCenter: {}
    },
    mutations: {
        [getHubCenterByClickFan] (state, hubCenter) {
            state.hubCenter = hubCenter;
        },
        [getHubCenterByClickMast] (state, mastHubCenter) {
            state.mastHubCenter = mastHubCenter;
        },
        [getTowerInfoWinPos] (state, towerHubCenter) {
            state.towerHubCenter = towerHubCenter;
        }
    },
    actions: {
    },
    getters: {}
};

export default moduleModalPages;
