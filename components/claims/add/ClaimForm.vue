<template>
  <div class="claimadd-claim-form">
    <v-row no-gutters>
      <v-col cols="9" class="px-3">
        <v-form ref="mainClaimAddForm" lazy-validation>
          <base-expansion-panel
            title="Общая информация"
            code="claimCommon"
            :expansionModel="expansionPanels.common"
          >
            <!-- <v-container> -->
            <v-row class="mx-0">
              <v-col cols="3" class="pl-0">
                <v-select
                  v-model="form.companyId"
                  :items="refsLists.activeCompanies"
                  :rules="[requiredRule]"
                  label="Компания"
                  :disabled="!(user && user.id)"
                  hide-details="auto"
                  outlined
                />
              </v-col>
              <v-col cols="4">
                <region-autocomplete
                  v-model="form.regionId"
                  :rules="[requiredRule]"
                  :disabled="!(user && user.id)"
                />
              </v-col>
            </v-row>

            <v-row class="mx-0">
              <v-col cols="2" class="pl-0">
                <v-select
                  v-model="form.eventId"
                  :items="refsLists.eventForms"
                  :rules="[requiredRule]"
                  label="Форма"
                  :disabled="!(user && user.id)"
                  hide-details="auto"
                  outlined
                />
              </v-col>
              <v-col cols="2">
                <v-select
                  v-model="form.reciptTypeId"
                  :items="refsLists.claimReciptTypes"
                  :rules="[requiredRule]"
                  label="Источник"
                  :disabled="!(user && user.id)"
                  hide-details="auto"
                  outlined
                />
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="form.typeId"
                  :items="refsLists.claimTypes"
                  :rules="[requiredRule]"
                  label="Тип обращения"
                  :disabled="!(user && user.id)"
                  hide-details="auto"
                  outlined
                />
              </v-col>
              <v-col cols="5" class="pr-0">
                <claim-reasons-dialog
                  @reason-selected="(id) => (form.reasonId = id)"
                  @claim-type-selected="(id) => (form.typeId = id)"
                  :disabled="!(user && user.id)"
                  :claim-type-id="form.typeId"
                  :claim-reason-id="form.reasonId"
                  :rules="[requiredRule]"
                  :onlyActuals="true"
                />
              </v-col>
            </v-row>

            <v-row class="mx-0 mt-n2">
              <v-col cols="12" class="px-0" style="position: relative">
                <claim-questions-answers
                  :reason-id="form.reasonId"
                  :region-id="form.regionId"
                  @setdata="setQuestionsAnswers"
                />
                <v-tabs v-model="selectedTabAnswerQuestion" height="34">
                  <v-tab class="qa-tab" href="#question">Вопрос</v-tab>
                  <v-tab class="qa-tab" href="#answer">Ответ</v-tab>
                  <v-tab class="qa-tab" href="#note">Заметка</v-tab>
                </v-tabs>
                <v-tabs-items v-model="selectedTabAnswerQuestion">
                  <v-tab-item class="mt-3" value="question">
                    <v-textarea
                      v-model="form.question"
                      :rules="[requiredRule]"
                      rows="3"
                      outlined
                      label="Вопрос"
                    />
                  </v-tab-item>
                  <v-tab-item class="mt-6" value="answer" eager>
                    <v-textarea
                      v-model="form.answer"
                      rows="3"
                      outlined
                      label="Ответ"
                    />
                  </v-tab-item>
                  <v-tab-item class="mt-6" value="note">
                    <v-textarea
                      v-model="form.note"
                      rows="3"
                      outlined
                      label="Заметка"
                    />
                  </v-tab-item>
                </v-tabs-items>
              </v-col>
            </v-row>
            <!-- </v-container> -->
          </base-expansion-panel>

          <base-expansion-panel
            title="Информация о полисе"
            code="claimPolicy"
            :expansionModel="expansionPanels.policy"
            class="mt-6"
          >
            <template #title>
              Информация о полисе
              <template v-if="agreeHref"
                >(<a
                  @click.stop=""
                  :href="agreeHref"
                  target="_blank"
                  class="text-uppercase text-decoration-underline"
                  >Полис</a
                >)</template
              >
            </template>
            <v-row class="mx-0">
              <v-col cols="7" class="pl-0">
                <v-text-field
                  label="Полис"
                  :value="policyInfo"
                  :disabled="loadingAgree"
                  outlined
                  hide-details="auto"
                >
                  <template #append>
                    <v-icon
                      @click="flags.searchAgreeDialogVisible = true"
                      small
                      color="secondary"
                      class="mt-1"
                      >search</v-icon
                    >
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="2">
                <policy-series-text-field
                  label="ВС"
                  v-model="form.tpn"
                  :disabled="loadingAgree"
                />
              </v-col>
              <v-col cols="3" class="pr-0">
                <policy-number-text-field
                  label="ЕНП"
                  v-model="form.enp"
                  :disabled="loadingAgree"
                />
              </v-col>
            </v-row>
          </base-expansion-panel>

          <base-expansion-panel
            title="Информация об участнике"
            code="claimMembers"
            :expansionModel="expansionPanels.members"
            class="mt-6"
          >
            <!-- Застрахованный -->
            <v-row class="mx-0">
              <v-col cols="12" class="py-0 pl-0">
                <span class="subtitle-2">Застрахованный</span>
              </v-col>
            </v-row>
            <v-row class="mx-0">
              <v-col cols="12" class="py-0 pl-0">
                <v-switch
                  v-model="switchApplicantForClient"
                  @change="setApplicantByClient"
                  :disabled="!form.client.id || loadingAgree"
                  inset
                  label="Является заявителем"
                  class="mt-1"
                />
              </v-col>
            </v-row>
            <v-row class="mx-0">
              <v-col cols="2" class="pl-0 pt-0">
                <v-text-field
                  label="ID"
                  v-model="form.client.id"
                  :disabled="loadingAgree"
                  outlined
                  hide-details="auto"
                >
                  <template #append>
                    <v-icon
                      @click="flags.searchClientDialogVisible = true"
                      small
                      color="secondary"
                      class="mt-1"
                    >
                      search
                    </v-icon>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="6" class="pt-0">
                <v-text-field
                  label="Фамилия Имя Отчество"
                  v-model="form.client.fullname"
                  :disabled="loadingAgree"
                  outlined
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="2" class="pr-0 pt-0">
                <date-picker v-model="form.client.birthDate" label="Дата" />
              </v-col>
            </v-row>
            <v-row class="mx-0">
              <v-col cols="5" class="pl-0">
                <v-text-field
                  label="Адрес"
                  :disabled="loadingAgree"
                  v-model="form.client.address"
                  outlined
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="3">
                <phone-text-field
                  v-model="form.client.phoneMobile"
                  title="Моб. телефон"
                  :disabled="loadingAgree"
                />
              </v-col>
              <v-col cols="3" class="pr-0">
                <v-text-field
                  label="Email"
                  v-model="form.client.email"
                  :disabled="loadingAgree"
                  outlined
                  hide-details="auto"
                />
              </v-col>
            </v-row>

            <!-- Представитель -->
            <v-row class="mx-0">
              <v-col cols="12" class="pb-0 pl-0">
                <span class="subtitle-2">Представитель</span>
              </v-col>
            </v-row>
            <v-row class="mx-0">
              <v-col cols="12" class="py-0 pl-0">
                <v-switch
                  v-model="switchApplicantForRepresentative"
                  @change="setApplicantByRepresentative"
                  :disabled="!form.representative.id || loadingAgree"
                  inset
                  label="Является заявителем"
                  class="mt-1"
                ></v-switch>
              </v-col>
            </v-row>
            <v-row class="mx-0">
              <v-col cols="2" class="pl-0 pt-0">
                <v-text-field
                  label="ID"
                  v-model="form.representative.id"
                  :disabled="loadingAgree"
                  outlined
                  hide-details="auto"
                >
                  <template #append>
                    <v-icon
                      @click="flags.searchRepresentativeDialogVisible = true"
                      small
                      color="secondary"
                      class="mt-1"
                    >
                      search
                    </v-icon>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="6" class="pt-0">
                <v-text-field
                  label="Фамилия Имя Отчество"
                  v-model="form.representative.fullname"
                  :disabled="loadingAgree"
                  outlined
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="2" class="pr-0 pt-0">
                <date-picker
                  v-model="form.representative.birthDate"
                  label="Дата"
                />
              </v-col>
            </v-row>
            <v-row class="mx-0">
              <v-col cols="5" class="pl-0">
                <v-text-field
                  label="Адрес"
                  v-model="form.representative.address"
                  :disabled="loadingAgree"
                  outlined
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="3">
                <phone-text-field
                  v-model="form.representative.phoneMobile"
                  title="Моб. телефон"
                  :disabled="loadingAgree"
                />
              </v-col>
              <v-col cols="3" class="pr-0">
                <v-text-field
                  label="Email"
                  v-model="form.representative.email"
                  :disabled="loadingAgree"
                  outlined
                  hide-details="auto"
                />
              </v-col>
            </v-row>
            <!-- Заявитель -->
            <v-row class="mx-0">
              <v-col cols="12" class="pb-0 pl-0">
                <span class="subtitle-2">Заявитель</span>
              </v-col>
            </v-row>
            <v-row class="mx-0">
              <v-col cols="2" class="pl-0">
                <v-text-field
                  label="ID"
                  v-model="form.applicant.id"
                  :disabled="loadingAgree"
                  outlined
                  hide-details="auto"
                >
                  <template #append>
                    <v-icon
                      @click="flags.searchApplicantDialogVisible = true"
                      small
                      color="secondary"
                      class="mt-1"
                      >search</v-icon
                    >
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Фамилия Имя Отчество"
                  v-model="form.applicant.fullname"
                  :disabled="loadingAgree"
                  outlined
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="2" class="pr-0">
                <date-picker v-model="form.applicant.birthDate" label="Дата" />
              </v-col>
            </v-row>
            <v-row class="mx-0">
              <v-col cols="5" class="pl-0">
                <v-text-field
                  label="Адрес"
                  v-model="form.applicant.address"
                  :disabled="loadingAgree"
                  outlined
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="3">
                <phone-text-field
                  v-model="form.applicant.phoneMobile"
                  title="Моб. телефон"
                  :disabled="loadingAgree"
                />
              </v-col>
              <v-col cols="3" class="pr-0">
                <v-text-field
                  label="Email"
                  v-model="form.applicant.email"
                  :disabled="loadingAgree"
                  outlined
                  hide-details="auto"
                />
              </v-col>
            </v-row>
          </base-expansion-panel>

          <event-claims class="mt-6"></event-claims>
        </v-form>
      </v-col>
      <v-col cols="3" class="px-3 pl-0">
        <sticky :stickyTop="90">
          <v-btn
            @click.native.stop="save"
            rounded
            depressed
            class="white"
            color="secondary"
          >
            <v-icon small class="mr-1">save</v-icon>Сохранить изменения
          </v-btn>
        </sticky>
      </v-col>
    </v-row>

    <dialog-wrapper
      title="Поиск полиса"
      max-width="1080px"
      v-model="flags.searchAgreeDialogVisible"
      divider
    >
      <search-agree
        :show-dialog-flag="flags.searchAgreeDialogVisible"
        @setdata="setAgreeFromAgreeSearch"
        :enp="form.enp"
        :tpn="form.tpn"
      ></search-agree>
    </dialog-wrapper>

    <search-client
      dialog-title="Поиск застрахованного"
      v-model="flags.searchClientDialogVisible"
      @close-dialog="flags.searchClientDialogVisible = false"
      @setdata="setClientByClientSearch"
    ></search-client>
    <search-client
      dialog-title="Поиск представителя"
      v-model="flags.searchRepresentativeDialogVisible"
      @close-dialog="flags.searchRepresentativeDialogVisible = false"
      @setdata="setRepresentativeByClientSearch"
    ></search-client>
    <search-client
      dialog-title="Поиск заявителя"
      v-model="flags.searchApplicantDialogVisible"
      @close-dialog="flags.searchApplicantDialogVisible = false"
      @setdata="setApplicantByClientSearch"
    ></search-client>
  </div>
