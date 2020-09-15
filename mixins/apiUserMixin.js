export const apiUserMixin = {
    methods: {
        /**
         * Возвращает данные пользователя
         * @param {String} login
         */
        async apiGetUserData(login) {
            //todo: наверное тут должна быть обработка непустого значения
            const { data } = await this.getUserData(login)

            return data
        },
        /**
         * Возвращает данные клиента
         * @param {String} clnId
         */
        async apiGetClientData(clnId) {
            const { data } = await this.getClientData(clnId);

            return data;
        },
        /**
         * Возвращает флаг наличия роли пользователя - Начальник ЗПЗ
         */
        async apiUserIsClaimBoss () {
            const { data } = await this.getUserAClaimBoss()

            return data
        },

        /* REQUESTS */
        /**
         * Возвращение данных пользователя
         * @param {String} login
         */
        getUserData(login) {
            return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/Api/GetUserData`, { params: { login } })
        },
        /**
         * Возвращение информации о клиенте
         * @param {Number} clnId 
         */
        getClientData(clnId) {
            return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/ClmApi/GetClientInfoById`, { params: { clnId } })
        },
        /**
         * Проверка роли пользователя Начальник ЗПЗ
         */
        getUserIsClaimBoss() {
            return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/Api/IsUserAClaimBoss`, { })
        }
    }
}