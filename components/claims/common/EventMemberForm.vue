<template>
  <div class="event-member-form">
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="4" class="pl-0">
            <v-select
              v-model="form.typeId"
              :items="refsLists.memberTypes"
              label="Тип"
              hide-details="auto"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="ID"
              v-model="form.clientInfo.id"
              outlined
              hide-details="auto"
            >
              <template v-slot:append>
                <v-icon
                  @click="flags.searchClientDialogVisible = true"
                  small
                  color="secondary"
                  class="mt-1"
                  >search</v-icon
                >
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="9" class="pl-0">
            <v-text-field
              label="Фамилия Имя Отчество"
              v-model="form.clientInfo.fullname"
              outlined
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col cols="3" class="pr-0">
            <date-picker
              v-model="form.clientInfo.birthDate"
              label="Дата рождения"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" class="pl-0">
            <v-text-field
              label="Адрес"
              v-model="form.clientInfo.address"
              outlined
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <phone-text-field v-model="form.clientInfo.phone" title="Телефон" />
          </v-col>
          <v-col cols="3" class="pr-0">
            <v-text-field
              label="Email"
              v-model="form.clientInfo.email"
              outlined
              hide-details="auto"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="pl-0 pr-0">
            <v-textarea
              v-model="form.note"
              rows="2"
              outlined
              label="Примечание"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="pl-0">
            <v-btn
              @click.prevent="postEventMember"
              rounded
              depressed
              color="primary"
            >
              Добавить
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <search-client
      dialog-title="Поиск застрахованного"
      v-model="flags.searchClientDialogVisible"
      @close-dialog="flags.searchClientDialogVisible = false"
      @setdata="setClientFromClientSearch"
    ></search-client>
  </div>
</template>

<script>
"use strict";

import { mask } from "vue-the-mask";
import { mapState } from "vuex";

import EventMemberViewModelFactory from "@/../utils/claimEdit/EventMemberViewModelFactory";
import ClientEventMemberFactory from "@/../utils/ClientEventMemberFactory";

import SearchClient from "@/../components/common/SearchClient";
import DatePicker from "@/../components/common/DatePicker";
import PhoneTextField from "@/../components/common/PhoneTextField";

export default {
  name: "EventMemberForm",
  props: {
    claimId: Number,
    claimMember: Object,
    showDialogFlag: Boolean,
  },
  components: { SearchClient, DatePicker, PhoneTextField },
  directives: { mask },

  watch: {
    showDialogFlag: {
      immediate: true,
      handler(val) {
        if (val) {
          this.setDeafaultData();
        }
      },
    },
    claimId: {
      immediate: true,
      handler(val, oldVal) {
        if (val != oldVal) {
          this.setDeafaultData();
        }
      },
    },
    claimMember: {
      immediate: true,
      handler(val, oldVal) {
        if (val?.id != oldVal?.id) {
          this.setDeafaultData();
        }
      },
    },
  },

  data() {
    return {
      flags: {
        searchClientDialogVisible: false,
      },

      form: EventMemberViewModelFactory.create(),
    };
  },

  computed: mapState("refs", ["refsLists"]),

  methods: {
    setDeafaultData() {
      this.form = EventMemberViewModelFactory.createByClaimMember({
        ...this.claimMember,
        claimId: this.claimId,
      });
    },

    /**
     * Сохранение / обновление участника с поднятием события
     */
    async postEventMember() {
      this.$emit("set-data", EventMemberViewModelFactory.create(this.form));
    },

    async setClientFromClientSearch(clientInfo) {
      console.log("setClientFromClientSearch", clientInfo);
      if (clientInfo?.id) {
        this.form.clientInfo = ClientEventMemberFactory.create(clientInfo);
      }
    },
  },
};
</script>