</template>
<script>
// todo Закончить поиск по таблице ВО
// todo Закончить выбор в таблице ВО

// todo Дата создания должна быть sysdate
// todo Удалить поля phone у членов

"use strict";
/* миксины */
import { datesMixin } from "@/../mixins/datesMixin";
import { validationRulesMixin } from "@/../mixins/validationRulesMixin";
/* объекты */
import ClaimFactory from "@/../utils/ClaimFactory";
import ClientInfoFactory from "@/../utils/ClientInfoFactory";
/* компоненты */
import EventClaims from "@/../components/claims/common/EventClaims";
import SearchClient from "@/../components/common/SearchClient";
import ClaimReasonsDialog from "@/../components/claims/common/ClaimReasonsDialog";
import BaseExpansionPanel from "@/../components/common/BaseExpansionPanel";
import DatePicker from "@/../components/common/DatePicker";
import Sticky from "@/../components/common/Sticky";
import ClaimQuestionsAnswers from "@/../components/claims/common/ClaimQuestionsAnswers";
import RegionAutocomplete from "@/../components/common/RegionAutocomplete";
import DialogWrapper from "@/../components/common/DialogWrapper.vue";
import SearchAgree from "@/../components/common/SearchAgree";
import PolicyNumberTextField from "@/../components/common/PolicyNumberTextField";
import PolicySeriesTextField from "@/../components/common/PolicySeriesTextField";
import PhoneTextField from "@/../components/common/PhoneTextField";

