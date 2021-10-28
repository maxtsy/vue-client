<template>
  <div no-gutters class="claim-and-event mt-0">
    <v-row no-gutters class="pb-3 pt-0">
      <v-col cols="12" class="px-3 pb-3">
        <claim-state-change-button
          v-if="claimForm.stateId == 21"
          class="mr-3"
          mode="open"
          :claimId="claimForm.id"
        />
        <claim-state-change-button
          v-if="claimForm.stateId == 1"
          class="mr-3"
          mode="prolong"
          :claimId="claimForm.id"
        />
        <claim-state-change-button
          v-if="claimForm.stateId == 1 || claimForm.stateId == 20"
          class="mr-3"
          mode="close"
          :beforSelectAsyncFunction="onCheckBeforeClose"
          :claimId="claimForm.id"
          :isCurrentAnswerFilled="
            !!(eventForm.answer && eventForm.answer.trim())
          "
        />
        <claim-print-button
          :claim-id="claimForm.id"
          :clm-out-number="claimForm.outNumber"
          :clm-out-date="claimForm.outDate"
          :event-type-id="eventForm.typeId"
          :event-answer="eventForm.answer"
        ></claim-print-button>
      </v-col>
    </v-row>
    <v-form :disabled="isReadOnly" ref="mainClaimEditForm" lazy-validation>
      <base-expansion-panel
        code="claimFormCommon"
        :expansionModel="expansionPanels.common"
        title="Общая информация"
      >
        <template #title>
          Общая информация
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
        <!-- <v-container> -->
        <v-row class="mx-0">
          <v-col cols="7" class="pl-0">
            <v-text-field
              label="Полис"
              :value="policyInfo"
              outlined
              hide-details="auto"
            >
              <template #append>
                <v-icon
                  @click="flags.searchAgreeDialogVisible = true"
                  small
                  color="secondary"
                  class="mt-1"
                >
                  search
                </v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="2">
            <policy-series-text-field
              label="ВС"
              v-model="claimForm.policySeries"
            />
          </v-col>
          <v-col cols="3">
            <policy-number-text-field
              label="ЕНП"
              v-model="claimForm.policyNumber"
            />
          </v-col>
        </v-row>
        <v-row class="mx-0">
          <v-col cols="3" class="pl-0">
            <date-picker
              v-model="claimForm.createDate"
              :rules="[requiredRule]"
              label="Дата обращения"
              supportTime
            />
          </v-col>
          <v-col cols="6">
            <region-autocomplete
              v-model="claimForm.regionId"
              :rules="[requiredRule]"
            ></region-autocomplete>
          </v-col>
          <v-col cols="3" class="pr-0">
            <v-select
              v-model="claimForm.companyId"
              :items="refsLists.companies"
              :rules="[requiredRule]"
              label="Компания"
              hide-details="auto"
              outlined
            ></v-select>
          </v-col>
        </v-row>
        <v-row class="mx-0">
          <v-col cols="2" class="pl-0">
            <v-select
              v-model="eventForm.typeId"
              :items="refsLists.eventForms"
              :rules="[requiredRule]"
              label="Форма"
              hide-details="auto"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-select
              v-model="eventForm.recipTypeId"
              :items="refsLists.claimReciptTypes"
              :rules="[requiredRule]"
              label="Источник"
              hide-details="auto"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="claimForm.typeId"
              :items="refsLists.claimTypes"
              :rules="[requiredRule]"
              label="Тип обращения"
              hide-details="auto"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="5" class="pr-0">
            <claim-reasons-dialog
              @reason-selected="changedReason"
              @claim-type-selected="(id) => (claimForm.typeId = id)"
              :claim-type-id="claimForm.typeId"
              :claim-reason-id="claimForm.reasonId"
              :rules="[requiredRule]"
              :onlyActuals="true"
              :defaultItem="claim.reason"
            ></claim-reasons-dialog>
          </v-col>
        </v-row>
        <v-row class="mx-0">
          <v-col cols="3" class="pl-0">
            <v-select
              v-model="claimForm.validateId"
              :items="refsLists.claimSolvencies"
              :rules="[requiredRule]"
              label="Правильность"
              hide-details="auto"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="4">
            <custom-select
              v-model="claimForm.stageId"
              :defaultItem="claim.stage"
              :items="stages"
              :rules="[requiredRule]"
              label="Стадия"
            />
          </v-col>
          <v-col cols="3">
            <date-picker
              v-model="claimForm.occurDate"
              label="Дата обращения"
              supportTime
            />
          </v-col>
          <v-col cols="2" class="pr-0">
            <date-picker v-model="claimForm.closeDate" label="Дата закрытия" />
          </v-col>
        </v-row>
        <v-row class="mx-0">
          <v-col cols="2" class="pl-0">
            <v-switch
              v-model="claimForm.repeated"
              inset
              label="Повторно"
              style="margin-top: 3px"
            ></v-switch>
          </v-col>
          <v-col cols="5" offset="5" class="pr-0">
            <v-text-field
              disabled
              label="Пользователь"
              v-model="claimForm.user"
              hide-details="auto"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <!-- </v-container> -->
      </base-expansion-panel>

      <base-expansion-panel
        title="Обращение"
        code="claimData"
        :expansionModel="expansionPanels.claim"
        class="mt-6"
      >
        <!-- <v-container> -->
        <v-row class="mx-0">
          <v-col cols="2" class="pl-0">
            <date-picker v-model="claimForm.outDate" label="Дата ответа" />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="claimForm.actNumber"
              label="Номер дела"
              outlined
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="claimForm.outNumber"
              label="Номер ответа"
              outlined
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col cols="3" class="pr-0">
            <date-picker
              v-model="claimForm.expectCloseDate"
              label="Ожидаемая дата закрытия"
            />
          </v-col>
        </v-row>
        <v-row class="mx-0">
          <v-col cols="12" class="pl-0 pr-0">
            <claim-questions-answers
              :reason-id="claimForm.reasonId"
              :region-id="claimForm.regionId"
              btnClass="mr-6"
              :disabled="isReadOnly"
              @setdata="setQuestionsAnswers"
            ></claim-questions-answers>
          </v-col>
        </v-row>
        <v-row class="mx-0">
          <v-col cols="12" class="pl-0 pr-0">
            <v-textarea
              v-model="eventForm.question"
              :rules="[requiredRule]"
              rows="3"
              outlined
              label="Вопрос"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row class="mx-0">
          <v-col cols="12" class="pl-0 pr-0 pb-0">
            <v-textarea
              v-model="eventForm.answer"
              rows="3"
              outlined
              label="Ответ"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row class="mx-0">
          <v-col cols="12" class="pl-0 pr-0 pb-0">
            <v-textarea
              v-model="eventForm.description"
              rows="3"
              outlined
              label="Почтовый адрес"
            ></v-textarea>
          </v-col>
        </v-row>
        <!-- </v-container> -->
      </base-expansion-panel>
      <dialog-wrapper
        title="Поиск полиса"
        max-width="1080px"
        v-model="flags.searchAgreeDialogVisible"
      >
        <search-agree
          :show-dialog-flag="flags.searchAgreeDialogVisible"
          @setdata="setAgreeFromAgreeSearch"
          :enp="claimForm.policyNumber"
          :tpn="claimForm.policySeries"
        ></search-agree>
      </dialog-wrapper>
    </v-form>
  </div>
