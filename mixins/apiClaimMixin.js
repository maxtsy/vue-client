export const apiClaimMixin = {
    methods: {
        postSetClaim (model) {
            return this.$http.post(`${OMInsurance.host}${OMInsurance.path}/ClmApi/SetClaim`, { model })
        },
        postUpdClaim (model) {
            return this.$http.post(`${OMInsurance.host}${OMInsurance.path}/ClmApi/UpdClaim`, { model })
        },
        async apiSetClaim(model) {
            const { data } = await this.postSetClaim(model)

            return data
        },
        async apiUpdClaim(model) {
            const { data } = await this.postUpdClaim(model)

            return data
        },
    }
}