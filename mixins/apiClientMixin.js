export const apiClientMixin = {
    methods: {
        /**
         * Поиск клиентов
         * @param {Object} model         
         */
        postClientsSearch(model) {
            return this.$http.post(`${OMInsurance.host}${OMInsurance.path}/Api/ClnSearch`, { model })
        },
        /**
         * Поиск клиентов
         * @param {Object} model
         */
        async apiPostClientsSearch(model) {
            const { data } = await this.postClientsSearch(model)

            return data
        }
    }    
}