</template>
<script>
import DocInfoFactory from "@/../utils/claimEdit/DocInfoFactory";
import RefFactory from "@/../utils/RefsFactory";

import { mapState, mapActions } from "vuex";
import { mask } from "vue-the-mask";
import { validationRulesMixin } from "@/../mixins/validationRulesMixin";

import BaseExpansionPanel from "@/../components/common/BaseExpansionPanel";
import DatePicker from "@/../components/common/DatePicker";
import ClaimInfoFactory from "@/../utils/claimEdit/ClaimInfoFactory";
import EventFactory from "@/../utils/claimEdit/EventFactory";
import RegionAutocomplete from "@/../components/common/RegionAutocomplete";
import ClaimReasonsDialog from "@/../components/claims/common/ClaimReasonsDialog";
import DialogWrapper from "@/../components/common/DialogWrapper.vue";
import SearchAgree from "@/../components/common/SearchAgree";
import ClaimPrintButton from "@/../components/ClaimPrintButton";
import ClaimStateChangeButton from "@/../components/claims/edit/ClaimStateChangeButton";
import ClaimQuestionsAnswers from "@/../components/claims/common/ClaimQuestionsAnswers";

import DeepEquals from "@/../utils/DeepEquals";
import PolicyNumberTextField from "@/../components/common/PolicyNumberTextField";
import PolicySeriesTextField from "@/../components/common/PolicySeriesTextField";
import CustomSelect from "@/../components/common/CustomSelect";

