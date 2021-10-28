<template>
  <div class="claimscommon-claim-journal">
    <base-expansion-panel
      title="Журнал"
      code="claimJournal"
      :expansionModel="expansionPanels.journal"
      class="claim-journal"
    >
      <v-data-table
        :headers="headers"
        :items="journal"
        item-key="eventDate"
        hide-default-footer
        class="claim-journal-results"
      >
        <template #item.eventDate="{ item }">
          {{ item.eventDate | dateFormat }}
        </template>
      </v-data-table>
    </base-expansion-panel>
  </div>
</template>

<script>
"use strict";

import BaseExpansionPanel from "@/../components/common/BaseExpansionPanel";
import { mapState } from "vuex";

export default {
  name: "claim-journal",

  components: { BaseExpansionPanel },

  filters: {
    dateFormat(value) {
      const [date, time] = value?.split(" ") || [];
      if (date && time) {
        const [hh, mm] = time.split(":");
        return `${date} ${hh}:${mm}`;
      }
      return null;
    },
  },

  data() {
    return {
      expansionPanels: {
        journal: 0,
      },
      headers: [
        { text: "Дата", value: "eventDate" },
        { text: "Тип сообщения", sortable: false, value: "typeName" },
        { text: "Текст сообщения", sortable: false, value: "text" },
        { text: "Пользователь", value: "userName" },
      ],
    };
  },

  computed: mapState("claim", ["journal"]),
};
</script>
