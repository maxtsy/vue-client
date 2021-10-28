<template>
  <base-expansion-panel
    title="ДОКУМЕНТЫ И ФАЙЛЫ"
    :expansionModel="expansionPanels.docs"
    class="claim-docs"
    code="claimDocs"
  >
    <template #header-buttons>
      <v-btn
        @click.native.stop="addDoc"
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
      :items="docs"
      hide-default-footer
      class="claim-docs-results"
    >
      <template #item.file.ext="{ item }">
        <div v-if="item.file.ext == 'mp3' || item.file.ext == 'wav'">
          <audio-wrapper :src="item.file.id | linkByFileId" />
        </div>
        <div v-else-if="item.file.ext == 'jpg'">
          <a :href="item.file.id | linkByFileId" target="_blank">
            <img
              style="width: 40px; height: 40px"
              :src="item.file.id | linkByFileId"
            />
          </a>
        </div>
        <div v-else>
          <a :href="item.file.id | linkByFileId" target="_blank"
            >{{ item.file.name }}.{{ item.file.ext }}</a
          >
        </div>
      </template>
      <template #item.createDate="{ item }">
        {{ item.createDate | dateFormat }}
      </template>
      <template #item.actions="{ item }">
        <v-btn icon :disabled="isReadOnly" @click.stop="removeDoc(item)">
          <v-icon small>delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <dialog-wrapper
      v-model="flags.addClaimDocDialogVisible"
      max-width="600px"
      title="Добавление документа"
    >
      <claim-doc-form
        :show-dialog-flag="flags.addClaimDocDialogVisible"
        :claim-id="claimId"
        @setdata="setNewDoc"
      ></claim-doc-form>
    </dialog-wrapper>
  </base-expansion-panel>
</template>

<script>
import {
  removeClaimDoc,
  setClaimDocs,
  uploadClaimFile,
} from "@/../api/api.docs";

import BaseExpansionPanel from "@/../components/common/BaseExpansionPanel";
import AudioWrapper from "@/../components/common/AudioWrapper.vue";
import DialogWrapper from "@/../components/common/DialogWrapper.vue";
import ClaimDocForm from "@/../components/claims/common/ClaimDocForm";

import { mapActions, mapState } from "vuex";

export default {
  name: "ClaimDocs",
  components: { BaseExpansionPanel, AudioWrapper, DialogWrapper, ClaimDocForm },

  props: {
    claimId: Number,
    isReadOnly: Boolean,
    showDocDialog: Boolean,
  },

  data() {
    return {
      expansionPanels: {
        docs: 0,
      },
      headers: [
        { text: "#", value: "id", width: 62, sortable: false },
        { text: "Документ", value: "file.ext", sortable: false },
        {
          text: "Дата создания",
          value: "createDate",
          width: 162,
          sortable: false,
        },
        { text: "", sortable: false, value: "actions", width: 16 },
      ],
      flags: {
        addClaimDocDialogVisible: false,
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

    linkByFileId(id) {
      return id
        ? `${OMInsurance.host}${OMInsurance.path}/File/FileById?filename=${id}`
        : null;
    },
  },

  watch: {
    showDocDialog(val) {
      if (val) {
        this.addDoc();
      }
    },
  },

  computed: mapState("claim", ["docs"]),

  methods: {
    ...mapActions(["addSuccessNotification", "addErrorNotification"]),
    ...mapActions("claim", ["fetchClaimDocs"]),

    async setNewDoc(fileInfo) {
      try {
        const file = fileInfo.file;
        const formData = new FormData();
        formData.append("file", file, file?.name);

        const response = await uploadClaimFile(formData);
        if (response) {
          const model = fileInfo.getAspModel();
          const { data } = await setClaimDocs(model);
          if (data?.id) {
            await this.fetchClaimDocs(this.claimId);
            this.addSuccessNotification("Документ успешно сохранён!");
          } else {
            this.addErrorNotification("Ошибка сохранения документа!");
          }
          this.flags.addClaimDocDialogVisible = false;
        } else {
          return this.addErrorNotification(
            "Файл не загрузился, невозможно сохранить документ!"
          );
        }
      } catch {
        this.addErrorNotification("Ошибка сохранения документа!");
      }
    },

    addDoc() {
      this.flags.addClaimDocDialogVisible = true;
    },

    async removeDoc(fileInfo) {
      if (confirm("Удалить документ?")) {
        try {
          const { data } = await removeClaimDoc(fileInfo.id);
          if (data?.id) {
            this.addSuccessNotification("Документ успешно удалён!");
            await this.fetchClaimDocs(this.claimId);
          } else {
            throw response;
          }
        } catch {
          this.addErrorNotification("Ошибка удаления документа!");
        }
      }
    },

    /** обновление списка после добавления документа */
    async afterCreateDoc() {
      await this.fetchClaimDocs(this.claimId);
      this.flags.addClaimDocDialogVisible = false;
    },
  },
};
</script>
