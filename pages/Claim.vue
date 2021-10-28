<template>
  <base-layout title="Обращения">
    <div class="claims-search">
      <v-row no-gutters>
        <v-col cols="12" class="px-3 pt-0 pb-6">
          <v-btn
            :href="addHref"
            target="_blank"
            rounded
            depressed
            color="primary"
            style="height:24px"
          >
            <v-icon color="white" size="16">add_circle_outline</v-icon>
            <div
              class="pl-1"
              style="font-size: 10px; font-weight:400; letter-spacing: 0.4px;"
            >
              Новое обращение
            </div>
          </v-btn>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="9" class="px-3">
          <search-form
            @search-ends="afterSearch"
            @loadingdata="loading"
            :page-current="pageCurrent"
          ></search-form>
        </v-col>
        <v-col cols="3" class="px-3">
          <user-statistics></user-statistics>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" class="px-3">
          <search-results
            @pagemove="afterMove"
            :items="searchResults.claims"
            :per-page="searchResults.sizePage"
            :total="searchResults.total"
            :page-current="searchResults.curPage"
            :page-count="searchResults.countPage"
            :loading-data="loadingData"
          ></search-results>
        </v-col>
      </v-row>
    </div>
  </base-layout>
</template>
<script>
"use strict";

import BaseLayout from "@/../components/common/BaseLayout";
import SearchForm from "@/../components/claims/index/SearchForm";
import SearchResults from "@/../components/claims/index/SearchResults";
import UserStatistics from "@/../components/claims/index/UserStatistics";

import '../../Content/styles.scss';

export default {
  components: { SearchForm, SearchResults, BaseLayout, UserStatistics },

  data() {
    return {
      searchResults: {
        claims: [],
        total: null,
        sizePage: 20,
        curPage: 1,
      },
      pageCurrent: null,
      loadingData: false,
      addHref: `${OMInsurance.host}${OMInsurance.path}/Claim/Add/`,
    };
  },

  methods: {
    /* обработчик меняющий данные в таблице результатов */
    afterSearch(searchResults) {
      this.searchResults = searchResults;
    },
    /* обработчик меняющий значение при смене страницы таблицы */
    afterMove(pageCurrent) {
      this.pageCurrent = pageCurrent;
    },
    /* обработчик отрабатывающий при загрузке данных в таблицу */
    loading(val) {
      this.loadingData = val;
    },
  },
};
</script>
