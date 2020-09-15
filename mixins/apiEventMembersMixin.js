export const apiEventMembersMixin = {
    methods: {        
        /**
         * Возвращает участников
         * @param {Number} claimId
         */
        async apiGetClaimMembers(claimId) {
            const { data } = await this.getClaimMembers(claimId);

            return data;
        },
        /**
         * Удаляет участника
         * @param {Number} id
         */
        async apiPostRemoveClaimMember(id) {
            const { data } = await this.postRemoveClaimMember(id);

            return data;
        },
        /**
         * Возврщает участника
         * @param {Number} id
         */
        async apiGetClaimMember(id) {
            const { data } = await this.getClaimMember(id);

            return data;
        },
        /**
         * Создает участника
         * @param {Object} model
         */
        async apiPostSetClaimMember(model) {
            const { data } = await this.postSetClaimMember(model);

            return data;
        },
        /**
         * Обноляет участника
         * @param {Object} model
         */
        async apiPostUpdClaimMember(model) {
            const { data } = await this.postUpdEventMember(model);

            return data;
        },
        /* REQUESTS */
        /**
         * Возвращение участников
         * @param {Number} claimId 
         */
        getClaimMembers(claimId) {
            return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/ClmApi/GetMembers`, { params: { claimId } })
        },
        /**
         * Возвращение участника
         * @param {Number} id
         */
        getClaimMember(id) {
            return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/ClmApi/GetEventMember`, { params: { id } })
        },
        /**
         * Создание участника
         * @param {Object} model 
         */
        postSetClaimMember(model) {
            return this.$http.post(`${OMInsurance.host}${OMInsurance.path}/ClmApi/SetEventMember`, { model })
        },
        /**
         * Обновление участника
         * @param {Object} model 
         */
        apiPostUpdClaimMember(model) {
            return this.$http.post(`${OMInsurance.host}${OMInsurance.path}/ClmApi/UpdEventMember`, { model })
        },
        /**
         * Удаление участника
         * @param {Number} id 
         */
        postRemoveClaimMember(id) {
            return this.$http.post(`${OMInsurance.host}${OMInsurance.path}/ClmApi/RemoveMember`, { id })
        },
    }
}