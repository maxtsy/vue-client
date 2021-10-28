<template>
  <div class="claims-search-form">
    <base-expansion-panel
      title="Поиск"
      code="searchClaimsForm"
      :expansionModel="expansionPanels.searchForm"
    >
      <v-form ref="searchClaimsForm">
        <!-- <v-container> -->
        <v-row class="mx-0">
          <v-col cols="2" class="pl-0">
            <v-text-field
              v-model="searchClaim.id"
              label="ID"
              outlined
              v-mask="[
                '###',
                '####',
                '#####',
                '######',
                '#######',
                '########',
                '#########',
                '##########',
                '###########',
              ]"
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <policy-number-text-field label="ЕНП" v-model="searchClaim.upn" />
          </v-col>
          <v-col cols="2">
            <policy-series-text-field label="ВС" v-model="searchClaim.tpn" />
          </v-col>
          <v-col cols="5" class="pr-0">
            <v-text-field
              autocomplete="off"
              @click="flags.searchMemberDialog = true"
              label="Заявитель"
              :value="searchClaim.member && searchClaim.member.fullname"
              outlined
              hide-details="auto"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mx-0">
          <v-col cols="3" class="pl-0">
            <region-autocomplete
              v-model="searchClaim.regionId"
            ></region-autocomplete>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="searchClaim.companyId"
              :items="refsLists.companies"
              label="Компания"
              hide-details="auto"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-select
              v-model="searchClaim.stateId"
              :items="refsLists.claimStates"
              label="Состояние"
              hide-details="auto"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="4" class="pr-0">
            <v-select
              v-model="searchClaim.stageId"
              :items="refsLists.claimStages"
              label="Стадия"
              hide-details="auto"
              outlined
            ></v-select>
          </v-col>
        </v-row>
        <v-row class="mx-0">
          <v-col cols="2" class="pl-0">
            <v-select
              v-model="searchClaim.eventTypeId"
              :items="refsLists.eventForms"
              label="Форма"
              hide-details="auto"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-select
              v-model="searchClaim.recipTypeId"
              :items="refsLists.claimReciptTypes"
              label="Источник"
              hide-details="auto"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="searchClaim.typeId"
              :items="refsLists.claimTypes"
              label="Тип обращения"
              hide-details="auto"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="5" class="pr-0">
            <claim-reasons-dialog
              @reason-selected="(id) => (searchClaim.reasonId = id)"
              @claim-type-selected="(id) => (searchClaim.typeId = id)"
              :claim-type-id="searchClaim.typeId"
              :claim-reason-id="searchClaim.reasonId"
            ></claim-reasons-dialog>
          </v-col>
        </v-row>
        <v-row class="mx-0">
          <v-col cols="2" class="pl-0">
            <date-picker v-model="searchClaim.startDate" label="с" />
          </v-col>
          <v-col cols="2">
            <date-picker v-model="searchClaim.endDate" label="по" />
          </v-col>
          <v-col cols="4">
            <search-user-text-field
              v-model="searchClaim.user"
              :disabled="searchOnlyMyClaims"
            />
          </v-col>
          <v-col cols="4" class="pr-0">
            <v-switch
              v-model="searchOnlyMyClaims"
              inset
              label="Показывать только мои"
              style="margin-top:3px"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row class="mx-0">
          <v-col cols="12" class="pl-0 mt-n2">
            <v-btn
              rounded
              depressed
              type="button"
              color="primary"
              :disabled="!user.id"
              @click="apiSearchClaims"
            >
              <v-icon size="16">search</v-icon> Искать
            </v-btn>
            <v-btn
              @click.prevent="clear"
              rounded
              depressed
              color="secondary"
              class="ml-3"
            >
              Очистить
            </v-btn>
          </v-col>
        </v-row>
        <!-- </v-container> -->
      </v-form>
    </base-expansion-panel>
    <search-client
      :disabled="!user"
      dialog-title="Поиск заявителя"
      v-model="flags.searchMemberDialog"
      @setdata="setMember"
    ></search-client>
  </div>
</template>

