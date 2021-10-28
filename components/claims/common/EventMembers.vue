<template>
  <base-expansion-panel
    title="Участники события"
    code="eventMembers"
    :expansionModel="expansionPanels.members"
    class="event-members"
  >
    <template #header-buttons>
      <v-btn
        @click.native.stop="addMember"
        :disabled="isReadOnly"
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
          Добавить
        </div>
      </v-btn>
    </template>
    <v-data-table
      :headers="headers"
      :items="members"
      hide-default-footer
      class="event-members-results pl-0 pr-0"
    >
      <template #item.id="{ item }">
        <a
          @click.prevent.stop="editMemberItem(item)"
          :data-id="item.id"
          class="text-decoration-none"
          >{{ item.id }}</a
        >
      </template>
      <template #item.createDate="{ item }">
        {{ item.createDate | dateFormat }}
      </template>
      <template #item.actions="{ item }">
        <v-btn
          icon
          :disabled="isReadOnly"
          @click.stop="removeMemberItem(item)"
          class="mx-n2"
        >
          <v-icon small>delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <event-member-dialog
      v-model="flags.eventMemberDialogVisible"
      :claim-id="claimId"
      :claimMember="selectedMember"
      @close-dialog="closeDialog"
      @setdata="createMember"
    ></event-member-dialog>
  </base-expansion-panel>
</template>

<script>
"use strict";

import { updateMember, setMember, removeMember } from "@/../api/api.member";
import EventMemberDialog from "@/../components/claims/common/EventMemberDialog";
import BaseExpansionPanel from "@/../components/common/BaseExpansionPanel";
import { mapActions, mapState } from "vuex";

export default {
  name: "EventMembers",
  props: {
    claimId: Number,
    isReadOnly: Boolean,
    showMemberDialog: Boolean,
  },

  components: { EventMemberDialog, BaseExpansionPanel },

  data() {
    return {
      expansionPanels: {
        members: 0,
      },
      headers: [
        { text: "#", sortable: false, value: "id", width: 62 },
        { text: "Тип участника", sortable: false, value: "type.name" },
        { text: "ФИО", sortable: false, value: "clientFullname" },
        { text: "Id ЗЛ", sortable: false, value: "clientId" },
        { text: "Телефон", sortable: false, value: "clientPhone" },
        { text: "Email", sortable: false, value: "clientEmail" },
        { text: "Примечание", sortable: false, value: "note" },
        { text: "Дата создания", sortable: false, value: "createDate" },
        { text: "", sortable: false, value: "actions" },
      ],
      flags: {
        /* флаг отображения окна создания/редактирования члена */
        eventMemberDialogVisible: false,
      },
      selectedMember: null,
    };
  },
  filters: {
    dateFormat(value) {
      return value?.split(" ")[0];
    },
  },
  watch: {
    showMemberDialog(val) {
      if (val) {
        this.addMember();
      }
    },
  },
  computed: mapState("claim", ["members"]),
  methods: {
    ...mapActions(["addErrorNotification", "addSuccessNotification"]),
    ...mapActions("claim", ["fetchEventMembers"]),

    addMember() {
      this.selectedMember = null;

      this.flags.eventMemberDialogVisible = true;
    },

    editMemberItem(claimMember) {
      this.selectedMember = claimMember;

      this.flags.eventMemberDialogVisible = true;
    },

    async removeMemberItem(claimMember) {
      if (confirm("Удалить участника события?")) {
        try {
          const { data } = await removeMember(claimMember?.id);
          if (data?.id) {
            await this.fetchEventMembers(this.claimId);
            this.addSuccessNotification("Участник успешно удалён!");
          } else {
            throw "request error";
          }
        } catch {
          this.addErrorNotification("Ошибка удаления участника!");
        }
      }
    },

    async createMember(eventMemberViewModel) {
      try {
        const model = eventMemberViewModel.getAspModel();
        const { data } = await (eventMemberViewModel?.id
          ? updateMember(model)
          : setMember(model));

        if (data?.id) {
          await this.fetchEventMembers(this.claimId);
          this.addSuccessNotification("Участник успешно добавлен!");
          this.flags.eventMemberDialogVisible = false;
        } else {
          throw "request error";
        }
      } catch {
        this.addErrorNotification("Ошибка запроса сохранения!");
      }
    },
    closeDialog() {
      this.flags.eventMemberDialogVisible = false;
      this.$emit("close-member-dialog");
    },
    clear() {
      this.members = [];
      this.claimMember = null;
    },
  },
};
</script>
