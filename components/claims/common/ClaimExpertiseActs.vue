<template>
  <div class="claimscommon-claim-expertise-acts">
    <base-expansion-panel
      title="Акты экспертиз"
      code="claimExpertiseActs"
      :expansionModel="expansionPanels.acts"
      class="claim-exp-acts"
    >
      <v-data-table
        :headers="headers"
        :items="expertiseActs"
        hide-default-footer
        class="claim-exp-acts-results"
      >
        <template #item.active="{ item }">
          {{ item.active ? "Да" : "Нет" }}
        </template>
        <template #item.createDate="{ item }">
          {{ item.createDate | dateFormat }}
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
  name: "ClaimExpertiseActs",
  
  components: { BaseExpansionPanel },

  data() {
    return {
      expansionPanels: {
        acts: 0,
      },
      headers: [
        { text: "Документ", value: "deacription", sortable: false },
        { text: "Активный", value: "active", sortable: false },
        { text: "Дата создания", value: "createDate", sortable: false },
      ],

      selectedId: undefined,
    };
  },

  computed: mapState("claim", ["expertiseActs"]),

  filters: {
    dateFormat(value) {
      return value?.split(" ")[0];
    },
  },
};
</script>
