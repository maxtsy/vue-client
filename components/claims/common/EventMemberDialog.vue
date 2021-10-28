<template>
  <dialog-wrapper
    :title="dialogTitle"
    max-width="600"
    :value="value"
    @input="afterClose"
  >
    <event-member-form
      :show-dialog-flag="value"
      :claim-id="claimId"
      :claimMember="claimMember"
      @set-data="afterCreateMember"
    ></event-member-form>
  </dialog-wrapper>
</template>

<script>
"use strict";
/* форма создания претензии */
import EventMemberForm from "@/../components/claims/common/EventMemberForm";
import DialogWrapper from "@/../components/common/DialogWrapper.vue";

export default {
  name: "EventMemberDialog",
  components: { EventMemberForm, DialogWrapper },
  props: {
    claimId: Number,
    claimMember: Object,
    value: Boolean,
  },

  computed: {
    dialogTitle() {
      return this.claimMember?.id
        ? `Редактирование участника № ${this.claimMember?.id}`
        : "Добавление участника";
    },
  },

  methods: {
    /* закрытие окна */
    afterClose() {
      this.$emit("input", false);
      this.$emit("close-dialog");
    },
    afterCreateMember(data) {
      this.$emit("setdata", data);
    },
  },
};
</script>
