<template>
  <dialog-wrapper
    title="Новая заметка"
    max-width="600"
    :value="value"
    @input="afterClose"
  >
    <claim-note-form
      :claim-id="claimId"
      @close-dialog="afterClose"
      @set-data="afterCreateNote"
    ></claim-note-form>
  </dialog-wrapper>
</template>
<script>
"use strict";
/* форма создания претензии */
import ClaimNoteForm from "./ClaimNoteForm";
import DialogWrapper from "@/../components/common/DialogWrapper.vue";

export default {
  name: "claimNoteDialog",
  components: { ClaimNoteForm, DialogWrapper },

  props: {
    claimId: Number,
    value: Boolean,
  },

  methods: {
    afterClose() {
      this.$emit("input", false);
      this.$emit("close-dialog");
    },

    afterCreateNote(data) {
      this.$emit("set-data", data);
    },
  },
};
</script>
