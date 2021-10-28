<template>
  <div class="claimscommon-claim-notes">
    <base-expansion-panel
      title="Заметки"
      code="claimNotes"
      :expansionModel="expansionPanels.notes"
      class="claim-notes"
    >
      <template #header-buttons>
        <v-btn
          @click.native.stop="addNote"
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
        :items="notes"
        hide-default-footer
        class="claim-notes-results"
      >
        <template #item.createDate="{ item }">
          {{ item.createDate | dateFormat }}
        </template>
        <template #item.actions="{ item }">
          <v-btn
            icon
            :disabled="isReadOnly"
            @click.stop="removeClaimNote(item)"
          >
            <v-icon small>delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <claim-note-dialog
        v-model="flags.addClaimNoteDialogVisible"
        :claimId="claimId"
        @set-data="setNewNote"
      />
    </base-expansion-panel>
  </div>
</template>

<script>
"use strict";

import { removeNote, setNote } from "@/../api/api.notes";
import ClaimNoteDialog from "@/../components/claims/common/ClaimNoteDialog";
import BaseExpansionPanel from "@/../components/common/BaseExpansionPanel";
import { mapActions, mapState } from "vuex";

export default {
  name: "ClaimNotes",
  props: {
    claimId: Number,
    isReadOnly: Boolean,
    showNoteDialog: Boolean,
  },
  components: { ClaimNoteDialog, BaseExpansionPanel },

  data() {
    return {
      expansionPanels: {
        notes: 0,
      },
      headers: [
        { text: "#", value: "id", width: 62, sortable: false },
        { text: "Заметка", value: "note", sortable: false },
        {
          text: "Дата создания",
          value: "createDate",
          width: 162,
          sortable: false,
        },
        { text: "", sortable: false, value: "actions", width: 16 },
      ],
      flags: {
        addClaimNoteDialogVisible: false,
      },
    };
  },

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

  watch: {
    showNoteDialog: {
      immediate: true,
      handler(val, oldVal) {
        if (val && val !== oldVal) {
          this.addNote();
        }
      },
    },
  },

  computed: mapState("claim", ["notes"]),

  methods: {
    ...mapActions(["addSuccessNotification", "addErrorNotification"]),
    ...mapActions("claim", ["fetchNotes"]),

    async setNewNote(claimNote) {
      try {
        const model = claimNote.getAspModel();
        const { data } = await setNote(model);
        if (data?.id) {
          this.addSuccessNotification("Заметка успешна сохранена!");
        } else {
          throw "request error";
        }
      } catch {
        this.addErrorNotification("Ошибка сохранения заметки!");
      }
      this.fetchNotes(this.claimId);
      this.flags.addClaimNoteDialogVisible = false;
    },

    addNote() {
      this.flags.addClaimNoteDialogVisible = true;
    },

    async removeClaimNote({ id }) {
      if (confirm("Удалить заметку?")) {
        try {
          const { data } = await removeNote(id);
          if (data?.id) {
            this.fetchNotes(this.claimId);
            this.addSuccessNotification(`Заметка №${id} успешно удалена!`);
          } else {
            throw "request error";
          }
        } catch (_error) {
          console.log("ERROR", _error);
          this.addErrorNotification("Ошибка удаления заметки!");
        }
      }
    },
    closeDialog() {
      this.flags.addClaimNoteDialogVisible = false;

      this.$emit("close-note-dialog");
    },
  },
};
</script>
