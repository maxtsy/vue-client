export const apiClaimJournalMixin = {
    methods: {
        async apiGetClaimJournal(claimId) {
            const { data } = await this.getClaimJournal(claimId);

            return data;
        },

        /* REQUESTS */
        /**
         * Возвращзает журнал
         * @param {Number} claimId 
         */
        getClaimJournal(claimId) {
            return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/ClmApi/GetJournal`, { params: { claimId } })
        },
    }
}