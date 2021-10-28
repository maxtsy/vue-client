<template>
  <base-layout title="Обращения" :subtitle="title" :isReadOnly="isReadOnly">
    <div class="claim-form">
      <v-row no-gutters>
        <v-col cols="9" class="px-3">
          <claim-and-event :isReadOnly="isReadOnly"></claim-and-event>

          <event-members
            :claim-id="claim.id"
            :isReadOnly="isReadOnly"
            :show-member-dialog="flags.showMemberDialog"
            @close-member-dialog="flags.showMemberDialog = false"
            class="mt-6"
          ></event-members>

          <claim-docs
            :claim-id="claim.id"
            :isReadOnly="isReadOnly"
            :show-doc-dialog="flags.showDocDialog"
            @close-doc-dialog="flags.showDocDialog = false"
            class="mt-6"
          ></claim-docs>

          <claim-notes
            :claim-id="claim.id"
            :isReadOnly="isReadOnly"
            :show-note-dialog="flags.showNoteDialog"
            v-if="isClaimExtInfo"
            @close-note-dialog="flags.showNoteDialog = false"
            class="mt-6"
          ></claim-notes>

          <claim-expertise-acts
            :claim-id="claim.id"
            :isReadOnly="isReadOnly"
            v-if="isClaimExtInfo"
            class="mt-6"
          ></claim-expertise-acts>

          <claim-journal
            :claim-id="claim.id"
            :isReadOnly="isReadOnly"
            v-if="isClaimExtInfo"
            class="mt-6"
          ></claim-journal>

          <event-claims class="mt-6"></event-claims>
        </v-col>
        <v-col cols="3" class="px-3">
          <v-row no-gutters class="py-3">
            <v-col cols="12">
              <sticky :stickyTop="76">
                <div class="claim-menu">
                  <v-list class="py-0 bg-none">
                    <v-list-item
                      v-for="item in menu.filter((it) => it.visible)"
                      :key="item.title"
                      @click.native.stop="scrollTo(item.control)"
                    >
                      <v-list-item-content>
                        <v-list-item-title
                          class="blue-grey--text text--darken-4 font-weight-medium"
                          style="letter-spacing: 0.4px"
                          >{{ item.title }}</v-list-item-title
                        >
                      </v-list-item-content>
                      <v-list-item-action class="my-2" v-if="item.action">
                        <v-btn
                          small
                          icon
                          @click.native.stop="item.action"
                          :disabled="isReadOnly"
                        >
                          <v-icon small color="secondary">
                            add_circle_outline
                          </v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </div>
                <v-row no-gutters>
                  <v-col cols="12" class="py-4">
                    <v-btn
                      :disabled="isReadOnly"
                      @click.native.stop="save"
                      rounded
                      depressed
                      class="white"
                      color="secondary"
                    >
                      <v-icon small class="mr-1">save</v-icon>Сохранить
                      изменения
                    </v-btn>
                  </v-col>
                </v-row>
              </sticky>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </base-layout>
</template>

<script>
// TODO: Проблема с остальными нераскрытыми панелями в дизайне
// TODO: Получать данные ивена в этом же компоненте
"use strict";

import ClaimAndEvent from "@/../components/claims/edit/ClaimAndEvent";

/* маска для полей */
import { mask } from "vue-the-mask";

import BaseLayout from "@/../components/common/BaseLayout";
import ClaimPrintButton from "@/../components/ClaimPrintButton";
import ClaimStateChangeButton from "@/../components/claims/edit/ClaimStateChangeButton";
import Sticky from "@/../components/common/Sticky";

import EventMembers from "@/../components/claims/common/EventMembers";
import ClaimDocs from "@/../components/claims/common/ClaimDocs";
import ClaimNotes from "@/../components/claims/common/ClaimNotes";
import ClaimExpertiseActs from "@/../components/claims/common/ClaimExpertiseActs";
import ClaimJournal from "@/../components/claims/common/ClaimJournal";
import EventClaims from "@/../components/claims/common/EventClaims";

