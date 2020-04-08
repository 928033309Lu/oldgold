import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import road from './modules/road';
import power from './modules/power';
import scheme from './modules/scheme';
import hubCenter from './modules/hubCenter';
import station from './modules/station';
import client from './modules/client';
import favorites from './modules/favorites';
import turbineBase from './modules/turbineBase';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        //
    },
    mutations: {
        //
    },
    actions: {

    },
    modules: {
        app,
        user,
        road,
        power,
        scheme,
        hubCenter,
        station,
        client,
        favorites,
        turbineBase
    }
});

export default store;
