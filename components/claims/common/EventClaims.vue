<template>
  <div class="claimscommon-event-claims">
    <base-expansion-panel
      title="Все обращения"
      code="eventClaims"
      :expansionModel="expansionPanels.claims"
      class="event-claims"
    >
      <v-data-table
        :headers="headers"
        :items="claims"
        hide-default-footer
        :items-per-page="1000"
        class="event-claims-results"
      >
        <template #item.id="{ item }">
          <a
            :href="itemHref + item.id"
            target="_blank"
            class="text-decoration-none"
          >
            {{ item.id }}
          </a>
        </template>
        <template #item.occurDate="{ item }">
          {{ item.occurDate | dateFormat }}
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
  name: "EventClaims",

  components: { BaseExpansionPanel },

  data() {
    return {
      expansionPanels: {
        claims: 0,
      },
      headers: [
        { text: "#", value: "id", sortable: false },
        { text: "Дата создания", value: "occurDate", sortable: false },
        { text: "Тип", value: "type.name", sortable: false },
        { text: "Состояние", value: "state.name", sortable: false },
        { text: "Id события", value: "eventId", sortable: false },
      ],
      itemHref: `${OMInsurance.host}${OMInsurance.path}/Claim/Edit/`,
    };
  },

  computed: mapState("claim", ["claims"]),

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
};
</script>
