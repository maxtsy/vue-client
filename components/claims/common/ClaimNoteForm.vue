<template scoped>
  <div class="claim-note-form">
    <v-form>
      <v-container>
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
          <v-col cols="12" class="pl-0 pr-0">
            <v-btn
              :disabled="!form.note"
              @click.prevent="saveNote"
              rounded
              depressed
              color="primary"
            >
              Сохранить
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
"use strict";

import { mapActions } from "vuex";
import ClaimNoteFactory from "@/../utils/claimEdit/ClaimNoteFactory";

export default {
  name: "ClaimNoteForm",

  props: {
    claimId: Number,
  },

  watch: {
    claimId: {
      immediate: true,
      handler(value, oldValue) {
        if (value != oldValue) {
          this.setDefaultData();
        }
      },
    },
  },

  data() {
    return {
      form: ClaimNoteFactory.create(),
    };
  },

  methods: {
    ...mapActions(["addSuccessNotification", "addErrorNotification"]),

    setDefaultData() {
      const { claimId } = this;
      this.form = ClaimNoteFactory.create({ claimId });
    },

    async saveNote() {
      this.$emit("set-data", ClaimNoteFactory.create(this.form));
    },
  },
};
</script>
