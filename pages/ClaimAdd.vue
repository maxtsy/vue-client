<template>
  <base-layout title="Обращения" subtitle="Новое обращение">
    <claim-form
      :agreeId="agreeId"
      :callerNumber="callerNumber"
      :linkedId="linkedId"
    ></claim-form>
  </base-layout>
</template>
<script>
import BaseLayout from "@/../components/common/BaseLayout";
import ClaimForm from "@/../components/claims/add/ClaimForm";

import '../../Content/styles.scss';

export default {
  components: { BaseLayout, ClaimForm },
  data() {
    return {
      agreeId: null,
      callerNumber: null,
      linkedId: null,
    };
  },

  created() {
    const { agreeId, callerNumber, linkedId } = window.OMInsurance;
    this.agreeId = agreeId;
    this.callerNumber = callerNumber;
    this.linkedId = linkedId;
  },
};
</script>