import { setClaim } from "@/../api/api.claims";
/* маска для полей */
import { mapActions, mapState } from "vuex";

export default {
  name: "ClaimForm",
  mixins: [datesMixin, validationRulesMixin],
  components: {
    EventClaims,
    SearchClient,
    ClaimReasonsDialog,
    BaseExpansionPanel,
    DatePicker,
    Sticky,
    ClaimQuestionsAnswers,
    RegionAutocomplete,
    DialogWrapper,
    SearchAgree,
    PolicyNumberTextField,
    PolicySeriesTextField,
    PhoneTextField,
  },

  props: {
    agreeId: { type: Number },
    callerNumber: { type: String },
    linkedId: { type: String },
  },

  computed: {
    ...mapState("users", ["user"]),
    ...mapState("agree", ["agree", "loadingAgree"]),
    ...mapState("refs", ["refsLists"]),

    policyInfo() {
      if (this.form.client?.id) {
        const { id, fullname } = this.form.client;
        return `${id} ${fullname}`;
      }
      return null;
    },

    agreeHref() {
      if (this.form.agreeId) {
        return `${OMInsurance.host}${OMInsurance.path}/ClientVisit/Details/${this.form.agreeId}`;
      }
      return null;
    },
  },

  watch: {
    agree(value, oldValue) {
      if (value?.id != oldValue?.id) {
        if (!this.flags.isAlreadyInstalledDefaultValues) {
          this.setDefaults();
        } else {
          this.setAgree();
        }
      }
    },
    user(value, oldValue) {
      if (value?.id != oldValue?.id) {
        this.setDefaults();
      }
    },
    "form.client"(value, oldValue) {
      if (value?.id != oldValue?.id) {
        this.fetchClientClaims({ clientId: value.id });
      }
    },
  },

  data() {
    return {
      switchApplicantForClient: true,
      switchApplicantForRepresentative: false,
      selectedTabAnswerQuestion: null,
      expansionPanels: {
        common: 0,
        policy: 0,
        members: 0,
      },
      flags: {
        searchAgreeDialogVisible: false,
        searchClientDialogVisible: false,
        searchRepresentativeDialogVisible: false,
        searchApplicantDialogVisible: false,
        isAlreadyInstalledDefaultValues: false,
      },
      form: ClaimFactory.create(),
    };
  },

  methods: {
    ...mapActions(["addSuccessNotification", "addErrorNotification"]),
    ...mapActions("agree", ["fetchAgree"]),
    ...mapActions("claim", ["fetchClientClaims"]),

    setDefaults() {
      if (!this.user?.id || this.loadingAgree) {
        return;
      }

      this.form = ClaimFactory.createByUserAgreeCallerNumber({
        user: this.user,
        callerNumber: this.callerNumber,
        agree: this.agree,
      });

      this.flags.isAlreadyInstalledDefaultValues = true;
    },

    setAgree() {
      this.form = ClaimFactory.createByUserAgreeCallerNumber({
        user: this.user,
        callerNumber: this.callerNumber,
        agree: this.agree,
        oldClaim: this.form,
      });
      this.updateSwitchers();
    },

    setApplicantByClient(isApplicant) {
      if (isApplicant) {
        this.switchApplicantForRepresentative = false;
        this.setApplicantByClientInfo(this.form.client);
      } else {
        this.setApplicantByClientInfo();
      }
    },

    setApplicantByRepresentative(isApplicant) {
      if (isApplicant) {
        this.switchApplicantForClient = false;
        this.setApplicantByClientInfo(this.form.representative);
      } else {
        this.setApplicantByClientInfo();
      }
    },

    setApplicantByClientInfo(clientInfo = {}) {
      this.form.applicant = ClientInfoFactory.create({
        ...clientInfo,
        phoneMobile: this.callerNumber,
      });
    },

    updateSwitchers() {
      const { client, applicant, representative } = this.form;
      if (client.id == applicant.id) {
        this.switchApplicantForClient = true;
        this.switchApplicantForRepresentative = false;
      } else if (representative.id == applicant.id) {
        this.switchApplicantForRepresentative = true;
        this.switchApplicantForClient = false;
      } else {
        this.switchApplicantForRepresentative = false;
        this.switchApplicantForClient = false;
      }
    },

    setClientByClientSearch(clientInfo) {
      if (clientInfo) {
        this.form.client = ClientInfoFactory.create(clientInfo);
        this.updateSwitchers();
      }
    },

    setApplicantByClientSearch(clientInfo) {
      if (clientInfo) {
        this.form.applicant = ClientInfoFactory.create(clientInfo);
        this.updateSwitchers();
      }
    },

    setRepresentativeByClientSearch(clientInfo) {
      if (clientInfo) {
        this.form.representative = ClientInfoFactory.create(clientInfo);
        this.updateSwitchers();
      }
    },

    async save() {
      if (this.$refs.mainClaimAddForm.validate()) {
        try {
          const model = this.form.getAspModel();
          const { data } = await setClaim(model, this.linkedId);
          if (data) {
            this.addSuccessNotification("Обращение успешно сохранено!");
            if (data?.claimId) {
              window.location.href = `${OMInsurance.host}${OMInsurance.path}/Claim/Edit/${data.claimId}`;
            }
          } else {
            throw response;
          }
        } catch (error) {
          const msg = error.message || "";
          this.addErrorNotification("Ошибка сохранения обращения! " + msg);
        }
      } else {
        this.addErrorNotification(`Заполните обязательные поля!`);
        // установка фокуса на tab-item с невалидным значением
        if (!this.form?.question) {
          this.selectedTabAnswerQuestion = "question";
        }
      }
    },

    async setAgreeFromAgreeSearch(selectedAgree) {
      this.flags.searchAgreeDialogVisible = false;
      if (selectedAgree?.id) {
        await this.fetchAgree(selectedAgree?.id);
      }
    },

    goToNewUrlByAgreeId(agreeId) {
      const search = window.location.search;
      const variables = search
        .substring(1)
        .split("&")
        .filter((it) => it.indexOf("agreeId=") != 0);
      variables.push(`agreeId=${agreeId}`);
      window.location.search = `?${variables.join("&")}`;
    },

    /* обрабатывает данные полученные из диалогового окна "Стандартные вопросы и ответы" */
    setQuestionsAnswers({ question, answer } = {}) {
      this.form.question = question;
      this.form.answer = answer;
    },
  },
  created() {
    if (this.agreeId) {
      this.fetchAgree(this.agreeId);
    }
  },
};
</script>