<script>
"use strict";
import { searchClaims } from "@/../api/api.claims";
import { datesMixin } from "@/../mixins/datesMixin";
import SearchClaimFactory from "@/../utils/SearchClaimFactory";

import ClaimReasonsDialog from "@/../components/claims/common/ClaimReasonsDialog";
import SearchUserTextField from "@/../components/common/SearchUserTextField";
import SearchClient from "@/../components/common/SearchClient";
import BaseExpansionPanel from "@/../components/common/BaseExpansionPanel";
import RegionAutocomplete from "@/../components/common/RegionAutocomplete";
import PolicyNumberTextField from "@/../components/common/PolicyNumberTextField";
import PolicySeriesTextField from "@/../components/common/PolicySeriesTextField";
import DatePicker from "@/../components/common/DatePicker";

import { mask } from "vue-the-mask";

import { mapState, mapActions } from "vuex";

export default {
  name: "SearchForm",

  mixins: [datesMixin],

  components: {
    ClaimReasonsDialog,
    SearchUserTextField,
    SearchClient,
    BaseExpansionPanel,
    RegionAutocomplete,
    PolicyNumberTextField,
    PolicySeriesTextField,
    DatePicker,
  },

  directives: { mask },

  props: {
    pageCurrent: Number,
  },

  computed: {
    ...mapState("users", ["user"]),
    ...mapState("refs", ["refsLists"]),
  },

  watch: {
    searchOnlyMyClaims: {
      immediate: true,
      handler(nVal, oldVal) {
        if (nVal != oldVal) {
          this.setUser(nVal ? this.user : null);
        }
      },
    },

    pageCurrent: {
      immediate: true,
      handler(nVal, oVal) {
        if (nVal) {
          this.apiSearchClaims();
        }
      },
    },

    user: {
      immediate: true,
      handler(nVal, oldVal) {
        if (nVal?.id != oldVal?.id) {
          this.setUser(nVal);
          this.searchClaim.regionId = nVal?.regionId;
          this.searchClaim.companyId = nVal?.companyId;
        }
      },
    },
  },

  data() {
    return {
      flags: {
        searchMemberDialog: false,
      },
      /* активные панели на странице */
      expansionPanels: {
        searchForm: 0,
      },

      searchClaim: SearchClaimFactory.create(),

      searchResults: {
        claims: [],
        total: null,
        sizePage: 20,
        curPage: 1,
        loadingData: false,
      },

      searchOnlyMyClaims: true,
    };
  },

  methods: {
    ...mapActions(["addSuccessNotification", "addErrorNotification"]),

    //Пока что нет кнопки
    clear() {
      this.searchClaim = SearchClaimFactory.create();
      this.setUser(this.user);
      // устанавливаем регион + компания
      this.searchClaim.regionId = this.user?.regionId;
      this.searchClaim.companyId = this.user?.companyId;
      this.searchOnlyMyClaims = true;
    },

    /**
     * Отсылает модель поиска на сервер и получаем список претензий
     */
    async apiSearchClaims() {
      this.$emit("loadingdata", true);
      try {
        let searchCriteria = this.searchClaim.getAspModel(
          this.pageCurrent || 1
        );

        const { data } = await searchClaims(searchCriteria);

        if (data) {
          const { items, totalCount, pageCount, pageNumber } = data;
          this.searchResults.claims = items;

          this.searchResults.total = totalCount;
          this.searchResults.countPage = pageCount;
          this.searchResults.curPage = pageNumber;

          this.$emit("search-ends", this.searchResults);
        } else {
          throw "bad request";
        }
        return data;
      } catch (_err) {
        this.addErrorNotification("Ошибка выполнения запроса!");
      } finally {
        this.$emit("loadingdata", false);
      }
    },

    /* Устанавливает пользователя из поиска пользователей */
    setUser(data) {
      this.searchClaim.user = data?.id ? { ...data } : null;
    },

    /* Устанавливает заявителя из поиска клиентов */
    setMember(member) {
      this.searchClaim.member = member?.id ? { ...member } : null;
    },
  },
};
</script>
