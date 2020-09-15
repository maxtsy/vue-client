export const apiClaimExpActsMixin = {
    methods: {
        async apiGetClaimExpActs(claimId) {
            const { data } = await this.getClaimExpActs(claimId);

            return data;
        },

        /* REQUEST */
        /**
        * Возвращзает акты экспертиз
        * @param {Number} claimId 
        */
        getClaimExpActs(claimId) {
            return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/ClmApi/GetExpActs`, { params: { claimId } })
        },
    }
}