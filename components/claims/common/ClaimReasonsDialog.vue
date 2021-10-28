<template>
  <div class="claim-reasons">
    <v-autocomplete
      :value="claimReasonId"
      @input="claimReasonChangedByAutocomplete"
      :items="reasonsByType"
      @click:clear="clear"
      :rules="rules"
      label="Причина"
      :disabled="disabled"
      outlined
      clearable
      hide-details="auto"
      :filter="treeFilter"
      item-text="name"
      item-value="id"
    >
      <template #item="{ item }">
        <span>
          <b>({{ item.id }})</b> {{ item.name }}
        </span>
      </template>
      <template #append>
        <v-icon
          color="secondary"
          @click.stop="showDialog = true"
          @mousedown.stop
        >
          arrow_drop_down
        </v-icon>
      </template>
    </v-autocomplete>
    <dialog-wrapper
      v-if="showDialog"
      v-model="showDialog"
      max-width="815"
      title="Выбрать причину обращения"
      :divider="true"
    >
      <v-btn-toggle
        v-model="selectedClaimTypeId"
        group
        color="primary"
        class="px-2"
      >
        <v-btn
          v-for="claimType in claimTypesById"
          :key="claimType.id"
          :value="claimType.id"
        >
          {{ claimType.name }}
        </v-btn>
      </v-btn-toggle>
      <v-text-field
        v-model="search"
        autofocus
        @click:clear="search = null"
        label="Поиск причины"
        outlined
        clearable
        hide-details="auto"
        class="pa-2"
      ></v-text-field>
      <v-treeview
        @update:active="update"
        :items="tree"
        activatable
        dense
        style="height: 500px"
        class="px-2"
        open-all
        :search="search"
        :filter="treeFilter"
        :active="selectedReasonId ? [selectedReasonId] : []"
      >
        <template #label="{ item }">
          <span class="row subtitle-2 mx-0" v-show="!selectedClaimTypeId">
            {{ claimTypesById[item.typeId].name }}
          </span>
          <span
            ><b>({{ item.id }})</b> {{ item.name }}</span
          >
        </template>
      </v-treeview>
      <template v-slot:actions>
        <v-btn @click.stop="save" depressed class="white ma-4" color="primary"
          >Выбрать</v-btn
        >
      </template>
    </dialog-wrapper>
  </div>
</template>
<script>
import DialogWrapper from "@/../components/common/DialogWrapper.vue";
import NodeFactory from "@/../utils/NodeFactory";
import { mapState } from "vuex";

function getReasonNode(reason, childrens) {
  const children = childrens
    .filter((el) => el.parentId == reason.id)
    .map((el) => getReasonNode(el, childrens));
  return { ...reason, children };
}

export default {
  name: "ClaimReasonsDialog",
  components: { DialogWrapper },
  props: {
    claimTypeId: { type: Number },
    claimReasonId: { type: Number },

    disabled: { type: Boolean },
    rules: { type: Array },

    defaultItem: Object,
    onlyActuals: Boolean,
  },
  data() {
    return {
      showDialog: false,
      selectedReasonId: null,
      selectedClaimTypeId: null,
      search: null,
    };
  },
  watch: {
    /**
     * Отслеживание изменений вне диалогового окна
     * если имеется выбранная причина и у неё отличается тип причины
     * то очищаем выбранную причину за несоответствие
     * если claimReasons пуст, то очищать не нужно
     */
    claimTypeId: {
      immediate: true,
      handler(value, oldValue) {
        if (value != oldValue) {
          this.selectedClaimTypeId = this.claimTypeId;
          if (
            this.claimReasonId &&
            this.claimReasons?.length &&
            this.claimReasons.find(({ id }) => id === this.claimReasonId)
              ?.typeId !== value
          ) {
            this.clear();
          }
        }
      },
    },

    /** Отслеживанеи открытия для установки всех отмеченных значений на место */
    showDialog(value, oldValue) {
      if (value && !oldValue) {
        this.selectedReasonId = this.claimReasonId;
        this.selectedClaimTypeId = this.claimTypeId;
        this.search = null;
      }
    },
  },
  computed: {
    ...mapState("refs", ["refs"]),

    claimReasons() {
      const claimReasons = this.refs?.claimReasons || [];
      const items = this.onlyActuals
        ? claimReasons.filter((it) => it.isActual)
        : claimReasons;
      if (this.defaultItem?.id) {
        const item = NodeFactory.create(this.defaultItem);        
        if (items.every((it) => it.id !== item.id)) {
          return [...items, item];
        }
      }
      return items;
    },

    reasonName() {
      const id = this.claimReasonId;
      const reason = this.claimReasons.find((it) => it.id === id);
      return reason?.name;
    },

    /**
     * Список причин отфильтрованный по типу причины.
     * Если нет выбранного типа, то возвращаются все причины
     */
    reasonsByType() {
      if (this.claimReasons) {
        const id = this.selectedClaimTypeId;
        const items = id
          ? this.claimReasons.filter((it) => it.typeId === id)
          : this.claimReasons;
        return items;
      }
      return [];
    },

    /**
     * Причины в виде дерева.
     * Если нет выбранного типа, то возвращается плоский список причин
     */
    tree() {
      if (this.selectedClaimTypeId) {
        const roots = this.reasonsByType.filter((it) => it.parentId == null);
        const childrens = this.reasonsByType.filter(
          (it) => it.parentId !== null
        );
        return roots.map((it) => getReasonNode(it, childrens));
      }
      return this.reasonsByType;
    },

    /**
     * Объект типов причин для быстрой выборке по id типа
     */
    claimTypesById() {
      const obj = {};
      if (this.refs?.claimTypes) {
        this.refs.claimTypes.forEach((it) => (obj[it.id] = it));
      }
      return obj;
    },
  },
  methods: {
    treeFilter({ id, name }, search) {
      return `${id} ${name?.toLowerCase()}`.indexOf(search.toLowerCase()) > -1;
    },

    claimReasonChangedByAutocomplete(claimId) {
      this.selectedReasonId = claimId;
      this.save();
    },

    save() {
      const reasonId = this.selectedReasonId;
      this.$emit("reason-selected", reasonId);
      if (reasonId) {
        const reason = this.claimReasons.find(({ id }) => id === reasonId);
        const claimTypeId = reason?.typeId || null;
        this.selectedClaimTypeId = claimTypeId;
        if (claimTypeId !== this.claimTypeId) {
          this.$emit("claim-type-selected", claimTypeId);
        }
      }
      this.showDialog = false;
    },

    update([item = null]) {
      this.selectedReasonId = item;
    },

    clear() {
      this.$emit("reason-selected", null);
    },
  },
};
</script>
