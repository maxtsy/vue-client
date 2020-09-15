export const apiClaimNotesMixin = {
    methods: {
        /**
         * Возвращает заметки
         * @param {Number} claimId
         */
        async apiGetClaimNotes(claimId) {
            const { data } = await this.getClaimNotes(claimId)

            return data
        },
        /**
         * Возврщает заметку
         * @param {Number} id
         */
        async apiGetClaimNote(id) {
            const { data } = await this.getClaimNote(id)

            return data
        },
        /**
         * Сохраняет заметку
         * @param {Object} model
         */
        async apiPostSetClaimNote(model) {
            const { data } = await this.postSetClaimNote(model)

            return data
        },
        /**
         * Удаляет заметку
         * @param {Number} id
         */
        async apiPostRemoveClaimNote(id) {
            const { data } = await this.postRemoveClaimNote(id)

            return data
        },

        /* REQUESTS */
        /**
         * Возвращение заметок
         * @param {Number} claimId 
         */
        getClaimNotes(claimId) {
            return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/ClmApi/GetNotes`, { params: { claimId } })
        },
        /**
         * Возвращение заметки
         * @param {Number} id
         */
        getClaimNote(id) {
            return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/ClmApi/GetNotes`, { params: { id } })
        },
        /**
         * Удаление заметки
         * @param {Number} id
         */
        postRemoveClaimNote(id) {
            return this.$http.post(`${OMInsurance.host}${OMInsurance.path}/ClmApi/RemoveNote`, { id })
        },
        /**
         * Создание заметки
         * @param {Object} model
         */
        postSetClaimNote(model) {
            return this.$http.post(`${OMInsurance.host}${OMInsurance.path}/ClmApi/SetNote`, { model })
        }
    }
}