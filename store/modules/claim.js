import { getMembersByClaim } from "@/../api/api.member";
import { getDocsByClaim } from "@/../api/api.docs";
import { getNotesByClaim } from "@/../api/api.notes";
import { getExpActsByClaim } from "@/../api/api.expacts";
import { getJournalByClaim } from "@/../api/api.journal";
import {
  getClaimsByClient,
  getClaimsByEvent,
  getClaimAndEvent,
  updateClaim,
} from "@/../api/api.claims";
import { updateEvent } from "@/../api/api.event";

import ClaimInfoFactory from "@/../utils/claimEdit/ClaimInfoFactory";
import EventFactory from "@/../utils/claimEdit/EventFactory";
import ClaimMemberFactory from "@/../utils/claimEdit/ClaimMemberFactory";
import FileInfoFactory from "@/../utils/claimEdit/FileInfoFactory";
import ClaimNoteFactory from "@/../utils/claimEdit/ClaimNoteFactory";
import ClaimJournalItemFactory from "@/../utils/claimEdit/ClaimJournalItemFactory";

import DeepEquals from "@/../utils/DeepEquals";

const state = () => ({
  syncFlag: false,

  claimInitialState: "",
  eventInitialState: "",

  claim: ClaimInfoFactory.create(),
  event: EventFactory.create(),
  members: [],
  docs: [],
  notes: [],
  expertiseActs: [],
  journal: [],
  claims: [],
});

const actions = {
  syncData({ commit }, flag) {
    commit("SET_SYNC_FLAG", flag);
  },
  async setClaimAndEvent({ commit, state }, { claim, event }) {
    const promises = [];

    if (claim?.id && state.claimInitialState != DeepEquals.stringify(claim)) {
      promises.push(updateClaim(claim.getAspModel()));
    }
    if (event?.id && state.eventInitialState != DeepEquals.stringify(event)) {
      promises.push(updateEvent(event.getAspModel()));
    }
    if (promises.length) {
      const results = await Promise.all(promises);
      if (results.every((it) => it?.data?.id)) {
        commit("SET_CLAIM", { claim });
        commit("SET_EVENT", { event });

        commit("SET_CLAIM_INITIAL_STATE");
        commit("SET_EVENT_INITIAL_STATE");
      } else {
        return false;
      }
    }
    return true;
  },
  async fetchClaimAndEvent({ commit }, claimId) {
    const response = await getClaimAndEvent(claimId);
    if (response.data) {
      commit("SET_CLAIM", response.data);
      commit("SET_EVENT", response.data);

      commit("SET_CLAIM_INITIAL_STATE");
      commit("SET_EVENT_INITIAL_STATE");
    }
  },

  async fetchEventMembers({ commit }, claimId) {
    const response = await getMembersByClaim(claimId);
    if (response.data) {
      commit("SET_MEMBERS", response.data);
    }
  },

  async fetchClaimDocs({ commit }, claimId) {
    const response = await getDocsByClaim(claimId);
    if (response.data) {
      commit("SET_DOCS", response.data);
    }
  },

  async fetchNotes({ commit }, claimId) {
    const response = await getNotesByClaim(claimId);
    try {
      if (response.data) {
        commit("SET_NOTES", response.data);
      } else {
        throw "request error";
      }
    } catch (error) {}
  },

  async fetchExpertiseActs({ commit }, claimId) {
    try {
      const response = await getExpActsByClaim(claimId);
      if (response.data) {
        commit("SET_EXPERTISE_ACTS", response.data);
      }
    } catch (error) {}
  },

  async fetchJournal({ commit }, claimId) {
    const response = await getJournalByClaim(claimId);
    if (response.data) {
      commit("SET_JOURNAL", response.data);
    }
  },

  async fetchEventClaims({ commit }, { eventId, claimId }) {
    const response = await getClaimsByEvent({ eventId, claimId });
    if (response.data) {
      commit("SET_EVENT_CLAIMS", response.data);
    }
  },

  async fetchClientClaims({ commit }, { clientId, claimIdFilter }) {
    if (clientId) {
      const response = await getClaimsByClient({
        clientId,
        claimIdFilter,
      });
      if (response.data) {
        commit("SET_EVENT_CLAIMS", response.data);
      }
    } else {
      commit("SET_EVENT_CLAIMS", []);
    }
  },
};

const getters = {};

const mutations = {
  SET_SYNC_FLAG(state, flag) {
    state.syncFlag = !!flag;
  },
  SET_CLAIM_INITIAL_STATE(state) {
    state.claimInitialState = DeepEquals.stringify(state.claim);
  },
  SET_EVENT_INITIAL_STATE(state) {
    state.eventInitialState = DeepEquals.stringify(state.event);
  },
  SET_CLAIM(state, { claim }) {
    state.claim = ClaimInfoFactory.create(claim);
  },
  SET_EVENT(state, { event }) {
    state.event = EventFactory.create(event);
  },

  SET_MEMBERS(state, { members }) {
    state.members = ClaimMemberFactory.createArray(members);
  },

  SET_DOCS(state, { docs }) {
    state.docs = FileInfoFactory.createArray(docs);
  },

  SET_NOTES(state, { notes }) {
    state.notes = ClaimNoteFactory.createArray(notes);
  },

  SET_EXPERTISE_ACTS(state, { docs }) {
    state.expertiseActs = FileInfoFactory.createArray(docs);
  },

  SET_JOURNAL(state, { journal }) {
    state.journal = ClaimJournalItemFactory.createArray(journal);
  },

  SET_EVENT_CLAIMS(state, { claims }) {
    state.claims = ClaimInfoFactory.createArray(claims);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
