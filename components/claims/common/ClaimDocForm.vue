<template>
  <div class="claim-doc-form">
    <v-form ref="claimDocForm" lazy-validation>
      <v-container>
        <v-row>
          <v-col cols="12" class="pl-0 pr-0">
            <v-select
              v-model="form.docTypeId"
              :items="refsLists.docTypes"
              :rules="[requiredRule]"
              label="Тип документа"
              hide-details="auto"
              outlined
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="pl-0 pr-0">
            <v-textarea
              v-model="form.description"
              rows="1"
              outlined
              label="Примечание"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="pl-0 pr-0">
            <v-file-input
              v-model="form.file"
              :rules="[requiredRule]"
              label="Добавить файл"
              outlined
              dense
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="pl-0 pr-0">
            <v-btn
              :disabled="!form.file || !form.docTypeId"
              @click.prevent="saveDoc"
              rounded
              depressed
              color="primary"
            >
              Прикрепить
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>
<script>
// TODO: После Примечания есть отступ под оишбки, у обычных полей он скрыт - нужно и этот скрыть
"use strict";

import { validationRulesMixin } from "@/../mixins/validationRulesMixin";
import FileInfoFactory from "@/../utils/claimEdit/FileInfoFactory";
import UserFactory from "@/../utils/UserFactory";

import { mapActions, mapState } from "vuex";

export default {
  name: "ClaimDocForm",

  mixins: [validationRulesMixin],

  props: {
    claimId: Number,
    docId: Number,
    showDialogFlag: Boolean,
  },

  computed: {
    ...mapState("users", ["user"]),
    ...mapState("refs", ["refsLists"]),
  },

  watch: {
    showDialogFlag: {
      immediate: true,
      handler(val, oldVal) {
        if (val && val !== oldVal) {
          this.setDefaultData();
        }
      },
    },
    user: {
      immediate: true,
      handler(value, oldValue) {
        if (value?.id != oldValue?.id) {
          this.setDefaultData();
        }
      },
    },
  },

  data() {
    return {
      form: FileInfoFactory.create(),
    };
  },
  methods: {
    ...mapActions(["addSuccessNotification", "addErrorNotification"]),

    setDefaultData() {
      const { user, claimId } = this;
      this.form = FileInfoFactory.create({
        user: UserFactory.create(user),
        claimId,
      });
    },

    async saveDoc() {
      if (this.$refs.claimDocForm.validate()) {
        this.$emit("setdata", this.form);
      }
    },
  },
};
</script>
