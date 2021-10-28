<template>
  <claim-form></claim-form>
</template>
<script>
import ClaimForm from "@/../components/claims/edit/ClaimForm";
import { mapActions } from "vuex";

import '../../Content/styles.scss';

export default {
  components: { ClaimForm },
  methods: {
    ...mapActions("users", ["fetchUser"]),
    ...mapActions("refs", [
      "fetchAgreeBaseRefs",
      "fetchBaseRefs",
      "fetchClaimRefs",
      "fetchClaimStagesForOpenState",
    ]),

    loadData() {
      return Promise.race([
        this.fetchUser(OMInsurance.login),
        this.fetchAgreeBaseRefs(),
        this.fetchBaseRefs(),
        this.fetchClaimRefs(),
        this.fetchClaimStagesForOpenState(),
      ]);
    },
  },

  async created() {
    await this.loadData();
  },
};
</script>
