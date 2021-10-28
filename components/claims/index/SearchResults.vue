<template>
  <div class="claims-search-results">
    <base-expansion-panel
      title="Обращения"
      code="searchClaimsResults"
      :expansionModel="expansionPanels.searchResults"
      class="mt-6"
    >
      <template #header-buttons>
        <v-btn
          @click.native.stop="add"
          rounded
          depressed
          small
          type="button"
          color="primary"
          :href="addHref"
          target="_blank"
          style="height:24px"
        >
          <v-icon color="white" size="16">add_circle_outline</v-icon>
          <div
            class="pl-1"
            style="font-size: 10px; font-weight:400; letter-spacing: 0.4px;"
          >
            Добавить
          </div>
        </v-btn>
      </template>
      <v-data-table
        :headers="headers"
        :items="items"
        :item-class="(item) => item.id + ''"
        :items-per-page="paginationPerPage"
        :server-items-length="total"
        :locale="'ru-RU'"
        @page-count="paginationPageCount = $event"
        class="search-results"
        :loading="loadingData"
        :hide-default-footer="true"
        loading-text="Загрузка... Пожалуйста подождите"
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
        <template #item.audioRecordBodyId="{ item }">
          <audio-wrapper
            v-if="item.audioRecordBodyId"
            :src="item.audioRecordBodyId | fileById"
          />
        </template>
      </v-data-table>
      <v-row v-show="paginationPageCount > 0">
        <v-col cols="4">
          <v-pagination
            v-model="paginationPageCurrent"
            :length="paginationPageCount"
            :total-visible="7"
            @input="pageMove"
          ></v-pagination>
        </v-col>
      </v-row>
    </base-expansion-panel>
  </div>
</template>

<script>
"use strict";

import BaseExpansionPanel from "@/../components/common/BaseExpansionPanel";
import AudioWrapper from "@/../components/common/AudioWrapper.vue";

export default {
  name: "SearchResults",

  components: { BaseExpansionPanel, AudioWrapper },

  filters: {
    fileById(id) {
      if (id) {
        return `${OMInsurance.host}${OMInsurance.path}/File/FileById?filename=${id}`;
      }
    },
    dateFormat(value) {
      const [date, time] = value?.split(" ") || [];
      if (date && time) {
        const [hh, mm] = time.split(":");
        return `${date}`; /* `${date} ${hh}:${mm}` */
      }
      return null;
    },
  },

  props: {
    items: Array,
    perPage: Number,
    total: Number,
    pageCurrent: Number,
    pageCount: Number,
    loadingData: Boolean,
  },

  data() {
    return {
      loading: false,

      expansionPanels: {
        searchResults: 0,
      },
      headers: [
        {
          text: "ID",
          align: "start",
          value: "id",
          width: 69,
        },
        { text: "Источник", value: "recipType.name", width: 120 },
        { text: "Тип", value: "type.name", width: 126 },
        { text: "Форма", value: "evntType.name", width: 98 },
        { text: "Состояние", value: "state.name", width: 122 },
        { text: "Стадия", value: "stage.name", width: 150 },
        { text: "Причина", value: "reason.name", width: 248 },
        { text: "Заведено", value: "occurDate", width: 116 },
        { text: "Полис", value: "doc.client", width: 248 },
        {
          text: "Прослушать запись",
          sortable: false,
          value: "audioRecordBodyId",
          width: 320,
        },
      ],
      paginationPageCurrent: this.pageCurrent,
      paginationPageCount: this.pageCount,
      paginationTotal: this.total,
      paginationPerPage: this.perPage,
      rowClass: "test-class", //({item}) => this.getTableItemClass(item)
      itemHref: `${OMInsurance.host}${OMInsurance.path}/Claim/Edit/`,
      addHref: `${OMInsurance.host}${OMInsurance.path}/Claim/Add/`,
    };
  },

  computed: {
    getPageCurrent() {
      return this.pageCurrent;
    },
    getPageCount() {
      return this.pageCount;
    },
  },

  methods: {
    add() {},
    pageMove(i) {
      this.$emit("pagemove", i);
    },
    getTableItemClass() {
      return "row-item-class";
    },
  },
};
</script>
