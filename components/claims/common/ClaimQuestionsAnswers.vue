<template>
  <div class="claim-questions-answers">
    <v-btn
      @click="flags.qaDialog = true"
      text
      color="primary"
      :class="`qa-btn ${btnClass}`"
      :disabled="disabled"
      >Стандартные вопросы и ответы</v-btn
    >
    <dialog-wrapper
      title="Стандартные вопросы и ответы"
      max-width="700"
      v-model="flags.qaDialog"
    >
      <v-container>
        <v-row no-gutters>
          <v-col cols="12">
            <v-text-field
              label="Поиск"
              v-model="searchQA"
              outlined
              hide-details="auto"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <v-data-table
              @item-selected="select"
              @click:row="
                (item, { select, expand }) => {
                  select();
                  expand();
                }
              "
              :headers="headers"
              :items="refs.qas"
              :search="searchQA"
              :disable-pagination="true"
              :hide-default-header="true"
              :hide-default-footer="true"
              :items-per-page="refs.qas.length"
              :local="'ru-RU'"
              :single-expand="true"
              :single-select="true"
              item-key="question"
              ref="qaDataTable"
              class="qa-data-table"
              show-select
            >
              <template
                #item.data-table-select="{ isSelected, select, expand }"
              >
                <v-simple-checkbox
                  color="primary"
                  class="qa-data-table-select-cbx"
                  :value="isSelected"
                  @input="
                    select($event);
                    expand($event);
                  "
                >
                </v-simple-checkbox>
              </template>
              <template #item.question="{ item, value }">
                <div
                  class="qa-table-question-item blue-grey--text text--darken-2"
                >
                  {{ value }}
                </div>
              </template>
              <template #expanded-item="{ headers, item }">
                <td :colspan="headers.length" class="py-2">
                  {{ item.answer }}
                </td>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" class="mt-6">
            <v-btn
              :disabled="!selectedQuestion && !selectedAnswer"
              @click.stop="set"
              rounded
              depressed
              color="primary"
              >Использовать</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </dialog-wrapper>
  </div>
</template>
<script>
"use strict";
import { getQARefsByRegionAndReason } from "@/../api/api.refs";
import DialogWrapper from "@/../components/common/DialogWrapper.vue";
import { mapActions } from "vuex";

export default {
  name: "ClaimQuestionsAnswers",

  components: { DialogWrapper },

  props: {
    reasonId: Number,
    regionId: Number,
    btnClass: String,
    disabled: Boolean,
  },

  watch: {
    reasonId(val, oldVal) {
      if (val != oldVal) {
        this.loadQARefs(0, val);
      }
    },
  },

  data() {
    return {
      flags: { qaDialog: false },
      searchQA: "",
      /* Выбранные вопрос и ответ */
      selectedQuestion: "",
      selectedAnswer: "",
      headers: [
        { text: "", value: "question", sortable: false },
        /* { text: "", value: "data-table-expand" }, */
      ],
      refs: {
        qas: [],
      },
    };
  },

  methods: {
    ...mapActions(["addErrorNotification"]),

    afterClose() {
      this.$emit("close-dialog");
    },

    /* Выбор такущего вопроса и ответа в окне "Стандартные вопросы и ответы" */
    select({ item, value } = {}) {
      if (value && item?.question && item?.answer) {
        this.selectedQuestion = item.question;
        this.selectedAnswer = item.answer;
      } else {
        this.selectedQuestion = null;
        this.selectedAnswer = null;
      }
    },

    set() {
      let question = this.selectedQuestion;
      let answer = this.selectedAnswer;

      this.$emit("setdata", { question, answer });
      this.close();
    },

    close() {
      this.flags.qaDialog = false;
    },

    clear() {},

    async loadQARefs(regionId, reasonId) {
      try {
        if (reasonId) {
          const { data } = await getQARefsByRegionAndReason(regionId, reasonId);
          if (data) {
            this.refs.qas = data.items || [];
          } else {
            throw response;
          }
        } else {
          this.refs.qas = [];
        }
      } catch (error) {
        console.log("ERROR", error);
        this.addErrorNotification("Ошибка запроса!");
      }
    },
  },
};
</script>
