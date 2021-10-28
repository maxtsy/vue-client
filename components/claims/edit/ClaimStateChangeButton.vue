<template>
  <v-btn
    rounded
    depressed
    :color="currentState.color"
    style="height: 24px"
    class="white--text"
    @click="onChangeStage"
    :loading="flags.loading"
    :disabled="flags.loading"
  >
    <div
      class="pl-1"
      style="font-size: 10px; font-weight: 400; letter-spacing: 0.4px"
    >
      {{ currentState.buttonText }}
    </div>
    <dialog-wrapper
      :title="currentState.title"
      v-model="flags.showDialog"
      :max-width="274"
    >
      <div class="change-stage-claim-dialog">
        <v-form>
          <v-row class="pl-1 pr-1">
            <v-col cols="12">
              <v-select
                v-model="selectedStageId"
                :items="allowedStages"
                label="Предварительная"
                hide-details="auto"
                outlined
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <date-picker v-model="selectedDate" label="Дата" />
            </v-col>
          </v-row>
          <v-row class="pl-1 pr-1">
            <v-col cols="12">
              <v-btn
                @click.native.stop="confirm"
                :disabled="!selectedStageId"
                block
                depressed
                color="primary"
                >{{ currentState.buttonText }}</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </div>
    </dialog-wrapper>
  </v-btn>
</template>
<script>
import { getAllowedClaimStages, setClaimStatus } from "@/../api/api.claims";
import RefsFactory from "@/../utils/RefsFactory";
import DateUtils from "@/../classes/DateUtils";
import DatePicker from "@/../components/common/DatePicker";
import DialogWrapper from "@/../components/common/DialogWrapper";
import { mapActions } from "vuex";

const states = [
  {
    name: "open",
    id: 1,
    requiredDateAndShowDialog: true,
    title: "Открытие обращения",
    buttonText: "Открыть",
    color: "#FFC107",
  },
  {
    name: "close",
    id: 21,
    requiredDateAndShowDialog: true,
    title: "Закрытие обращения",
    buttonText: "Закрыть",
    color: "primary",
  },
  {
    name: "prolong",
    id: 20,
    requiredDateAndShowDialog: false,
    buttonText: "Продлить",
    color: "primary",
  },
];

export default {
  name: "claim-state-change-button",
  components: { DatePicker, DialogWrapper },

  props: {
    beforSelectAsyncFunction: Function,
    date: {
      type: String,
      default: DateUtils.dateToString(DateUtils.getCurrentDay()),
    },
    isCurrentAnswerFilled: { type: Boolean },
    claimId: { type: Number },
    mode: {
      type: String,
      validator: (val) => states.some((it) => it.name === val),
      required: true,
    },
  },
  watch: {
    date: {
      immediate: true,
      handler(val) {
        this.selectedDate = val;
      },
    },
  },
  computed: {
    currentState() {
      return states.find((it) => it.name === this.mode);
    },
  },
  data() {
    return {
      flags: {
        showDialog: false,
        loading: false,
      },
      allowedStages: [],
      selectedStageId: null,
      selectedDate: null,
    };
  },
  methods: {
    ...mapActions(["addErrorNotification"]),

    async onChangeStage() {
      this.flags.loading = true;
      const allowFunc = this.beforSelectAsyncFunction;
      if (!allowFunc || (await allowFunc())) {
        await this.loadAllowStages();
      }
      this.flags.loading = false;
    },

    async loadAllowStages() {
      try {
        const { id, name, requiredDateAndShowDialog } = this.currentState;
        if (name === "prolong") {
          throw { message: "Продление обращения невозможно!" };
        }

        const { data } = await getAllowedClaimStages(this.claimId, id);
        if (data) {
          const { claimStagesAllowed, message } = data;
          if (message) {
            throw message;
          }
          if (!claimStagesAllowed?.length) {
            throw "Ошибка при получении стадий обращения! Невозможно изменить состояние обращения!";
          }
          
          const stages = RefsFactory.createList(claimStagesAllowed);
          if (stages?.length === 1) {
            this.selectedStageId = stages[0].value;
          }
          this.allowedStages = stages;
          this.flags.showDialog = !!requiredDateAndShowDialog;
        } else {
          throw "bad request";
        }
      } catch (error) {
        this.addErrorNotification(error);
      }
    },

    async confirm() {
      const stateName = this.currentState.name;
      const stageId = this.selectedStageId;
      if (
        stateName === "close" &&
        stageId !== 360 &&
        !this.isCurrentAnswerFilled
      ) {
        const text = 'Заполните поле "Ответ" и сохраните обращение!';
        this.flags.showDialog = false;
        return this.addErrorNotification(text);
      }

      try {
        const closeDate = stateName === "close" ? this.selectedDate : null;
        const openDate = stateName === "open" ? this.selectedDate : null;
        const { data } = await setClaimStatus(
          this.claimId,
          this.currentState.id,
          stageId,
          closeDate,
          openDate
        );
        if (data?.id) {
          window.location.href = `${OMInsurance.host}${OMInsurance.path}/Claim/Edit/${this.claimId}`;
        } else {
          throw response.error;
        }
      } catch (error) {
        console.log(error);
        this.addErrorNotification(error.message);
      }
    },
  },
};
</script>