import { mapActions, mapState } from "vuex";

export default {
  name: "ClaimForm",
  directives: { mask },
  components: {
    BaseLayout,
    ClaimAndEvent,
    EventMembers,
    ClaimDocs,
    ClaimNotes,
    ClaimExpertiseActs,
    ClaimJournal,
    EventClaims,
    ClaimPrintButton,
    Sticky,
    ClaimStateChangeButton,
  },

  data() {
    return {
      claimId: null,
      expansionPanels: {
        common: 0,
        claim: 0,

        claims: 0,
      },

      flags: {
        showMemberDialog: false,
        showDocDialog: false,
        showNoteDialog: false,
      },
    };
  },
  computed: {
    ...mapState("claim", [
      "event",
      "claim",
      "members",
      "docs",
      "notes",
      "expertiseActs",
      "journal",
      "claims",
    ]),
    ...mapState("users", ["user"]),

    isClaimExtInfo() {
      return this.user?.isClaimExtInfo;
    },

    menu() {
      return [
        {
          title: "Обращение",
          control: "claim-and-event",
          visible: true,
        },
        {
          title: `Участники события (${this.members?.length})`,
          control: "event-members",
          action: () => (this.flags.showMemberDialog = true),
          visible: true,
        },
        {
          title: `Документы (${this.docs?.length})`,
          control: "claim-docs",
          action: () => (this.flags.showDocDialog = true),
          visible: true,
        },
        {
          title: `Заметки (${this.notes?.length})`,
          control: "claim-notes",
          action: () => (this.flags.showNoteDialog = true),
          visible: this.isClaimExtInfo,
        },
        {
          title: `Акты экспертиз (${this.expertiseActs?.length})`,
          control: "claim-exp-acts",
          visible: this.isClaimExtInfo,
        },
        {
          title: `Журнал (${this.journal?.length})`,
          control: "claim-journal",
          visible: this.isClaimExtInfo,
        },
        {
          title: `Все обращения клиента (${this.claims?.length})`,
          control: "event-claims",
          visible: true,
        },
      ];
    },

    isReadOnly() {
      return !this.claim.id || !this.event.id || this.claim.stateId === 21;
    },

    title() {
      const name = this.claim?.id ? ` № ${this.claim.id}` : "";
      return `Редактирование обращения${name}`;
    },
    clientId() {
      return this.members.find((it) => it.type?.code == "DECLARANT")?.clientId;
    },
  },

  watch: {
    title(val, oldVal) {
      if (val && val != oldVal) {
        document.title = val;
      }
    },

    clientId(val) {
      this.fetchClientClaims({ clientId: val, claimIdFilter: this.claimId });
    },

    isClaimExtInfo(value, oldValue) {
      if (value && value != oldValue) {
        this.fetchJournal(this.claimId);
        this.fetchExpertiseActs(this.claimId);
        this.fetchNotes(this.claimId);
      }
    },
  },

  methods: {
    ...mapActions(["addErrorNotification"]),
    ...mapActions("claim", [
      "fetchClaimAndEvent",
      "fetchEventMembers",
      "fetchClaimDocs",
      "fetchNotes",
      "fetchExpertiseActs",
      "fetchJournal",
      "fetchClientClaims",
      "syncData",
    ]),

    scrollTo(cls) {
      if (cls) {
        const elms = document.getElementsByClassName(cls);
        if (elms.length == 1) {
          elms[0].scrollIntoView({
            block: "center",
            behavior: "smooth",
            inline: "start",
          });
        }
      }
    },

    save() {
      return this.syncData(true);
    },
  },
  async created() {
    try {
      const claimId = window.OMInsurance.claimId;

      this.claimId = claimId;
      this.fetchClaimAndEvent(claimId);
      this.fetchEventMembers(claimId);
      this.fetchClaimDocs(claimId);
    } catch {
      this.addErrorNotification("Ошибка загрузки данных!");
    }
  },
};
</script>
