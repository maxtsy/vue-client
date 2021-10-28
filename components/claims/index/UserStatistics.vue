<template>
  <div class="claims-user-statistics">
    <base-expansion-panel
      title="Статистика"
      code="userStatistics"
      :expansionModel="expansionPanels.userStatistics"
    >
      <v-container no-gutters>
        <v-row>
          <v-col cols="12" class="pt-0">
            <div
              active
              class="blue-dark--text"
              style="font-weight: 500; line-height: 16px; letter-spacing: 0.15px;"
            >
              Состояние
            </div>
          </v-col>
        </v-row>
        <user-statistics-item-row
          name="Открыто"
          color="#F44336"
          :value="numberByStateOpened"
          :maxValue="maxOfStates"
          :nameWidthCols="4"
        ></user-statistics-item-row>
        <user-statistics-item-row
          name="Закрыто"
          color="#2BC28D"
          :value="numberByStateClosed"
          :maxValue="maxOfStates"
          :nameWidthCols="4"
        ></user-statistics-item-row>
        <user-statistics-item-row
          name="Продлено"
          color="#FFC107"
          :value="numberByStateProlong"
          :maxValue="maxOfStates"
          :nameWidthCols="4"
        ></user-statistics-item-row>
      </v-container>
      <v-divider class="my-2"></v-divider>
      <v-container no-gutters>
        <v-row>
          <v-col cols="12" class="pt-0">
            <div
              active
              class="blue-dark--text"
              style="font-weight: 500; line-height: 16px; letter-spacing: 0.15px;"
            >
              Тип
            </div>
          </v-col>
        </v-row>
        <user-statistics-item-row
          name="Заявление"
          color="#2BC28D"
          :value="numberByTypeStatement"
          :maxValue="maxOfTypes"
        ></user-statistics-item-row>
        <user-statistics-item-row
          name="Консультация"
          color="#1A7555"
          :value="numberByTypeConsult"
          :maxValue="maxOfTypes"
        ></user-statistics-item-row>
        <user-statistics-item-row
          name="Предложение"
          color="#FFC107"
          :value="numberByTypeProposal"
          :maxValue="maxOfTypes"
        ></user-statistics-item-row>
      </v-container>
    </base-expansion-panel>
  </div>
</template>
<script>
"use strict";

import { getStatisticsForClaims } from "@/../api/api.claims";
import UserStatisticsItemRow from "@/../components/claims/index/UserStatisticsItemRow";
import BaseExpansionPanel from "@/../components/common/BaseExpansionPanel";

export default {
  name: "user-statistics",

  components: { UserStatisticsItemRow, BaseExpansionPanel },

  filters: {
    numberSplitFilter(value) {
      return value
        .toString()
        .split("")
        .reverse()
        .map((it, i) => (i % 3 == 2 ? ` ${it}` : it))
        .reverse()
        .join("");
    },
  },

  data() {
    return {
      expansionPanels: { userStatistics: 0 },
      numberByTypeConsult: 0,
      numberByTypeStatement: 0,
      numberByTypeProposal: 0,

      numberByStateOpened: 0,
      numberByStateClosed: 0,
      numberByStateProlong: 0,
    };
  },

  computed: {
    maxOfTypes() {
      return Math.max(
        this.numberByTypeConsult,
        this.numberByTypeStatement,
        this.numberByTypeProposal
      );
    },
    maxOfStates() {
      return Math.max(
        this.numberByStateOpened,
        this.numberByStateClosed,
        this.numberByStateProlong
      );
    },
  },

  methods: {
    helpClick() {},

    async loadStatistics() {
      const { data } = await getStatisticsForClaims();
      if (data) {
        const { statistics } = data;

        this.numberByTypeConsult = statistics.numberByTypeConsult || 0;
        this.numberByTypeStatement = statistics.numberByTypeStatement || 0;
        this.numberByTypeProposal = statistics.numberByTypeProposal || 0;

        this.numberByStateOpened = statistics.numberByStateOpened || 0;
        this.numberByStateClosed = statistics.numberByStateClosed || 0;
        this.numberByStateProlong = statistics.numberByStateProlong || 0;
      }
    },
  },

  created() {
    this.loadStatistics();
  },
};
</script>
