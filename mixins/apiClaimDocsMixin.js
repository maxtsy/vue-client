export const apiClaimDocsMixin = {
    methods: {

        /**
         * Возвращет документы
         */
        async apiGetClaimDocs(claimId) {
            const { data } = await this.getClaimDocs(claimId)

            return data
        },
        /**
         * Удаляет документ
         * @param {Number} id
         */
        async apiRemoveClaimDoc(id) {
            const { data } = await this.postRemoveClaimDoc(id)

            return data
        },
        /**
         * Сохраняет документ
         * @param {Object} model
         */
        async apiPostSetClaimDoc(model) {
            const { data } = await this.postSetClaimDoc(model)

            return data
        },
        /**
         * Сохраняет файл
         * @param {FormData} formData
         */
        async apiPostClaimFileUpload(formData) {
            const { data } = await this.postClaimFileUpload(formData)

            return data
        },

        /* REQUESTS */
        /**
         * Возвращает документы
         * @param {Number} claimId 
         */
        getClaimDocs(claimId) {
            return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/ClmApi/GetDocs`, { params: { claimId } })
        },
        /**
         * Сохранение документа
         * @param {Object} model 
         */
        postSetClaimDoc(model) {
            return this.$http.post(`${OMInsurance.host}${OMInsurance.path}/ClmApi/SetDoc`, { model });
        },
        /**
         * Удаление документа
         * @param {Number} id
         */
        postRemoveClaimDoc(id) {
            return this.$http.post(`${OMInsurance.host}${OMInsurance.path}/ClmApi/RemoveDoc`, { id })
        },
        /**
         * Сохранение файла документа
         * @param {Object} formData 
         */
        postClaimFileUpload(formData) {
            return this.$http.post(`${OMInsurance.host}${OMInsurance.path}/File/Upload`, formData);
        }
    }
}