export default {
  name: "ClaimAndEvent",

  components: {
    BaseExpansionPanel,
    DatePicker,
    RegionAutocomplete,
    ClaimReasonsDialog,
    DialogWrapper,
    SearchAgree,
    ClaimPrintButton,
    ClaimStateChangeButton,
    ClaimQuestionsAnswers,
    PolicyNumberTextField,
    PolicySeriesTextField,
    CustomSelect,
  },

  mixins: [validationRulesMixin],

  directives: { mask },

  props: {
    isReadOnly: { type: Boolean },
  },

  computed: {
    ...mapState("claim", [
      "claim",
      "event",
      "syncFlag",
      "claimInitialState",
      "eventInitialState",
    ]),
    ...mapState("refs", ["refsLists"]),

    stages() {
      const stateId = this.claimForm.stateId;
      if (stateId == 1 || stateId == 20) {
        return this.refsLists.claimStagesForOpenState;
      }
      return this.refsLists.claimStages;
    },

    policyInfo() {
      const { id, client } = this.claimForm.doc;
      return [id, client].filter((it) => it).join(" ");
    },

    agreeHref() {
      const agreeId = this.claimForm.doc.id;
      return agreeId
        ? `${OMInsurance.host}${OMInsurance.path}/ClientVisit/Details/${agreeId}`
        : null;
    },
  },

  watch: {
    syncFlag(value, oldValue) {
      if (value && value != oldValue) {
        this.syncData(false);
        this.save();
      }
    },
    claim: {
      immediate: true,
      handler(val, oldVal) {
        if (JSON.stringify(val) != JSON.stringify(oldVal)) {
          this.claimForm = ClaimInfoFactory.create(val);
        }
      },
    },
    event: {
      immediate: true,
      handler(val, oldVal) {
        if (JSON.stringify(val) != JSON.stringify(oldVal)) {
          this.eventForm = EventFactory.create(val);
        }
      },
    },
  },

  data() {
    return {
      expansionPanels: { common: 0, claim: 0 },
      claimForm: ClaimInfoFactory.create(),
      eventForm: EventFactory.create(),

      flags: {
        searchAgreeDialogVisible: false,
      },
    };
  },

  methods: {
    ...mapActions(["addSuccessNotification", "addErrorNotification"]),
    ...mapActions("claim", ["changeClaimForm", "setClaimAndEvent", "syncData"]),

    changedReason(reasonId) {
      this.claimForm.reasonId = reasonId;
      this.claimForm.reason = RefFactory.create({ id: reasonId });
    },

    setAgreeFromAgreeSearch(data) {
      this.flags.searchAgreeDialogVisible = false;
      this.claimForm.doc = DocInfoFactory.create(data);
      this.claimForm.docId = this.claimForm.doc.id;
    },

    async save() {
      try {
        if (this.$refs.mainClaimEditForm.validate()) {
          const data = {
            claim: this.claimForm,
            event: this.eventForm,
          };
          if (await this.setClaimAndEvent(data)) {
            this.addSuccessNotification("Обращение успешно сохранено!");
          } else {
            throw "request error";
          }
        } else {
          this.addErrorNotification(`Заполните обязательные поля!`);
        }
      } catch {
        this.addErrorNotification(`Ошибка сохранения обращения!`);
      }
    },

    getIsModified() {
      return (
        this.claimInitialState != DeepEquals.stringify(this.claimForm) ||
        this.eventInitialState != DeepEquals.stringify(this.eventForm)
      );
    },

    onCheckBeforeClose() {
      return new Promise(async (resolve) => {
        if (this.$refs.mainClaimEditForm.validate()) {
          const text = "У вас есть несохраненные данные, хотите сохранить?";
          if (this.getIsModified() && confirm(text)) {
            await this.save();
          }
          resolve(true);
        } else {
          this.addErrorNotification(`Заполните обязательные поля!`);
          resolve(false);
        }
      });
    },

    /* обрабатывает данные полученные из диалогового окна "Стандартные вопросы и ответы" */
    setQuestionsAnswers({ question, answer } = {}) {
      this.eventForm.question = question;
      this.eventForm.answer = answer;
    },
  },
};
</script>
