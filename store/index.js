"use strict";

import Vue from "vue";
import Vuex from "vuex";
import { createLogger } from "vuex";

import notifications from "@/../store/modules/notifications";
import audio from "@/../store/modules/audio";
import helpmessages from "@/../store/modules/helpmessages";
import users from "@/../store/modules/users";
import refs from "@/../store/modules/refs";
import claim from "@/../store/modules/claim";
import agree from "@/../store/modules/agree";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: { notifications, audio, helpmessages, users, refs, claim, agree },
  plugins: debug ? [createLogger()] : [],
});
