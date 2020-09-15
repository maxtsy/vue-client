export const requestsMixin = {
    methods: {
        /**
         * Поиск обращений
         * @param {Object} params 
         */
        postClaimsSearch (params) {
            return this.$http.post(`${OMInsurance.host}${OMInsurance.path}/Api/ClmSearch`, params)
        },          
        /**
         * Возврщает пренезию
         * @param {Number} id 
         */
        getClaim (id) {
            return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/ClmApi/GetClaim`, { params : { id : id } })
        },
        /**
         * Возвращает претензию и событие
         * @param {Number} id 
         */
        getClaimAndEvent (id) {
            return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/ClmApi/GetClaimAndEvent`, { params : { id : id } })
        },
        /**
         * Возвращает полную претензию со всеми объектами 
         * @param {Number} id 
         */
        getClaimFull (id) {
            return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/ClmApi/GetClaimFull`, { params : { id : id } })
        },
        /**
         * Возврщает список претензий по событию
         * @param {Number} eventId 
         */
        getEventClaims (eventId) {
            return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/ClmApi/GetClaimList`, { params : { eventId } })
        },  
        /**
         * Создание претензии
         * @param {Object} model 
         */
        postSetClaim (model) {
            return this.$http.post(`${OMInsurance.host}${OMInsurance.path}/ClmApi/SetClaim`, { "model": model })
        },
        /**
         * Обновление претензии
         * @param {Object} model 
         */
        postUpdClaim (model) {
            return this.$http.post(`${OMInsurance.host}${OMInsurance.path}/ClmApi/UpdClaim`, { "model": model })
        },
        /**
         * Возращает событие
         * @param {Number} claimId 
         */
        getEvent (claimId) {
            return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/ClmApi/GetEvent`, { params : { id : claimId } })
        },
        /**
         * Создание события
         * @param {Object} model 
         */
        postSetEvent (model) {
            return this.$http.post(`${OMInsurance.host}${OMInsurance.path}/ClmApi/SetEvent`, { "model": model })
        },
        /**
         * Обновление события
         * @param {Object} model 
         */
        postUpdEvent (model) {
            return this.$http.post(`${OMInsurance.host}${OMInsurance.path}/ClmApi/UpdEvent`, { "model": model })
        },        
        /**
         * Возвращает информацию о пользователе
         * @param {Number} userId 
         */
        getUserInfo (userId) {
            return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/ClmApi/GetUserInfoById`, { params : { clnId }})
        },
        /**
         * Поиск пользователей
         * @param {Object} model 
         */
        postUsersSearch (model) {
            return this.$http.post(`${OMInsurance.host}${OMInsurance.path}/Api/UsrSearch`, { model })
        },           
        async apiPostUsersSearch(model) {
            const { data } = await this.postUsersSearch(model)

            return data
        },
        /**
         * Проверка стадии
         * @param {Number} claimId 
         * @param {Number} stageId 
         */
        getClaimIsConfirmed (claimId, stageId) {
            return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/ClmApi/ExistsStage`, { params: { claimId, stageId } })
        },
        async apiGetClaimIsConfirmed (claimId, stageId) {
            const { data } = await this.getClaimIsConfirmed(claimId, stageId)

            return data
        }
    },
}