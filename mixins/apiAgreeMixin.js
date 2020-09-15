export const apiAgreeMixin = {
    methods: {
        postAgreesSearch(model) {
            return this.$http.post(`${OMInsurance.host}${OMInsurance.path}/Api/AgrSearch`, { model });
        },
        getAgree(agreeId) {
            return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/Api/AgrGet`, { params: { agreeId }});
        },
        /**
         * 
         * @param {Object} model
         */
        async apiAgreesSearch(model) {
            const { data } = await this.postAgreesSearch(model)

            return data
        },
        async apiGetAgree (agreeId) {
            const { data } = await this.getAgree(agreeId)

            return data
        }
    }
}